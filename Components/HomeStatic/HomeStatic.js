
import { useContext, useState } from 'react'
import AuthContextProvider from '../../Context/AuthModalContext'
import { GlobalLoadingContext } from '../../Context/GlobalLoadingContext';
import AuthDialog from './AuthDialog'
import GlobalLoader from '../GlobalLoader'

export default function HomeStatic() {

    const [authModalOpen,setAuthModalOpen] = useState(false);
    const {globalLoading} = useContext(GlobalLoadingContext)
    let CloseAuthModal = () => {
        setAuthModalOpen(false);
    }

    return (
        <>

            {globalLoading && <GlobalLoader />}

            <div className="position-relative" style={{width: "100vw",height: "100vh"}}>
                <button onClick={() => setAuthModalOpen(true)} className="position-absolute top-50" style={{left: "50%", transform: "translate(-50%,-50%)"}}>Login</button>
                {authModalOpen && <AuthContextProvider><AuthDialog CloseAuthModal={CloseAuthModal} /></AuthContextProvider>}
            </div>
        </>
    )
}
