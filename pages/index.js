import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import { FaDiscord, FaGithub, FaInstagram, FaRedditAlien, FaTwitter } from 'react-icons/fa'
import { MdLogin } from 'react-icons/md'

export default function Home() {
  
  const links = [
    {
      name: 'Discord',
      icon: <FaDiscord />,
      link: 'https://discord.com/invite/j7VUUep9Hn',
      key: 'discord'
    },
    {
      name: 'Github',
      icon: <FaGithub />,
      link: '',
      key: 'github'
    },
    {
      name: 'Instagram',
      icon: <FaInstagram />,
      link: 'https://www.instagram.com/rpiadmissions/?hl=en',
      key: 'instagram'
    },
    {
      name: 'Twitter',
      icon: <FaTwitter />,
      link: 'https://twitter.com/rpi',
      key: 'twitter'
    },
    {
      name: 'Reddit',
      icon: <FaRedditAlien />,
      link: 'https://www.reddit.com/r/RPI/',
      key: 'reddit'
    },
  ]

  return (
    <div>
      <Head>
        <title>Lecture Hall</title>
        <meta name="description" content="Lecture assistant" />
        <meta property="og:image"  content="/imgs/room.jpg"></meta>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className='bg-stone-900 min-h-[100vh] text-stone-50'>

        {/* Navbar */}
        <Navbar />

        {/* Header */}
        <div 
          className='
            flex container mx-auto px-2 mt-20 gap-10
            xl:flex-row flex-col
            xl:text-left text-center          
          '
        >
          <div className='basis-1/2'>

            {/* Welcome  */}
            <h1 className='lg:text-8xl text-6xl mb-6 font-bold text-stone-50'>
              <div className='lg:text-5xl text-4xl font-thin italic'>Welcome to</div>
              Lecture Hall
            </h1>

            {/* Description */}
            <p className='text-lg text-stone-400'>
              Lecture Hall is a classroom assistant that allows professors to keep track of attendance, in-class quizzes, partcipation points, group discussions, polls, and classroom related questions.
            </p>

            <div className='mt-12 flex justify-center xl:justify-start'>
            <Link href='./login'>
              <a className='bg-blue-600 px-6 py-3 rounded flex items-center gap-4'>Login / Signup <MdLogin /></a>
            </Link>
            </div>
          </div>
          <div className='basis-1/2 max-w-[800px] mx-auto'>
            <Image 
              src='/imgs/room.jpg' 
              width={1512} 
              height={982} 
              alt="rooms demo" 
              className='rounded shadow-xl p-10 basis-1/2 scale-75 hover:scale-90 transition-all'
            />
          </div>
        </div>

        {/* Red Banner */}
        <div className='bg-rpi py-4 px-2 flex gap-4 text-2xl uppercase mt-24 bg-rpi_red'>
          <div className='flex gap-4 mt-auto container mx-auto justify-center'>
            {links.map((link) => {
              return(
                <Link href={link.link} key={link.key}>
                  <a target="_blank" rel="noreferrer" className='text-2xl cursor-pointer hover:text-stone-900'>
                    {link.icon}
                  </a>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Thank you section */}
        <div className='container mx-auto mt-12 px-2 flex gap-4'>
          <Image src='/imgs/rpilogo.png' width={100} height={100} alt="rpilogo" layout='fixed' className='rounded shadow-xl float-left '/>
          <div>
            <div>Special Thanks:</div>
            <small className='italic'>Created by the students of ITWS Database Systems Fall 22.</small>
            <div className='flex mt-5'>
            <Link
                href="https://discord.gg/j7VUUep9Hn"
                className=''
                rel="noreferrer"
              >
                <a target="_blank" className='bg-blue-500 flex items-center gap-2 px-6 py-3 rounded'>
                  <div><FaDiscord /></div>
                  <div>Join the RPI ITWS Discord</div>
                </a>
              </Link>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  )
}
