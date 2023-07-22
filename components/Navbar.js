import React, { useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '../utils/supabaseClient'
import { useRouter } from 'next/router'
import Image from 'next/image'

export default function Navbar() {
  const router = useRouter()

  const links = [
    {
      name: 'Home',
      link: '/',
      key: 'home'
    },
    {
      name: 'About',
      link: '/',
      key: 'about'
    },
  ]

  async function checkStatus() {
    const { data, error } = await supabase.auth.getSession()
    
    if(data.session){

      const user_id = data.session.user.id      
      const email = data.session.user.email
      const avatar = data.session.user.user_metadata.avatar_url
      
      const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', user_id)
      
      if(users.length > 0){
        const { data, error } = await supabase
          .from('users')
          .update([
            { 
              avatar: avatar, 
              email: email 
            },
          ])
          .eq('user_id', user_id)

        if(users[0].first_name === '' || users[0].last_name === ''){
          router.push({
            pathname: '/welcome',
            query: {user_id: user_id},
          })
        } else {
          router.push('/dashboard')
        }
      } else {
        const { data, error } = await supabase
          .from('users')
          .insert([
            { 
              user_id: user_id,
              avatar: avatar, 
              email: email 
            },
          ])

        router.push({
          pathname: '/welcome',
          query: { user_id: user_id },
        })
      }
      
    } 
  }

  useEffect(() => {
    checkStatus()
  }, [])

  return (
    <div className='h-24 flex items-center gap-10 container mx-auto px-2'>
      <Image width={214} height={40} src='/imgs/rpiwordlogo.png' />
      <div className='flex ml-auto gap-5'>
        {links.map((link) => {
          return(
            <Link href={link.link} key={link.key}>
              <a className='text-xl cursor-pointer hover:text-red-500 transition-all'>
                {link.name}
              </a>
            </Link>
          )
        })}
      </div>
      <div className=''>
        <Link href='./login'>
          <a className='bg-blue-600 px-2 py-1 rounded'>Login / Signup</a>
        </Link>
      </div>
    </div>
  )
}
