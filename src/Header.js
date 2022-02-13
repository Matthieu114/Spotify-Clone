import React, { useContext, useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { HiOutlineChevronDown } from "react-icons/hi";
import { RiShareBoxLine } from "react-icons/ri";
import { Context } from "./Context";

import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
  clientId: "af8f13c3293b44e38287e574fd56b9dd"
});

const Header = ({ accessToken, bgColor }) => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState({});
  const [navbar, setNavbar] = useState(false);
  const { providerValue } = useContext(Context);
  const playlistIntersect = document.querySelector("[data-playlist-intersect]");
  const homepageIntersect = document.querySelector("[data-homepage-scroll]");

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
    spotifyApi
      .getMe()
      .then((res) => {
        setUser({
          username: res.body.display_name,
          email: res.body.email,
          avatar: res.body.images[0].url,
          uri: res.body.uri,
          id: res.body.id
        });
      })
      .catch((e) => console.log(e));
  }, [accessToken]);

  const sectionOptions = {
    rootMargin: "-100px 0px 0px 0px"
  };
  const homepageOptions = {
    rootMargin: "-300px 0px 0px 0px"
  };

  const sectionObserver = new IntersectionObserver(
    (entries, sectionObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          setNavbar(true);
        } else {
          setNavbar(false);
        }
      });
    },
    sectionOptions
  );

  const hompageObserver = new IntersectionObserver((entries, homepage) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        setNavbar(true);
      } else {
        setNavbar(false);
      }
    });
  }, homepageOptions);

  if (playlistIntersect !== null) sectionObserver.observe(playlistIntersect);
  if (homepageIntersect) hompageObserver.observe(homepageIntersect);

  const AUTH_URL =
    "https://accounts.spotify.com/authorize?client_id=af8f13c3293b44e38287e574fd56b9dd&response_type=code&redirect_uri=http://localhost:3000&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state%20playlist-read-private";

  return (
    <div
      className={`text-spotify-100 flex h-16 ${bgColor} items-center 
        ease-linear duration-300 fixed md:w-header w-full z-[20] top-0 ${
          navbar ? "bg-opacity-100" : "bg-opacity-0"
        }`}>
      <div className="mr-auto mx-10 flex">
        <a href="#" className="bg-spotify-1200 mr-4 rounded-full p-3">
          <FaChevronLeft />
        </a>
        <a href="#" className="rounded-full p-3 bg-spotify-1200">
          <FaChevronRight />
        </a>
      </div>
      {!providerValue?.auth ? (
        <div className="">
          <button href="#" className=" header-buttons ">
            SIGN UP
          </button>
          <button
            onClick={async () => {
              window.location.href = AUTH_URL;
            }}
            className="header-buttons bg-spotify-100 text-spotify-text-600 rounded-full mr-10">
            LOG IN
          </button>
        </div>
      ) : (
        <div className="mr-10 relative">
          <button
            className="rounded-full lg:py-1 p-1 bg-spotify flex items-center bg-spotify-1300 hover:bg-spotify-700"
            onClick={() => setOpen(!open)}>
            <img src={user.avatar} className="rounded-full h-7 lg:mr-2"></img>
            <p className="font-semibold mr-1 hidden lg:block">
              {user.username}
            </p>
            <HiOutlineChevronDown className="text-xl mr-1 hidden lg:block" />
          </button>
          {open && (
            <ul className="bg-spotify-700 w-52 absolute top-10 rounded-md right-0 z-50">
              <li className="profile-dropdown-item flex items-center">
                <p className="mr-auto">Account</p>
                <RiShareBoxLine className="text-spotify-100 text-xl" />
              </li>
              <li className="profile-dropdown-item">Profile</li>
              <li
                className="profile-dropdown-item"
                onClick={() => providerValue?.setAuth(null)}>
                Log Out
              </li>
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Header;
