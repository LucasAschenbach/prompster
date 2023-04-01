import React from "react";

interface Props {
  children: React.ReactNode;
}

const Card: React.FC<Props> = ({ children }) => {
  return (
    <div className="rounded-md border border-zinc-700 bg-black p-2 text-white shadow-xl">
      {children}
    </div>
  );
};

export default Card;
