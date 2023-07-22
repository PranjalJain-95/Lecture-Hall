import React, { useState, useEffect } from 'react'
import { supabase } from '../utils/supabaseClient'
import { HiOutlineChatAlt2 } from 'react-icons/hi'
import { AiOutlineQuestionCircle } from 'react-icons/ai'
import { CgPoll } from 'react-icons/cg'
import { MdOutlineAdminPanelSettings } from 'react-icons/md'
import { BiTestTube } from 'react-icons/bi'
import Chat from './Chat'
import Quiz from './quiz/quiz'

export default function AppBar({ roomID, userID }) {

  const [active, setActive] = useState('chat')
  const [admins, setAdmins] = useState(false)

  const getRoles = async () => {
    const { data: attendance, error } = await supabase
    .from('attendance')
    .select(`*`)
    .eq('room_id', roomID)
    .or(`role_id.eq.1`)
    
    const exists = attendance.find(obj => obj.user_id === userID)
    if(exists){
      setAdmins(true)
    } else {
      setAdmins(false)
    }
  }

  useEffect(() => {
    getRoles()
  }, []);

  const apps = [
    {
      name: 'Chat',
      icon: <HiOutlineChatAlt2 />,
      key: 'chat',
      unlocked: true
    },
    {
      name: 'Question',
      icon: <AiOutlineQuestionCircle />,
      key: 'question',
      unlocked: true
    },
    {
      name: 'Poll',
      icon: <CgPoll />,
      key: 'poll',
      unlocked: true
    },
    {
      name: 'Quiz',
      icon: <BiTestTube />,
      key: 'quiz',
      unlocked: true
    },
    {
      name: 'Admin Settings',
      icon: <MdOutlineAdminPanelSettings />,
      key: 'roomAdmin',
      unlocked: admins
    },
  ]
  
  return (
    <div className='flex flex-col w-128 h-screen bg-stone-900 border-l border-stone-500 text-stone-100 '>
      
      {/* App Selection */}
      <div className='bg-stone-400 flex items-center justify-center h-16'>
        {apps.map((item) => { 
          if(item.unlocked){
            return(
              <div 
                key={item.key}
                onClick={() => {setActive(item.key)}}
                className={`
                  flex items-center justify-center text-3xl w-full h-16
                  ${item.key === active ? 'bg-stone-900':'bg-black cursor-pointer text-stone-500'}
                `}>
                {item.icon}
              </div> 
            ) 
          }
        })}        
      </div>
      
      {/* Apps */}
      { active === 'chat' && <Chat roomID={roomID} userID={userID} /> }
      { active === 'quiz' && <Quiz roomID={roomID} userID={userID} /> }
      { active === 'roomAdmin' && <Quiz roomID={roomID} userID={userID} /> }
    </div>
  )
}
