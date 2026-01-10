import React from 'react'
import Container from './common/Container'

const Banner = () => {
  return (
    <section className='py-10 mt-20'>
        <Container>
            <div>
                <h1 className='text-8xl w-[700px] font-sirin-stencil font-medium'>Your Complete <br /><span className='font-rubik-maps text-8xl text-[#00C0E8] leading-16 tracking-[0.25]'>Event</span> <br />Solution Platform</h1>
                <p className='text-2xl font-semibold font-outfit w-[600px] mt-10'>Connect with the best event professionals in one place we have everything you need for your perfect event</p>

                <div className='mt-10'>

                  <button className=' cursor-pointer border-2 bg-[#00C0E8] px-6 py-3 rounded-md text-white text-xl font-outfit font-medium hover:bg-white hover:text-[#00C0E8] hover:border-[#00C0E8]'>Explore Services </button>

                    <button className=' ml-10 cursor-pointer border-2 border-[#00C0E8] px-6 py-3 rounded-md text-[#00C0E8] text-xl font-outfit font-medium hover:bg-[#00C0E8] hover:text-white hover:border-[#00C0E8]'>Join as Vendor</button>
                </div>

            </div>
        </Container>
    </section>
  )
}

export default Banner