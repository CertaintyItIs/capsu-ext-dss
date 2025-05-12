"use client";

import { useCallback, useEffect, useState, ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'
import { type User } from '@supabase/supabase-js'

async function getNotifications({ user }: { user: User | null }) {
  if (!user) return [];

  const supabase = createClient();

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
  };

  // Step 1: Fetch notifications with form data
  const { data, error, status } = await supabase
    .from('tbl_notifications')
    .select(`
      id,
      status,
      reason,
      form_id,
      notified_to,
      notified_by,
      created_at,
      tbl_forms (
        id,
        form
      )
    `)
    .eq('notified_to', user.id)
    .order('created_at', { ascending: false })
    .range(0, 4) as unknown as { data: Notification[]; error: any; status: number };

  if (error && status !== 406) throw error;

  // Step 2: Reshape data to match mappedNotifications needs
  const notifications = (data || []).map((n) => ({
    id: n.id,
    status: n.status,
    reason: n.reason,
    notified_by: n.notified_by,
    form: n.tbl_forms?.form || 'Unknown Form',
    created_at: n.created_at,
  }));

  console.log("notifications", notifications)
  

  return notifications;
}


async function getCampus({ user_id }: { user_id: string | null }): Promise<string | null> {
    
    if (!user_id) return null

    const supabase = createClient()
    
    const { data: userData, error: userError, status: userStatusError } = await supabase
        .from('tbl_users')
        .select('campus_id')
        .eq('id', user_id )
        .single()

    if (userError && userStatusError !== 406) throw userError

    const { data: campusData, error: campusError, status: campusStatusError } = await supabase
        .from('tbl_campus')
        .select('campus')
        .eq('id', userData?.campus_id)
        .single()

    if (campusError && campusStatusError !== 406) throw campusError

    return campusData?.campus || null
}


export default function NotificationButton({ user }: { user: User | null }) {
    const supabase = createClient()
    const [loading, setLoading] = useState(true)

    const [notifications, setNotifications] = useState<{
      created_at: ReactNode; id: string, message: string 
}[]>([]) 

    const fetchNotifications = useCallback(async () => {
        try {
          setLoading(true)
        
          const notifications_data = await getNotifications({ user }) // Step 1: Get notifications
            
          if (notifications_data) {
            // Step 2: Map notifications and resolve campus names
            const mappedNotifications = await Promise.all(
              notifications_data.map(async (item) => {
                const campus = await getCampus({ user_id: item.notified_by }) // Step 2a: Translate campus_id
      
                let message = '' // Step 3: Format message based on status
                
                let created_at = new Date(item.created_at).toLocaleString('en-US', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                })
      
      
                if (item.status === 'Approved') {
                  message = `Your submission for ${item.form} Form has been approved.`
                } else if (item.status === 'Rejected') {
                  message = `Your submission for ${item.form} Form has been rejected due to ${item.reason}.`
                } else if (item.status === 'Pending') {
                  message = `${item.form} Form from ${campus ?? 'Unknown Campus'} is pending for verification.`
                }
      
                return { id: item.id.toString(), message , created_at} // Step 4: Return mapped object
              })
            )
            console.log("mapped notifications", mappedNotifications)
            setNotifications(mappedNotifications) // Step 5: Save to state
          }
        } catch (error) {
          alert('Error loading notifications!')
        } finally {
          setLoading(false)
        }
      }, [supabase])
      
    useEffect(() => {
        fetchNotifications()
    }, [fetchNotifications])

    return (
        <div className="fixed top-4 right-4 z-50">
            <div className="dropdown dropdown-bottom dropdown-end">
                <div tabIndex={0} role="button" className="btn w-8 h-8 items-center justify-center rounded-full p-0">
                    <img src="/notifications-read.png" alt="Notification" className=" w-6 h-6" />
                </div>
                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-10 w-52 p-2 shadow-sm">
                    {loading ? (
                        <li><a>Loading...</a></li>
                    ) : notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <li className="p-1 "key={notification.id}>
                              <a>
                              <div>
                              <p className="text-">{notification.message}</p>
                              <p className="italic">Time: {notification.created_at}</p>
                              </div>
                             </a>
                            </li>
                        ))
                    ) : (
                        <li><a>No notifications available</a></li>
                    )}
                    <li><a>See more notifications</a></li>
                </ul>
            </div>
        </div>
    )
}
