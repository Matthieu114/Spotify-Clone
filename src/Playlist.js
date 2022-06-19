import React, { useContext, useState } from 'react';
import { useEffect } from 'react';
import SpotifyWebApi from 'spotify-web-api-node';
import { useParams } from 'react-router';
import moment from 'moment';
import { BsPlayCircleFill, BsPause, BsFillPlayFill } from 'react-icons/bs';
import { RiHeartFill } from 'react-icons/ri';
import { FiMoreHorizontal } from 'react-icons/fi';
import { GoClock } from 'react-icons/go';
import { Context } from './Context';

const PlaylistTrack = ({ item, index, accessToken, activeId, setActiveId, interval }) => {
  const [showPlayButton, setShowPlayButton] = useState(false);

  const { currentSelectedTrackValue, currentPlayingTrack, currentSeekbarValue, currentSDKPlayerValue } = useContext(Context);

  const playTrack = async (id) => {
    currentSelectedTrackValue?.setCurrentTrack(item);
    let position;

    interval.current = setInterval(() => {
      currentSDKPlayerValue.currentPlayer?.getCurrentState().then((state) => {
        if (!state) return;
        console.log('running from playlist');
        currentSeekbarValue.setSeekbarValue(state.position);
      });
    }, 1000);

    if (item.track.id != currentPlayingTrack.currentTrackId.track_id) position = 0;
    else position = currentPlayingTrack.currentTrackId.position;
    await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${id}`, {
      method: 'PUT',
      body: JSON.stringify({ uris: [item.track.uri], position_ms: position }),
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

  const ChangeMilis = (ms) => {
    let minutes = Math.floor(ms / 60000);
    let seconds = ((ms % 60000) / 1000).toFixed(0);
    return seconds === 60 ? minutes + 1 + ':00' : minutes + ' : ' + (seconds < 10 ? '0' : '') + seconds + '';
  };

  return (
    <tr
      key={item.track.id}
      className={`playlist-rows ${activeId === item.track.id ? 'active-row' : ''}`}
      onMouseEnter={() => setShowPlayButton(true)}
      onMouseLeave={() => setShowPlayButton(false)}
      onClick={() => {
        setActiveId(item.track.id);
      }}>
      <td className='priority-1'>
        {!showPlayButton ? (
          index + 1
        ) : currentPlayingTrack.currentTrackId.track_id === item.track.id ? (
          !currentPlayingTrack.currentTrackId.paused ? (
            <BsPause
              className='text-xl text-spotify-100 -m-1'
              onClick={() => {
                pauseTrack(currentPlayingTrack.currentTrackId.device_id);
              }}
            />
          ) : (
            <BsFillPlayFill
              className='text-xl text-spotify-100 -m-1'
              onClick={() => {
                playTrack(currentPlayingTrack.currentTrackId.device_id);
              }}
            />
          )
        ) : (
          <BsFillPlayFill
            className='text-xl text-spotify-100 -m-1'
            onClick={() => {
              playTrack(currentPlayingTrack.currentTrackId.device_id);
            }}
          />
        )}
      </td>
      <td className='flex items-center priority-1'>
        <img src={item.track.album?.images[0].url} className='h-10 w-10'></img>
        <div className='ml-4'>
          <p className='text-spotify-100'>{item.track.name}</p>
          <p className='text-sm'>{item.track.artists[0].name}</p>
        </div>
      </td>
      <td className='priority-2'>
        <p className='max-w-[25vw] overflow-hidden text-ellipsis whitespace-nowrap'>{item.track.album.name}</p>
      </td>
      <td className='whitespace-nowrap  priority-3'>{moment(item.added_at).format('MMM. D, YYYY ')}</td>
      <td className='priority-1 whitespace-nowrap'>{showPlayButton ? <p>{ChangeMilis(item.track.duration_ms)}</p> : ChangeMilis(item.track.duration_ms)}</td>
    </tr>
  );
};

const Playlist = ({ accessToken, interval }) => {
  const [playlist, setPlaylist] = useState({});
  const [activeId, setActiveId] = useState();
  const [headerVisible, setHeaderVisible] = useState(false);
  const [headerText, setHeaderText] = useState(false);
  const { currentBackgroundColor } = useContext(Context);
  const playlistIntersect = document.querySelector('[data-playlist-intersect]');

  const { id } = useParams();

  const MilisToMinutes = (ms) => {
    let minutes = Math.floor(ms / 60000);
    let seconds = ((ms % 60000) / 1000).toFixed(0);
    return seconds === 60 ? minutes + 1 + ':00' : minutes + ' min ' + (seconds < 10 ? '0' : '') + seconds + ' sec';
  };

  useEffect(() => {
    const spotifyApi = new SpotifyWebApi({
      clientId: 'af8f13c3293b44e38287e574fd56b9dd'
    });

    if (!accessToken) return;
    let mounted = true;
    spotifyApi.setAccessToken(accessToken);
    spotifyApi
      .getPlaylist(id, { limit: '10' })
      .then((res) => {
        if (mounted) {
          setPlaylist({
            name: res.body.name,
            owner: res.body.owner.display_name,
            followers: res.body.followers.total,
            uri: res.body.uri,
            id: res.body.id,
            img: res.body.images[0]?.url,
            href: res.body.href,
            nbOfTracks: res.body.tracks.total,
            tracks: res.body.tracks.items,
            type: res.body.type,
            duration: MilisToMinutes(res.body.tracks.items.reduce((sum, items) => sum + items.track.duration_ms, 0))
          });
        }
      })
      .catch((e) => {
        console.log(e);
      });

    return () => (mounted = false);
  }, [accessToken, id]);

  useEffect(() => {
    currentBackgroundColor.setCurrentColor('bg-spotify-400');
  }, [currentBackgroundColor]);

  const sectionOptions = {
    rootMargin: '80px 0px 0px 0px'
  };
  const headerSectionOptions = {
    rootMargin: '0px 0px 0px 0px'
  };

  const headingObserver = new IntersectionObserver((entries, headingObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        setHeaderVisible(true);
      } else {
        setHeaderVisible(false);
      }
    });
  }, sectionOptions);

  const headerObserver = new IntersectionObserver((entries, headerObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        setHeaderText(true);
      } else {
        setHeaderText(false);
      }
    });
  }, headerSectionOptions);

  if (playlistIntersect !== null) {
    headingObserver.observe(playlistIntersect);
    headerObserver.observe(playlistIntersect);
  }

  return (
    <div className='relative md:ml-64 bg-spotify-900 mb-24 box-border'>
      <div className={`fixed top-[6px] z-30 text-spotify-100 flex items-center md:left-[420px] left-[150px] ${headerText ? 'opacity-100' : 'opacity-0'} ease-linear duration-100`}>
        <BsPlayCircleFill className='text-[52px] mr-5 text-spotify-400 bg-spotify-1300 rounded-full hover:scale-105 hover:text-green-400 shadow-lg' />
        <h1 className='font-bold text-2xl whitespace-nowrap overflow-hidden text-ellipsis md:max-w-heading-text sm:max-w-[40vw] max-w-[10vw]'>{playlist.name}</h1>
      </div>
      <section className='flex md:flex-row flex-col content-center p-10 pt-20 bg-gradient-to-t from-spotify-1300 to bg-spotify-400 text-spotify-100' data-playlist-intersect>
        <div>
          <img src={playlist.img} alt='Playlist Image' className='sm:max-h-[250px] sm:min-h-[150px] sm:min-w-[150px] md:h-auto h-[100px]' />
        </div>
        <div className='md:ml-5 mt-auto'>
          <p className='font-semibold sm:text-sm  text-xs md:mt-0 mb-2 mt-4'>{playlist.type?.toUpperCase()}</p>
          <h1 className='font-bold md:text-5xl text-2xl '>{playlist.name}</h1>
          <div className='flex items-center text-sm mt-2'>
            <p className=' font-semibold'>{playlist.owner}</p>
            <p className=" before:content-['•'] before:px-1 playlist-about">{playlist.followers} likes</p>
            <p className=" before:content-['•'] before:px-1 playlist-about">{playlist.nbOfTracks} songs, </p>
            <p className='pl-1 playlist-about'> {playlist.duration}</p>
          </div>
        </div>
      </section>
      <section className='from-spotify-800 to-spotify-900 box-border'>
        <div className='flex p-10 items-center justify-between w-[280px]'>
          <BsPlayCircleFill className='text-6xl  text-spotify-400 bg-spotify-1300 rounded-full hover:scale-105 hover:text-green-400 shadow-lg' />
          <RiHeartFill className='text-4xl text-spotify-400' />
          <FiMoreHorizontal className='text-4xl text-spotify-300 hover:text-spotify-100 ease-in duration-100' />
        </div>

        <table className='md:w-table text-spotify-200 border-collapse box-border w-screen  md:mx-auto '>
          <thead className='text-left border-b-2 border-spotify-200 sticky top-16 z-[10]'>
            <tr className={`  ${headerVisible && 'bg-spotify-800'} rounded-lg w-screen`}>
              <th className='playlist-table-heading priority-1'>#</th>
              <th className='playlist-table-heading  priority-1'>TITLE</th>
              <th className='playlist-table-heading  priority-2'>ALBUM</th>
              <th className='playlist-table-heading whitespace-nowrap priority-3'>DATE ADDED</th>
              <th className='playlist-table-heading text-lg priority-1'>
                <GoClock className='ml-5' />
              </th>
            </tr>
          </thead>

          <tbody className='text-left sticky z-0'>
            {playlist?.tracks?.map((item, index) => {
              return <PlaylistTrack item={item} index={index} key={index} accessToken={accessToken} setActiveId={setActiveId} activeId={activeId} interval={interval} />;
            })}
          </tbody>
        </table>

        {playlist?.tracks?.length < 5 && <div className='h-[60vh]'></div>}
        {playlist?.tracks?.length < 15 && <div className='h-[20vh]'></div>}
      </section>
    </div>
  );
};

export default Playlist;
