import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Sidebar from '../../components/Sidebar'
import { useRouter } from 'next/router'
import Validate from '../../components/Validate'
import { supabase } from '../../utils/supabaseClient'

export default function Room() {
  const router = useRouter()
  const [roomID, setRoomID] = useState('')
  const [publicRooms, setPublicRooms] = useState([])

  async function getAllRooms() {
  
    const { data: rooms, error } = await supabase
      .from('rooms')
      .select(`
        *, 
        attendance(room_id),
        groups(room_id)
      `)
      .eq('is_private', false)
    
    if(error) {
      console.log("ERROR: Get All Rooms")
      console.log(error);
    }
    
    return setPublicRooms(rooms)
  }

  useEffect(() => {
    getAllRooms()
  }, []);


  function handleSubmit(event) {
    event.preventDefault();
    router.push({
      pathname: `/room/[roomID]`,
      query: { roomID: roomID.toUpperCase() },
    });
  }

  return (
    <div className='flex flex-row bg-stone-900 h-screen'>
      <Validate>
        <Sidebar />
        <div className='w-full bg-stone-900 text-stone-50 pt-16 px-6'>

          {/* Find a room */}
          <div className='mb-20'>
            <h1 className='text-5xl mb-4'>
              Join Room:
            </h1>
            <div className='text-2xl text-stone-900'>
              <form>
                <input type="text" className='p-4' id="roomID" name='roomID' onChange={(e)=>{setRoomID(e.target.value)}}/>
                <button 
                  type='submit'
                  className='bg-green-400 h-full p-4'
                  onClick={handleSubmit}
                >Enter</button>  
              </form>
              
        
            </div>
          </div>

          {/* Public Rooms */}
          <div className='mb-4'>
            <h1 className='text-5xl mb-4'>
              Public Rooms:
            </h1>
            <div className='text-stone-50 flex gap-4'>
              {publicRooms.map((room) => {
                return(
                  <Link 
                    key={room.id}
                    href={{
                      pathname: `/room/[roomID]`,
                      query: { roomID: room.id },
                    }}
                  >
                  <a className='bg-stone-700 w-64 p-3 rounded text-center hover:bg-blue-600 cursor-pointer'>
                    <div className='text-2xl'>{room.name}</div>
                    <div className='text-lg'>{room.attendance.length}/{room.max_room_size} Attendees</div>
                  </a>
                  </Link>
                )
              })}
            </div>
          </div>

        </div>
      </Validate>
    </div>
  )
}
