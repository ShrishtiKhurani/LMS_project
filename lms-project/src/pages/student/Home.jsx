import React from 'react'
import Hero from '../../components/student/Hero'
import Companies from '../../components/student/Companies'
import CourseSection from '../../components/student/CourseSection'
import TestieMonialsSection from '../../components/student/TestieMonialsSection'
import CallToAction from '../../components/student/CallToAction'
import Footer from '../../components/student/Footer'
import CoursesDetails from './CoursesDetails'

const Home = () => {
  return (
    <div className='flex flex-col items-center space-y-7 text-center'>
      <Hero/>
      <Companies/>
      <CourseSection/>
      <TestieMonialsSection/>
      <CallToAction/>
      <Footer/>
      <CoursesDetails/>
      
      
      
    </div>
  )
}

export default Home
