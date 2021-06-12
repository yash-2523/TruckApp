
import { Cancel, } from '@material-ui/icons'
import React from 'react'
import { useEffect } from 'react'
import { useContext } from 'react'
import { AuthModalContext } from '../../Context/AuthModalContext'
import SignInOTP1 from './SignInOTP1'
import SignInOTP2 from './SignInOTP2'
import SignUpPage1 from './SignUpPage1'
import './style.scss'

export default function AuthDialog(props) {


    const { SignInStage } = useContext(AuthModalContext)
    const [signInStage,setSignInStage] = SignInStage;

    const Component = [
        
            <SignInOTP1 />,
            <SignInOTP2 />,
            <SignUpPage1 />
        
    ]



    useEffect(() => {
        ChangeScaling()
        window.addEventListener('resize',ChangeScaling)

        return () => {
            window.removeEventListener('resize', ChangeScaling)
        }
    },[])

    let ChangeScaling = () => {
        const mainContainer = document.querySelector('.auth-modal > .main-container');
        const mainContainerImages = document.querySelectorAll('.auth-modal > .main-container > div > img')
        if(window.innerWidth > "830"){
            mainContainer.style.transform = "scale(1)";

            for(let i=0;i<mainContainerImages.length;i++){
                if(mainContainerImages[i].tagName == "IMG"){
                    mainContainerImages[i].style.transform = "scale(1)";
                    mainContainerImages[i].style.transformOrigin = "none";
                }
            }
        }
        else{
            mainContainer.style.transform = `scale(${window.innerWidth / parseInt(800)})`;
            for(let i=0;i<mainContainerImages.length;i++){
                if(mainContainerImages[i].tagName == "IMG"){
                    mainContainerImages[i].style.transform = `scale(${window.innerWidth / parseInt(800)})`;
                    mainContainerImages[i].style.transformOrigin = "20% 0%";
                }
            }
        }
    }

    return (
        <div className="auth-modal"> 
             <div className="main-container">
                
                <div className="col-6 auth-intro">
                    <img src="assets/truckApp_logo_transparent.png" className="px-3 mt-5"></img>
                    <p className="mx-4 mt-5 text-light text-bold text-center">Start your Journey with India’s best app for tranporters</p>
                    <img src="assets/devices.png" className="mt-5 mx-2"></img>
                </div>
                <div className="col-6 bg-light">
                    {Component[signInStage]}
                </div>
                <Cancel onClick={props.CloseAuthModal} className="position-absolute close-btn" />
             </div>

        </div>
    )
}
