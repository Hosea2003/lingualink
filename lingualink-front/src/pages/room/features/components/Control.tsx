import React, { useState } from 'react'

function Control({image_work, image_no_work}:{
    image_work:string, image_no_work:string
}) {
    const [work, setWork]=useState(true)
  return (
    <button className='control-btn'>
        <img src={work?image_work:image_no_work} alt="" />
    </button>
  )
}

export default Control