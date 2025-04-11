"use client";


export default function Subheading({children,}: Readonly<{children: React.ReactNode;}>) {
    
    return (
        <span className="text-xs text-gray-900 flex">
            {children}
        </span>      
    );
}