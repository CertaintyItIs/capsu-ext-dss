"use client";

import SubmitButtonCard from "../components/submit/SubmitButtonCard";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Test() {
    const router = useRouter();

    const forms = [
        { url:"a1", type: "A.1", description: "Recognized and implemented community programs" },
        { url:"a1a2a3", type: "A.1 A.2 A.3", description: "Training activities implemented\nBeneficiaries/Community/Population served\nBeneficiary program rating\nBeneficiary program timeliness rating" },
        { url:"a4", type: "A.4", description: "Adopters engaged in profitable enterprise" },
        { url:"a5", type: "A.5", description: "Impacted Assessment Conducted" },
        { url:"a5_a", type: "A.5", description: "Ordinance/Resoultion proposed" },
        { url:"a5_b", type: "A.5", description: "Awards/Recognition received" },
        { url:"a5_1", type: "A.5.1", description: "Technology/Innovations utilized in extension activities" },
        { url:"a5_2", type: "A.5.2", description: "Demo project implemented" },
        { url:"a6", type: "A.6", description: "Funding for extension services" },
        { url:"a6_1", type: "A.6.1", description: "GAA-CE utilized allocated funds" },
        { url:"a6_1_b", type: "A.6.1", description: "Institutional policy maintained" },
        { url:"b", type: "B", description: "Sustainable linkages/partnership" },
        { url:"c", type: "C", description: "IEC Materials/Techno Guides developed" },
        { url:"d", type: "D", description: "Programs monitored and evaluated biannually" },
        { url:"e", type: "E", description: "Extension activity featured in print, radio, or online media" },
        { url:"f", type: "F", description: "Plantilla position faculty and staff engaged in extension and community services" },
    ];

    const [selectedForm, setSelectedForm] = useState<string | null>(null);

    const handleSubmit = () => {
        if (selectedForm) {
            router.push(`/submit/${encodeURIComponent(selectedForm)}`);
        } else {
            alert("Please select a form first.");
        }
    };

    return (
        <div className="flex flex-col p-4">
            <div className="mb-4">
                <h1 className="text-2xl font-bold">Submit Documents</h1>
            </div>

            <div className="flex flex-wrap">
                {forms.map((item, index) => (
                    <SubmitButtonCard
                        key={index}
                        title={item.type}
                        value={item.description}
                        selected={selectedForm === item.url}
                        onClick={() => setSelectedForm(item.url)}
                    />
                ))}
            </div>

            <div className="mt-6">
                <button
                    onClick={handleSubmit}
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
                >
                    Submit
                </button>
            </div>
        </div>
    );
}
