import { useState } from "react";
import axios from "axios";

export default function Profile(props) {
  const [email, setEmail] = useState("");
  const [id, setId] = useState(0);
  const [username, setUsername] = useState("");
  const [hashedPassword, setHashedPassword] = useState("");

  const getData = async () => {
    console.log("getdata!!");
    console.log("cookies");

    // cookies
    let data = await axios.get(`${process.env.REACT_APP_API_SERVER}/auth/`, {
      withCredentials: true,
    });

    // local storage if it is there

    // const token = localStorage.getItem("passport_token");
    // const requestedUsername = localStorage.getItem("username");
    // let data;
    // if (token && requestedUsername) {
    //   console.log("localstorage);
    //   data = await axios.get(
    //     `${process.env.REACT_APP_API_SERVER}/auth/${requestedUsername}`,
    //     {
    //       withCredentials: true,
    //     }
    //   );
    // } else {
    //   console.log("state");

    //   data = await axios.get(
    //     `${process.env.REACT_APP_API_SERVER}/auth/${props.username}`,
    //     {
    //       headers: {
    //         Authorization: `Bearer ${props.token}`,
    //       },
    //     }
    //   );
    // }

    console.log(data.data);

    setEmail(data.data.email);
    setId(data.data.id);
    setUsername(data.data.username);
    setHashedPassword(data.data.password);
  };
  // console.log(props.token);
  // console.log(props.username);

  return (
    <div>
      <h1>Logged in users profile</h1>
      <button onClick={getData}>Get Profile!</button>

      {email.length > 0 && hashedPassword.length > 0 ? (
        <div>
          <h4>Username: {username}</h4>
          <h4>Email: {email}</h4>
          <h4>ID: {id}</h4>
          <h4>Hashed Password: {hashedPassword}</h4>
        </div>
      ) : (
        <div>no user </div>
      )}
    </div>
  );
}
