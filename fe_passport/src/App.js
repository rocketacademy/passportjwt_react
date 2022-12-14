import logo from "./logo.svg";
import "./App.css";
import Form from "./Form";
import { useState } from "react";
import Profile from "./Profile";

function App() {
  const [token, setToken] = useState("");
  const [username, setUsername] = useState("");

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          <Form />
          <Form getToken={setToken} getUsername={setUsername} login />
        </div>
        <Profile token={token} username={username} />
      </header>
    </div>
  );
}

export default App;
