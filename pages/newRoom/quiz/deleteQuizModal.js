import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { CgCloseR } from 'react-icons/cg'
import { useRoomSettings } from '../newRoomContext'

export default function DeleteQuizModal({question, index, setModal}) {
  const {quizzes, setQuizzes} = useRoomSettings()
  const [alphabet] = useState(['A','B','C','D','E','F'])

  const deleteQuestion = () => {
    let data = [...quizzes]
    data.splice(index, 1)
    setQuizzes(data)
    setModal(false)
  }
  
  return (
    <div 
      className="fixed h-screen w-screen top-0 left-0 flex justify-center items-start py-20 bg-stone-900/60 backdrop-blur overflow-auto"
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
        <h1 className='text-2xl mb-10 text-red-400 font-bold flex'>
          Delete Question <button className='ml-auto text-red-500 text-3xl' onClick={()=>{setModal(false)}}><CgCloseR /></button>
        </h1>
        <div className='mb-16 bg-stone-800 p-4 rounded'>
          <div className='font-bold text-lg text-stone-300'>{index + 1}. {question.question}</div>
          <div>
            {question.choices.map((choice, index2) => {
              return(
                <div
                  className={`
                    rounded border mt-2 flex px-2 py-1 items-center gap-2
                    ${choice.answer ? 'border-green-500/50 bg-green-500/20' : 'border-stone-400'}
                  `} 
                  key={'quiz' + index2}
                >
                  <span className='text-indigo-300'>{alphabet[index2]}.</span>
                  <span>{choice.text}</span> 
                  <span className='ml-auto'>{choice.answer ? 'correct' : 'incorrect'}</span>
                </div>
              )
            })}
          </div>
        </div>
        <h5 className='text-red-100 text-lg font-bold text-center'><span className='text-3xl text-red-500'>Warning:</span><br/> You are about to delete this question.<br/>Are you sure?</h5>
        <div className='flex gap-4 mt-4 items-center'>
          <button className='bg-red-600/75 px-2 py-1 rounded hover:bg-red-600 ml-auto' onClick={()=>{deleteQuestion()}}>Delete</button>
          <button className='bg-blue-600/75 px-2 py-1 rounded hover:bg-blue-600 mr-auto' onClick={()=>{setModal(false)}}>Cancel</button>
        </div>
      </motion.div>
    </div>
  )
}
