import Link from 'next/link'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { supabase } from '../utils/supabaseClient'
import { AiOutlineHome } from 'react-icons/ai'
import { MdMeetingRoom, MdAdd } from 'react-icons/md'
import { FiSettings } from 'react-icons/fi'
import { useRouter } from 'next/router'

export default function Sidebar() {
  const router = useRouter()

  const icons = [
    {
      name: 'Home',
      icons: <AiOutlineHome />,
      link: '/dashboard',
      key: 'home',
    },
    {
      name: 'Rooms',
      icons: <MdMeetingRoom />,
      link: '/room',
      key: 'room',
    },
    {
      name: 'Create Room',
      icons: <MdAdd />,
      link: '/newRoom',
      key: 'addroom',
    },
  ]

  const [profile, setProfile] = useState('')
  const [active, setActive] = useState(false)
  const [route, setRoute] = useState(router.route)

  async function getUser(){
    const { data, error } = await supabase.auth.getSession()
    if(!data.session){
      router.push('/')
    } else {
      setProfile(data.session.user.user_metadata.picture)
    }
  }

  useEffect(()=> {
    getUser()
  }, [])

  async function handleSignout(){
    const { error } = await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className='flex flex-col flex-wrap items-center h-screen w-20 bg-stone-900 border-r border-stone-500 text-stone-300 '>

      {/* Logo */}
      <div className='h-[61px] w-full text-sm text-center mb-2 flex justify-center items-center'>
        <Image src='/imgs/logo.png' width="40px" height="40px" className='rounded-sm p-3' alt="app logo" />
        {/* logo goes here */}
      </div>

      {/* Links */}
      <div className={`flex flex-col flex-wrap mt-16 mb-auto gap-4 w-full`}>
        {icons.map((link) => {
          return(
            <Link href={link.link} key={link.key}>
              <a 
                className={`
                  relative flex flex-col justify-center items-center
                  p-2 text-3xl cursor-pointer
                  hover:text-blue-500 hover:rounded-sm 
                  ${route === (link.link) && 'text-indigo-400'}
                `}
              >
                {link.icons}
                {route === (link.link) && <div className={`w-[2px] h-full bg-indigo-400 absolute -right-[1px]`}></div>}
                {/* <small className='text-sm text-center'>{link.name}</small> */}
              </a>
            </Link>
          )
        })}
      </div>

      <div className='flex flex-col items-center w-full py-4'>

        {/* Settings */}
        <Link href='/settings'>
          <a 
            className='p-2 text-3xl mb-2 cursor-pointer hover:bg-blue-500 hover:rounded-sm'
          >
            <FiSettings />
          </a>
        </Link>

        {/* Profile */}
        <div 
          className='relative text-3xl mb-2 cursor-pointer rounded-full bg-stone-900 border border-stone-500 w-10 h-10 mt-4'
          onClick={()=>{setActive(true)}}
        >
          {profile && <Image 
            src={`${profile}`}
            layout='fill'
            objectFit='fill'
            alt='profileImage' 
            className='rounded-full p-3' 
          />}
          {active && 
            <div className='absolute left-0 bottom-0 pl-14 text-xl'
              onMouseLeave={()=>{setActive(false)}}
            >
              <div className='p-2 rounded bg-stone-700'>
              <Link href='/profile'>
                <a className='p-1 rounded mb-2'>Profile</a>
              </Link>
              <button onClick={() => {handleSignout()}} className='bg-red-700 py-1 px-2 rounded mt-4'>Logout</button>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  )
}
