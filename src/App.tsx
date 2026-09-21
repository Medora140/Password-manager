import { useState } from 'react'
import './scss/main.scss'
import Navbar from './components/Navbar'

import Footer from './components/Footer'
import Manager from './components/Manager'
function App() {
  return (
    <>
    <div className='body'>
      <Navbar/>
      <Manager/>
    </div>
    <Footer/>
    </>
  )
}

export default App
