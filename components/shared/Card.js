import React from "react";

const Card = ({ title, content, onClick }) => {
  return (
      <div
        onClick={onClick}
        className="bg-white border border-black p-4 rounded-lg w-72 h-44 flex flex-col gap-1 cursor-pointer"
      >
        <h2 className="font-bold peer hover:text-blue-700">{title}</h2>
        <p className="peer-hover:text-blue-700 text-base">{content}</p>
      </div>
  );
};

export default Card;
