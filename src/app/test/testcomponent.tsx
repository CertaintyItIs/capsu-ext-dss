'use client'

import { use, useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { type User } from "@supabase/supabase-js";

export default function TestComponent({ user }: { user: string}) {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);

  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const [middleName, setMiddleName] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [campus, setCampus] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [position, setPosition] = useState<string | null>(null);

  const getProfile = useCallback(async () => {
    try {
      setLoading(true);

      console.log(user);

      const { data, error, status } = await supabase
        .from("tbl_users")
        .select(
          `username, first_name, last_name, middle_name, avatar_url, campus, role, position`
        )
        .eq("id", user?.id)
        .single();

      console.log("data", data);

      if (error && status !== 406) throw error;

      if (data) {
        setFirstName(data.first_name);
        setLastName(data.last_name);
        setMiddleName(data.middle_name);
        setAvatarUrl(data.avatar_url);
        setCampus(data.campus);
        setRole(data.role);
        setPosition(data.position);
      }
    } catch (error) {
      alert("Error loading user data!");
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    getProfile();
  }, [user, getProfile]);

  return (
    <div className="flex-col static">
      {[
        {
          id: "firstName",
          label: "First Name",
          value: firstName,
          setter: setFirstName,
        },
        {
          id: "middleName",
          label: "Middle Name",
          value: middleName,
          setter: setMiddleName,
        },
        {
          id: "lastName",
          label: "Last Name",
          value: lastName,
          setter: setLastName,
        },
        { id: "campus", label: "Campus", value: campus, setter: setCampus },
        { id: "role", label: "Role", value: role, setter: setRole },
        {
          id: "position",
          label: "Position",
          value: position,
          setter: setPosition,
        },
        {
          id: "avatarUrl",
          label: "Avatar URL",
          value: avatarUrl,
          setter: setAvatarUrl,
        },
      ].map(({ id, label, value, setter }) => (
        <div className="form-control" key={id}>
          <label className="label" htmlFor={id}>
            <span className="label-text">{label}</span>
          </label>
          <input
            id={id}
            type="text"
            className="input input-bordered"
            value={value || ""}
            onChange={(e) => setter(e.target.value)}
          />
        </div>
      ))}
    </div>
  );
}
