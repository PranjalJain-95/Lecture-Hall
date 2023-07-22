import React from 'react'
import { supabase } from '../../utils/supabaseClient'
import Navbar from '../../components/Navbar'
import { FaDiscord } from 'react-icons/fa'

export default function LoginPage() {

  async function signInWithDiscord() {
    const { user, session, error } = await supabase.auth.signInWithOAuth({
      provider: 'discord',
    })

  }

  return (
    <div className='bg-stone-900 text-stone-50 w-screen h-screen'>
      <Navbar />
      <div className='flex flex-col mt-40 items-center'>
        <h1 className='text-5xl mb-10'>Login</h1>
        {/* <form onSubmit={handleSubmit}>
          <input tyhpe="text" id="roomID" name="roomID" />
        </form> */}
        <button 
          onClick={signInWithDiscord}
          className='bg-blue-500 flex items-center gap-2 px-2 py-1 rounded text-xl hover:text-stone-900 transition-all'>
          <div><FaDiscord /></div>
          <div>Login with Discord</div>
        </button>
      </div>
    </div>
  )
}
