import { useEffect, useState, useContext, useMemo } from "react";
import Homepage from "./Homepage";
import Navbar from "./Navbar";
import UseAuth from "./UseAuth";
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
  const providerValue = useMemo(() => ({ auth, setAuth }), [auth, setAuth]);

  const accessToken = UseAuth(auth);

  return (
    <div className="App relative h-full">
      <Context.Provider value={providerValue}>
        <Routes>
          <Route
            path="/playlists/*"
            element={
              <>
                <Homepage accessToken={accessToken} />
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
              </>
            }
          />
          {/* <Navbar accessToken={accessToken} />
          <Homepage accessToken={accessToken} /> */}
        </Routes>
      </Context.Provider>
    </div>
  );
}

export default App;
