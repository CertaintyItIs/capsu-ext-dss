"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Fira_Sans } from "next/font/google";

const supabase = createClient();

async function getCurrentUserDetails() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) return null;

  const { data: userDetails, error: userDetailsError } = await supabase
    .from("tbl_users")
    .select("role, campus_id, username, first_name")
    .eq("id", user.id)
    .single();

  if (userDetailsError || !userDetails) return null;

  return {
    id: user.id,
    role: userDetails.role,
    campus_id: userDetails.campus_id,
    username: userDetails.username,
    first_name: userDetails.first_name,
  };
}

type UserDetails = {
  id: string;
  role: any;
  campus_id: any;
  username: any;
  first_name: any;
};

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<UserDetails | null>(null);

  const nav_items = user
    ? [
        { name: "back", icon: "/back.png" },
        { name: "menu", icon: "/menu.png" },
        { name: "Dashboard", icon: "/dashboard.png", link: "/" },
        {
          name: "Submit documents",
          icon: "/submit_documents.png",
          link: "/submit",
        },
        {
          name: "Generate reports",
          icon: "/generate_reports.png",
          link: "/generate",
        },
        { name: "View records", icon: "/records.png", link: "/view" },
        { name: "Verify documents", icon: "/verify.png", link: "/verify" },
      ]
    : [{ name: "Login", icon: "/menu.png", link: "/login" }];

  useEffect(() => {
    (async () => {
      const details = await getCurrentUserDetails();
      setUser(details);
    })();
  }, []);

  return (
    <aside className="fixed inset-y-0 left-0 z-10 flex flex-col border-r-2 border-r-black bg-background w-auto min-w-[64px]">
      {/* Header */}
      <div className="px-4 py-2 flex items-center bg-blue-500 text-white">
        <a className="flex items-center" href="/">
          <img src="/capsulogo.png" alt="Logo" className="w-10 mr-2" />
          {isOpen && (
            <div>
              <h1 className="font-bold text-sm">Capiz State University</h1>
              <h1 className="text-sm">RDE - CESO</h1>
            </div>
          )}
        </a>
      </div>

      {/* User Info */}
      {user && isOpen && (
        <div className="px-6 py-2 w-full flex flex-col gap-1 bg-blue-400">
          <a
            href="/account"
            className="font-semibold truncate text-white hover:text-blue-200"
          >
            {`Hello, ${user.first_name}!`}
          </a>
          <p className="text-xs text-white opacity-80">{user.role}</p>
          <form action="/auth/signout" method="POST">
            <button
              type="submit" 
              className="text-xs bg-white rounded-sm px-0.5 py-1 text-red-800 opacity-80 hover:bg-red-200 mt-1"
            >
              Sign out
            </button>
          </form>
        </div>
      )}

      {/* Navigation Items */}
      <ul className="px-4 py-2 bg-white text-gray-800 flex-1 overflow-y-auto">
        <li>
          {nav_items.map((item) =>
            isOpen ? (
              item.name === "back" ? (
                <div
                  key={item.name}
                  onClick={() => setIsOpen(false)}
                  className="cursor-pointer flex p-2 items-center hover:bg-gray-200 rounded-md"
                >
                  <img
                    src={item.icon}
                    alt={item.name}
                    className="w-6 h-6 mr-2"
                  />
                </div>
              ) : item.name !== "menu" ? (
                <div
                  className="flex items-center p-2 hover:bg-gray-200 rounded-md"
                  key={item.name}
                >
                  <a href={item.link} className="flex items-center gap-2">
                    <img src={item.icon} alt={item.name} className="w-6 h-6" />
                    <p className="font-medium">{item.name}</p>
                  </a>
                </div>
              ) : null
            ) : item.name === "menu" ? (
              <div
                key={item.name}
                onClick={() => setIsOpen(true)}
                className="cursor-pointer flex p-2 items-center hover:bg-gray-200 rounded-md"
              >
                <img src={item.icon} alt={item.name} className="w-6 h-6" />
              </div>
            ) : item.name !== "back" ? (
              <div
                key={item.name}
                className="flex p-2 hover:bg-gray-200 rounded-md"
              >
                <a href={item.link}>
                  <img src={item.icon} alt={item.name} className="w-6 h-6" />
                </a>
              </div>
            ) : null
          )}
        </li>
      </ul>
    </aside>
  );
}
