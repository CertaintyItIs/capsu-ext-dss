// lib/auth/getUserRole.ts

import { SupabaseClient } from '@supabase/supabase-js'

export async function getUserRole(userId: string, supabase: SupabaseClient) {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single()
    return data?.role || null
    }
  