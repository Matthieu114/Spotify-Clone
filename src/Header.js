import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Header = ({ code, acessToken }) => {
  const AUTH_URL =
    "https://accounts.spotify.com/authorize?client_id=af8f13c3293b44e38287e574fd56b9dd&response_type=code&redirect_uri=http://localhost:3000&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state%20playlist-read-private";

  return (
    <div
      className="bg-gradient-to-b from-spotify-1300 to bg-spotify-800 
    text-spotify-100 flex h-16 items-center bg-opacity-95 fixed md:w-header w-full">
      <div className="mr-auto mx-10 flex">
        <a href="#" class="bg-spotify-1200 mr-4 rounded-full p-3">
          <FaChevronLeft />
        </a>
        <a href="#" class="rounded-full p-3 bg-spotify-1200">
          <FaChevronRight />
        </a>
      </div>
      {!code ? (
        <div className="">
          <button href="#" className=" header-buttons ">
            SIGN UP
          </button>
          <button
            onClick={() => (window.location.href = AUTH_URL)}
            className="header-buttons bg-spotify-100 text-spotify-text-600 rounded-full mr-10">
            LOG IN
          </button>
        </div>
      ) : (
        <div className="mr-10">
          <button className="rounded-full py-2 bg-spotify-1300">
            User coming soon...
          </button>
        </div>
      )}
    </div>
  );
};

export default Header;
