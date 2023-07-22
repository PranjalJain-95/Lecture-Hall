import React, { useEffect, useState } from 'react'
import { MdOutlineExitToApp } from 'react-icons/md'
import { HiUserGroup } from 'react-icons/hi'
import { RoomAssistant, RoomParticipant} from './RoomUser'
import { supabase } from '../utils/supabaseClient'

export default function Room({ roomID }) {

  const [attendanceList, setAttendanceList] = useState()
  const [roomName, setRoomName] = useState('')
  const [groups, setGroups] = useState()

  // Numbers
  const [roomMax, setRoomMax] = useState(0)
  const [attendanceSize, setAttendanceSize] = useState(0)

  // Get Attendance
  async function getAttendance(){
    
    const { data: attendance, error } = await supabase
      .from('attendance')
      .select('*')
      .eq('room_id', roomID)

    let data2 = [...attendance]

    for(let i = 0; i < data2.length; i++){
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', data2[i].user_id)

        data2[i].info =user[0]
    }

    if(error){
      console.log(error)
    }
    
    // Get Attendance
    setAttendanceList(attendance)
    setAttendanceSize(attendance.length)

  }

  // Configure attendance subscription
  const subscribeAttendance = () => {
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
      (payload) => {
        console.log('Attendance Change received!', payload)
        getAttendance()
      }
    )
    .subscribe()
  }

  // Anytime the attendance changes, update.
  useEffect(() => {
    if(attendanceList){
      setAttendanceSize(attendanceList.length)
    }
  }, [attendanceList]);

  async function getGroups(){
    const { data: groups, error } = await supabase
      .from('groups')
      .select(`
        *,
        group_participants(*)
      `)
      .eq('room_id', roomID)

    if(error){
      console.log(error)
    }
    
    // Get Room Size based on Groups
    let roomSize = 0;
    groups.map((group)=>{
      roomSize += group.max_group_size
    })
    
    setGroups(groups)
    setRoomMax(roomSize)
  }

  async function getRoomInfo(){
    const { data: rooms, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('id', roomID)

    if(error){
      console.log(error)
    }

    // Set Room Name
    setRoomName(rooms[0].name)
  }

  async function findParticipants(id) {
    const { data: rooms, error } = await supabase
      .from('rooms')
      .select('id')
      .eq('id', id)
    
    
    if(error) {
      console.log(error);
    }
    
    if(rooms.length > 0){
      setRoomFound(true)
    }
  }

  useEffect(() => {
    getRoomInfo()
    getAttendance()
    subscribeAttendance()
    getGroups()
  }, []);
 

  const GroupDivider = (groups) => {
    const groupSize = groups.length;

    return(
      <div className='flex flex-wrap w-full'>
        {groups.map((group) => {
          let groupArray = []
          for(let i = 0; i < group.max_group_size; i++){
            groupArray.push(
              {
                user_id: null,
                role_id: 3
              }
            );          
          }
          return(
            <div 
              key={group.name.replace(/\s/g, '')} 
              className={`
                w-full flex flex-col p-3 text-lg
                ${groupSize < 2 && 'basis-full'}
                ${groupSize === 2 && 'basis-1/2'}
                ${groupSize === 3 && 'basis-1/3'}
                ${groupSize > 3 && 'basis-1/4'}
              `}
            >
              <div className='border border-stone-700 rounded h-full p-2 hover:bg-stone-800'>
                <div className='flex '>

                  {/* Group Name */}
                  {group.name}

                  {/* Group Size */}
                  <span className='ml-auto'>
                    {group.group_participants.length}/{group.max_group_size}
                  </span>

                </div>
                <div className='flex flex-wrap gap-2 mt-2 justify-center'>
                  {groupArray.map((user, index) => {
                    return(
                      <div key={group.group_id + index}>
                        <RoomParticipant user={user}/> 
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className='flex flex-col text-stone-50 w-full'>

      {/* Lecture Header */}
      <div className='h-16 w-full bg-stone-900 text-stone-50 p-4 text-xl flex flex-wrap gap-4 border-b border-stone-500'>

        {/* Name of the room */}
        {roomName}

        {/* Exit Room Button */}
        <button className='bg-red-500 rounded-full px-2 h-auto text-xs flex justify-center items-center my-1 gap-1'>
          <MdOutlineExitToApp /> Leave Room
        </button>

        {/* Number of participants in the room currently */}
        <div className='ml-auto text-yellow-200'>
          <div className='flex items-center gap-2 '>
            <HiUserGroup />
            {attendanceSize}/{roomMax} 
          </div>
        </div>
      </div>

      {/* Room Content */}
      <div className='h-full overflow-auto'>

        {/* Host Section */}
        <div className='flex flex-row border-b border-stone-500'>

          {/* Whiteboard */}
          <div className='basis-1/3 flex items-center p-4 text-3xl'>
           
          </div>

          {/* Hosts Section */}
          <div className='basis-1/3 flex items-center justify-center'>
            {attendanceList && attendanceList.map((user) => {
              if(user.role_id === 1){
                return (
                  <span key={user.participant_id} className='p-4'>
                    <RoomParticipant user={user}/>
                  </span>
                )
              }
            })}
          </div>

          {/* Timers */}
          <div className='basis-1/3 text-right p-3'>
            <div className='text-red-400'>Class Starts In</div>
            <div className='text-green-500 text-4xl italic'>04:35</div>
          </div>

        </div>
        
        {/* Assistant Section */}
        <div className='flex flex-row border-b border-stone-500'>
            <div className='basis-full flex flex-wrap items-center justify-center'>
            {attendanceList && attendanceList.map((user) => {
              
              if(user.role_id === 2){
                return(
                  <span key={user.partcipant_id} className='p-4'>
                    <RoomParticipant user={user}/>
                  </span>
                )
              }

            })}
            </div>
        </div>

        {/* Groups Section */}
        <div className='flex flex-row border-b border-stone-500'>
            {groups &&
              <div className='basis-full flex flex-wrap items-center justify-center'>
                {GroupDivider(groups)}
              </div>
            }
        </div>
      </div>

      {/* Bottom Bar */}
      <div className='h-16 w-full bg-stone-900 text-stone-50 p-4 text-xl flex gap-4 mt-auto border-t border-stone-500'>
        {/* Nothing Yet */}
        <div className='text-green-400 font-bold'>
          Room #: {roomID}
        </div>

        {/* My Points Section */}
        <div className='ml-auto text-amber-400 font-bold'>
          <div className='flex items-center gap-2'>
            My Points: 0/10
          </div>
        </div>
      </div>


    </div>
  )
}
