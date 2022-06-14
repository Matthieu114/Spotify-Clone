import React from 'react';
import Header from './Header';

const LandingPage = ({ accessToken }) => {
  return (
    <div className='h-screen bg-gradient-to-t from-spotify-1300 to bg-blue-700 overflow-x-hidden overflow-y-scroll relative md:ml-64'>
      <Header accessToken={accessToken} />
    </div>
  );
};

export default LandingPage;
