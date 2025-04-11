"use client";

export default function SubmitButtonCard({
    title,
    value,
    selected,
    onClick,
}: {
    title: string;
    value: string;
    selected: boolean;
    onClick: () => void;
}) {
    return (
        <div
            onClick={onClick}
            className={`flex flex-col w-1/4 h-1/4 m-3 p-2 rounded-lg shadow-lg border-2 cursor-pointer
                ${selected ? "bg-blue-400 border-blue-500" : "bg-white hover:bg-blue-200 border-gray-300"} 
                transition duration-300 ease-in-out`}
        >
            <h1 className="text-xl font-semibold">{title}</h1>
            <p className="whitespace-pre-line">{value}</p>
        </div>
    );
}
