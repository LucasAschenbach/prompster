import React from "react";

interface Props {
  children: React.ReactNode;
}

const Card: React.FC<Props> = ({ children }) => {
  return (
    <div className="overflow-clip rounded-md border border-zinc-700 bg-black text-white shadow-xl">
      {children}
    </div>
  );
};

export default Card;
