import React, { useEffect, useState } from "react"
import { supabase } from "../../../utils/supabaseClient"
import AddUsersModal from "./addUsersModal"
import { useRoomSettings } from "../newRoomContext"
import RoomHosts from "./roomHosts"
import { motion } from "framer-motion"

export default function HostSettings() {
  const { setHostReady, userID, hosts, setHosts, assistants, setAssistants } = useRoomSettings()
  const [modal, setModal] = useState(null)
  
  async function addMyself(){
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', userID)

    setHosts(users)
    setHostReady(true)
  }

  useEffect(() => {
    addMyself()
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
      <h1 className='text-4xl mb-10 text-indigo-300 font-bold'>Host Settings</h1>
      <div className="flex">
        <RoomHosts title ='Hosts' users={hosts} setUsers={setHosts} id={1} setModal={setModal} />
        <RoomHosts title ='Assistants' users={assistants} setUsers={setAssistants} id={2} setModal={setModal} />
      </div>

      {/* Modals */}
      {modal === 1 && <AddUsersModal title='Hosts' users={hosts} setUsers={setHosts} setModal={setModal}/>}
      {modal === 2 && <AddUsersModal title='Assistants' users={assistants} setUsers={setAssistants} setModal={setModal}/>}
        
    </motion.div>
  )
}
