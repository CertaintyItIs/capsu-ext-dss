"use client";

import SubmitButtonCard from "../components/SubmitButtonCard";

export default function Test(){
    const data_items = [
        { 
            type: "A.1", 
            description: "Recognized and implemented community programs" 
        },
        { 
            type: "A.1 A.2 A.3", 
            description: "Training activities implemented\nBeneficiaries/Community/Population served\nBeneficiary program rating\nBeneficiary program timeliness rating" 
        },
        { 
            type: "A.4", 
            description: "Adopters engaged in profitable enterprise" 
        },
        { 
            type: "A.5", 
            description: "Impacted Assessment Conducted" 
        },
        { 
            type: "A.5", 
            description: "Ordinance/Resoultion proposed" 
        },
        { 
            type: "A.5", 
            description: "Awards/Recognition received" 
        },
        { 
            type: "A.5.1", 
            description: "Technology/Innovations utilized in extension activities" 
        },
        { 
            type: "A.5.2", 
            description: "Demo project implemented" 
        },
        { 
            type: "A.6", 
            description: "Funding for extension services" 
        },
        { 
            type: "A.6.1", 
            description: "GAA-CE utilized allocated funds" 
        },
        { 
            type: "A.6.1", 
            description: "Institutional policy maintained" 
        },
        { 
            type: "B", 
            description: "Sustainable linkages/partnership" 
        },
        { 
            type: "C", 
            description: "IEC Materials/Techno Guides developed" 
        },
        { 
            type: "D", 
            description: "Programs monitored and evaluated biannually" 
        },
        { 
            type: "E", 
            description: "Extension activity featured in print, radio, or online media" 
        },
        { 
            type: "F", 
            description: "Plantilla position faculty and staff engaged in extension and community services" 
        },
    ];

    return (
        <div className="flex flex-col">
            <div className="flex">
                <h1> Submit Documents </h1>
            </div>
            

           <div className="flex flex-wrap">
                {data_items.map((item) => (
                    <SubmitButtonCard title={item.type} value={item.description}/>
                ))}
           </div>

           <div>
                <button> Submit</button>
           </div>
            
        </div>       
    );
}