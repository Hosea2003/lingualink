import React from 'react'
import CreateRoom from './CreateRoom'
import LanguageProvider from './hooks/useLanguage'
import InviteProvider from './hooks/useInvite'

function CreaterRoomWrapper() {
  return (
    <React.Fragment>
        <LanguageProvider>
            <InviteProvider>
                <CreateRoom/>
            </InviteProvider>
        </LanguageProvider>
    </React.Fragment>
  )
}

export default CreaterRoomWrapper