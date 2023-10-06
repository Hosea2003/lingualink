import Peer from 'peerjs'
import React, { useEffect, useRef, useState } from 'react'
import Control from './Control'

function AudioComponent({stream}:{stream?:MediaStream}) {

  const audioRef = useRef<HTMLVideoElement>(null)

  useEffect(()=>{

    if(audioRef.current && stream){
        audioRef.current.srcObject=stream
    }

  }, [stream])

  return (
    <div className='audio-component'>
      <video ref={audioRef} autoPlay
           className='video-container'/>

      {/* controls */}
      <div className="controls">
          <Control image_no_work={require('../../../../assets/images/icons8_mute_unmute_64px.png')}
          image_work={require('../../../../assets/images/icons8_microphone_64px.png')}/>

          <Control image_no_work={require('../../../../assets/images/icons8_camera_52px.png')}
          image_work={require('../../../../assets/images/icons8_no_camera_52px.png')}/>

          <button className="control-btn stop">
            <img src={require('../../../../assets/images/icons8_stop_52px.png')} alt="" />
          </button>
      </div>
    </div>
  )
}

export default AudioComponent