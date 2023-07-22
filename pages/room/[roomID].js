import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import Link from 'next/link'
import Validate from '../../components/Validate'
import { supabase } from '../../utils/supabaseClient'
import Room from '../../components/Room'
import AppBar from '../../components/AppBar'

export const getServerSideProps = async ({params}) => {
  const roomID = params.roomID;
  return {
     props: { roomID }
  }
}

export default function NoRoom({ roomID }) {
  const router = useRouter()
  const [roomFound, setRoomFound] = useState(false)
  const [roomInfo, setRoomInfo] = useState()
  const [loading, setLoading] = useState(true)
  const [joinRoom, setJoinRoom] = useState(false)
  const [host, setHost] = useState(null)
  const [join, setJoin] = useState(false)
  const [registered, setRegistered] = useState(false)
  const [userID, setUserID] = useState(null)

  async function findUser(id){
    const { data: users, error } = await supabase
      .from('users')
      .select(`*`)
      .eq('user_id', id)

    if(error){
      console.log(error)
    }

    if(users.length > 0 ){
      setHost(users[0].first_name + ' ' + users[0].last_name)
    }
  }

  async function findRoom(id) {
    const { data: rooms, error } = await supabase
      .from('rooms')
      .select(`
        *,
        groups(
          *,
          group_participants(*)
        ),
        attendance(
          *, 
          users(*)
        )
      `)
      .eq('id', id)

    if(error) {
      console.log("ERROR: Find Room")
      console.log(error);
    } else {

      if(rooms.length > 0 || rooms === undefined){
        const {
          data: { user },
        } = await supabase.auth.getUser()

        const userExists = await rooms[0].attendance.find(obj => obj.user_id === user.id)

        if(userExists){
          setRegistered(true)
          setJoinRoom(true)
        }

        setRoomInfo(rooms[0])             // Save Room Information
        findUser(rooms[0].created_by)     // Find Host Information
        setRoomFound(true)                // Display Information
        setLoading(false)
      } else {
        setLoading(false)
      }
    } 
    
  }

  async function getSession() {
    const {
      data: { user },
    } = await supabase.auth.getUser()
  
    if(!user){
      router.push('/')
    } else {
      setUserID(user.id)
    }

  }

  async function handleJoin(){
    if(!registered){

      const { data, error } = await supabase
      .from('attendance')
      .insert([
        { 
          user_id: userID,
          room_id: roomID, 
          role_id: 4 
        },
      ])

      if(error){
        console.log("ERROR:")
        console.log(error)
      }
    }

    setJoinRoom(true)
  }

  useEffect(() => {
    getSession()
    findRoom(roomID)
  }, []);


if(!loading){
  return (
    <Validate>

    { roomFound ? 
      // Room Found
      <div className='h-screen bg-stone-900 flex '>
        <Sidebar />

        { joinRoom ?
          <>
            <Room roomID={roomID} userID={userID}/>
            <AppBar roomID={roomID} userID={userID} />
          </>
          :
          <>
            <div className='bg-stone-900 w-full flex justify-center items-center'>
              <div className={`
                flex flex-col
                max-w-[400px] max-h-[400px] w-full h-full rounded p-4 
                text-stone-50 bg-gradient-to-br transition-all
                from-stone-700 to-stone-600
                `}>
                <div className='text-stone-50 text-4xl text-center'>
                  <small className='text-lg text-stone-300 italic'>Welcome to</small>
                  <div className='mt-4'>{roomInfo.name}</div>
                </div>
                <div className='text-2xl h-full text-center'>
                  <div className='justify-center mt-12'>
                    <button 
                      className='
                        px-6 py-2 bg-gradient-to-r  mb-6
                        from-green-400  to-green-300 rounded shadow w-full text-stone-900
                        hover:from-green-600  hover:to-green-500 transition-all hover:text-stone-50'
                      onMouseEnter={()=>{ setJoin(true) }}
                      onMouseLeave={()=>{ setJoin(false) }}
                      onClick={handleJoin}
                    >{registered ? 'Welcome Back' : 'Register'}</button>
                    <Link href='/room'>
                      <a 
                        className='text-red-500 text-lg hover:text-red-200'
                      >
                        Back to Lobby
                      </a>
                    </Link>
                  </div>
                </div>
                <div className='text-stone-50 font-bold italic flex'>
                  <div className='mr-auto'>Room #: {roomID}</div>
                  Host: {host}
                </div>
              </div>
            </div>
          </>
        }
      </div>
      :
      // Room Not Found
      <div className='flex flex-row bg-stone-900 text-stone-50'>
          <Sidebar />
          <div className='text-4xl flex flex-col items-center w-full p-10'>
            <div>Room Not Found</div>
            <div className='text-6xl my-10'>Room: {roomID}</div>
            <div className='text-xl'>Please try your search again.  If you encountered this page in error please send us a message and we will resolve it as soon as possible.</div>
            <Link href='/room'>
              <a className='text-blue-500 mt-10 border border-blue-500 rounded p-3 hover:bg-blue-500 hover:text-stone-50'>Back to Rooms</a>
            </Link>
          </div>
      </div>
    }
    </Validate>
  )} else {
    return(
      <div className='bg-stone-900 flex h-screen w-screen text-5xl justify-center items-center text-stone-50'>
        loading
      </div>
    )
  }
  
}
