"use client";


export default function DashboardCard({ title, value }: { title: string; value: string }) {
    
    return (
        <div className="flex flex-col w-1/4 h-1/4 m-3 p-2 rounded-lg shadow-lg border-2 border-gray-300 justify-center items-center bg-white hover:bg-blue-200 transition duration-300 ease-in-out">
            <p className="align-middle">{title}</p>
            <h1 className="text-6xl">{value}</h1>
        </div>       
    );
}