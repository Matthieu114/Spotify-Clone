import React from "react";
import Header from "./Header";
import { useEffect, useState } from "react";
import UseAuth from "./UseAuth";
import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
  clientId: "af8f13c3293b44e38287e574fd56b9dd"
});

const Homepage = ({ code, accessToken }) => {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
    spotifyApi
      .getUserPlaylists("11179334269", { limit: "10" })
      .then((res) => {
        setPlaylists(
          res.body.items.map((playlist) => {
            console.log(playlist);
            return {
              playlistName: playlist.name,
              uri: playlist.uri,
              id: playlist.id,
              img: playlist.images[0]?.url
            };
          })
        );
      })
      .catch((e) => {
        console.log(e);
      });
  }, [accessToken]);

  return (
    <div className="h-screen bg-gradient-to-t from-spotify-1300 to bg-spotify-400 overflow-x-hidden overflow-y-scroll relative md:ml-64">
      <Header code={code} accessToken={accessToken} />
      <div className=" mt-16 p-8 text-spotify-100">
        <h1 className="text-3xl font-semibold mb-8">Good evening</h1>
        <div className="grid grid-cols-spotify gap-6 h-60  overflow-clip">
          {playlists.map((item) => {
            return (
              <div className="flex  bg-gradient-to-r from-spotify-200 to bg-spotify-700 rounded-md items-center">
                <img src={item.img} alt="no image" className="h-24" />
                <p className="text-spotify-text-100 ml-3 font-semibold">
                  {" "}
                  {item.playlistName}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Homepage;
