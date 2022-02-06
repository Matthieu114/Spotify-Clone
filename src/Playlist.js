import React, { useState } from "react";
import { useEffect } from "react";
import Header from "./Header";
import SpotifyWebApi from "spotify-web-api-node";
import { useParams } from "react-router";

const Playlist = ({ accessToken }) => {
  const [playlist, setPlaylist] = useState({});
  const [tracks, setTracks] = useState({});
  const spotifyApi = new SpotifyWebApi({
    clientId: "af8f13c3293b44e38287e574fd56b9dd"
  });

  const { id } = useParams();

  const MilisToMinutes = (ms) => {
    let minutes = Math.floor(ms / 60000);
    let seconds = ((ms % 60000) / 1000).toFixed(0);
    return seconds == 60
      ? minutes + 1 + ":00"
      : minutes + " min " + (seconds < 10 ? "0" : "") + seconds + " sec";
  };

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
    spotifyApi
      .getPlaylist(id, { limit: "10" })
      .then((res) => {
        console.log(res);
        // setTracks(
        //   res.body.map((playlist) => {
        //     return {
        //         trackName: playlist.tracks.item
        //     };
        //   })
        // );
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
          duration: MilisToMinutes(
            res.body.tracks.items.reduce(
              (sum, items) => sum + items.track.duration_ms,
              0
            )
          )
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }, [accessToken, id]);

  return (
    <div className="h-screen bg-gradient-to-t from-spotify-1300 to bg-red-900 overflow-x-hidden overflow-y-scroll relative md:ml-64 z-0">
      <Header accessToken={accessToken} />
      <section className="flex text-spotify-100 mt-16 p-10">
        <div>
          <img
            src={playlist.img}
            alt="Playlist Image"
            className="max-h-[250px] min-h-[150px] min-w-[150px]"
          />
        </div>
        <div className="ml-5 mt-auto">
          <p className="font-semibold text-sm">
            {playlist.type?.toUpperCase()}
          </p>
          <h1 className="font-bold text-5xl">{playlist.name}</h1>
          <div className="flex items-center text-sm mt-2">
            <p className=" font-semibold">{playlist.owner}</p>
            <p className=" before:content-['•'] before:px-1 playlist-about">
              {playlist.followers} likes
            </p>
            <p className=" before:content-['•'] before:px-1 playlist-about">
              {playlist.nbOfTracks} songs,{" "}
            </p>
            <p className="pl-1 playlist-about"> {playlist.duration}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Playlist;
