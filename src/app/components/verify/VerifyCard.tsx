"use client";

export default function VerifyCard({
  form,
  status,
  date,
  time,
  submitted_by,
}: {
  form: string;
  status: string;
  date: string;
  time: string;
  submitted_by: string;
}) {
  return (
    <div
      className={`flex flex-col w-1/6 m-3 p-2 rounded-lg shadow-lg border-2 cursor-pointer
                bg-white hover:bg-blue-200 border-gray-300
                transition duration-300 ease-in-out`}
    >
      <h1 className="text-2xl font-bold">{form}</h1>
      <span
        className={`self-start inline-block text-sm px-1 py-0.5 rounded ${
          status == "Pending"
            ? "bg-yellow-200"
            : status == "Rejected"
            ? "bg-red-200"
            : status == "Verified"
            ? "bg-green-200"
            : ""
        }`}
      >
        {status}
      </span>

      <p className="text-sm font-semibold">{date}</p>
      <p className="text-sm font-semibold">{time}</p>
      <p className="text-sm">{submitted_by}</p>
    </div>
  );
}
