"use client";

import Heading from "@/app/components/typography/Heading";
import Subheading from "@/app/components/typography/Subheading";
import { createClient } from "@/lib/supabase/client";
import { useState, useEffect } from "react";

export default function Test() {
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<
    { [key: string]: any } & { support_file_path?: string }
  >({});
  const [file, setFile] = useState<File | null>(null);

  const data_items = [
    { key: "training", label: "Title of training conducted", type: "text" },
    { key: "venue", label: "Place/Venue", type: "text" },
    { key: "date_from", label: "Date start", type: "date" },
    { key: "date_to", label: "Date end", type: "date" },
    { key: "duration", label: "Duration", type: "text" },
    {
      key: "num_persons_trained",
      label: "Number of persons trained",
      type: "text",
    },
    {
      key: "weight_persons_trained",
      label: "Number of persons trained weighted by length of training",
      type: "text",
    },
    {
      key: "num_trainees_surveyed",
      label: "Number of trainees surveyed",
      type: "text",
    },
    {
      key: "num_clients_rate",
      label: "Number of clients who rate the training course as",
      type: "text",
    },
    { key: "5_rate", label: "5 (Best)", type: "text" },
    { key: "4_rate", label: "4 (Better)", type: "text" },
    { key: "3_rate", label: "3 (Good)", type: "text" },
    { key: "2_rate", label: "2 (Fair)", type: "text" },
    { key: "1_rate", label: "1 (Poor)", type: "text" },
    {
      key: "num_clients_timeliness",
      label: "Number of clients who rate the timeliness of service delivery as",
      type: "text",
    },
    { key: "5_timeliness", label: "5 (Best)", type: "text" },
    { key: "4_timeliness", label: "4 (Better)", type: "text" },
    { key: "3_timeliness", label: "3 (Good)", type: "text" },
    { key: "2_timeliness", label: "2 (Fair)", type: "text" },
    { key: "1_timeliness", label: "1 (Poor)", type: "text" },
    {
      key: "support_file_path",
      label: "Upload supporting documents",
      type: "upload",
    },
  ];

  async function submitForm() {
    try {
      setLoading(true);

      // Get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) throw new Error("User not authenticated.");

      // Get user's campus_id
      const { data: campus_id, error: campus_idError } = await supabase
        .from("tbl_users")
        .select("campus_id")
        .eq("id", user.id)
        .single();
      if (campus_idError) throw campus_idError;

      // Insert into tbl_forms
      const { data: entryData, error: errorForm } = await supabase
        .from("tbl_forms")
        .insert({
          form: "A1 A2 A3",
          status: "Pending",
          document_status: "Pending",
          campus_id: campus_id.campus_id,
          latest_change: new Date().toISOString(),
          submitted_by: user.id,
        })
        .select();
      if (errorForm) throw errorForm;

      const formId = entryData?.[0]?.id;
      const payload: {
        [key: string]: any;
        form_id: any;
        support_file_path?: string;
      } = { ...formData, form_id: formId };

      if (file) {
        const fileExt = file.name.split(".").pop();
        const filePath = `${user.id}/${formId}_${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("a1-training-activities") // Make sure this bucket exists
          .upload(filePath, file);

        console.log("uploadError", uploadError);
        if (uploadError) throw uploadError;

        // Add the uploaded file path to the payload
        payload.support_file_path = filePath;
      }

      // Insert into A1.a_tbl_training_activities
      const { error: errorA1 } = await supabase
        .from("A1.a_tbl_training_activities")
        .upsert(payload);

      console.log("errorA1", errorA1);
      if (errorA1) throw errorA1;

      // Upload file to Supabase Storage

      // Insert activity log
      const { error: activityError } = await supabase
        .from("tbl_activity_log")
        .insert({
          form_id: formId,
          action: "Submitted A1 A2 A3 Form",
          document_status: "Pending",
          done_at: new Date().toISOString(),
          done_by: user.id,
        });

      if (activityError) throw activityError;

      // Notify admins
      const { data: admins, error: adminError } = await supabase
        .from("tbl_users")
        .select("id")
        .eq("role", "Admin");
      if (adminError) throw adminError;

      const notifications = admins.map((admin) => ({
        created_at: new Date().toISOString(),
        status: "Pending",
        reason: "First Submission",
        notified_to: admin.id,
        notified_by: user.id,
        form_id: formId,
      }));

      const { error: notifError } = await supabase
        .from("tbl_notifications")
        .insert(notifications);
      if (notifError) throw notifError;

      alert("Form submitted successfully!");
    } catch (error) {
      console.error(error);
      const user = await supabase.auth.getUser();
      console.log(user);
      alert("Error submitting form!");
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    const sumRates = ["5_rate", "4_rate", "3_rate", "2_rate", "1_rate"]
      .map((key) => parseInt(formData[key] || 0, 10))
      .reduce((sum, val) => sum + (isNaN(val) ? 0 : val), 0);

    const sumTimeliness = [
      "5_timeliness",
      "4_timeliness",
      "3_timeliness",
      "2_timeliness",
      "1_timeliness",
    ]
      .map((key) => parseInt(formData[key] || 0, 10))
      .reduce((sum, val) => sum + (isNaN(val) ? 0 : val), 0);

    setFormData((prev) => ({
      ...prev,
      num_clients_rate: sumRates,
      num_clients_timeliness: sumTimeliness,
    }));
  }, [
    formData["5_rate"],
    formData["4_rate"],
    formData["3_rate"],
    formData["2_rate"],
    formData["1_rate"],
    formData["5_timeliness"],
    formData["4_timeliness"],
    formData["3_timeliness"],
    formData["2_timeliness"],
    formData["1_timeliness"],
  ]);

  useEffect(() => {
    if (formData.date_from && formData.date_to) {
      const start = new Date(formData.date_from);
      const end = new Date(formData.date_to);

      if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end >= start) {
        const timeDiff = end.getTime() - start.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1; // inclusive
        setFormData((prev) => ({
          ...prev,
          duration: `${daysDiff}`,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          duration: "",
        }));
      }
    }
  }, [formData.date_from, formData.date_to]);
  return (
    <div className="flex flex-col gap-5 p-10 bg-white rounded-lg shadow-md">
      <div className="breadcrumbs text-sm">
        <ul>
          <li>
            <a>Home</a>
          </li>
          <li>
            <a>Submit Documents</a>
          </li>
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
        <form>
          {data_items.map((item) => {
            const value = formData[item.key] || "";
            const renderField = () => {
              switch (item.type) {
                case "text":
                case "date":
                  return (
                    <fieldset className="fieldset" key={item.key}>
                      <legend className="fieldset-legend">{item.label}</legend>
                      <input
                        type={item.type}
                        className="input input-neutral border"
                        value={value}
                        onChange={(e) => handleChange(item.key, e.target.value)}
                        placeholder="Type here"
                      
                      />
                      
                    </fieldset>
                  );
                case "long text":
                  return (
                    <fieldset className="fieldset" key={item.key}>
                      <legend className="fieldset-legend">{item.label}</legend>
                      <textarea
                        className="textarea textarea-neutral border"
                        value={value}
                        onChange={(e) => handleChange(item.key, e.target.value)}
                        placeholder="Type here"
                      ></textarea>
                    </fieldset>
                  );
                case "upload":
                  return (
                    <fieldset className="fieldset" key={item.key}>
                      <legend className="fieldset-legend">{item.label}</legend>
                      <input
                        type="file"
                        className="file-input file-input-neutral"
                        onChange={(e) => {
                          const selectedFile = e.target.files?.[0] || null;
                          setFile(selectedFile);
                        }}
                        
                      />
                    </fieldset>
                  );
                default:
                  return null;
              }
            };
            return renderField();
          })}
        </form>
      </div>

      <div>
        <button
          className={`btn btn-primary ${loading ? "btn-disabled" : ""}`}
          onClick={submitForm}
          type="button"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
}
