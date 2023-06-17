import React from "react";

interface Props {
  children: React.ReactNode;
}

const Card: React.FC<Props> = ({ children }) => {
  return (
    <div className="rounded-md border border-zinc-700 bg-black text-white shadow-xl overflow-clip">
      {children}
    </div>
  );
};

export default Card;
