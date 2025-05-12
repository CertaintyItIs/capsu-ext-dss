'use client'
import { use, useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { type User } from '@supabase/supabase-js'

export default function AccountForm({ user }: { user: User | null }) {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)

  const [firstName, setFirstName] = useState<string | null>(null)
  const [lastName, setLastName] = useState<string | null>(null)
  const [middleName, setMiddleName] = useState<string | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [campus, setCampus] = useState<string | null>(null)
  const [role, setRole] = useState<string | null>(null)
  const [position, setPosition] = useState<string | null>(null)

  const getProfile = useCallback(async () => {
    try {
      setLoading(true)

      console.log(user?.id) 

      const { data, error, status } = await supabase
        .from('tbl_users')
        .select(`username, first_name, last_name, middle_name, avatar_url, campus_id, role, position`)
        .eq('id', user?.id)
        .single()

        console.log({ data, error })

      if (error && status !== 406) throw error

     

      if (data) {
        setFirstName(data.first_name)
        setLastName(data.last_name)
        setMiddleName(data.middle_name)
        setAvatarUrl(data.avatar_url)
        setCampus(data.campus_id)
        setRole(data.role)
        setPosition(data.position)
      }
    } catch (error) {
      alert('Error loading user data!')
    } finally {
      setLoading(false)
    }
  }, [user, supabase])

  useEffect(() => {
    getProfile()
  }, [user, getProfile])

  async function updateProfile() {
    try {
      setLoading(true)

      const { error } = await supabase.from('tbl_users').upsert({
        id: user?.id as string,
        first_name: firstName,
        last_name: lastName,
        middle_name: middleName,
        avatar_url: avatarUrl,
        campus_id: campus,
        role: role,
        position: position,
        updated_at: new Date().toISOString(),
      })

      if (error) throw error
      alert('Profile updated!')
    } catch (error) {
      console.log(error)
      alert('Error updating the data!' + error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-widget space-y-4 flex-col">
      <div className="form-control">
        <label className="label" htmlFor="email">
          <span className="label-text">Email</span>
        </label>
        <input
          id="email"
          type="text"
          className="input input-bordered"
          value={user?.email || ''}
          disabled
        />
      </div>

      {[
        { id: 'firstName', label: 'First Name', value: firstName, setter: setFirstName },
        { id: 'middleName', label: 'Middle Name', value: middleName, setter: setMiddleName },
        { id: 'lastName', label: 'Last Name', value: lastName, setter: setLastName },
        { id: 'campus', label: 'Campus', value: campus, setter: setCampus },
        { id: 'role', label: 'Role', value: role, setter: setRole },
        { id: 'position', label: 'Position', value: position, setter: setPosition },
        { id: 'avatarUrl', label: 'Avatar URL', value: avatarUrl, setter: setAvatarUrl },
      ].map(({ id, label, value, setter }) => (
        <div className="form-control" key={id}>
          <label className="label" htmlFor={id}>
            <span className="label-text">{label}</span>
          </label>
          <input
            id={id}
            type="text"
            className="input input-bordered"
            value={value || ''}
            onChange={(e) => setter(e.target.value)}
          />
        </div>
      ))}

      <div className="form-control">
        <button
          className="btn btn-primary w-full"
          onClick={updateProfile}
          disabled={loading}
        >
          {loading ? 'Loading ...' : 'Update'}
        </button>
      </div>

      <div className="form-control">
        <form action="/auth/signout" method="post">
          <button className="btn w-full" type="submit">
            Sign out
          </button>
        </form>
      </div>
    </div>
  )
}
