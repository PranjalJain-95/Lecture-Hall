import React from 'react'
import Sidebar from '../../components/Sidebar'
import Validate from '../../components/Validate'

export default function Dashboard() {
  return (
    <div className='flex h-screen className bg-stone-900 text-stone-50'>
      <Validate>
        <Sidebar />
        <div className='mt-16 px-5 text-5xl'>
          Dashboard Page Coming Soon
        </div>
      </Validate>
    </div>
  )
}
