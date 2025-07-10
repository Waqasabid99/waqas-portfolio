import React, { useEffect, useState } from 'react'
import Hero from './components/hero/Hero'
import ServMarquee from './components/hero/ServMarquee'
import Navbar from './components/navigation/Navbar'
import Footer from './components/navigation/Footer'
import ContactForm from './components/navigation/ContactForm'
import ScrollToTop from './components/navigation/ScrollToTop'
import About from './components/sections/About'
import Portfolio from './components/sections/Portfolio'
import Services from './components/sections/Services'
import axios, { Axios } from 'axios'
import HireForm from './components/hero/HireForm'

const App = () => {
const [apiData, setApiData] = useState('')
  useEffect(() => {
    axios.get("https://waqas-portfolio-qlpx.onrender.com/").then((response)=>{
      setApiData(response.data)
    })
  
  }, [])
  

 const [showHireForm, setShowHireForm] = useState(false);
 const [showContactForm, setShowContactForm] = useState(false);

  const onHireClick = () => {
    setShowHireForm(true);
    setShowContactForm(false); 
  };

  const onCloseClick = () => {
    setShowHireForm(false);
    setShowContactForm(false);
  };

  const onContactClick = () => {
    setShowHireForm(false);
    setShowContactForm(true);
  };

  const handleWhatsappBtn = () => {
    window.open(
      "https://wa.me/923208703508?text=Hi%2C%20I%20came%20across%20your%20profile%20through%20Waqasabidwork.online%20and%20I'm%20interested%20in%20discussing%20a%20project%20with%20you",
      "_blank"
    );
  };

  return (
    <>
    {/* <h1>{apiData}</h1> */}
      {!showHireForm && !showContactForm &&(
        <>
          <Navbar onWhatsClick = {handleWhatsappBtn} />
          <Hero onHireClick={onHireClick} onWhatsClick = {handleWhatsappBtn} />
          <ServMarquee />
          <Services />
          <About />
          <Portfolio />
          <Footer onContactClick = {onContactClick} onWhatsClick = {handleWhatsappBtn} />
          <ScrollToTop />
        </>

      )}

      {showHireForm && (
        <>
        <Navbar onWhatsClick = {handleWhatsappBtn}/>
        <HireForm onCloseClick = {onCloseClick} />
        <Footer onContactClick = {onContactClick} onWhatsClick = {handleWhatsappBtn}/>
        </>
      )}

      {showContactForm &&(
        <>
        <Navbar onWhatsClick = {handleWhatsappBtn} />
        <ContactForm onCloseClick = {onCloseClick} />
        {/* <Footer onContactClick = {onContactClick} /> */}
        </>
      )}
    </>
  )
}

export default App
