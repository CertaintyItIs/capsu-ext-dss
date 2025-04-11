"use client";

import Heading from "@/app/components/typography/Heading";
import Subheading from "@/app/components/typography/Subheading";
export default function Test() {
    const data_items = [
        {
            key: "1",
            label: "Name of Adopter",
            type: "text",
        },
        {
            key: "2",
            label: "Training attended",
            type: "text",
        },
        {
            key: "3",
            label: "Training date",
            type: "date",
        },
        {
            key: "4",
            label: "Profitable enterprise",
            type: "long text",
        },
        {
            key: "5",
            label: "Net income",
            type: "text",
        },
    ];

    return (
        <div className="flex flex-col gap-5 p-10 bg-white rounded-lg shadow-md">
        
        <div className="breadcrumbs text-sm">
            <ul>
                <li><a>Home</a></li>
                <li><a>Submit Documents</a></li>
                <li>A.4</li>
            </ul>
        </div>
            
            <div className="flex flex-col">
                <Heading>A.4 Form</Heading>    
                <Subheading> Adopters engaged in profitable enterprise</Subheading>
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