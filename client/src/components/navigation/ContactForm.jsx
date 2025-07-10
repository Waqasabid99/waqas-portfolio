import React, { useState } from 'react';
import axios from 'axios'


const ContactForm = (props) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        'https://waqas-portfolio-qlpx.onrender.com/contact',
        formData,
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        alert('Message sent!');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        alert('Failed to send message.');
      }
    } catch (error) {
      alert('Failed to send message.');
    }
  };

  return (
    <div id="contact" className="w-full bg-[#f8f9fb] py-12 px-6 md:px-20">
      <div className="max-w-screen-md mx-auto bg-white rounded-lg shadow-md p-8 border border-gray-100">
        <div className='flex justify-between items-start'>
        <h2 className="text-2xl font-bold text-[#1365ff] mb-6">Contact Me</h2>
        <button
        onClick={props.onCloseClick}
        className=" text-white bg-red-500 p-1 rounded-sm hover:text-[#e2e6ea55]"
      >
        Close
      </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              name="name"
              type="text"
              placeholder="Your Name"
              required
              value={formData.name}
              onChange={handleChange}
              className="border px-4 py-2 rounded-md"
            />
            <input
              name="email"
              type="email"
              placeholder="Your Email"
              required
              value={formData.email}
              onChange={handleChange}
              className="border px-4 py-2 rounded-md"
            />
          </div>

          <input
            name="subject"
            type="text"
            placeholder="Subject"
            required
            value={formData.subject}
            onChange={handleChange}
            className="border px-4 py-2 rounded-md w-full"
          />

          <textarea
            name="message"
            placeholder="Your Message"
            rows="5"
            required
            value={formData.message}
            onChange={handleChange}
            className="border px-4 py-2 rounded-md w-full"
          />

          <button
            type="submit"
            className="bg-[#1365ff] text-white px-6 py-2 rounded-full hover:bg-white hover:text-[#1365ff] border border-[#1365ff] transition"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;