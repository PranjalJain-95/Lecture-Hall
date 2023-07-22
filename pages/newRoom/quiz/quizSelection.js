import React, { useState } from 'react'
import DeleteQuizModal from './deleteQuizModal'
import EditQuizModal from './editQuizModal'


export default function QuizSelection({question,index}) {
  const [alphabet] = useState(['A','B','C','D','E','F'])
  const [deleteModal, setDeleteModal] = useState(false)
  const [editModal, setEditModal] = useState(false)

  return (
    <>
    {/*  */}
    <div className='mb-16 bg-stone-800 p-4 rounded'>
      <div className='font-bold text-lg text-stone-300'>{index + 1}. {question.question}</div>
      <div>
        {question.choices.map((choice, index2) => {
          return(
            <div
              className={`
                rounded border mt-2 flex px-2 py-1 items-center gap-2
                ${choice.answer ? 'border-green-300/50 bg-green-300/30' : 'border-stone-400'}
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
      
      <div className='flex gap-4 mt-4 items-center'>

        {/* Points Awarded */}
        <h5 className='text-indigo-300 text-lg mr-auto'>
          Points Awarded: 
          <span className='ml-2 text-stone-50 px-2 rounded-full font-light'>{question.points}</span>
        </h5>

        {/* Edit Button */}
        <button 
          className='bg-blue-600/50 px-2 py-1 rounded hover:bg-blue-600' 
          onClick={()=>{setEditModal(true)}}
        >Edit</button>

        {/* Delete Button */}
        <button 
          className='bg-red-600/50 px-2 py-1 rounded hover:bg-red-600' 
          onClick={()=>{setDeleteModal(true)}}
        >Delete</button>

      </div>
    </div>

    {editModal && <EditQuizModal setModal={setEditModal} quiz={question} index={index} />}
    {deleteModal && <DeleteQuizModal setModal={setDeleteModal} question={question} index={index}/>}
  </>
  )
}
