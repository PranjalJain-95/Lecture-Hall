import { createContext, useContext } from 'react';
import { useState } from 'react';

const AppContext = createContext();

export function NewRoomContextWrapper({ children }) {
  // Sidebar Settings
  const [activeLink, setActiveLink] = useState('room')
  const [userID, setUserID] = useState(null)

  // Room Settings
  const [roomName, setRoomName] = useState('')
  const [roomCode, setRoomCode] = useState(null)
  const [roomPrivacy, setRoomPrivacy] = useState(true)
  const [roomSize, setRoomSize] = useState(160)
  const [groupSize, setGroupSize] = useState(1)
  const [groupNames, setGroupNames] = useState(['Group 1'])
  const [roomReady, setRoomReady] = useState(false)
  const [roomPoints, setRoomPoints] = useState(0)

  // Hosts and Assistants
  const [hosts, setHosts] = useState([])
  const [assistants, setAssistants] = useState([])
  const [hostReady, setHostReady] = useState(false)

  // Quiz Settings
  const [quizName, setQuizName] = useState('')
  const [quizzes, setQuizzes] = useState([])
  const [quizReady, setQuizReady] = useState(false)

  // Poll Settings
  const [polls, setPolls] = useState([])
  const [pollReady, setPollReady] = useState(false)

  // Room Ready
  const [createRoomReady, setCreateRoomReady] = useState(false)


  // Future Features  -------------------------------------

  // Room Rules section - Rules displayed before entering room and user has to agree before joining.
  // Nag Warning - Allows host or assistants to send a pop up message to all users to make sure everyone is paying attention.  
  // Disable chats - Stop letting people use chat system.  Probably useful during quizzes.

  // ------------------------------------------------------


  return (
    <AppContext.Provider value={{
      roomName, setRoomName,
      userID, setUserID,
      activeLink, setActiveLink,
      roomCode, setRoomCode,
      roomPrivacy, setRoomPrivacy,
      groupSize, setGroupSize,
      groupNames, setGroupNames,
      hosts, setHosts,
      assistants, setAssistants,
      quizName, setQuizName,
      quizzes, setQuizzes,
      polls, setPolls,
      roomReady, setRoomReady,
      hostReady, setHostReady,
      createRoomReady, setCreateRoomReady,
      quizReady, setQuizReady,
      pollReady, setPollReady,
      roomPoints, setRoomPoints,
      roomSize, setRoomSize
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useRoomSettings() {
  return useContext(AppContext);
}