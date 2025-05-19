"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import Link from "next/link";

type Form = {
  id: number;
  form: string;
};

type Notification = {
  id: number;
  status: string;
  reason: string | null;
  form_id: number;
  notified_to: string;
  notified_by: string;
  tbl_forms?: Form; // not an array
  created_at: string;
  read_by_user: string;
};

type MappedNotification = {
  id: string;
  message: string;
  created_at: string;
  read_by_user: string;
};

async function getNotifications({ user }: { user: User | null }) {
  const supabase = createClient();
  if (!user) return [];
  const { data, error } = await supabase
    .from("tbl_notifications")
    .select(
      `
      id,
      status,
      reason,
      form_id,
      notified_to,
      notified_by,
      created_at,
      read_by_user,
      tbl_forms (
        id,
        form
      )
    `
    )
    .eq("notified_to", user.id)
    .order("created_at", { ascending: false });
  if (error) throw error;

  // Step 2: Reshape data to match mappedNotifications needs
  const notifications = (data || []).map((n) => ({
    id: n.id,
    status: n.status,
    reason: n.reason,
    notified_by: n.notified_by,
    form: Array.isArray(n.tbl_forms)
      ? n.tbl_forms[0]?.form || "Unknown Form"
      : n.tbl_forms?.form || "Unknown Form",
    created_at: n.created_at,
    form_id: n.form_id,
    notified_to: n.notified_to,
    read_by_user: n.read_by_user,
  }));

  console.log("notifications", notifications);

  return notifications;
}

export async function Account() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

async function getCampus({
  user_id,
}: {
  user_id: string | null;
}): Promise<string | null> {
  if (!user_id) return null;

  const supabase = createClient();

  const {
    data: userData,
    error: userError,
    status: userStatusError,
  } = await supabase
    .from("tbl_users")
    .select("campus_id")
    .eq("id", user_id)
    .single();

  if (userError && userStatusError !== 406) throw userError;

  const {
    data: campusData,
    error: campusError,
    status: campusStatusError,
  } = await supabase
    .from("tbl_campus")
    .select("campus")
    .eq("id", userData?.campus_id)
    .single();

  if (campusError && campusStatusError !== 406) throw campusError;

  return campusData?.campus || null;
}

// Dummy getFormName function, replace with your actual logic
async function getFormName({ form_id }: { form_id: string }) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("tbl_forms")
    .select("form")
    .eq("id", form_id)
    .single();

  return data?.form || "Unknown Form";
}

export default function NotificationsPage({ user }: { user: User | null }) {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<MappedNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const userCurrentValue = await Account();
      const notifications_data = await getNotifications({
        user: userCurrentValue,
      });
      if (notifications_data) {
        const mappedNotifications = await Promise.all(
          notifications_data.map(async (item) => {
            const campus = await getCampus({ user_id: item.notified_by });
            const form = await getFormName({ form_id: item.form_id });
            let message = "";
            let created_at = new Date(item.created_at).toLocaleString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            });

            if (item.status === "Approved") {
              message = `Your submission for ${form} Form has been approved.`;
            } else if (item.status === "Rejected") {
              message = `Your submission for ${form} Form has been rejected due to ${item.reason}.`;
            } else if (item.status === "Pending") {
              message = `${form} Form from ${
                campus ?? "Unknown Campus"
              } is pending for verification.`;
            }

            return {
              id: item.id.toString(),
              message,
              created_at,
              read_by_user: item.read_by_user,
            };
          })
        );
        setNotifications(mappedNotifications);
        setUnreadCount(
          notifications_data.filter((n) => n.read_by_user === "unread").length
        );
      }
    } catch (error) {
      alert("Error loading notifications!");
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Mark all unread notifications as read when unmounting
  useEffect(() => {
    fetchNotifications();

    return () => {
      // On exit, mark all unread as read
      const markAsRead = async () => {
        const currentUser = await Account();
        if (!currentUser) return;
        await supabase
          .from("tbl_notifications")
          .update({ read_by_user: "read" })
          .eq("notified_to", currentUser.id)
          .eq("read_by_user", "unread");
      };
      markAsRead();
    };
  }, [fetchNotifications]);

  return (
    <div className="flex flex-col p-4 max-w-xl mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <span className="badge badge-primary">{unreadCount} unread</span>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : notifications.length === 0 ? (
        <div>No notifications available</div>
      ) : (
        <ul className="space-y-2">
          {notifications.map((notification) => (
            <li key={notification.id}>
              <Link
                href="/verify"
                className={`block p-3 rounded border cursor-pointer transition ${
                  notification.read_by_user === "unread"
                    ? "bg-blue-50 border-blue-300 font-semibold hover:bg-blue-100"
                    : "bg-white border-gray-200 hover:bg-gray-100"
                }`}
              >
                <div className="text-base">{notification.message}</div>
                <div className="text-xs italic text-gray-500">
                  Time: {notification.created_at}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
