import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react'
import { supabase } from '../../../utils/supabaseClient';
import { useRoomSettings } from '../newRoomContext';
import { CgCloseR, CgSearch } from 'react-icons/cg'
import { motion } from 'framer-motion';
export default function AddUsers({title, users, setUsers, setModal}) {
  const hostRef = useRef()
  const { hosts, assistants } = useRoomSettings()

  // States
  const [userSearch, setUserSearch] = useState()
  const [userFound, setUserFound] = useState(true)
  const [userLoading, setUserLoading] = useState(false)
  const [userAlreadyExists, setUserAlreadyExists] = useState(true)
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    findUser('')
  }, [hosts, assistants]);

  // Find user by email
  const findUser = async (event) => {
    if(event) event.preventDefault();

    // Start loading
    setUserLoading(true)

    // Find email of user
    const getEmail = async(email) => {
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
      

      // Check if user exists
      if(user.length > 0) {
        const hostFound = hosts.find(obj => obj.user_id === user[0].user_id)
        const assistantFound = assistants.find(obj => obj.user_id === user[0].user_id)

        setUserSearch(user)
        setUserFound(true)
        
        // Check if host is already in the list
        hostFound || assistantFound ? setUserAlreadyExists(true) : setUserAlreadyExists(false)
      
      // If user doesn't exist
      } else {
        // Check if email field was empty
        if(email){
          setUserFound(false)
          setUserSearch(null)
        } else {
          setUserFound(true)
        }
      }
      setUserLoading(false)
    }

    // Run Function but wait half a second for person to stop typing.
    const timeOutID = setTimeout(()=> getEmail(userEmail), 0)
    return () => clearTimeout(timeOutID)
  }

  const addUser = async (user) => {
    setUsers([...users, user])
  }

  return (
    <div 
      className="fixed h-screen w-screen top-0 left-0 flex justify-center items-center bg-stone-900/60 backdrop-blur"
    >
      <motion.div 
        initial={{
          opacity: 0,
          y: 0
        }}
        animate={{
          opacity: 1,
          y: [270, -100, 0]
        }}
        transition={{ duration: 0.5 }}
        className="bg-stone-700 max-w-[500px] w-full max-h-[300px] h-full rounded p-6">

        {/* Room Settings */}
        <h1 className='text-2xl mb-10 text-stone-50 font-bold flex'>
          {title} <button className='ml-auto text-red-500 text-3xl' onClick={()=>{setModal(null)}}><CgCloseR /></button>
        </h1>

        <div className='mb-20'>

          {/* Users */}
          <div className='text-lg'>

            {/* Find Users */}
            <div>

              {/* Title */}
              <div className='mb-2'>Find User by Email:
                {userLoading ?
                  <span className='text-blue-500'> Searching...</span>
                  :
                  <span className='text-red-500'> {!userFound && 'User Not Found'} </span>
                }
              </div>

              {/* Input Field */}
              <form className='flex bg-stone-200 py-1 gap-2 px-2 rounded'>
                <input 
                  type="text" 
                  ref={hostRef}
                  className="text-stone-900 px-2 rounded py-1 w-full bg-transparent"
                  onChange={(e)=>{ setUserEmail(e.target.value) }}
                />
                <button className='text-center text-stone-900' type='submit' onClick={(e)=>{ findUser(e) }}>
                  <CgSearch className='w-10'/>
                </button>
              </form>

              {/* Host Found */}
              <div className='mt-10'>
                {userFound && userSearch && userSearch.map((user) => {
                  return(
                    <div key={user.user_id} className='flex gap-5 items-center'>
                      <Image src={user.avatar} alt={user.user_id} width={30} height={30} className="rounded-full bg-stone-50 border border-green-500"/>
                      {user.first_name} {user.last_name}
                      <button 
                        className={`
                          ${userAlreadyExists ? 'bg-red-600' : 'bg-green-600'} py-1 px-2 rounded text-sm
                        `}
                        onClick={() => {addUser(user)} }
                        disabled={userAlreadyExists ? true : false}
                      >{userAlreadyExists ? 'Already Added' : 'Add Host'}
                      </button>  
                    </div>
                  )
                })}
              </div>
              
            </div>
          </div>
          
        </div>

        
      </motion.div>
    </div>
  )
}
