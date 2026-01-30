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
        <section id="services">
        <Services />
      </section>
      <section id="join-network"> 
        <JoinOurNetwork/>
        </section>
              <section id="reviews">
        <Review />
      </section>  
       <section id="contact">
        <ContactUs />
      </section>
        <Footer/>
    </div>
  )
}

export default page