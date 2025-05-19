'use client';

import { useEffect, useState } from 'react';
import { createClient } from "@/lib/supabase/client";


const supabase = createClient();

type TrainingActivity = {
    id: number;
    created_at: string;
    quarter_id: number;
    campus_id: number;
    training: string;
    venue: string;
    date_from: string;
    date_to: string;
    duration: number;
    num_persons_trained: number;
    weight_persons_trained: number;
    num_trainees_surveyed: number;
    num_clients_rate: number;
    num_clients_timeliness: number;
    remarks: string | null;
    support_file_path: string | null;
    submitted_by: string;
    "5_rate": number;
    "4_rate": number;
    "3_rate": number;
    "2_rate": number;
    "1_rate": number;
    "5_timeliness": number;
    "4_timeliness": number;
    "3_timeliness": number;
    "2_timeliness": number;
    "1_timeliness": number;
    form_id: number;
};

type Form = {
    id: number;
    campus_id: number;
    submitted_by: string;
    status: string;
};

type Campus = {
    id: number;
    campus: string;
};

const FORM_OPTIONS = [
    { label: 'A1 A2 A3', value: 'A1 A2 A3' },
    { label: 'A2', value: 'A2' },
    { label: 'A3', value: 'A3' },
];

async function getCurrentUserDetails() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) return null;

  const { data: userDetails, error: userDetailsError } = await supabase
    .from("tbl_users")
    .select("role, campus_id, username")
    .eq("id", user.id)
    .single();

  if (userDetailsError || !userDetails) return null;

  return {
    id: user.id,
    role: userDetails.role,
    campus_id: userDetails.campus_id,
    username: userDetails.username,
  };
}

