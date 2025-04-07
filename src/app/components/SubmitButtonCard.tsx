"use client"

export default function SubmitButtonCard({ title, value }: { title: string; value: string }){
    
        return (
            <div className="flex flex-col w-1/4 h-1/4 m-3 p-2 rounded-lg shadow-lg border-2 border-gray-300 bg-white hover:bg-blue-200 transition duration-300 ease-in-out">
                <h1 className="text-xl">{title}</h1>
                <p>{value}</p>
            </div>       
        );    
}