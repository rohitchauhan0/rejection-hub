"use client"
import Image from 'next/image'
import React, { useState } from 'react'
import { TiPlus } from "react-icons/ti";
import PostModal from './Modal';

const Navbar = () => {
    const [showModal, setshowModal] = useState(false)
  return (
   <>
    <div className=' w-full max-w-screen-xl mx-auto flex items-center justify-between p-5'>
        <Image src="/logo.png" alt="logo" width={100} height={100} />
        <TiPlus className=' text-white cursor-pointer hover:text-red-600 transition-all duration-300' size={30} onClick={() => setshowModal(true)} />
    </div>
    {showModal && <PostModal setshowModal={setshowModal} />}
   </>
  )
}

export default Navbar