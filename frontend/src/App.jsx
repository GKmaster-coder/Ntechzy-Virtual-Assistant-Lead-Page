import React from 'react'
import Header from './components/Header'
import InteractiveChat2 from './components/InteractiveChat2'
import { Toaster } from "react-hot-toast";
import { Helmet } from 'react-helmet-async';

const App = () => {
  return (
    <>
      <Helmet>
        <title>AFFF Foam Cancer Lawsuit – Check Eligibility</title>
        <meta
          name="description"
          content="Find out if you qualify for the AFFF foam cancer lawsuit. Firefighters, military, and airport workers exposed to firefighting foam may be eligible for compensation. Check your eligibility today."
        />
        <meta
          name="keywords"
          content="AFFF foam cancer lawsuit, firefighting foam cancer claims, AFFF cancer lawyer, AFFF compensation claims, AFFF foam lawsuit firefighters"
        />
        <link rel="canonical" href="https://www.mycollege.com/afff-lawsuit" />
      </Helmet>

      <Header />
      <div
        className="p-10 h-[90vh] flex items-center justify-center bg-gray-50"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?auto=format&fit=crop&w=1350&q=80')",
          backgroundSize: 'cover',
        }}
      >
        <div className='h-[70vh] w-2xl'>
          <InteractiveChat2 />
        </div>
      </div>
      <Toaster position="top-right" reverseOrder={false} />
    </>
  )
}

export default App
