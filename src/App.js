import Homepage from "./Homepage";
import Navbar from "./Navbar";
import UseAuth from "./UseAuth";
const code = new URLSearchParams(window.location.search).get("code");

function App() {
  const accessToken = UseAuth(code);
  return (
    <div className="App relative h-full">
      <Navbar code={code} accessToken={accessToken} />
      <Homepage code={code} accessToken={accessToken} />
    </div>
  );
}

export default App;
