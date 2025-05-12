"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function A1A2A3Form({ form_id }: { form_id: string }) {
  const supabase = createClient();
  const [formData, setFormData] = useState<any>(null);
  const [fileURL, setFileURL] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const getFormData = async () => {
    const { data } = await supabase
      .from("A1.a_tbl_training_activities")
      .select("*")
      .eq("form_id", form_id);

    setFormData(data?.[0]);
  };

  useEffect(() => {
    getFormData();
  }, []);

  const getPublicURL = async (path: string) => {
    const { data } = supabase.storage.from("a1-training-activities").getPublicUrl(path);
    return data.publicUrl;
  };


  const data_items = [
    { key: "training", label: "Title of training conducted", type: "text" },
    { key: "venue", label: "Place/Venue", type: "text" },
    { key: "date_from", label: "Date start", type: "date" },
    { key: "date_to", label: "Date end", type: "date" },
    { key: "duration", label: "Duration", type: "text" },
    { key: "num_persons_trained", label: "Number of persons trained", type: "text" },
    { key: "weight_persons_trained", label: "Number of persons trained weighted by length of training", type: "text" },
    { key: "num_trainees_surveyed", label: "Number of trainees surveyed", type: "text" },
    { key: "num_clients_rate", label: "Number of clients who rate the training course as", type: "text" },
    { key: "5_rate", label: "5 (Best)", type: "text" },
    { key: "4_rate", label: "4 (Better)", type: "text" },
    { key: "3_rate", label: "3 (Good)", type: "text" },
    { key: "2_rate", label: "2 (Fair)", type: "text" },
    { key: "1_rate", label: "1 (Poor)", type: "text" },
    { key: "num_clients_timeliness", label: "Number of clients who rate the timeliness of service delivery as", type: "text" },
    { key: "5_timeliness", label: "5 (Best)", type: "text" },
    { key: "4_timeliness", label: "4 (Better)", type: "text" },
    { key: "3_timeliness", label: "3 (Good)", type: "text" },
    { key: "2_timeliness", label: "2 (Fair)", type: "text" },
    { key: "1_timeliness", label: "1 (Poor)", type: "text" },
    { key: "support_file_path", label: "Upload supporting documents", type: "upload" },
  ];

  return (
    <>
      {data_items.map((item) => (
        <div key={item.key} className="mb-4">
          <label className="block font-semibold mb-1">{item.label}</label>
          <div className="text-lg text-zinc-600">
            {item.key === "support_file_path" && formData?.[item.key] ? (
              <>
                <a
                  href={fileURL || "#"}
                  download
                  target="_blank"
                  className="btn btn-sm btn-outline"
                  onClick={async () => {
                    if (!fileURL) {
                      const url = await getPublicURL(formData[item.key]);
                      setFileURL(url);
                    }
                  }}
                >
                  View Document
                </a>
              </>
            ) : (
              formData?.[item.key] || ""
            )}
          </div>
        </div>
      ))}

 
    </>
  );
}
