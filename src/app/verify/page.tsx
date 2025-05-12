"use client";

import VerifyCard from "../components/verify/VerifyCard";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export default function Test() {
  const router = useRouter();
  const supabase = createClient();

  interface Form {
    status: string;
    form: any;
    created_at: string;
    user_id: string;
    reason?: string;
    form_id: string;
    campus_id: string;
  }

  const [pendingForms, setPendingForms] = useState<Form[]>([]);
  const [rejectedForms, setRejectedForms] = useState<Form[]>([]);
  const [approvedForms, setApprovedForms] = useState<Form[]>([]);
  const [campusMap, setCampusMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

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

  async function getCampusMap() {
    const { data: campuses, error } = await supabase
      .from("tbl_campus")
      .select("id, campus");
  
    if (error) {
      console.error("Error fetching campus list:", error);
      return {};
    }
  
    const map: Record<string, string> = {};
    campuses.forEach((c) => {
      map[c.id] = c.campus; // ✅ corrected from c.name to c.campus
    });
  
    return map;
  }
  

  async function getForms(): Promise<Form[]> {
    const currentUser = await getCurrentUserDetails();

    let query = supabase.from("tbl_forms").select("*");

    if (currentUser.role === "Staff") {
      query = query.eq("campus_id", currentUser.campus_id);
    }


    const { data: notifications, error: notificationsError } = await query;

    if (notificationsError) {
      console.error("Error fetching forms:", notificationsError);
      return [];
    }

    return notifications;
  }

  useEffect(() => {
    const fetchEverything = async () => {
      setLoading(true);
      try {
        const [campusMapResult, forms] = await Promise.all([
          getCampusMap(),
          getForms(),
        ]);

        setCampusMap(campusMapResult);

        const mapCampusName = (form: Form) => ({
          ...form,
          campus_name: campusMapResult[form.campus_id] || "Unknown Campus",
        });

        const enrichedForms = forms.map(mapCampusName);

        setPendingForms(enrichedForms.filter((f) => f.status === "Pending"));
        setRejectedForms(enrichedForms.filter((f) => f.status === "Rejected"));
        setApprovedForms(enrichedForms.filter((f) => f.status === "Approved"));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchEverything();
  }, []);

  const renderSection = (title: string, forms: any[]) => (
    <>
      <div className="mb-4">
        <h1 className="text-1xl font-bold">{title}</h1>
      </div>
      <div className="flex flex-wrap gap-4">
        {forms.map((item, index) => (
          <VerifyCard
            key={index}
            form={item.form}
            status={item.status}
            date={new Date(item.created_at).toLocaleDateString()}
            time={new Date(item.created_at).toLocaleTimeString()}
            submitted_by={item.campus_name} // ✅ Campus name instead of campus_id
            form_id={item.id}
          />
        ))}
        {forms.length === 0 && (
          <p className="text-sm text-gray-500">No {title.toLowerCase()} forms.</p>
        )}
      </div>
    </>
  );

  return (
    <div className="flex flex-col p-4">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Verify Forms</h1>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {renderSection("Pending for verification", pendingForms)}
          {renderSection("Rejected", rejectedForms)}
          {renderSection("Approved", approvedForms)}
        </>
      )}

      <div className="mt-6" />
    </div>
  );
}
