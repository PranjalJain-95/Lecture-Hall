import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import { FiSend } from 'react-icons/fi'
import { supabase } from '../utils/supabaseClient'

export default function Chat({ roomID, userID }) {
  const chat = useRef()
  const [message, setMessage] = useState('')
  const [roomMessages, setRoomMessages] = useState([])

  const [attendanceList, setAttendanceList] = useState()
  const [groups, setGroups] = useState()

 

  async function getAttendance(){
    const { data: attendance, error } = await supabase
      .from('attendance')
      .select(`
        *,
        users(*)
      `)
      .eq('room_id', roomID)

    if(error){
      console.log(error)
    }
    
    // Get Attendance
    setAttendanceList(attendance)
  }

  async function realTimeAttendance(){
    supabase
    .channel(`public:attendance:eq.${roomID}`)
    .on(
      'postgres_changes',
      { 
        event: '*', 
        schema: 'public', 
        table: 'attendance',
        filter: `room_id=eq.${roomID}`
      },
      async (payload) => {
        console.log('Attendance Change received!', payload)

        // Get Attendance
        getAttendance()
      }
    )
    .subscribe()
  }

  async function getMessages() {
    // Get Messages
    const { data: messages, error } = await supabase
      .from('room_messages')
      .select('*, users(*)')
      .eq('room_id', roomID)

    if(error){
      console.log(error)
    }

    setRoomMessages(messages)
  }
  
  async function realTimeMessages(){
    // Realtime Messages
    supabase
      .channel(`public:room_messages:eq.${roomID}`)
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'room_messages',
          filter: `room_id=eq.${roomID}`
        },
        (payload) => {
    
          // setRoomMessages((current) => [...current, payload.new])
          
          // Get Messages
          console.log('Messages Change received!', payload.new)
          getMessages()
        }
    )
    .subscribe()
  }


  // Start the party
  useEffect(() => {
    getMessages()
    realTimeMessages()
    getAttendance()
    realTimeAttendance()
  }, []);

    async function realTimeMessages(){
    // Realtime Messages
    supabase
      .channel(`public:room_messages:eq.${roomID}`)
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'room_messages',
          filter: `room_id=eq.${roomID}`
        },
        (payload) => {
    
          // setRoomMessages((current) => [...current, payload.new])
          
          // Get Messages
          console.log('Messages Change received!', payload.new)
          getMessages()
        }
    )
    .subscribe()
  }

  // Scroll to bottom of Chat
  useEffect(() => {
    chat.current.scrollIntoView({
      behavior: 'smooth'
    });
  }, [roomMessages]);
 

  // When user sends a new chat message
  async function handleChatSubmit(e){
    e.preventDefault()
    if(message.length > 0){
      // Send chat message to room
      const { data, error } = await supabase
        .from('room_messages')
        .insert([
          { 
            room_id: roomID,
            user_id: userID, 
            message, message
          },
        ])
        
      // Clear textbox
      setMessage('')
    }
  }

  // async function getNewUser(id){
  //   const { data: users, error } = await supabase
  //     .from('users')
  //     .select(`*`)
  //     .eq('user_id', id)

  //   const user  = { users: users[0]}
  // }

  // Selected chat system.  Need to add groups later
  const [active, setActive] = useState('everyone')

  // List of available chat systems
  const chats = [
    {
      name: 'Everyone',
      key: 'everyone'
    },
    {
      name: 'Group',
      key: 'group'
    },
  ]

  return (
    <div
      className='grid overflow-hidden' 
      style={{ 
        height: 'calc(100vh - 4rem)',
        gridTemplateRows: '4rem auto 4rem'
      }}
    >
      {/* Chat Groups */}
      <div className='flex h-16'>
        {chats.map((item) => { 
          return(
            <div 
              key={item.key} 
              className={`w-full h-16 flex justify-center items-center font-bold
              ${ active === item.key ? 
                `text-blue-500 border-b-2 border-blue-500 ` : 
                `text-stone-50 border-b cursor-pointer` }
            `}>
              {item.name}
            </div>
          )
        })}
      </div>

      {/* Chat Messages */}
      <div className='p-3 justify-end overflow-auto h-full'
        style={{
          // height: 'calc(100vh - 16rem)'
        }}
      >
        {roomMessages && attendanceList && roomMessages.map((item, key, array) => { 
          const user = item.users
          const avatar = user.avatar ? user.avatar : '/imgs/rpilogo.png';
          const user_id = item.user_id;
          const created_at = item.created_at;
          const fullName = user.first_name && user.last_name ? user.first_name + ' ' + user.last_name : 'Deleted User';
          const message = item.message;

          const dateFormat = new Date(created_at)
          const AMPM = dateFormat.getHours() > 12 ? 'PM' : 'AM'
          const hours = dateFormat.getHours() > 12 ? dateFormat.getHours() - 12 : dateFormat.getHours()
          const minutes = dateFormat.getMinutes() < 10 ? '0' + dateFormat.getMinutes() : dateFormat.getMinutes() 
          const date = hours + ':' + minutes + ' ' + AMPM
          
          return(
            <div key={created_at} className={`
              flex gap-2 mt-2 w-full items-start
              ${userID === user_id ? 'justify-end' : ''}
            `}>

              {/* Avatar */}
              <div 
                className={`
                  rounded-full overflow-hidden justify-end relative flex items-center mt-1
                  ${userID === user_id ? 'hidden' : ''}
                `}
                // style={{width: '32px', height: '32px'}}
                >
                  {key > 0  && array[key-1].user_id === item.user_id ? <div className='ml-8'></div> :
                    <Image src={avatar} width={32}  height={32} layout='intrinsic' />
                  }
              </div>

              {/* Name, Time, and Message */}
              <div className='mb-2  flex-wrap flex-col w-full '>
                
                {key > 0  && array[key-1].user_id === item.user_id ? '' :
                  <div className={`
                    ${userID === user_id ? 'text-right' : ''}
                  `}>
                    <span className={`font-bold ${userID === user_id ? 'float-right pl-2' : '' }`}>
                      {fullName}
                    </span>
                    <small className='ml-2 text-stone-400 text-md'>{date}</small>
                  </div>
                }

                {/* Message */}
                <div 
                  className={`
                    p-1 rounded-md py-1 px-2
                    ${userID === user_id ? 'bg-blue-600 text-right float-right ml-9' : 'bg-stone-600 mr-auto text-left float-left'}
                  `}
                >
                  {message}
                </div>
              </div>
            </div>
          )
        })}
        <div ref={chat}></div>
      </div>

      {/* Text Input */}
      <div className='p-2 h-[3rem] m-2 flex bg-stone-600 items-center gap-5 rounded'>
        <form className='flex w-full gap-2 m-2' autoComplete="off">
          <input 
            type="text" 
            id="chattext" 
            name="chattext" 
            placeholder='Type...'
            className='w-full bg-stone-600 outline-0'
            value={message}
            onChange={(e)=>{setMessage(e.target.value)}}
          />
          <button type="submit" onClick={handleChatSubmit} className='mx-3'>
            <FiSend />
          </button>
        </form>
      </div>
    </div>
  )
}
