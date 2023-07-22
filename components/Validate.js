import React, { useState, useEffect } from 'react'
import { supabase } from '../utils/supabaseClient'
import { useRouter } from 'next/router'

export default function Validate({children}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function getUser(){
    const { data, error } = await supabase.auth.getSession()
    
    if(error) console.log(error)
    if(!data.session){
      router.push('/')
    } else {
      setLoading(true)
    }
  }

  useEffect(()=> {
    getUser()
  }, [])

  return (
    <>
      {loading && children}
    </>
  )
}
