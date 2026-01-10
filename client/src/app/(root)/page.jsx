import Banner from '@/components/Banner'
import ContactUs from '@/components/common/ContactUs'
import Footer from '@/components/Footer'
import JoinOurNetwork from '@/components/JoinOurNetwork'
import Review from '@/components/Review'
import Services from '@/components/Services'
import React from 'react'

const page = () => {
  return (
    <div>
        <Banner/>
        <Services/>
        <JoinOurNetwork/>
        <Review/>
        <ContactUs/>
        <Footer/>
    </div>
  )
}

export default page