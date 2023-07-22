import React from 'react'
import Sidebar from '../../components/Sidebar'
import Validate from '../../components/Validate'
import { NewRoomContextWrapper } from './newRoomContext'
import RoomSelection from './roomSelection'
import RoomSidebar from './roomSidebar'

export default function index() {

  return (
    <Validate>
      <NewRoomContextWrapper>
        <div className='flex h-screen'>
          <Sidebar />
          <RoomSidebar />
          <RoomSelection />
        </div>
      </NewRoomContextWrapper>
    </Validate>
  )
}
