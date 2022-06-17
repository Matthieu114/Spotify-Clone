import { useEffect, useState, useContext, useMemo } from 'react';
import Homepage from './Homepage';
import Navbar from './Navbar';
import Header from './Header';
import Playlist from './Playlist';
import UseAuth from './UseAuth';
import FooterMusicPlayer from './FooterMusicPlayer';
import { Route, Routes, Outlet, Navigate, useNavigate } from 'react-router-dom';

import { Context } from './Context';
import LandingPage from './LandingPage';

const code = new URLSearchParams(window.location.search).get('code');

function App() {
  const [auth, setAuth] = useState(code);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [currentColor, setCurrentColor] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(undefined);
  const [currentTrackId, setCurrentTrackId] = useState({});
  const [loading, setLoading] = useState(true);

  const nav = useNavigate();

  const providerValue = useMemo(() => ({ auth, setAuth }), [auth, setAuth]);
  const currentSelectedTrackValue = useMemo(() => ({ currentTrack, setCurrentTrack }), [currentTrack, setCurrentTrack]);
  const currentBackgroundColor = useMemo(() => ({ currentColor, setCurrentColor }), [currentColor, setCurrentColor]);
  const currentSDKPlayerValue = useMemo(() => ({ currentPlayer, setCurrentPlayer }), [currentPlayer, setCurrentPlayer]);
  const currentPlayingTrackValue = useMemo(() => ({ currentTrackId, setCurrentTrackId }), [currentTrackId, setCurrentTrackId]);

  const accessToken = UseAuth(auth);

  const goLanding = <Navigate to='/landing' />;
  const goHome = <Navigate to='/home' />;

  useEffect(() => {
    if (accessToken !== undefined) setLoading(false);
    if (!auth) {
      nav('/landing');
    }
  }, [accessToken]);

  return (
    <div className='App relative h-full'>
      <Context.Provider
        value={{
          providerValue: providerValue,
          currentSelectedTrackValue: currentSelectedTrackValue,
          currentBackgroundColor: currentBackgroundColor,
          currentSDKPlayerValue: currentSDKPlayerValue,
          currentPlayingTrack: currentPlayingTrackValue
        }}>
        <Routes>
          <Route exact path='/' element={auth ? goHome : goLanding} />
          <Route
            path='/'
            element={
              <div>
                <Navbar accessToken={accessToken} />
                <Header accessToken={accessToken} bgColor={currentBackgroundColor.currentColor} />
                {auth && !loading ? <FooterMusicPlayer accessToken={accessToken} /> : ''}
                <Outlet />
              </div>
            }>
            <Route path='/landing' element={<LandingPage accessToken={accessToken} />} />
            <Route path='/home' element={<Homepage accessToken={accessToken} />} />
            <Route path='/playlists/:id' element={<>{auth ? <Playlist accessToken={accessToken} /> : <Homepage accessToken={accessToken} />}</>} />
          </Route>
        </Routes>
      </Context.Provider>
    </div>
  );
}

export default App;
