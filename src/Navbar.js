import React from 'react';

import { FaSpotify } from 'react-icons/fa';
import { BsFillHouseDoorFill } from 'react-icons/bs';
import { FiSearch } from 'react-icons/fi';
import { BiLibrary } from 'react-icons/bi';
import { RiAddBoxFill, RiHeartFill } from 'react-icons/ri';

const Navbar = () => {
  return (
    <div className='bg-spotify-1300 md:w-64 h-screen text-spotify-100 absolute w-0 overflow-hidden'>
      <div className='flex flex-col ml-8 mt-5 items-start'>
        <div className='flex items-center'>
          <FaSpotify className='text-5xl ' />
          <h1 className='ml-1 text-3xl font-semibold'>Spotify</h1>
        </div>

        <ul className='mt-8 tracking-wider font-semibold text-sm text-spotify-300'>
          <li className='list-items active flex items-center mb-5'>
            <BsFillHouseDoorFill className='text-2xl' />{' '}
            <p className='ml-4'>Home</p>
          </li>
          <li className='list-items flex items-center  mb-5'>
            <FiSearch className='text-2xl' /> <p className='ml-4'>Search</p>
          </li>
          <li className='list-items flex items-center  mb-10'>
            <BiLibrary className='text-2xl' />{' '}
            <p className='ml-4'>Your Library</p>
          </li>
          <li className='list-items flex items-center mb-5'>
            <RiAddBoxFill className='text-2xl' />
            <p className='ml-4'>Create Playlist</p>
          </li>
          <li className='list-items flex items-center  mb-5'>
            <RiHeartFill className='text-2xl' />
            <p className='ml-4'>Liked Songs</p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
