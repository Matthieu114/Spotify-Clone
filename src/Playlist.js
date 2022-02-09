import React, { useState } from "react";
import { useEffect } from "react";
import Header from "./Header";
import SpotifyWebApi from "spotify-web-api-node";
import { useParams } from "react-router";
import moment from "moment";

import { BsPlayCircleFill } from "react-icons/bs";
import { RiHeartFill } from "react-icons/ri";
import { FiMoreHorizontal } from "react-icons/fi";
import { GoClock } from "react-icons/go";

const Playlist = ({ accessToken }) => {
  const [playlist, setPlaylist] = useState({});
  const [headerVisible, setHeaderVisible] = useState(false);
  const [headerText, setHeaderText] = useState(false);
  const playlistIntersect = document.querySelector("[data-playlist-intersect]");

  const spotifyApi = new SpotifyWebApi({
    clientId: "af8f13c3293b44e38287e574fd56b9dd"
  });

  const { id } = useParams();

  const MilisToMinutes = (ms) => {
    let minutes = Math.floor(ms / 60000);
    let seconds = ((ms % 60000) / 1000).toFixed(0);
    return seconds === 60
      ? minutes + 1 + ":00"
      : minutes + " min " + (seconds < 10 ? "0" : "") + seconds + " sec";
  };

  const ChangeMilis = (ms) => {
    let minutes = Math.floor(ms / 60000);
    let seconds = ((ms % 60000) / 1000).toFixed(0);
    return seconds === 60
      ? minutes + 1 + ":00"
      : minutes + " : " + (seconds < 10 ? "0" : "") + seconds + "";
  };

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
    spotifyApi
      .getPlaylist(id, { limit: "10" })
      .then((res) => {
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

  const sectionOptions = {
    rootMargin: "80px 0px 0px 0px"
  };
  const headerSectionOptions = {
    rootMargin: "0px 0px 0px 0px"
  };

  const headingObserver = new IntersectionObserver(
    (entries, headingObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          setHeaderVisible(true);
        } else {
          setHeaderVisible(false);
        }
      });
    },
    sectionOptions
  );

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
    <div className="relative md:ml-64 z-0 bg-spotify-900 mb-28 box-border">
      <Header accessToken={accessToken} bgColor="bg-red-1000" />
      {headerText && (
        <div
          className="fixed top-[6px] 
        z-40 text-spotify-100 flex items-center md:left-[420px] left-[150px] ">
          <BsPlayCircleFill className="text-[52px] mr-5 text-spotify-400 bg-spotify-1300 rounded-full hover:scale-105 hover:text-green-400 shadow-lg" />
          <h1 className="font-bold text-2xl whitespace-nowrap overflow-hidden text-ellipsis md:max-w-heading-text max-w-[40vw]">
            {playlist.name}
          </h1>
        </div>
      )}
      <section
        className="flex p-10 pt-20 bg-gradient-to-t from-spotify-1300 to bg-red-900 text-spotify-100"
        data-playlist-intersect>
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
      <section className="from-spotify-800 to-spotify-900 box-border">
        <div className="flex p-10 items-center justify-between w-[280px]">
          <BsPlayCircleFill className="text-6xl  text-spotify-400 bg-spotify-1300 rounded-full hover:scale-105 hover:text-green-400 shadow-lg" />
          <RiHeartFill className="text-4xl text-spotify-400" />
          <FiMoreHorizontal className="text-4xl text-spotify-300 hover:text-spotify-100 ease-in duration-100" />
        </div>
        <div className="box-border">
          <table className="md:w-table text-spotify-200 border-collapse box-border mx-auto table-auto">
            <thead className="text-left border-b-2 border-spotify-200 sticky top-16 -z-[999]">
              <tr
                className={`  ${
                  headerVisible && "bg-spotify-800"
                } rounded-lg w-screen`}>
                <th className="playlist-table-heading">#</th>
                <th className="playlist-table-heading">TITLE</th>
                <th className="playlist-table-heading">ALBUM</th>
                <th className="playlist-table-heading whitespace-nowrap">
                  DATE ADDED
                </th>
                <th className="playlist-table-heading text-lg text-spotify-100">
                  <GoClock className="mx-auto" />
                </th>
              </tr>
            </thead>

            <tbody className="text-left sticky -z-[1000]">
              {playlist?.tracks?.map((item, index) => {
                return (
                  <tr key={item.track.id} className="playlist-rows ">
                    <td className="playlist-table-data ">{index + 1}</td>
                    <td className="playlist-table-data flex items-center mr-20">
                      <img src={playlist.img} className="h-10 w-10"></img>
                      <div className="ml-4">
                        <p className="text-spotify-100">{item.track.name}</p>
                        <p className="text-sm">{item.track.artists[0].name}</p>
                      </div>
                    </td>
                    <td className="overflow-hidden">
                      <p>{item.track.album.name}</p>
                    </td>
                    <td className="whitespace-nowrap">
                      {moment(item.added_at).format("MMM. D, YYYY ")}
                    </td>
                    <td className="whitespace-nowrap">
                      {ChangeMilis(item.track.duration_ms)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Playlist;
