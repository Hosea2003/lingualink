import React from 'react'
import { Link } from 'react-router-dom'
import '../../../assets/css/room-home.css'
import CreatedRoom from './components/CreatedRoom'

function RoomHome() {
  return (
    <div className="room-page">
        <div className='room-home'>
        <div className="room-card create">
            <p className="text">
                Organise your meeting and conference and add
                multilanguage feature. Lingualink is here for that;
            </p>
            <Link to={'create'} className='action'>Create conference</Link>
        </div>
        <div className="room-card manage">
            <p className="text">
                You have organised meetings? You can manage your existing meeting 
                and conference.
            </p>
            <Link to={''} className='action'>Manage</Link>
        </div>
        <div className="room-card join">
            <p className="text">
                Join a meeting and choose the translation you want.
            </p>
            <Link to={'join'} className='action'>Join</Link>
        </div>
    </div>
    <CreatedRoom/>
    </div>
  )
}

export default RoomHome