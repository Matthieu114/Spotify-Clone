import React, { useEffect, useContext } from 'react';
import Header from './Header';
import { Context } from './Context';
const LandingPage = ({ accessToken }) => {
  const { currentBackgroundColor } = useContext(Context);
  useEffect(() => {
    currentBackgroundColor.setCurrentColor('');
  }, [currentBackgroundColor]);
  return <div className='h-screen bg-gradient-to-t from-spotify-1300 to bg-blue-700 overflow-x-hidden overflow-y-scroll relative md:ml-64' data-test-landing></div>;
};

export default LandingPage;
