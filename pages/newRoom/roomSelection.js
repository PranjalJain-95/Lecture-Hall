import React from 'react'
import { useRoomSettings } from './newRoomContext'

import RoomSettings from './room/roomSettings'
import HostSettings from './host/hostSettings'
import QuizSettings from './quiz/quizSettings'

export default function RoomSelection() {
  const { activeLink } = useRoomSettings()

  return(
    <div className='bg-stone-900 w-full text-stone-200 px-10 py-6 overflow-auto font-light'>
      {activeLink === 'room' && <RoomSettings />}
      {activeLink === 'host' && <HostSettings />}
      {activeLink === 'quiz' && <QuizSettings />}
    </div>
  )
}
