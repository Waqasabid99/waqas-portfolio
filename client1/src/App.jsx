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
import HireForm from './components/hero/HireForm'
import api from './api/api'
import SEO from './hooks/SEO'
import { ChatWidget } from "ai-chat-interface"

const App = () => {

  const [messages, setMessages] = useState(() => {
    const stored = localStorage.getItem('messages')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        return parsed.map((m) => ({
          ...m,
          timestamp: new Date(m.timestamp),
        }))
      } catch {
        return []
      }
    }
    return []
  })

  // Debounce the localStorage write to throttle I/O
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('messages', JSON.stringify(messages))
    }, 500)
    return () => clearTimeout(timer)
  }, [messages])

  const handleMessage = async (message, _history) => {
    const body = {
      model: "qwen3.5:0.8b",
      messages: [
        {
          role: "user",
          content: message
        },
      ],
      think: false,
      stream: true
    }

    const response = await fetch(`http://localhost:11434/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      const text = await response.text()
      throw new Error(`Chat API error: ${response.status} ${response.statusText} - ${text}`)
    }

    if (!response.body) {
      throw new Error('Streaming response body is not available.')
    }

    return response.body
  }

  const helpArticles = [
    {
      title: "How to create an account",
      content: "To create an account, please visit our website and click on the 'Sign Up' button. Follow the registration process to create your account.",
      url: "https://google.com"
    },
    {
      title: "Explain me about your product",
      content: "Our product is a comprehensive solution that helps businesses to streamline their workflow and improve their productivity. It is a user-friendly interface that allows users to manage their tasks, projects, and teams in one place. It also provides real-time analytics and reporting to help businesses make informed decisions.",
      url: "https://google.com"
    },
    {
      title: "Do you offer a free trial?",
      content: "Yes, we offer a free trial for 14 days. You can sign up for a free trial on our website.",
      url: "https://google.com"
    },
    {
      title: "What are the pricing plans?",
      content: "Our pricing plans are as follows: \n - Basic: $10/month \n - Pro: $20/month \n - Enterprise: $30/month",
      url: "https://google.com"
    },
    {
      title: "What are the payment methods?",
      content: "Our payment methods are as follows: \n - Credit Card \n - Debit Card \n - PayPal \n - Bank Transfer",
      url: "https://google.com"
    },
    {
      title: "What is your return policy?",
      content: "Our return policy is simple. You can return any item within 30 days of purchase. The item must be in its original condition and packaging.",
      url: "https://google.com"
    },
    {
      title: "What is your refund policy?",
      content: "Our refund policy is simple. You can get a refund for any item within 30 days of purchase. The item must be in its original condition and packaging.",
      url: "https://google.com"
    }
  ]

  const [apiData, setApiData] = useState('')
  useEffect(() => {
    api.get("/").then((response) => {
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
      "https://wa.me/923208703508?text=Hi%2C%20I%20came%20across%20your%20profile%20through%20waser.online%20and%20I'm%20interested%20in%20discussing%20a%20project%20with%20you",
      "_blank"
    );
  };

  return (
    <>
      <SEO
        title={"Waqas Ali Abid || Portfolio"}
        description={"Portfolio of Waqas Ali Abid"}
        keywords={"Waqas Ali Abid, Portfolio"}
        image={''}
        url={''}
        type={'website'}
      />
      {/* <h1>{apiData}</h1> */}
      {!showHireForm && !showContactForm && (
        <>
          <Navbar onWhatsClick={handleWhatsappBtn} />
          <Hero onHireClick={onHireClick} onWhatsClick={handleWhatsappBtn} />
          <ServMarquee />
          <Services />
          <About />
          <Portfolio />
          <Footer onContactClick={onContactClick} onWhatsClick={handleWhatsappBtn} />
          <ScrollToTop />
          <ChatWidget messages={messages} onMessage={handleMessage} theme='light' showHistory={true} helpArticles={helpArticles} showHelpArticles={true} />
        </>

      )}

      {showHireForm && (
        <>
          <Navbar onWhatsClick={handleWhatsappBtn} />
          <HireForm onCloseClick={onCloseClick} />
          <Footer onContactClick={onContactClick} onWhatsClick={handleWhatsappBtn} />
        </>
      )}

      {showContactForm && (
        <>
          <Navbar onWhatsClick={handleWhatsappBtn} />
          <ContactForm onCloseClick={onCloseClick} />
          {/* <Footer onContactClick = {onContactClick} /> */}
        </>
      )}
    </>
  )
}

export default App
