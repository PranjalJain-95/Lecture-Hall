import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CgCloseR } from 'react-icons/cg'
import { useRoomSettings } from './newRoomContext'
import Image from 'next/image'
import { supabase } from '../../utils/supabaseClient'
import { useRouter } from 'next/router'

export default function CreateModal({setModal}) {
  const router = useRouter()
  
  const {
    quizName, 
    quizzes, 
    roomName,
    roomCode,
    roomPrivacy,
    groupSize,
    roomPoints,
    groupNames,
    hosts,
    assistants,
    userID,
    roomSize
  } = useRoomSettings()

  const [totalPoints, setTotalPoints] = useState(0)

  const getQuizPoints = () => {
    let points = 0
    for(let i = 0; i < quizzes.length; i++){
      points += parseInt(quizzes[i].points)
    }
    setTotalPoints(points)
  }

  // Save Room
  const saveRoom = async () => {

    // Create Room
    const { rooms, error } = await supabase
      .from('rooms')
      .insert([
        { 
          id: roomCode,
          name: roomName,
          is_private: roomPrivacy,
          is_active: false,
          created_by: userID,
          max_room_size: parseInt(roomSize)
        },
      ])

    // If room is created, add the rest of the room information.
    if(error){
      console.log(error)
    } else {

      addGroup()
      addHosts()

      if(quizzes.length > 0){
        addQuiz()
      }
      
      if(assistants.length > 0){
        addAssistants()
      }
      
      setModal(false)
      router.push(`/room/${roomCode}`)
    }
  }

  // Add Hosts
  const addHosts = async () => {
    let data2 = await []
    for(let i = 0; i < hosts.length; i++){
      await data2.push(
        {
          room_id: roomCode,
          user_id: hosts[i].user_id,
          role_id: 1
        }
      )
    }
    
    // console.log("Data2:")
    // console.log(data2)

    const { data, error } = await supabase
      .from('attendance')
      .insert(data2)

    if(error){
      console.log("Adding Hosts to Attendance Error:")
      console.log(error)
    }
  }

  // Add Assitants
  const addAssistants = async () => {
    let data2 = await []
    for(let i = 0; i < assistants.length; i++){
      await data2.push(
        {
          room_id: roomCode,
          user_id: assistants[i].user_id,
          role_id: 2
        }
      )
    }
    
    const { data, error } = await supabase
      .from('attendance')
      .insert(data2)

    if(error){
      console.log("Adding Assistants to Attendance Error:")
      console.log(error)
    }
  }

  // Add Groups
  const addGroup = async () => {
    let data2 = await []
    for(let i = 0; i < groupNames.length; i++){
      await data2.push(
        {
          room_id: roomCode,
          name: groupNames[i],
          max_group_size: parseInt(groupSize)
        }
      )
    }
    
    const { data, error } = await supabase
      .from('groups')
      .insert(data2)

    if(error){
      console.log("Adding to groups error:")
      console.log(error)
    }
  }

  // Add Quizzes
  const addQuiz = async () => {
    const { data, error } = await supabase
      .from('quizzes')
      .insert([
        {
          name: quizName,
          room_id: roomCode,
          timer_minutes: quizzes.length
        }
      ])
      .select()
      
    if(error){
      console.log("Adding to groups error:")
      console.log(error)
    } else {
      addQuizAnswers(data[0].quiz_id)
    }
  }

  // Quiz Answers
  const addQuizAnswers = async (quizID) =>{

    await quizzes.map( async (q) => {
      const { data, error } = await supabase
        .from('quiz_questions')
        .insert([
          {
            quiz_id: quizID,
            question: q.question,
            points: q.points,
            type: 'multi'
          }
        ])
        .select()
      
      if(data){
        await quizChoices(data[0].id, q.choices)
      } else {
        console.log('Error: Adding Quiz Answers')
        console.log(error)
      }
      
      
    })
  }

  // Quiz Choices
  const quizChoices = async (id, choices) => {
    let data2 = []
    for(let i = 0; i < choices.length; i++) {
      await data2.push(
        {
          question_id: id,
          text: choices[i].text,
          correct: choices[i].answer
        }
      )
    }

    const { data, error } = await supabase
      .from('quiz_answers')
      .insert(data2)

    if(error){
      console.log("Error: Quiz Answers")
      console.log(error)
    }
  }

  useEffect(() => {
    getQuizPoints()
  }, []);

  return (
    <div 
      className="fixed h-screen w-screen top-0 left-0 flex justify-center items-start py-20 bg-stone-900/60 backdrop-blur overflow-auto z-10"
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
        className="bg-stone-700 max-w-[500px] w-full min-h-[300px] rounded p-6"
      >
        <h1 className='text-2xl mb-10 text-stone-50 font-bold flex'>
          Confirm Room Creation <button className='ml-auto text-red-500 text-3xl' onClick={()=>{setModal(false)}}><CgCloseR /></button>
        </h1>

        
        <h3 className='text-xl text-blue-300 mt-4 border-b border-stone-500'>Room Information</h3>
        <div className='text-stone-50'>
          <div><span className='text-blue-300'>Name:</span> {roomName}</div>
          <div><span className='text-blue-300'>Code:</span> {roomCode}</div>
          <div><span className='text-blue-300'>Privacy:</span> {roomPrivacy ? 'Public' : 'Private'}</div>
          <div><span className='text-blue-300'>Participation Points:</span> {roomPoints}</div>
          <div><span className='text-blue-300'>Room Size:</span> {roomSize}</div>
        </div>

        <h3 className='text-xl text-green-300 mt-10 border-b border-stone-500'>Host/Assistant Information</h3>
        <div className='text-stone-50'>
          <div>
            <span className='text-green-300'>Host Names:</span> 
            {hosts.map((host, index)=>{
              return(
                <div 
                  className='ml-4 flex items-center gap-2 mt-1'
                  key={'host' + index}
                >
                  <Image alt="avatar" src={host.avatar} width={32}  height={32} layout='intrinsic' className='rounded-full'/>
                  {host.first_name} {host.last_name}
                </div>
              )
            })}
          </div>
        </div>
        <div className='text-stone-50'>
          <div>
            <span className='text-green-300'>Assistant Name(s):</span> 
            {assistants.map((host, index)=>{
              return(
                <div 
                  className='ml-4 flex items-center gap-2 mt-1'
                  key={'host' + index}
                >
                  <Image alt="avatar" src={host.avatar} width={32}  height={32} layout='intrinsic' className='rounded-full'/>
                  {host.first_name} {host.last_name}
                </div>
              )
            })}
          </div>
        </div>

        <h3 className='text-xl text-red-300 mt-10 border-b border-stone-500'>Group Information</h3>
        <div className='text-stone-50'>
          <div><span className='text-red-300'># of Groups:</span> {groupNames.length}</div>
          <div><span className='text-red-300'>Group Size:</span> {groupSize}</div>
        </div>

        <h3 className='text-xl text-amber-300 mt-10 border-b border-stone-500'>Quiz Information</h3>
        <div className='text-stone-50'>
          <div><span className='text-amber-300'>Name:</span> {quizName}</div>
          <div><span className='text-amber-300'># of Questions:</span> {quizzes.length}</div>
          <div><span className='text-amber-300'>Quiz Points:</span> {totalPoints}</div>
        </div>

        <h3 className='text-xl text-purple-300 mt-10 border-b border-stone-500'>Total Partcipation Points</h3>
        <div className='text-stone-50'>
          <div><span className='text-purple-300'>Total Points:</span> {parseInt(totalPoints) + parseInt(roomPoints)}</div>
        </div>

        <div className='flex gap-5 justify-end mt-10'>
          <button className='py-1 px-2 bg-green-600 rounded' onClick={()=>{saveRoom()}}>Create Room</button>
          <button className='py-1 px-2 bg-red-400 rounded' onClick={()=>{setModal(false)}}>Cancel</button>
        </div>

      </motion.div>
    </div>
  )
}
