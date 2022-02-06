import React, { useContext } from "react";
import { useState, useEffect } from "react";

import { FaSpotify } from "react-icons/fa";
import { BsFillHouseDoorFill } from "react-icons/bs";
import { FiSearch } from "react-icons/fi";
import { BiLibrary } from "react-icons/bi";
import { RiAddBoxFill, RiHeartFill } from "react-icons/ri";
import SpotifyWebApi from "spotify-web-api-node";
import { useNavigate } from "react-router";
import { Context } from "./Context";

const spotifyApi = new SpotifyWebApi({
  clientId: "af8f13c3293b44e38287e574fd56b9dd"
});

const Playlists = ({ item }) => {
  const navigate = useNavigate();
  return (
    <li
      className="list-items py-2 overflow-hidden overflow-ellipsis whitespace-nowrap"
      onClick={() => navigate(`/playlists/${item.id}`)}>
      {item.name}
    </li>
  );
};

const Navbar = ({ accessToken }) => {
  const [playlists, setPlaylists] = useState([]);
  const { auth } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);

    spotifyApi
      .getUserPlaylists("11179334269", { limit: "45" })
      .then((res) => {
        setPlaylists(
          res.body.items.map((playlist) => {
            return {
              name: playlist.name,
              uri: playlist.uri,
              id: playlist.id
            };
          })
        );
      })
      .catch((e) => {
        console.log(e);
      });
  }, [accessToken]);

  return (
    <div className="bg-spotify-1300 md:w-64 text-spotify-100 absolute h-screen top-0 left-0 w-0 overflow-hidden flex flex-col">
      <div className="ml-8 mt-5 items-start">
        <div className="flex items-center">
          <FaSpotify className="text-5xl " />
          <h1 className="ml-1 text-3xl font-semibold">Spotify</h1>
        </div>
        <ul className="mt-8 tracking-wider font-semibold text-sm text-spotify-300 flex-shrink-0">
          <li
            className="list-items active flex items-center mb-5"
            onClick={() => navigate("/")}>
            <BsFillHouseDoorFill className="text-2xl" />
            <p className="ml-4">Home</p>
          </li>
          <li className="list-items flex items-center  mb-5">
            <FiSearch className="text-2xl" /> <p className="ml-4">Search</p>
          </li>
          <li className="list-items flex items-center  mb-10">
            <BiLibrary className="text-2xl" />
            <p className="ml-4">Your Library</p>
          </li>
          <li className="list-items flex items-center mb-5">
            <RiAddBoxFill className="text-2xl" />
            <p className="ml-4">Create Playlist</p>
          </li>
          <li className="list-items flex items-center  mb-5">
            <RiHeartFill className="text-2xl" />
            <p className="ml-4">Liked Songs</p>
          </li>
        </ul>
        <hr className="bg-spotify-200 w-52"></hr>
      </div>
      <ul
        className="overflow-y-scroll h-full ml-8 mt-5 pr-3 items-start text-sm text-spotify-300
      scrollbar scrollbar-thumb-spotify-200">
        {auth &&
          playlists.map((item) => {
            return <Playlists key={item.id} item={item} />;
          })}
      </ul>
      <div className="flex-shrink-0 h-[50px]"></div>
    </div>
  );
};

export default Navbar;
