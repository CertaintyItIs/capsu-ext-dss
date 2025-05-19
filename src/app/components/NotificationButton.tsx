"use client";

import { useCallback, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { type User } from "@supabase/supabase-js";

type Form = { id: number; form: string };
type Notification = {
  id: number;
  status: string;
  reason: string | null;
  form_id: number;
  notified_to: string;
  notified_by: string;
  tbl_forms?: Form;
  created_at: string;
};

async function fetchLatestNotifications(userId: string | null) {
  if (!userId) return [];

  const supabase = createClient();
  const { data, error } = await supabase
    .from("tbl_notifications")
    .select(
      `id, status, reason, form_id, notified_to, notified_by, created_at, tbl_forms(id, form)`
    )
    .eq("notified_to", userId)
    .order("created_at", { ascending: false })
    .range(0, 4);

  if (error) throw error;
  return data as Notification[];
}

async function fetchUnreadCount(userId: string | null): Promise<number> {
  if (!userId) return 0;
  const supabase = createClient();
  const { count, error } = await supabase
    .from("tbl_notifications")
    .select("*", { count: "exact", head: true })
    .eq("notified_to", userId)
    .eq("read_by_user", "unread");

  if (error) throw error;
  return count || 0;
}

async function fetchCampus(userId: string | null): Promise<string | null> {
  if (!userId) return null;
  const supabase = createClient();
  const { data: userData } = await supabase
    .from("tbl_users")
    .select("campus_id")
    .eq("id", userId)
    .single();

  const { data: campusData } = await supabase
    .from("tbl_campus")
    .select("campus")
    .eq("id", userData?.campus_id)
    .single();

  return campusData?.campus || null;
}

export default function NotificationButton({ user }: { user: User | null }) {
  const router = useRouter();
  const [notifications, setNotifications] = useState<
    { id: string; message: string; created_at: ReactNode; status: string }[]
  >([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [notifs, count] = await Promise.all([
        fetchLatestNotifications(user?.id ?? null),
        fetchUnreadCount(user?.id ?? null),
      ]);

      const mapped = await Promise.all(
        notifs.map(async (n) => {
          const campus = await fetchCampus(n.notified_by);
          const created_at = new Date(n.created_at).toLocaleString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });

          let message = "";
          if (n.status === "Approved") {
            message = `Your submission for ${n.tbl_forms?.form || "Unknown Form"} has been approved.`;
          } else if (n.status === "Rejected") {
            message = `Your submission for ${n.tbl_forms?.form || "Unknown Form"} was rejected due to ${n.reason}.`;
          } else {
            message = `${n.tbl_forms?.form || "Unknown Form"} from ${
              campus || "Unknown Campus"
            } is pending for verification.`;
          }

          return { id: n.id.toString(), message, created_at, status: n.status };
        })
      );

      setNotifications(mapped);
      setUnreadCount(count);
    } catch (error) {
      alert("Failed to fetch notifications.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="dropdown dropdown-bottom dropdown-end">
        <div
          tabIndex={0}
          role="button"
          className="relative btn w-10 h-10 items-center justify-center rounded-full p-0 bg-base-200"
        >
          <img src="/notifications-read.png" alt="Notification" className="w-6 h-6" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 rounded-full bg-red-500 text-white text-[10px]">
              {unreadCount}
            </span>
          )}
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content menu bg-base-100 rounded-box shadow-md w-80 overflow-y-auto overflow-x-hidden z-10 p-2"
        >
          {loading ? (
            <li>
              <span>Loading...</span>
            </li>
          ) : notifications.length > 0 ? (
            <>
              {notifications.map((n) => (
                <li key={n.id} className="py-1">
                  <a
                    className="hover:bg-base-200 p-2 rounded-md transition"
                    onClick={() => router.push("/verify")}
                  >
                    <p className="text-sm font-medium break-words">{n.message}</p>
                    <p className="text-xs italic text-gray-500">Time: {n.created_at}</p>
                  </a>
                </li>
              ))}
              <li className="mt-2">
                <a
                  onClick={() => router.push("/notifications")}
                  className="block text-center text-sm text-blue-600 hover:underline"
                >
                  See more notifications
                </a>
              </li>
            </>
          ) : (
            <li>
              <span>No notifications available</span>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
