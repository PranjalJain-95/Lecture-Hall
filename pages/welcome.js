import { useRouter } from 'next/router'
import React, { useState } from 'react'
import Image from 'next/image'
import { supabase } from '../utils/supabaseClient'

// export const getServerSideProps = async ({ params }) => {
//   const user_id = params.user_id;
//   return {
//      props: { user_id }
//   }
// }

export default function Welcome() {
  const router = useRouter()
  const { user_id } = router.query
  
  const [first, setFirst] = useState('')
  const [last, setLast] = useState('')

  async function handleSubmit(e){
    e.preventDefault()
    
    if(first.length > 0 && last.length > 0){
      const newFirst = first.charAt(0).toUpperCase() + first.slice(1)
      const newLast = last.charAt(0).toUpperCase() + last.slice(1)
 
      const { data, error } = await supabase
      .from('users')
      .update([
        { 
          first_name: newFirst, 
          last_name: newLast 
        },
      ])
      .eq('user_id', user_id)

      router.push('/dashboard')
    }
  }

  return (
    <div className={`
      bg-stone-900 h-screen w-screen flex flex-row justify-center items-center text-stone-50
    `}>
      <div 
        className='basis-1/3 h-full text-center pt-10'
        style={{
          background: `linear-gradient(
            to bottom,
            #d6001c,
            #d6001d96
          ), url(/imgs/rpilecture.jpg)`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center center'
        }}
      
      >
        <Image src='/imgs/rpiwordlogo.png' width='200px' height='50px' /> 
        <div>Information Technology and Web Science</div>
      </div>

      <div className='basis-2/3 p-5 px-16'>
        <h1 className='text-5xl text-center mb-2'>Welcome to Lecture Hall</h1>
        <h3 className='text-lg italic text-center mb-10 text-stone-300'>We need to finish setting up your account.</h3>
        <form className='flex flex-col'>
          <label for="first_name" className='text-xl flex gap-5 items-end'>
            First Name
            {first.length < 1 && <span className='text-sm text-red-500 ml-auto'>*First Name Field is Empty</span>}
          </label> 
          <input type="text" id="first_name" className='bg-stone-600 text-xl py-2 px-1 rounded' onChange={(e)=>{setFirst(e.target.value)}} />

          <label for="last_name" className='text-xl mt-4 flex gap-5 items-end'>
            Last Name 
            {last.length < 1 && <span className='text-sm text-red-500 ml-auto'>*Last Name Field is Empty</span>}
          </label>
          <input type="text" id="last_name" className='bg-stone-600 text-xl py-2 px-1 rounded' onChange={(e)=>{setLast(e.target.value)}} />

          <button
            className={`
              mt-4 py-2
              ${first.length > 0 && last.length > 0 ? 'bg-blue-500' : 'bg-blue-900'}
            `}
            type='submit' onClick={handleSubmit}
            disabled={first.length > 0 && last.length > 0 ? false : true}
          >Submit</button>
        </form>
      </div>
    </div>
  )
}
