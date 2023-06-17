import React from 'react';

type Props = {
    className?: string;
    children: React.ReactNode;
};

const KeyIcon: React.FC<Props> = ({ className, children }) => {
    return (
        <div className={`inline-block px-1 py-0.5 text-zinc-400 rounded bg-zinc-800 border-zinc-700 border-b-2 shadow-inner text-center text-xs dark:text-white font-semibold ${className}`}>
            {children}
        </div>
    );
};

export default KeyIcon;
