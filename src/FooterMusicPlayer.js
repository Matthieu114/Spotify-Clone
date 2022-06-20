import React, { useContext, useEffect, useState, useRef } from 'react';
import { Context } from './Context';

import { RiHeartLine } from 'react-icons/ri';
import { AiOutlineExpand } from 'react-icons/ai';
import { BsPlayCircleFill } from 'react-icons/bs';
import { MdPauseCircle } from 'react-icons/md';
import { IoMdSkipBackward, IoMdSkipForward } from 'react-icons/io';
import { FaRandom } from 'react-icons/fa';
import { TiArrowLoop } from 'react-icons/ti';

const FooterMusicPlayer = ({ accessToken, interval }) => {
  const { providerValue, currentSDKPlayerValue, currentPlayingTrack, currentSelectedTrackValue, currentSeekbarValue } = useContext(Context);

  let track = { paused: true };

  const loadScript = () => {
    if (currentSDKPlayerValue.currentPlayer != null) return;
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;
    document.body.appendChild(script);
  };

  const playTrack = async (id) => {
    interval.current = setInterval(() => {
      currentSDKPlayerValue.currentPlayer?.getCurrentState().then((state) => {
        if (!state) return;
        currentSeekbarValue.setSeekbarValue(state.position);
      });
    }, 1000);
    let position = currentPlayingTrack.currentTrackId.position;

    await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${id}`, {
      method: 'PUT',
      body: JSON.stringify({ uris: [currentSelectedTrackValue?.currentTrack?.uri], position_ms: position }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    });
  };

  const pauseTrack = async (id) => {
    clearInterval(interval.current);
    await fetch(`https://api.spotify.com/v1/me/player/pause?device_id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    });
  };

  const playNext = async (id) => {
    try {
      await fetch(`https://api.spotify.com/v1/me/player/next?device_id=${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        }
      });
    } catch (e) {
      console.log(e);
    }

    currentSDKPlayerValue.currentPlayer?.getCurrentState().then((state) => {
      if (!state) return;
      currentSelectedTrackValue.setCurrentTrack(state.track_window.current_track);
    });
  };

  const formatTime = (time) => {
    time = time / 1000;
    let min = Math.floor(time / 60);
    if (min < 10) {
      min = `0` + min;
    }

    let sec = Math.floor(time % 60);
    if (sec < 10) {
      sec = '0' + sec;
    }

    return `${min} : ${sec}`;
  };

  const initialisePlayer = () => {
    loadScript();
    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: 'My spotify project',
        getOAuthToken: (cb) => {
          cb(accessToken);
        },
        volume: 0.5
      });

      player.on('initialization_error', (e) => console.error(e));
      player.on('authentication_error', (e) => console.error(e));
      player.on('account_error', (e) => console.error(e));
      player.on('playback_error', (e) => console.error(e));

      player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        currentSDKPlayerValue.setCurrentPlayer(player);
        currentPlayingTrack.setCurrentTrackId({ ...track, device_id: device_id });
        track = { ...track, device_id: device_id };
      });

      player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
      });

      player.addListener('player_state_changed', (state) => {
        currentPlayingTrack.setCurrentTrackId({ ...track, position: state.position, track_id: state.track_window.current_track.id, paused: state.paused, duration: state.duration });
      });

      player.connect();
    };
  };

  useEffect(() => {
    initialisePlayer();
  }, [accessToken]);

  if (!accessToken) return null;
  return (
    <div className='w-screen h-[85px]  bg-spotify-800 fixed bottom-0 left-0 z-[10000] text-spotify-100'>
      {currentSelectedTrackValue?.currentTrack != null && providerValue.auth ? (
        <div className='flex items-center justify-between relative'>
          <div className='flex items-center m-2'>
            <div>
              <img src={currentSelectedTrackValue?.currentTrack?.album.images[2].url} height={64} width={64} alt='' />
            </div>
            <div className='px-4'>
              <p>{currentSelectedTrackValue?.currentTrack?.name}</p>
              <p className='text-sm text-spotify-300'>{currentSelectedTrackValue?.currentTrack?.artists[0].name}</p>
            </div>
            <div className='flex items-center text-spotify-300'>
              <RiHeartLine className='play-icons text-  xl' />
              <AiOutlineExpand className='text-xl play-icons' />
            </div>
          </div>

          <div className='text-center text-spotify-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center'>
            <div className='flex items-center'>
              <FaRandom className=' play-icons' />
              <IoMdSkipBackward className=' play-icons' />
              {currentPlayingTrack.currentTrackId.paused ? (
                <BsPlayCircleFill
                  className='play-icons play-pause-button '
                  onClick={() => {
                    playTrack(currentPlayingTrack.currentTrackId.device_id);
                  }}
                />
              ) : (
                <MdPauseCircle
                  className='play-icons play-pause-button '
                  onClick={() => {
                    pauseTrack(currentPlayingTrack.currentTrackId.device_id);
                  }}
                />
              )}
              <IoMdSkipForward className=' play-icons' onClick={() => playNext(currentPlayingTrack.currentTrackId.device_id)} />
              <TiArrowLoop className=' play-icons' />
            </div>
            <div className='flex flex-row items-center mt-2'>
              <p className='text-xs mr-2 text-spotify-300'>{formatTime(currentSeekbarValue.seekbarValue)}</p>
              <input
                type='range'
                className=' bg-spotify-300 appearance-none h-[4px] rounded-full w-[25vw] min-w-[250px] slider-thumb overflow-hidden'
                max={currentPlayingTrack.currentTrackId.duration}
                value={currentSeekbarValue.seekbarValue}
              />
              <p className='text-xs ml-2 text-spotify-300'>{formatTime(currentPlayingTrack.currentTrackId.duration)}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className='flex justify-center mt-2'>
          <div className='text-center text-spotify-300'>
            <div className='flex items-center'>
              <FaRandom className=' play-icons' />
              <IoMdSkipBackward className=' play-icons' />
              <BsPlayCircleFill className=' play-icons play-pause-button ' />
              <IoMdSkipForward className=' play-icons' />
              <TiArrowLoop className=' play-icons' />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FooterMusicPlayer;
