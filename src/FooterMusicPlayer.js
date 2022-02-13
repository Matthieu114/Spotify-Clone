import React, { useContext, useEffect, useState } from "react";
import { Context } from "./Context";

import { RiHeartLine } from "react-icons/ri";
import { AiOutlineExpand } from "react-icons/ai";
import { BsPlayCircleFill } from "react-icons/bs";
import { MdPauseCircle } from "react-icons/md";
import { IoMdSkipBackward, IoMdSkipForward } from "react-icons/io";
import { FaRandom } from "react-icons/fa";
import { TiArrowLoop } from "react-icons/ti";
import { MdOutlineQueueMusic } from "react-icons/md";
import { MdDevices } from "react-icons/md";

const FooterMusicPlayer = ({ accessToken, track }) => {
  const { currentTrackValue } = useContext(Context);
  const { providerValue } = useContext(Context);
  const [playState, setPlayState] = useState(false);

  const loadScript = () => {
    const script = document.createElement("script");
    script.async = true;
    script.defer = "defer";
    script.src = "https://sdk.scdn.co/spotify-player.js";
    document.body.appendChild(script);
  };

  const initialisePlayer = () => {
    loadScript();
    window.onSpotifyWebPlaybackSDKReady = () => {
      console.log("SDk initializing");
      const player = new window.Spotify.Player({
        name: "Matthieus spotify yeaaa",
        getOAuthToken: (cb) => {
          cb(accessToken);
        },
        volume: 0.5
      });

      player.addListener("ready", ({ device_id }) => {
        console.log("Ready with Device ID", device_id);
      });
      player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
      });

      player.connect();
    };
  };

  useEffect(() => {
    initialisePlayer();
  }, []);

  if (!accessToken) return null;
  return (
    <div
      className="w-screen h-24 bg-spotify-800 fixed bottom-0 left-0 z-[10000] text-spotify-100"
      onClick={() => console.log(currentTrackValue?.currentTrack)}>
      {currentTrackValue?.currentTrack != null && providerValue.auth ? (
        <div className="flex items-center justify-between relative">
          <div className="flex items-center m-4">
            <div>
              <img
                src={currentTrackValue?.currentTrack?.track.album.images[2].url}
                alt=""
              />
            </div>
            <div className="px-4">
              <p>{currentTrackValue?.currentTrack?.track.name}</p>
              <p className="text-sm text-spotify-300">
                {currentTrackValue?.currentTrack?.track.artists[0].name}
              </p>
            </div>
            <div className="flex items-center text-spotify-300">
              <RiHeartLine className="play-icons text-  xl" />
              <AiOutlineExpand className="text-xl play-icons" />
            </div>
          </div>

          <div className="text-center text-spotify-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="flex items-center">
              <FaRandom className=" play-icons" />
              <IoMdSkipBackward className=" play-icons" />
              {!playState ? (
                <BsPlayCircleFill className=" play-icons play-pause-button " />
              ) : (
                <MdPauseCircle className="play-icons play-pause-button " />
              )}
              <IoMdSkipForward className=" play-icons" />
              <TiArrowLoop className=" play-icons" />
            </div>
            <div>
              <input
                type="range"
                name=""
                id=""
                className=" bg-spotify-300 appearance-none h-[3px] rounded-full"
              />
            </div>
          </div>

          <div className="flex mr-4">
            <h1>logo1</h1>
            <h1>logo2</h1>
            <h1>logo3</h1>
            <h1>logo4</h1>
            <h1>logo5</h1>
          </div>
        </div>
      ) : (
        <div className="flex justify-center mt-4">
          <div className="text-center text-spotify-300">
            <div className="flex items-center">
              <FaRandom className=" play-icons" />
              <IoMdSkipBackward className=" play-icons" />
              {!playState ? (
                <BsPlayCircleFill className=" play-icons play-pause-button " />
              ) : (
                <MdPauseCircle className="play-icons play-pause-button " />
              )}
              <IoMdSkipForward className=" play-icons" />
              <TiArrowLoop className=" play-icons" />
            </div>
            <div>player</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FooterMusicPlayer;
