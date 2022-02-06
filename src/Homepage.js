import React, { useContext } from "react";
import { useEffect, useState } from "react";
import SpotifyWebApi from "spotify-web-api-node";
import { BsPlayCircleFill } from "react-icons/bs";
import { useNavigate } from "react-router";
import { Context } from "./Context";
import Header from "./Header";

const spotifyApi = new SpotifyWebApi({
  clientId: "af8f13c3293b44e38287e574fd56b9dd"
});

const PlaylistItem = ({ item }) => {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  return (
    <div
      className="playlist-item flex  bg-opacity-40 bg-gradient-to-r from-spotify-200 to bg-spotify-700 rounded-md items-center box-border relative
      "
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onClick={() => {
        navigate(`playlists/${item.id}`);
      }}>
      <img src={item.img} alt="no image" className="h-24 rounded-l-md" />
      <p className="text-spotify-text-100 ml-3 font-semibold max-w-[45%] overflow-hidden overflow-ellipsis ">
        {item.playlistName}
      </p>
      {visible && (
        <BsPlayCircleFill className="text-6xl  text-spotify-400 bg-spotify-1300 rounded-full hover:scale-105 shadow-lg absolute right-5" />
      )}
    </div>
  );
};

const HomepageItems = ({ item }) => {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  return (
    <div
      className="homepage-item flex flex-col  bg-opacity-90 bg-spotify-800 rounded-md p-4 box-border relative mb-20
      "
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onClick={() => {
        navigate("/playlists");
      }}>
      <img src={item.img} alt="no image" className="aspect-auto rounded-md" />
      <div className="text-left">
        <p className="text-spotify-text-100 mt-3 font-semibold overflow-ellipsis ">
          {item.name}
        </p>
        <p className="text-spotify-text-200 max-h-16 text-sm overflow-hidden">
          {item.description}
        </p>
      </div>
      {visible && (
        <BsPlayCircleFill
          className="text-6xl  text-spotify-400 bg-spotify-1300 rounded-full hover:scale-105 shadow-lg 
        bottom-28 absolute right-5"
        />
      )}
    </div>
  );
};

const Homepage = ({ accessToken }) => {
  const [playlists, setPlaylists] = useState([]);
  const [featured, setFeatured] = useState([]);
  const { auth } = useContext(Context);

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
    spotifyApi
      .getUserPlaylists("11179334269", { limit: "10" })
      .then((res) => {
        setPlaylists(
          res.body.items.map((playlist) => {
            return {
              playlistName: playlist.name,
              uri: playlist.uri,
              id: playlist.id,
              img: playlist.images[0]?.url,
              href: playlist.href
            };
          })
        );
      })
      .catch((e) => {
        console.log(e);
      });

    spotifyApi.getFeaturedPlaylists("11179334269").then((res) => {
      setFeatured(
        res.body.playlists.items.map((feature) => {
          return {
            name: feature.name,
            description: feature.description,
            img: feature.images[0]?.url,
            id: feature.id,
            uri: feature.uri
          };
        })
      );
    });
  }, [accessToken]);

  return auth ? (
    <div className="h-screen bg-gradient-to-t from-spotify-1300 to bg-blue-700 overflow-x-hidden overflow-y-scroll relative md:ml-64 z-0">
      <Header accessToken={accessToken} />
      <section className=" mt-16 p-8 text-spotify-100">
        <h1 className="text-3xl font-semibold mb-8">Good evening</h1>
        <div className="grid grid-cols-spotify100 gap-6 h-60 overflow-clip">
          {playlists.map((item) => {
            return <PlaylistItem item={item} key={item.id} />;
          })}
        </div>
      </section>
      <section className=" px-8 text-spotify-100 mb-10">
        <h1 className="text-2xl font-semibold mb-2">
          Based on your recent listening
        </h1>
        <h2 className="mb-8 text-spotify-text-200">
          Inspired by your recent activity
        </h2>
        <div className="grid grid-cols-spotify200 gap-6 h-[340px] overflow-hidden">
          {featured.map((item) => {
            return <HomepageItems item={item} key={item.id} />;
          })}
        </div>
      </section>
      <section className=" px-8 text-spotify-100 mb-80">
        <h1 className="text-2xl font-semibold mb-2">
          Based on your recent listening
        </h1>
        <h2 className="mb-8 text-spotify-text-200">
          Inspired by your recent activity
        </h2>
        <div className="grid grid-cols-spotify200 gap-6 h-[360px] overflow-hidden">
          {featured.map((item) => {
            return <HomepageItems item={item} key={item.id} />;
          })}
        </div>
      </section>
    </div>
  ) : (
    <div className="h-screen bg-gradient-to-t from-spotify-1300 to bg-blue-700 overflow-x-hidden overflow-y-scroll relative md:ml-64">
      <Header accessToken={accessToken} />
    </div>
  );
};

export default Homepage;