export default function Page() {
    const [fileURL, setFileURL] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [userCampusId, setUserCampusId] = useState<number | null>(null);
    const [selectedForm, setSelectedForm] = useState('A1');
    const [activities, setActivities] = useState<TrainingActivity[]>([]);
    const [loading, setLoading] = useState(false);

    // For Admin
    const [campuses, setCampuses] = useState<Campus[]>([]);
    const [selectedCampusId, setSelectedCampusId] = useState<number | null>(null);

    // Fetch user session, role, and campus_id
    useEffect(() => {
        const getUser = async () => {
            const currentUser = await getCurrentUserDetails();
            
            if (currentUser) {
                setUserId(currentUser.id);
                setRole(currentUser.role || null);
                setUserCampusId(currentUser.campus_id ?? null);
            }
        };
        getUser();
    }, []);

    // Fetch campuses for Admin
    useEffect(() => {
        if (role === 'Admin') {
            supabase
                .from('tbl_campus')
                .select('id, campus')
                .then(({ data }) => {
                    setCampuses(data || []);
                    if (data && data.length > 0) setSelectedCampusId(data[0].id);
                });
        }
    }, [role]);

    // Fetch activities for Staff or Admin
    useEffect(() => {
        const fetchActivities = async () => {
            setLoading(true);

            // Get forms based on role
            let formsQuery = supabase.from('tbl_forms').select('id, campus_id, submitted_by, status');

            if (role === 'Staff' && userCampusId) {
                formsQuery = formsQuery
                    .eq('campus_id', userCampusId)
                    .eq('status', 'Approved');
            } else if (role === 'Admin' && selectedCampusId) {
                formsQuery = formsQuery
                    .eq('campus_id', selectedCampusId)
                    .eq('status', 'Approved');
            } else {
                setActivities([]);
                setLoading(false);
                return;
            }

            const { data: forms, error: formsError } = await formsQuery;

            if (formsError || !forms) {
                setActivities([]);
                setLoading(false);
                return;
            }

            const formIds = forms.map((f: Form) => f.id);
            if (formIds.length === 0) {
                setActivities([]);
                setLoading(false);
                return;
            }

            // Fetch activities with id in formIds
            const { data: activitiesData, error: activitiesError } = await supabase
                .from('A1.a_tbl_training_activities')
                .select('*')
                .in('form_id', formIds);

            if (activitiesError || !activitiesData) {
                setActivities([]);
            } else {
                setActivities(activitiesData as TrainingActivity[]);
            }
            setLoading(false);
        };

        if ((role === 'Staff' && userCampusId) || (role === 'Admin' && selectedCampusId)) {
            fetchActivities();
        }
    }, [role, userCampusId, selectedCampusId, selectedForm]);

    const getPublicURL = async (path: string) => {
    const { data } = supabase.storage.from("a1-training-activities").getPublicUrl(path);
    return data.publicUrl;
  };
    return (
        <div className="p-6">
            <div className="mb-4">
                <label htmlFor="form-select" className="mr-2 font-semibold">Select Form:</label>
                <select
                    id="form-select"
                    value={selectedForm}
                    onChange={e => setSelectedForm(e.target.value)}
                    className="border px-2 py-1 rounded"
                >
                    {FORM_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            </div>

            {role === 'Admin' && (
                <div className="mb-4">
                    <label htmlFor="campus-select" className="mr-2 font-semibold">Select Campus:</label>
                    <select
                        id="campus-select"
                        value={selectedCampusId ?? ''}
                        onChange={e => setSelectedCampusId(Number(e.target.value))}
                        className="border px-2 py-1 rounded"
                    >
                        {campuses.map(campus => (
                            <option key={campus.id} value={campus.id}>{campus.campus}</option>
                        ))}
                    </select>
                </div>
            )}

            {(role === 'Staff' || role === 'Admin') && (
                <div>
                    <h2 className="text-lg font-bold mb-2">
                        {role === 'Staff' ? 'My Campus Accepted Training Activities' : 'Accepted Training Activities for Selected Campus'}
                    </h2>
                    {loading ? (
                        <div>Loading...</div>
                    ) : (
                        <table className="min-w-full border">
                            <thead>
                                <tr>
                                    <th className="border px-2 py-1">Form_ID</th>
                                    <th className="border px-2 py-1">Created At</th>
                                    <th className="border px-2 py-1">Training</th>
                                    <th className="border px-2 py-1">Venue</th>
                                    <th className="border px-2 py-1">Date From</th>
                                    <th className="border px-2 py-1">Date To</th>
                                    <th className="border px-2 py-1">Duration</th>
                                    <th className="border px-2 py-1"># Persons Trained</th>
                                    <th className="border px-2 py-1">Weight Persons Trained</th>
                                    <th className="border px-2 py-1"># Trainees Surveyed</th>
                                    <th className="border px-2 py-1"># Clients Rate</th>
                                    <th className="border px-2 py-1"># Clients Timeliness</th>
                                    <th className="border px-2 py-1">Remarks</th>
                                    <th className="border px-2 py-1">Submitted By</th>
                                    <th className="border px-2 py-1">5 Rate</th>
                                    <th className="border px-2 py-1">4 Rate</th>
                                    <th className="border px-2 py-1">3 Rate</th>
                                    <th className="border px-2 py-1">2 Rate</th>
                                    <th className="border px-2 py-1">1 Rate</th>
                                    <th className="border px-2 py-1">5 Timeliness</th>
                                    <th className="border px-2 py-1">4 Timeliness</th>
                                    <th className="border px-2 py-1">3 Timeliness</th>
                                    <th className="border px-2 py-1">2 Timeliness</th>
                                    <th className="border px-2 py-1">1 Timeliness</th>
                                    <th className="border px-2 py-1">Supporting Document</th>
                                    {/* Add more columns as needed */}
                                </tr>
                            </thead>
                            <tbody>
                                {activities.length === 0 ? (
                                    <tr>
                                        <td className="border px-2 py-1 text-center" colSpan={4}>No records found.</td>
                                    </tr>
                                ) : (
                                    activities.map(activity => (
                                        <tr key={activity.id}>
                                            <td className="border px-2 py-1">{activity.form_id}</td>
                                            <td className="border px-2 py-1">
                                                {new Date(activity.created_at).toLocaleString('en-US', {
                                                    hour: 'numeric',
                                                    minute: '2-digit',
                                                    hour12: true,
                                                    month: 'long',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </td>
                                            <td className="border px-2 py-1">{activity.training}</td>
                                            <td className="border px-2 py-1">{activity.venue}</td>
                                            <td className="border px-2 py-1">
                                                {activity.date_from
                                                    ? new Date(activity.date_from).toLocaleDateString('en-US', {
                                                        month: 'long',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })
                                                    : ''}
                                            </td>
                                            <td className="border px-2 py-1">
                                                {activity.date_to
                                                    ? new Date(activity.date_to).toLocaleDateString('en-US', {
                                                        month: 'long',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })
                                                    : ''}
                                            </td>
                                            <td className="border px-2 py-1">{activity.duration}</td>
                                            <td className="border px-2 py-1">{activity.num_persons_trained}</td>
                                            <td className="border px-2 py-1">{activity.weight_persons_trained}</td>
                                            <td className="border px-2 py-1">{activity.num_trainees_surveyed}</td>
                                            <td className="border px-2 py-1">{activity.num_clients_rate}</td>
                                            <td className="border px-2 py-1">{activity.num_clients_timeliness}</td>
                                            <td className="border px-2 py-1">{activity.remarks}</td>
                                            <td className="border px-2 py-1">{activity.submitted_by}</td>
                                            <td className="border px-2 py-1">{activity["5_rate"]}</td>
                                            <td className="border px-2 py-1">{activity["4_rate"]}</td>
                                            <td className="border px-2 py-1">{activity["3_rate"]}</td>
                                            <td className="border px-2 py-1">{activity["2_rate"]}</td>
                                            <td className="border px-2 py-1">{activity["1_rate"]}</td>
                                            <td className="border px-2 py-1">{activity["5_timeliness"]}</td>
                                            <td className="border px-2 py-1">{activity["4_timeliness"]}</td>
                                            <td className="border px-2 py-1">{activity["3_timeliness"]}</td>
                                            <td className="border px-2 py-1">{activity["2_timeliness"]}</td>
                                            <td className="border px-2 py-1">{activity["1_timeliness"]}</td>
                                            <td className="border px-2 py-1">
                                                {activity.support_file_path ? (
                                                  <>
                                                    <a
                                                    href={fileURL || "#"}
                                                    download
                                                    target="_blank"
                                                    className="btn btn-sm btn-outline text-xs"
                                                    onClick={async () => {
                                                        if (!fileURL && activity.support_file_path) {
                                                        const url = await getPublicURL(activity.support_file_path);
                                                        setFileURL(url);
                                                        }
                                                    }}
                                                    >
                                                    View Document
                                                     </a>
                                                </>
                                                ) : (
                                                    <span className="text-gray-400">No file</span>
                                                )}
                                            </td>
                                            {/* Add more columns as needed */}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
}