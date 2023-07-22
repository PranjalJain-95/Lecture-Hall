import React, { useState } from 'react'
import Image from 'next/image'
import { MdOutlineChair,  MdPersonRemove, MdClose, MdArrowDownward } from 'react-icons/md'
import { BiMessageDetail } from 'react-icons/bi'
import { RiChatOffLine } from 'react-icons/ri'
 

export function RoomParticipant({user}) {
  const [active, setActive] = useState(false)

  if(user.user_id !== null){
    console.log(user)
  }
  return (
    <div className='relative cursor-pointer'>
      <div 
        className={`
          ${user.user_id === null ? 'bg-gray-600' : 'bg-blue-500'}
          ${user.role_id === 1 && 'w-28 h-28 p-2 '}
          ${user.role_id === 2 && 'w-20 h-20 p-2'}
          ${user.role_id === 3 && 'w-9 h-9 p-1'}
          rounded-full relative flex justify-center items-center
        `}
        onClick={()=>{setActive(true)}}
      >
        <div 
          className='relative flex justify-center items-center overflow-hidden w-full h-full rounded-full shadow-xl' 
          style={{boxShadow: 'rgba(0, 0, 0, 0.95) 0px 0px 10px'}}
        >
          {user.user_id === null ?
            <div className='text-white-500'><MdOutlineChair /></div>
          :
            user.info.avatar !== undefined ?
              <Image src={user.info.avatar} width='20px' height='20px' layout='fill' alt="avatar" />
              :
              <div 
                className={`
                  ${user.role_id === 1 && 'text-2xl'}
                `}>
                  {user.info.first_name[0]}{user.info.last_name[0]}
              </div>
          }
        </div>
      </div>

      {/* Hover over active user */}
      {active && user.user_id !== null &&
        <div 
          onMouseLeave={() => {setActive(false)}}
          className='absolute top-0 left-0 z-50 pl-[100%] '>
          <div className='text-sm w-40 z-50 top-0 bg-stone-600 rounded-md shadow-md border border-stone-500'>

            {/* Avatar Image */}
            <div className='px-2 text-md border-b border-stone-700'>
              <div className='p-1 rounded overflow-hidden'>
                <Image src={user.info.avatar} width='100px' height='100px' layout='fixed' alt='user logo'/>
              </div>
            </div>

            {/* User Information */}
            <div className='px-2 text-md border-b border-stone-700'>
              Name:<br/> 
              <div className='text-xl'>
                {user.info.first_name} {user.info.last_name}
              </div>
            </div>

            {/* Interactive Buttons */}
            <div className='flex w-full gap-3 justify-center p-3'> 
              <div className='p-2 text-2xl bg-green-500 rounded-full basis-3'><BiMessageDetail /></div>
              <div className='p-2 text-2xl bg-amber-500 rounded-full basis-3'><RiChatOffLine /></div>
              <div className='p-2 text-2xl bg-red-500 rounded-full basis-3'><MdPersonRemove /></div>
            </div>

          </div>
        </div>
      }
    
      {/* Hover over active user */}
      {active && user.user_id === null &&
        <div 
          onMouseLeave={() => {setActive(false)}}
          className='absolute -translate-y-9 z-50 pl-10'>
          <div className='text-sm w-40 z-50 top-0 bg-stone-600 rounded-md shadow-md border border-stone-500'>
            <div className='px-2 text-md border-b border-stone-700'>
              <div className='text-xl'>
                Have a seat.
              </div>
            </div>
            <div className='flex w-full gap-3 justify-center p-3'> 
            <div className='p-2 text-2xl bg-green-500 rounded-full basis-3'><MdArrowDownward /></div>
            <div onClick={()=>{setActive(false)}} className='p-2 text-2xl bg-red-500 rounded-full basis-3'><MdClose /></div>
            </div>
          </div>
        </div>
      }


    </div>
  )
}