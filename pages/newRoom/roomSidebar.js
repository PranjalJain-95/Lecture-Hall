import React, { useEffect, useState } from 'react'
import { supabase } from '../../utils/supabaseClient'
import { useRoomSettings } from './newRoomContext'
import { BsFillXSquareFill, BsFillCheckSquareFill } from 'react-icons/bs'
import CreateModal from './createModal'
export default function RoomSidebar() {

  const { createRoomReady, setCreateRoomReady, roomReady, hostReady, activeLink, setActiveLink, setUserID, quizReady } = useRoomSettings()

  // States
  const [modal, setModal] = useState(false)

  useEffect(() => {
    if(hostReady && roomReady && quizReady){
      setCreateRoomReady(true)
    } else {
      setCreateRoomReady(false)
    }
  }, [hostReady, roomReady, quizReady]);

  useEffect(() => {
    async function getUser(){
      const { data: { user } } = await supabase.auth.getUser()
      setUserID(user.id)
    }

    getUser()
  }, []);

  const links = [
    {
      name: 'Room',
      key: 'room',
      linkActive: true,
      required: true,
      roomState: roomReady,
    },
    {
      name: 'Hosts',
      key: 'host',
      linkActive: true,
      required: true,
      roomState: hostReady,
    },
    {
      name: 'Security',
      key: 'security',
      linkActive: false,
      required: false,
      roomState: true,
    },
    {
      name: 'Chat',
      key: 'chat',
      linkActive: false,
      required: false,
      roomState: true,
    },
    {
      name: 'Quiz',
      key: 'quiz',
      linkActive: true,
      required: true,
      roomState: quizReady,
    },
    {
      name: 'Polls',
      key: 'poll',
      linkActive: true,
      required: false,
      roomState: true,
    },
    {
      name: 'Extra Features',
      key: 'extra',
      linkActive: false,
      required: false,
      roomState: true,
    },
  ]

  return (
    <div className='
      w-60 bg-stone-800 h-screen text-stone-50 border-r border-stone-700 py-6 px-4
      flex flex-col
    '>
      {/* Room Profiles */}
      <h5 className='text-2xl'>Room Profiles</h5>
      <div className='italic text-red-400'>Coming soon</div>

      {/* Settings */}
      <h5 className='text-2xl mt-12 mb-4'>Settings</h5>
      <div className='flex flex-col gap-4 capitalize'>
        {links.map((item) => { 
          return(
            <div 
              className={`
                flex items-center
                ${item.linkActive ? 'cursor-pointer text-stone-50' : 'text-stone-500'}  
              `} 
              key={item.key}
              onClick={()=>{item.linkActive ? setActiveLink(item.key) : ''}}
            >
              <div className={`
                ${activeLink === item.key && 'text-blue-500'}
              `}>{item.name}</div>
              {item.required && 
                <span className='ml-auto'>
                  {item.roomState ? <BsFillCheckSquareFill className='text-green-500'/> : <BsFillXSquareFill className='text-red-500'/>}
                </span>
              }
            </div>
          )
        })}
      </div>

      {/* Create Room Button */}
      <button 
        className={`
          mt-auto 
          py-2 rounded font-bold border
          ${createRoomReady ? 'border-green-500' : 'border-red-500'}
          ${createRoomReady ? 'hover:bg-green-500' : 'hover:bg-red-500'}
          hover:text-stone-900
        `}
        onClick={()=>{setModal(true)}}
      >Create Room</button>

      {/* Room ready message */}
      <small className='text-center mt-2'>
        {createRoomReady ? '*room is ready to be created' : '*check to make sure all minimum settings are met.'}
      </small>

      {/* Modal */}
      {modal && <CreateModal setModal={setModal}/>}
    </div>
  )
}
