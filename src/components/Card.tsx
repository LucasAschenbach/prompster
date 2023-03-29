import React from 'react';

interface Props {
  children: React.ReactNode;
}

const Card: React.FC<Props> = ({ children }) => {
  return (
    <div className="bg-black shadow-xl rounded-md p-2 border border-zinc-700 text-white">
      {children}
    </div>
  );
};

export default Card;
