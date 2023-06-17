import React from "react";

type Props = {
  className?: string;
  children: React.ReactNode;
};

const KeyIcon: React.FC<Props> = ({ className, children }) => {
  return (
    <div
      className={`dark:text-white inline-block rounded border-b-2 border-zinc-700 bg-zinc-800 px-1 py-0.5 text-center text-xs font-semibold text-zinc-400 shadow-inner ${className}`}
    >
      {children}
    </div>
  );
};

export default KeyIcon;
