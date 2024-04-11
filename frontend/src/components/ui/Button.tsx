import React from "react";

const Button = (props: { children: any; onClick: any }) => {
  return (
    <button
      className="bg-blue-600 text-white font-[Poppins] py-2 px-6 rounded md:ml-8 hover:bg-blue-800 
    duration-500"
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};

export default Button;
