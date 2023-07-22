import Image from 'next/image'
import React from 'react'
import { BsTrash } from 'react-icons/bs'
import { motion } from 'framer-motion'

export default function RoomHosts({title, users, setUsers, setModal, id}) {

  // Remove User from List
  const removeUser = (index) => {
    let data = [...users];
    data.splice(index, 1)
    setUsers(data)
  }

  return (
    <div 
      className='basis-1/2'>
      <div className='text-2xl mb-10'>{title}:</div>
      {
        users.length > 0 ? 
        users.map((user, index) => {
          return(
            <div className='flex items-center mt-4' key={user.user_id} >
              <div className='flex gap-5 items-center'>
                <Image src={user.avatar} alt="profile image" width={30} height={30} className="border  bg-stone-50 rounded-full shadow" />
                {user.first_name} {user.last_name}
              
                {(index > 0 || id === 2 )&& 
                  <BsTrash 
                    onClick={()=>{ removeUser(index) }}
                    className='text-red-500 cursor-pointer'
                  />
                }
              </div>
            </div>
          )
        })
        :
        <div>No Users</div>

      }
      <button className='mt-4 py-1 px-2 bg-green-500' onClick={()=> {setModal(id)}}>Add {title}</button>
    </div>
  )
}
