import React from 'react'
import Container from './Container'
import logo from '../../images/logo.png'
import Image from 'next/image'
const Header = () => {
  return (
   <section className='py-5'>
    <Container>
        <div className='flex items-center justify-between'>
            <div>
               <Image src={logo} alt="logo" />
            </div>
            <div>
                <ul className='flex cursor-pointer  items-center font-outfit gap-10 text-xl font-semibold text-[#333333]'>
                    <li>Home</li>
                    <li>Services</li>
                    <li>Contract</li>
                    <li>Login</li>
                    
                <button className=' cursor-pointer border-2 bg-[#00C0E8] px-6 py-2 rounded-md text-white text-xl font-outfit font-medium hover:bg-white hover:text-[#00C0E8] hover:border-[#00C0E8]'>Sign Up</button>
                </ul>
            </div>
        </div>
    </Container>
   </section>
  )
}

export default Header