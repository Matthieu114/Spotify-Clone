import { useEffect, useState, useContext, useMemo } from "react";
import Homepage from "./Homepage";
import Navbar from "./Navbar";
import Playlist from "./Playlist";
import UseAuth from "./UseAuth";
import FooterMusicPlayer from "./FooterMusicPlayer";
import {
  Route,
  Routes,
  Navigate,
  useLocation,
  BrowserRouter as Router
} from "react-router-dom";

import { Context } from "./Context";

const code = new URLSearchParams(window.location.search).get("code");

function App() {
  const [auth, setAuth] = useState(code);
  const [currentTrack, setCurrentTrack] = useState(null);

  const providerValue = useMemo(() => ({ auth, setAuth }), [auth, setAuth]);
  const currentTrackValue = useMemo(
    () => ({ currentTrack, setCurrentTrack }),
    [currentTrack, setCurrentTrack]
  );

  const accessToken = UseAuth(auth);

  return (
    <div className="App relative h-full">
      <Context.Provider
        value={{
          providerValue: providerValue,
          currentTrackValue: currentTrackValue
        }}>
        <Routes>
          <Route
            path="/playlists/:id"
            element={
              <>
                {auth ? (
                  <Playlist accessToken={accessToken} />
                ) : (
                  <Homepage accessToken={accessToken} />
                )}
                {/* <FooterMusicPlayer accessToken={accessToken} /> */}
                <Navbar accessToken={accessToken} />
              </>
            }
          />
          <Route
            exact
            path="/"
            element={
              <>
                <Homepage accessToken={accessToken} />
                <Navbar accessToken={accessToken} />
                <FooterMusicPlayer accessToken={accessToken} />
              </>
            }
          />
        </Routes>
      </Context.Provider>
    </div>
  );
}

export default App;
