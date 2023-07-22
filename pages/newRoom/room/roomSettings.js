import React, { useState, useEffect } from 'react'
import { supabase } from '../../../utils/supabaseClient'
import { useRoomSettings } from '../newRoomContext';
import { BsTrash } from 'react-icons/bs'
import { BiAddToQueue } from 'react-icons/bi'
import { motion } from 'framer-motion';

export default function RoomSettings() {
  const { 
    roomCode, 
    setRoomCode, 
    groupNames, 
    setGroupNames, 
    groupSize, 
    setGroupSize, 
    setRoomReady, 
    roomPrivacy, 
    setRoomPrivacy, 
    roomName, 
    setRoomName,
    roomPoints, 
    setRoomPoints,
    roomSize,
    setRoomSize
  } = useRoomSettings()

  const [loading, setLoading] = useState(false)

  // Generate Room Code
  async function createID(length) {
    setLoading(true)
    var result           = '';
    var characters       = 'ABCDEFGHJKLMNPQRTUVWXYZ123456789';
    var charactersLength = characters.length;

    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
      charactersLength));
    }

    // Make sure room code deoesn't already exist in the system
    const { data: rooms, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('id', result)

    if(error){
      console.log(error)
    } else {
      rooms.length > 0 ? createID(8) : setRoomCode(result)

      setLoading(false)
    }
  }

  // Add Group to list
  async function addGroup(){
    const newGroup = `Group ${groupNames.length + 1}`
    setGroupNames([...groupNames, newGroup])
  }

  // Change name of the group
  async function handleNameChange(index, e){
    let data = [...groupNames];
    data[index] = e.target.value;
    setGroupNames(data)
  }

  // Remove group from list
  async function removeGroup(index){
    let data = [...groupNames];
    data.splice(index, 1)
    setGroupNames(data)
  }

  // Create Group code if one doesn't exist
  useEffect(() => {
    if(!roomCode){ createID(8) }
    setRoomSize(160)
  }, []);

  // Room Ready check
  useEffect(() => {
    groupSize > 0 ? setRoomReady(true) : setRoomReady(false);
    groupNames.length > 0 ? setRoomReady(true) : setRoomReady(false);
    roomName.length > 0 ? setRoomReady(true) : setRoomReady(false)
  }, [groupSize, groupNames, roomName]);

  // Change the size of the group size
  useEffect(() => {
    setGroupSize(Math.floor(roomSize / groupNames.length))
  }, [groupNames]);

  return (
    <motion.div
      initial={{
        opacity: 0
      }}
      animate={{
        opacity: 1
      }}
      className='pb-20'
    >
      {/* Room Settings */}
      <h1 className='text-4xl mb-10 text-indigo-300 font-bold'>Room Settings</h1>
      
      {/* Room Name */}
      <div className='text-2xl mt-16'>
        <div>Room Name: <span className='text-red-300 text-sm'>*required</span></div>
        <input 
          value={roomName}
          className='px-2 py-1 mt-2 bg-stone-300 text-stone-900 rounded font-normal text-xl w-full max-w-[500px]'
          onChange={(e)=>{setRoomName(e.target.value)}}
        />
      </div>

      {/* Room Privacy */}
      <div className='mt-16'>
        <div className='text-2xl'>
          <div>Room Privacy:</div>
          <div className={`flex items-center gap-6 mt-2 text-lg ${roomPrivacy ? 'text-stone-400' : 'text-blue-300'}`}>
            <label htmlFor="default-toggle" className="inline-flex relative items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={roomPrivacy} 
                id="default-toggle" 
                className="sr-only peer" 
                onChange={(e)=>{setRoomPrivacy(e.target.checked)}}
              />
              <div className="
                focus:outline-0 w-11 h-6 peer-focus:outline-none rounded-full peer bg-gray-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600
              "></div>
            </label>
            {roomPrivacy ? 'Private Room' : 'Public Room'}
          </div>
        </div>
      </div>


      {/* Room Code */}
      <div className='text-2xl mt-16'>
        <div>Room Code:</div>
        <div className='text-4xl text-green-500 tracking-widest'>{ roomCode }</div>
      </div>
      <div className='mt-4'>
        <button 
          onClick={()=>{createID(8)}}
          className={`
              ${loading ? 'bg-blue-800' : 'bg-blue-500'}
            bg-blue-500 px-2 py-1 text-md rounded w-48`}
          disabled={loading ? true : false}
        >{loading ? 'Loading...' : 'Generate Room Code'}</button>
      </div>

      {/* Room Selection */}
      <div className='text-2xl mt-16'>
        Room Selection:
        <div className='flex gap-6'>

          {/* Office */}
          <button disabled className='border border-stone-500 text-center p-4 my-4 text-lg text-stone-500 rounded'>
            <div>Office</div>
            <small>Max Room Size: 50</small>
            <div className='text-sm text-red-300'>*Coming Soon</div>
          </button>  

          {/* Auditorium */}
          <button className='border border-green-500 text-center p-4 my-4 text-lg text-green-500 rounded cursor-pointer'>
            <div>Auditorium</div>
            <small>Max Room Size: {roomSize}</small>
          </button>  

          {/* Event */}
          <button disabled className='border border-stone-500 text-center p-4 my-4 text-lg text-stone-500 rounded'>
            <div>Event</div>
            <small>Max Room Size: 400</small>
            <div className='text-sm text-red-300'>*Coming Soon</div>
          </button>  
        </div>
      </div>

      {/* Room Name */}
      <div className='text-2xl mt-16'>
        <div>Participation Points: <span className='text-red-300 text-sm'>*required</span></div>
        <input 
          value={roomPoints}
          type='number'
          min='0'
          max='100'
          className='px-2 py-1 mt-2 bg-stone-300 text-stone-900 rounded font-normal text-xl'
          onChange={(e)=>{setRoomPoints(e.target.value)}}
        />
      </div>      

      {/* Groups  */}
      <h1 className='text-4xl mt-20 mb-16 text-indigo-300 font-bold'>Group Settings</h1>

        <div className='text-2xl flex gap-2'>
          Group Size: {groupSize}
        </div>
        <input 
          type="range" 
          min={1} 
          max={Math.floor(roomSize / groupNames.length)}
          value={groupSize}
          id="myRange" 
          className='w-[250px] mt-4'
          onChange={(e)=>{setGroupSize(e.target.value)}}
        />

        <div className='text-2xl mt-10'>
          Group Names:
          {groupNames.map((group, key) => {
            return(
              <div key={key} className='flex gap-5 items-center my-2 rounded'>
                <input 
                  type="string" 
                  value={group}  
                  className="bg-stone-700 p-2 text-lg" 
                  onChange={(e) => {handleNameChange(key, e)}}
                />
                {key > 0 &&
                  <BsTrash 
                    className='text-red-500 cursor-pointer'
                    onClick={()=>{removeGroup(key)}}
                  />
                }
              </div>
            )
          })}
          <button 
            className='flex gap-4 items-center bg-green-600 py-1 px-2 rounded mt-4'
            onClick={addGroup}
          >
            <BiAddToQueue /> Add Group
          </button>          
        </div>

        {/* Confirmation Testing */}
        {/* {groupNames.map(item => {
          return(
            <div key={item}>{item}</div>
          )
        })} */}
    

    </motion.div>
  )
}
