import React from 'react';

export const Logo = ({ className = "w-8 h-8" }) => (
    <svg
        viewBox="0 0 512 512"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        {/* Simplified paths for small sizes */}
        <path d="M128 128 L256 384 L384 128" stroke="currentColor" strokeWidth="60" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="128" cy="128" r="40" className="fill-neon-blue" />
        <circle cx="384" cy="128" r="40" className="fill-neon-purple" />
        <circle cx="256" cy="384" r="40" className="fill-neon-green" />
    </svg>
);
