import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CgCloseR } from 'react-icons/cg'
import { BiAddToQueue } from 'react-icons/bi'
import { AiFillCheckCircle } from 'react-icons/ai'
import { TbTrash } from 'react-icons/tb'
import { useRoomSettings } from '../newRoomContext'

export default function EditQuizModal({setModal, quiz, index}) {
  const { quizzes, setQuizzes } = useRoomSettings()
  const [question, setQuestion] = useState('')
  const [alphabet] = useState(['A','B','C','D','E','F'])
  const [points, setPoints] = useState(1)
  const [verify, setVerify] = useState(true)
  const [saveReady, setSaveReady] = useState(false)
  const [choices, setChoices] = useState([
    {
      text: '',
      answer: false,
      type: 'multi'
    },
    {
      text: '',
      answer: false,
      type: 'multi'
    },
  ])

  // Check for atleast 1 correct answer
  useEffect(() => {
    let data = choices.find(obj => obj.answer === true)
    if(data) {
      setSaveReady(true)
    } else {
      setSaveReady(false)
    }
  }, [choices]);

  useEffect(() => {
    setQuestion(quiz.question)
    setChoices(quiz.choices)
    setPoints(quiz.points)
  }, []);

  const validate = () => {
    if(saveReady){
      setVerify(false)
    }
  }

  const changeAnswerText = (index, newText) => {
    let data = [...choices];
    data[index].text = newText
    setChoices(data)
  }

  const changeCorrectAnswer = (index, value) => {
    let data = [...choices];
    data[index].answer = !value
    setChoices(data)
  }

  const removeAnswer = (index) => {
    if(choices.length > 2){
      let data = [...choices]
      data.splice(index, 1)
      setChoices(data)
    } else {
      setdeletedAnswersError("Minimum of 2 answers required")
    }
  }

  const addChoice = () => {
    if(choices.length < 5){
      let data = [...choices]
      data.push({
        text: '',
        answer: false,
        type: 'multi'
      })
      setChoices(data)
    }
  }

  const addQuiz = async () => {
    let data  = [...quizzes]
    let newQuizQuestion = {
      question: question,
      choices: choices,
      points: points
    }
    data[index] = newQuizQuestion
    
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
      {verify ?
      <>
        {/* Room Settings */}
        <h1 className='text-2xl mb-10 text-stone-50 font-bold flex'>
          Edit Question <button className='ml-auto text-red-500 text-3xl' onClick={()=>{setModal(false)}}><CgCloseR /></button>
        </h1>

        {/* Choice of Quiz */}
        <div className='flex gap-4'>
          {/* Multiple Choice */}
          <button className={`border border-green-500 px-2 py-1 rounded`}>
            Multiple Choice
          </button>

          {/* Fill in the blank */}
          <button className={`border border-red-500 px-2 py-1 rounded`} disabled>
            Fill in the blank <br/>
            <span className='text-sm text-red-500 italic'>*Coming Soon</span>
          </button>
        </div>

        {/* Title */}
        <div className='mt-10 text-indigo-300 mb-4 text-2xl'>
          Multiple Choice: <div className='text-sm text-stone-300'>*Max 5 Choices</div>
        </div>
        
        {/* Question Input */}
        <label className='text-lg text-stone-200' for="question">Question:</label><br/>
        <input 
          name="question" 
          id="question" 
          type='text' 
          value={question}
          className='text-stone-900 py-1 px-2 bg-stone-300 rounded w-full mb-10'
          onChange={(e)=>{setQuestion(e.target.value)}}
        />

        {/* Choices Input */}
        <div className='text-lg text-stone-200' for="question">
          Choices: 
        </div>
        {
          choices.map((choice, index) => {
            return (
              <div className='flex items-center mb-2 gap-3' key={`choice${index}`}>
                <input
                  name="question" 
                  type='text'
                  value={choice.text}
                  onChange={(e)=>{changeAnswerText(index, e.target.value)}}
                  className={`
                    text-stone-900 py-1 px-2 bg-stone-300 rounded w-full

                  `}
                />

                {/* Add Choice */}
                <button
                  onClick={()=>{changeCorrectAnswer(index, choices[index].answer)}} 
                  className={`
                    text-2xl
                    ${choice.answer ? 'text-green-500' : 'text-stone-500'}
                  `}
                ><AiFillCheckCircle /></button>

                {/* Delete */}
                <button 
                  disabled={choices.length > 2 ? false : true}
                  onClick={()=>{removeAnswer(index)}}
                  className={`
                    p-1 text-xl rounded-full
                    ${choices.length > 2 ? 
                      ' text-red-400 hover:bg-red-400 hover:text-stone-900': 
                      ' text-stone-600'}
                  `}
                ><TbTrash /></button>
              </div>
            )
          })
        }
        
        {/* add more choices and warning messages */}
        <div className='mb-16'>
          {choices.length <= 2 ? <div className='text-red-500 text-sm'>*Minimum of 2 choices required</div> : ''}
          {choices.length >= 5  ? <div className='text-red-500 text-sm'>*Maximum of 5 choices</div> : ''}
          <button 
            className={`
              flex gap-4 items-center 
              py-1 px-2 rounded mt-4
              ${choices.length < 5 ? 'bg-green-600' : 'bg-stone-500'}
            `}
            onClick={()=>{addChoice()}}
            disabled={choices.length < 5 ? false : true}
          >
            <BiAddToQueue /> Add More Choices
          </button>        
        </div>
        

        <div className='mt-10 text-indigo-300 mb-4 text-2xl'>
          Points Awarded: <div className='text-sm text-stone-300'>*Max 100 Points</div>
        </div>
        <div className='mb-10'>
          <input 
            type='number' 
            className='px-2 py-1 rounded text-stone-900 bg-stone-200' 
            min='0'
            max='100'
            value={points} 
            onChange={(e)=>{setPoints(e.target.value)}} />
        </div>

        {/* Save Question Button / Cancel Button */}
        <div className='flex gap-5 items-center'>
          <button className={`
            px-2 py-1 w-auto rounded 
            ${saveReady ? 'bg-blue-500' : 'bg-stone-400'}
          `} onClick={()=>{validate()}}>Save Question</button>
          {!saveReady && <div className='text-red-300 text-sm'>*Most have one correct answer</div>}
          <button className='px-2 py-1 w-16 rounded bg-red-500 ml-auto' onClick={()=>{setModal(false)}}>Cancel</button>
        </div>
      </>
      :
      <>
        {/* Preview of Quiz Question */}
        <h2 className='text-3xl text-indigo-300 mb-8'>Preview:</h2>
        <div className='border border-stone-500 rounded p-4'>
          <div className='font-bold text-lg'>{question}</div>
          <div>
            {choices.map((choice, index) => {
              return(
                <div
                  className={`
                    rounded border mt-2 flex px-2 py-1 items-center gap-2
                    ${choice.answer ? 'border-green-500 bg-green-500/25' : 'border-stone-400'}
                  `} 
                  key={'choices' + index}
                >
                  <span className='text-indigo-300'>{alphabet[index]}.</span>
                  <span>{choice.text}</span> 
                  <span className='ml-auto'>{choice.answer ? 'correct' : 'incorrect'}</span>
                </div>
              )
            })}
          </div>
          <h5 className='mt-4 text-amber-300 text-xl'>Points Awarded: <span className='ml-2 bg-amber-300 text-stone-900 px-2 rounded'>{points}</span></h5>
        </div>

        {/* Save / Back / Cancel */}
        <div className='flex gap-5 mt-16'>
          <button className='px-2 py-1 w-32 mr-auto rounded bg-green-500' onClick={()=>{addQuiz()}}>Save</button>
          <button className='px-2 py-1 w-16 rounded bg-purple-500' onClick={()=>{setVerify(true)}}>Back</button>
          <button className='px-2 py-1 w-16 rounded bg-red-500' onClick={()=>{setModal(false)}}>Cancel</button>
        </div>
      </>
      }

    </motion.div>
  </div>
  )
}
