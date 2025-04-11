"use client";


export default function Heading({children,}: Readonly<{children: React.ReactNode;}>) {
    
    return (
        <span className="mb-2 text-3xl font-bold text-gray-900 flex">
            {children}
        </span>      
    );
}