"use client";

import Heading from "@/app/components/typography/Heading";
import Subheading from "@/app/components/typography/Subheading";
export default function Test() {
    const data_items = [
        {
            key: "1",
            label: "Title of training conducted",
            type: "text",
        },
        {
            key: "2",
            label: "Place/Venue",
            type: "text",
        },
        {
            key: "3",
            label: "Date start",
            type: "date",
        },
        {
            key: "4",
            label: "Date end",
            type: "date",
        },
        {
            key: "5",
            label: "Duration",
            type: "text",
        },
        { 
            key: "6",
            label: "Number of persons trained",
            type: "text",
        },
        { 
            key: "7",
            label: "Number of persons trained weighted by length of training",
            type: "text",
        },
        { 
            key: "8",
            label: "Number of trainees surveyed",
            type: "text",
        },
        { 
            key: "9",
            label: "Number of clients who rate the training course as",
            type: "text",
        },
        { 
            key: "10",
            label: "5 (Best)",
            type: "text",
        },
        { 
            key: "11",
            label: "4 (Better)",
            type: "text",
        },
        { 
            key: "12",
            label: "3 (Good)",
            type: "text",
        },
        { 
            key: "13",
            label: "2 (Fair)",
            type: "text",
        },
        { 
            key: "14",
            label: "1 (Poor)",
            type: "text",
        },
        { 
            key: "15",
            label: "Number of clients who rate the training course as",
            type: "text",
        },
        { 
            key: "16",
            label: "5 (Best)",
            type: "text",
        },
        { 
            key: "17",
            label: "4 (Better)",
            type: "text",
        },
        {
            key: "18",
            label: "3 (Good)",
            type: "text",
        },
        { 
            key: "19",
            label: "2 (Fair)",
            type: "text",
        },
        { 
            key: "20",
            label: "1 (Poor)",
            type: "text",
        },
        { 
            key: "21",
            label: "Number of clients who rate the timeliness of service delivery as",
            type: "text",
        },
        { 
            key: "22",
            label: "5 (Best)",
            type: "text",
        },
        { 
            key: "23",
            label: "4 (Better)",
            type: "text",
        },
        { 
            key: "24",
            label: "3 (Good)",
            type: "text",
        },
        { 
            key: "25",
            label: "2 (Fair)",
            type: "text",
        },
        { 
            key: "26",
            label: "1 (Poor)",
            type: "text",
        },
        {
            key: "27",
            label: "Upload supporting documents",
            type: "upload",
        }
    ];

    return (
        <div className="flex flex-col gap-5 p-10 bg-white rounded-lg shadow-md">
        
        <div className="breadcrumbs text-sm">
            <ul>
                <li><a>Home</a></li>
                <li><a>Submit Documents</a></li>
                <li>A.1 A.2 A.3</li>
            </ul>
        </div>
            
            <div className="flex flex-col">
                <Heading>A.1 Form</Heading>    
                <Subheading> 
                    <ul>
                        <li>Training activities implemented</li>
                        <li>Beneficiaries/Community/Population served</li>
                        <li>Beneficiary program rating</li>
                        <li>Beneficiary program timeliness rating</li>
                    </ul>
                </Subheading>
                </div>
            <div className="flex flex-col gap-4">
                {data_items.map((item) => {
                    const renderField = () => {
                        switch (item.type) {
                            case "text":
                                return (
                                    <fieldset className="fieldset" key={item.key}>
                                        <legend className="fieldset-legend">{item.label}</legend>
                                        <input type="text" className="input input-neutral border" placeholder="Type here" />
                                    </fieldset>
                                );
                            case "date":
                                return (
                                    <fieldset className="fieldset" key={item.key}>
                                        <legend className="fieldset-legend">{item.label}</legend>
                                        <input type="date" className="input input-neutral border" placeholder="Type here" />
                                    </fieldset>
                                );
                            case "long text":
                                return (
                                    <fieldset className="fieldset" key={item.key}>
                                        <legend className="fieldset-legend">{item.label}</legend>
                                        <textarea className="textarea textarea-neutral border" placeholder="Type here"></textarea>
                                    </fieldset>
                                );
                            case "upload":
                                return (
                                    <fieldset className="fieldset" key={item.key}>
                                        <legend className="fieldset-legend">{item.label}</legend>
                                        <input type="file" className="file-input file-input-neutral" placeholder="Type here" />
                                    </fieldset>
                                );
                            default:
                                return null;
                        }
                    };
                    return renderField();
                })}
            </div>

            <div>
                <button className="btn btn-primary">Submit</button>
            </div>
        </div>
    );
}