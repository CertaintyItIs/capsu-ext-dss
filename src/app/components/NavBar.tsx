"use client";

import { useState } from "react";

export default function NavBar(){
    const [isOpen, setIsOpen] = useState(false);
    const nav_items = [
        { name: "back", icon:"/back.png"},
        { name: "menu", icon: "/menu.png"},
        { name: "Dashboard", icon: "/dashboard.png", link:"/"},
        { name: "Submit documents", icon: "/submit_documents.png", link:"/submit"},
        { name: "Generate reports", icon: "/generate_reports.png", link:"/generate"},
        { name: "View records", icon: "/records.png", link:"/view"},
        { name: "Verify documents", icon: "/verify.png", link:"/verify"},
    ]
    
    return (
        <aside className="fixed inset-y-0 left-0 z-10 flex flex-col border-r-2 border-r-black bg-background ">
        <div>
            <div className={"px-4 py-2 flex  bg-blue-500 text-white"}>
            <a className="flex" href="/">
            <div>
                <img src="/capsulogo.png" alt="Logo" className="w-10 mr-2" />
            </div>
            {(isOpen == true) ? (
            <div>
                <h1>Capiz State University</h1>
                <h1>RDE - CESO</h1>
            </div>
            ) : null
            }
            </a>
            </div>
        
            <ul className="px-4 py-2 bg-white text-gray-800">  
                <li>
                    {nav_items.map((item) => (
                    (isOpen == true) ? (
                        (item.name == "back") ? (
                        <div key={item.name} onClick={() => setIsOpen(!isOpen)} className="cursor-pointer flex p-2">
                            <img src={item.icon} alt={item.name} className="w-6 h-6 mr-2" />
                        </div>) 
                        : (item.name != "menu") ? (
                        <div className="flex-row p-2" key={item.name}>
                            <a href={item.link}>
                            <img src={item.icon} alt={item.name} className="w-6 h-6 mr-2" />
                            <p>{item.name}</p>
                            </a>
                        </div>)
                        : ( null )
                    ) : (
                        (item.name == "menu") ? (
                        <div key={item.name} onClick={() => setIsOpen(!isOpen)} className="cursor-pointer flex p-2">
                            <img src={item.icon} alt={item.name} className="w-6 h-6 mr-2" />
                        </div>) 
                        : (item.name != "back") ? (
                        <div key={item.name} className="flex p-2">
                            <a href={item.link}>
                            <img src={item.icon} alt={item.name} className="w-6 h-6 mr-2" />
                            </a>
                        </div>)
                        : ( null )
                        )
                    ))}
                </li>
            </ul>
        </div>


        <div className="flex bg-gray-100">

        </div>
        </aside>
        
    );
}