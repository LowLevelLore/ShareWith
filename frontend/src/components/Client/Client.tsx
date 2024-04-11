import React from "react";
import Avatar from "react-avatar";

function Client(props: { username: string; socketId: string }) {
  return (
    <div className="client">
      <Avatar name={props.username} size={"50"} round={"14"} />
      <span className="userName">{props.username}</span>
    </div>
  );
}

export default Client;
