import { useState } from "react";
import axios from "axios";

export default function Form(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    if (props.login) {
      console.log("login");

      let response = await axios.post(
        `${process.env.REACT_APP_API_SERVER}/auth/login`,
        { username, password }
      );
      props.getToken(response.data.token);
      props.getUsername(username);
      console.log(response.data);
    } else {
      console.log("signup");
      let response = await axios.post(
        `${process.env.REACT_APP_API_SERVER}/auth/signup`,
        { email, password, username }
      );
      console.log(response.data);
    }
  };

  return (
    <div style={{ margin: "3em", border: "solid 1em white" }}>
      {props.login ? (
        <div>
          <h1>Login</h1>
          <form onSubmit={onSubmit}>
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <br />
            <label>Password:</label>
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <br />
            <input type="submit" value="submit" />
          </form>
        </div>
      ) : (
        <div>
          <h1>Signup</h1>
          <form onSubmit={onSubmit}>
            <label>Email:</label>
            <br />
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <br />
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <br />
            <label>Password:</label>
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <br />
            <input type="submit" value="submit" />
          </form>
        </div>
      )}
    </div>
  );
}
