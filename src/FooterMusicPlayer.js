import React, { useContext, useEffect, useState } from 'react';
import { Context } from './Context';

import { RiHeartLine } from 'react-icons/ri';
import { AiOutlineExpand } from 'react-icons/ai';
import { BsPlayCircleFill } from 'react-icons/bs';
import { MdPauseCircle } from 'react-icons/md';
import { IoMdSkipBackward, IoMdSkipForward } from 'react-icons/io';
import { FaRandom } from 'react-icons/fa';
import { TiArrowLoop } from 'react-icons/ti';
import axios from 'axios';

const FooterMusicPlayer = ({ accessToken, track }) => {
  const { currentTrackValue } = useContext(Context);
  const { providerValue, currentPlayerValue, currentPlayingTrack } = useContext(Context);

  const [playState, setPlayState] = useState(false);

  const loadScript = () => {
    if (currentPlayerValue.currentPlayer != null) return;
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;
    document.body.appendChild(script);
  };

  const playTrack = async (id) => {
    setPlayState(!playState);

    await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${id}`, {
      method: 'PUT',
      body: JSON.stringify({ uris: [currentTrackValue?.currentTrack?.track.uri] }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    });
  };

  const pauseTrack = async (id) => {
    setPlayState(false);
    await fetch(`https://api.spotify.com/v1/me/player/pause?device_id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    });
  };

  const initialisePlayer = () => {
    loadScript();
    window.onSpotifyWebPlaybackSDKReady = () => {
      console.log('SDk initializing');

      const player = new window.Spotify.Player({
        name: '3rd Test',
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
        currentPlayerValue.setCurrentPlayer(player);
        currentPlayingTrack.setCurrentTrackId(device_id);
      });

      player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
      });

      player.addListener('player_state_changed', (state) => {
        console.log(state);
      });

      player.connect();
    };
  };

  useEffect(() => {
    initialisePlayer();
  }, [accessToken]);

  if (!accessToken) return null;
  return (
    <div className='w-screen h-24 bg-spotify-800 fixed bottom-0 left-0 z-[10000] text-spotify-100'>
      {currentTrackValue?.currentTrack != null && providerValue.auth ? (
        <div className='flex items-center justify-between relative'>
          <div className='flex items-center m-4'>
            <div>
              <img src={currentTrackValue?.currentTrack?.track.album.images[2].url} alt='' />
            </div>
            <div className='px-4'>
              <p>{currentTrackValue?.currentTrack?.track.name}</p>
              <p className='text-sm text-spotify-300'>{currentTrackValue?.currentTrack?.track.artists[0].name}</p>
            </div>
            <div className='flex items-center text-spotify-300'>
              <RiHeartLine className='play-icons text-  xl' />
              <AiOutlineExpand className='text-xl play-icons' />
            </div>
          </div>

          <div className='text-center text-spotify-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
            <div className='flex items-center'>
              <FaRandom className=' play-icons' />
              <IoMdSkipBackward className=' play-icons' />
              {!playState ? (
                <BsPlayCircleFill
                  className='play-icons play-pause-button '
                  onClick={() => {
                    playTrack(currentPlayingTrack.currentTrackId);
                  }}
                />
              ) : (
                <MdPauseCircle
                  className='play-icons play-pause-button '
                  onClick={() => {
                    pauseTrack(currentPlayingTrack.currentTrackId);
                  }}
                />
              )}
              <IoMdSkipForward className=' play-icons' />
              <TiArrowLoop className=' play-icons' />
            </div>
            <div>
              <input type='range' name='' id='' className=' bg-spotify-300 appearance-none h-[3px] rounded-full' />
            </div>
          </div>

          <div className='flex mr-4'>
            <h1>logo1</h1>
            <h1>logo2</h1>
            <h1>logo3</h1>
            <h1>logo4</h1>
            <h1>logo5</h1>
          </div>
        </div>
      ) : (
        <div className='flex justify-center mt-4'>
          <div className='text-center text-spotify-300'>
            <div className='flex items-center'>
              <FaRandom className=' play-icons' />
              <IoMdSkipBackward className=' play-icons' />
              {!playState ? <BsPlayCircleFill className=' play-icons play-pause-button ' /> : <MdPauseCircle className='play-icons play-pause-button ' />}
              <IoMdSkipForward className=' play-icons' />
              <TiArrowLoop className=' play-icons' />
            </div>
            <div>player</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FooterMusicPlayer;
