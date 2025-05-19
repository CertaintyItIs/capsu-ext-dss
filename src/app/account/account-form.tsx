'use client'
import { useCallback, useEffect, useState } from 'react'
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
      const { data, error, status } = await supabase
        .from('tbl_users')
        .select('first_name, last_name, middle_name, avatar_url, campus_id, role, position')
        .eq('id', user?.id)
        .single()

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
      alert('Error updating the data! ' + error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-base-100 shadow-lg rounded-box space-y-6">
      <h2 className="text-3xl font-bold">Account Details</h2>

      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Email</span>
        </label>
        <input
          type="text"
          className="input input-bordered w-full"
          value={user?.email || ''}
          disabled
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">First Name</span>
          </label>
          <input
            type="text"
            className="input input-bordered"
            value={firstName || ''}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="e.g. Juan"
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Middle Name</span>
          </label>
          <input
            type="text"
            className="input input-bordered"
            value={middleName || ''}
            onChange={(e) => setMiddleName(e.target.value)}
            placeholder="e.g. Santos"
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Last Name</span>
          </label>
          <input
            type="text"
            className="input input-bordered"
            value={lastName || ''}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="e.g. Dela Cruz"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Campus</span>
          </label>
          <input
            type="text"
            className="input input-bordered"
            value={campus || ''}
            onChange={(e) => setCampus(e.target.value)}
            placeholder="e.g. Main Campus"
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Role</span>
          </label>
          <input
            type="text"
            className="input input-bordered"
            value={role || ''}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g. Student"
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Position</span>
          </label>
          <input
            type="text"
            className="input input-bordered"
            value={position || ''}
            onChange={(e) => setPosition(e.target.value)}
            placeholder="e.g. President"
          />
        </div>
      </div>

     

      <div className="flex flex-col gap-3">
        <button
          className={`btn btn-primary ${loading ? 'btn-disabled' : ''}`}
          onClick={updateProfile}
        >
          {loading ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Updating...
            </>
          ) : (
            'Update Profile'
          )}
        </button>

        <form action="/auth/signout" method="post">
          <button className="btn btn-outline w-full" type="submit">
            Sign out
          </button>
        </form>
      </div>
    </div>
  )
}
