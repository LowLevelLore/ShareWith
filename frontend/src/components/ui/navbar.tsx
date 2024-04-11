import React, { useState } from "react";
import Button from "./Button";

const Nav = (props: { logoutFn: any }) => {
  let Links = [
    { name: "Create", link: "/create" },
    { name: "Join", link: "/join" },
    { name: "About Us", link: "/" },
    { name: "Contact Us", link: "/contact" },
  ];
  let [open, setOpen] = useState(false);
  return (
    <div className="shadow-md w-full relative top-0 left-0 border-b-2 border-white">
      <div className="md:flex items-center justify-between bg-transparent py-4 md:px-10 px-7">
        <div
          className="font-bold text-2xl cursor-pointer flex items-center font-[Poppins]
      text-white"
        >
          <span className="text-3xl text-indigo-600 mr-1 pt-2"></span>
          CodeWith
        </div>

        <div
          onClick={() => setOpen(!open)}
          className="text-3xl absolute right-8 top-6 cursor-pointer md:hidden"
        ></div>

        <ul
          className={`md:flex md:items-center md:pb-0 pb-12 absolute md:static bg-transparent md:z-auto z-[-1] left-0 w-full md:w-auto md:pl-0 pl-9 transition-all duration-500 ease-in ${
            open ? "top-20 " : "top-[-490px]"
          }`}
        >
          {Links.map((link) => (
            <li key={link.name} className="md:ml-8 text-xl md:my-0 my-7">
              <a
                href={link.link}
                className="text-white hover:text-gray-400 duration-500"
              >
                {link.name}
              </a>
            </li>
          ))}
          <Button onClick={props.logoutFn}>Logout</Button>
        </ul>
      </div>
    </div>
  );
};

export default Nav;
