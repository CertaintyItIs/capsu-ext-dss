"use client";

import VerifyCard from "../components/verify/VerifyCard";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Test() {
  const router = useRouter();

  const forms = [
    {
        key: "1",
        form: "A.1 A.2 A.3",
        date: "January 24, 2025",
        time: "1:24PM",
        status: "Pending",
        submitted_by: "Skusta Clee",
    },
    {
        key: "2",
        form: "C",
        date: "February 25, 2025",
        time: "1:24PM",
        status: "Pending",
        submitted_by: "Rory James",
    },
    {
        key: "3",
        form: "F",
        date: "February 28, 2025",
        time: "1:24PM",
        status: "Pending",
        submitted_by: "Kumar Ravi",
    },
    {
        key: "4",
        form: "A5",
        date: "March 17, 2025",
        time: "1:24PM",
        status: "Pending",
        submitted_by: "Ishaan Khan",
    },
  ];

  const forms2 = [
    {
        key: "1",
        form: "A.1 A.2 A.3",
        date: "January 24, 2025",
        time: "1:24PM",
        status: "Rejected",
        submitted_by: "Skusta Clee",
    },
    {
        key: "2",
        form: "C",
        date: "January 24, 2025",
        time: "1:24PM",
        status: "Rejected",
        submitted_by: "Rory James",
    },
    {
        key: "3",
        form: "F",
        date: "January 24, 2025",
        time: "1:24PM",
        status: "Rejected",
        submitted_by: "Kumar Ravi",
    },
    {
        key: "4",
        form: "A5",
        date: "January 24, 2025",
        time: "1:24PM",
        status: "Rejected",
        submitted_by: "Ishaan Khan",
    },
  ];

  const forms3 = [
    {
        key: "1",
        form: "A.1 A.2 A.3",
        date: "January 24, 2025",
        time: "1:24PM",
        status: "Verified",
        submitted_by: "Skusta Clee",
    },
    {
        key: "2",
        form: "C",
        date: "January 24, 2025",
        time: "1:24PM",
        status: "Verified",
        submitted_by: "Rory James",
    },
    {
        key: "3",
        form: "F",
        date: "January 24, 2025",
        time: "1:24PM",
        status: "Verified",
        submitted_by: "Kumar Ravi",
    },
    {
        key: "4",
        form: "A5",
        date: "January 24, 2025",
        time: "1:24PM",
        status: "Verified",
        submitted_by: "Ishaan Khan",
    },
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
        <h1 className="text-2xl font-bold">Verify Forms</h1>
      </div>
      
      <div className="mb-4">
        <h1 className="text-1xl font-bold">Pending for verification</h1>
      </div>

      <div className="flex flex-wrap">
        {forms.map((item, index) => (
          <VerifyCard
            key={index}
            form={item.form}
            status={item.status}
            date={item.date}
            time={item.time}
            submitted_by={item.submitted_by}
          />
        ))}
      </div>

      <div className="mb-4">
        <h1 className="text-1xl font-bold">Rejected</h1>
      </div>

      <div className="flex flex-wrap">
        {forms2.map((item, index) => (
          <VerifyCard
            key={index}
            form={item.form}
            status={item.status}
            date={item.date}
            time={item.time}
            submitted_by={item.submitted_by}
          />
        ))}
      </div>

      <div className="mb-4">
        <h1 className="text-1xl font-bold">Verified</h1>
      </div>

      <div className="flex flex-wrap">
        {forms3.map((item, index) => (
          <VerifyCard
            key={index}
            form={item.form}
            status={item.status}
            date={item.date}
            time={item.time}
            submitted_by={item.submitted_by}
          />
        ))}
      </div>
      <div className="mt-6">

      </div>
    </div>
  );
}
