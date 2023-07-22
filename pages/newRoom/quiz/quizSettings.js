import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRoomSettings } from '../newRoomContext'
import AddQuizModal from './addQuizModal'
import QuizSelection from './quizSelection'

export default function QuizSettings() {
  const { quizzes, setQuizReady, quizName, setQuizName } = useRoomSettings()
  const [totalPoints, setTotalPoints] = useState(0)

  // Modal config
  const [addModal, setAddModal] = useState(false)
  
  const getPoints = () => {
    let points = 0
    for(let i = 0; i < quizzes.length; i++){
      points += parseInt(quizzes[i].points)
    }
    setTotalPoints(points)
  }

  useEffect(() => {
    getPoints()
  }, [quizzes]);

  useEffect(() => {
    setQuizReady(true)
  }, []);

  return (
    <motion.div
      initial={{
        opacity: 0
      }}
      animate={{
        opacity: 1
      }}
    >
      <h1 className='text-4xl mb-10 text-indigo-300 font-bold'>Quiz Settings</h1>
      <div className='text-2xl'>Quiz Name:</div>
      <input 
        type='text' 
        value={quizName}
        onChange={(e)=>{setQuizName(e.target.value)}}
        className='mb-10 mt-2 py-1 px-2 rounded bg-stone-300 text-stone-900 font-normal'
      />

      <div className='text-2xl mb-2'>Questions:</div>

      {quizzes.length > 0 ? 
        <div className='max-w-[400px] w-full'>
        {quizzes.map((question,index) => {
          return(
            <>
              <QuizSelection question={question} index={index} />
            </>
          )
        })}
        </div>
        
        : 
        <div className='text-red-300'>No Quiz Questions.</div>
      }

      {/* Add Quiz Button */}
      <button 
        className='mt-4 py-1 px-2 bg-green-700 rounded hover:bg-green-400 hover:text-stone-900 transition-all' 
        onClick={()=> {setAddModal(true)}}
      >Add Quiz Question</button>

      {/* Possible Points */}
      <div className='text-2xl mt-10'>Quiz Totals:</div>
      <div className='text-green-500 text-xl'>Number of Questions: {quizzes.length}</div>
      <div className='text-green-500 text-xl'>Max Points Possible: {totalPoints}</div>

      {/* Modals */}
      {addModal && <AddQuizModal setModal={setAddModal}/>}

    </motion.div>
  )
}
