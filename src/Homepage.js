import React from 'react';
import Header from './Header';
import axios from 'axios';
import { useEffect, useState } from 'react';

const Homepage = () => {
  const [songsOfTheDay, setSongsOfTheDay] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get('');
        console.log(res);
      } catch (e) {
        console.log(e);
      }
    };

    fetch();
  }, []);

  return (
    <div className='h-screen bg-gradient-to-br from-spotify-700 to bg-spotify-800 overflow-x-hidden overflow-y-scroll relative md:ml-64'>
      <Header />
      <div className=' mt-16 p-8 text-spotify-100'>
        <h1 className='text-2xl font-semibold'>
          A ne pas manquer aujourd'hui!
        </h1>
      </div>
    </div>
  );
};

export default Homepage;
