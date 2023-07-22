import React from 'react'
import { supabase } from './supabaseClient'


// Get Session User
export async function getUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return user
}

export async function getMyInformation() {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return user
}

