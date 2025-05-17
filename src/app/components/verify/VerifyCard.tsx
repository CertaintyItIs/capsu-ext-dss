"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import A1A2A3Form from "./A1A2A3/Form";
import { create } from "domain";
import { redirect } from 'next/navigation'

export default function VerifyCard({
  form,
  status,
  date,
  time,
  submitted_by,
  form_id,
  campus_id,
}: {
  form: string;
  status: string;
  date: string;
  time: string;
  submitted_by: string;
  form_id: string;
  campus_id: string;
}) {
  const supabase = createClient();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState<"approve" | "reject" | "">("");
  const [currentForm, setCurrentForm] = useState<string | null>(null);


  async function getCurrentUserDetails() {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error("User not authenticated.");
    }

    const { data: userDetails, error: userDetailsError } = await supabase
      .from("tbl_users")
      .select("role, campus_id")
      .eq("id", user.id)
      .single();

    if (userDetailsError || !userDetails) {
      throw new Error("Unable to fetch user details.");
    }

    return {
      id: user.id,
      role: userDetails.role,
      campus_id: userDetails.campus_id,
    };
  }

  const handleConfirm = async () => {
    if (!approvalStatus) return;

    const status = approvalStatus === "approve" ? "Approved" : "Rejected";
    const documentStatus = status;

    const now = new Date().toISOString();

    const userDetails = await getCurrentUserDetails();
    const currentUser = userDetails.id;
    const campusId = userDetails.campus_id;

    // Insert into tbl_activity_log
    const {data: logData, error: logError} = await supabase.from("tbl_activity_log").insert({
      created_at: now,
      done_at: now,
      form_id: form_id,
      action: `${status} by Approver`,
      document_status: documentStatus,
      done_by: currentUser,
    });

    if (logError) {
      console.error("Error inserting into tbl_activity_log:", logError);
      return;
    }

    // Update tbl_forms
    const {data: tblFormData, error: tblFormDataError} = await supabase
      .from("tbl_forms")
      .update({
        status: status,
        document_status: documentStatus,
        latest_change: now,
      })
      .eq("id", form_id);

    if (tblFormDataError) {
      console.error("Error updating tbl_forms:", tblFormDataError);
      return;
    }

    // Insert into tbl_notifications

    const {data: notifications_data, error: notificationError} = await supabase.from("tbl_notifications").insert({
      form_id: form_id,
      status: status,
      notified_to: submitted_by,
      notified_by: currentUser,
      created_at: now,
    });

    if (notificationError) {
      console.error("Error inserting into tbl_notifications:", notificationError);
      return;
    }

    setShowModal(false);
    redirect("/verify");
  };

  const toggleModal = async () => {
    if (!showModal) {
      setLoading(true);
      let tableName = "";

      if (form === "A1 A2 A3") {

        const { data: data } = await supabase
          .from("A1.a_tbl_training_activities")
          .select("*")
          .eq("id", form_id);
        
        

      setFormData(data?.[0]);
      setShowModal(true);
      setLoading(false);
      return;
      } else {
        tableName = form.toLowerCase(); // fallback to form name
      }

      // const { data, error } = await supabase
      //   .from(tableName)
      //   .select("*")
      //   .eq("form_id", form_id)
      //   .single();

      // if (error) {
      //   console.error("Error fetching form data:", error);
      //   setFormData(null);
      // } else {
      //   setFormData(data);
      // }

      // setShowModal(true);
      // setLoading(false);
    } else {
      setShowModal(false);
    }
  };

  return (
    <>
      <div
        onClick={toggleModal}
        className={`flex flex-col w-1/6 m-3 p-2 rounded-lg shadow-lg border-2 cursor-pointer
                bg-white hover:bg-blue-200 border-gray-300
                transition duration-300 ease-in-out`}
      >
        <h1 className="text-2xl font-bold">{form}</h1>
        <span
          className={`self-start inline-block text-sm px-1 py-0.5 rounded ${
            status === "Pending"
              ? "bg-yellow-200"
              : status === "Rejected"
              ? "bg-red-200"
              : status === "Approved"
              ? "bg-green-200"
              : ""
          }`}
        >
          {status}
        </span>
        <p className="text-sm font-semibold">{date}</p>
        <p className="text-sm font-semibold">{time}</p>
        <p className="text-sm">{campus_id}</p>
        <p className="text-sm">{form_id}</p>
      </div>

      {/* DaisyUI Modal */}
      {showModal && (
        <dialog className="modal modal-open">
          <div className="modal-box max-w-2xl">
            
          <div className="sticky top-0 z-10 bg-white pb-2 mb-2 border-b border-gray-200">
      <h3 className="font-bold text-lg">Form {form} Details</h3>

      <div className="flex items-center gap-4 mt-2">
        <div className="flex items-center gap-2">
          
          <input
            type="radio"
            name="approval_status"
            value="approve"
            id="approve"
            className="radio radio-success border"
            onChange={() => setApprovalStatus("approve")}
          />

          <label htmlFor="approve" className="font-medium">Approve</label>

          <input
            type="radio"
            name="approval_status"
            value="reject"
            id="reject"
            className="radio radio-error ml-4 border"
            onChange={() => setApprovalStatus("reject")}
          />
          <label htmlFor="reject" className="font-medium">Reject</label>
        </div>

        <button onClick={handleConfirm} className="btn btn-primary ml-auto">
          Confirm
        </button>
      </div>
    </div>

            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="py-4">
                {form === "A1 A2 A3" ? (
                  <>
                      <A1A2A3Form form_id={form_id} />
                  </>
                ) : (
                  <pre className="bg-gray-100 p-2 rounded">
                    {JSON.stringify(formData, null, 2)}
                  </pre>
                )}
              </div>
            )}

            <div className="modal-action">
              <button className="btn" onClick={toggleModal}>
                Close
              </button>
            </div>
          </div>
        </dialog>
      )}
    </>
  );
}
