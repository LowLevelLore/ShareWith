import React, { useEffect, useRef, useState } from "react";
import ACTIONS from "./Actions";
import Editor from "@monaco-editor/react";
import { Socket } from "socket.io-client";

function Editor__(props: {
  roomId: string;
  socketRef: React.MutableRefObject<Socket<any, any> | undefined>;
  onCodeChange__: (code_: string) => void;
}) {
  const [code, setCode] = useState("");
  useEffect(() => {
    props.socketRef.current?.on(
      ACTIONS.CODE_CHANGE,
      (data: { code: string }) => {
        setCode(data.code);
        console.log("Sett");
        props.onCodeChange__(data.code);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.socketRef.current]);

  return (
    <div className="text-white">
      <Editor
        onChange={(event) => {
          if (event) {
            setCode(event);

            props.onCodeChange__(event);
          }
          props.socketRef.current?.emit(ACTIONS.CODE_CHANGE, {
            roomId: props.roomId,
            code: event,
          });
          console.log(code);
        }}
        height="100vh"
        language="python"
        theme="vs-dark"
        value={code}
        options={{
          inlineSuggest: { enabled: true },
          fontSize: 16,
          formatOnType: true,
          autoClosingBrackets: "always",
          minimap: { scale: 10 },
        }}
      />
    </div>
  );
}

export default Editor__;
