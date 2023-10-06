import React, { useEffect, useRef, useState } from 'react'
import Navbar from '../components/Navbar'
import { Outlet } from 'react-router-dom'

function RouteWithNav() {

  return (
    <div>
        <Navbar/>
        <div className="bottom">
          <Outlet />
        </div>
    </div>
  )
}

export default RouteWithNav