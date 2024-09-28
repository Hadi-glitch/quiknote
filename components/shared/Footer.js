import React from "react";

const Footer = () => {
  return (
    <div className="px-3 py-2 flex justify-between absolute bottom-0 w-full">
      <div className="flex justify-between w-full flex-col md:flex-row text-center">
        <p>&copy; 2024 QuikNote. All rights reserved.</p>
        <p>Made with ❤️ By Hadi</p>
      </div>
    </div>
  );
};

export default Footer;
