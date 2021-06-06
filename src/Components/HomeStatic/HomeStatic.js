import React from 'react'
import { useState } from 'react'
import AuthContextProvider from '../../Context/AuthModalContext'
import AuthDialog from './AuthDialog'

export default function HomeStatic() {

    const [authModalOpen,setAuthModalOpen] = useState(false);

    let CloseAuthModal = () => {
        setAuthModalOpen(false);
    }

    return (
        <div className="position-relative" style={{width: "100vw",height: "100vh"}}>
            <button onClick={() => setAuthModalOpen(true)} className="position-absolute top-50" style={{left: "50%", transform: "translate(-50%,-50%)"}}>Login</button>
            {authModalOpen && <AuthContextProvider><AuthDialog CloseAuthModal={CloseAuthModal} /></AuthContextProvider>}
        </div>
    )
}
