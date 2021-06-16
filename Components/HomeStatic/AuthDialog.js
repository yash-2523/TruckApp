import Image from 'next/image'
import { Cancel, } from '@material-ui/icons'
import { useEffect } from 'react'
import { useContext } from 'react'
import { AuthModalContext } from '../../Context/AuthModalContext'
import SignInOTP1 from './SignInOTP1'
import SignInOTP2 from './SignInOTP2'
import SignUpPage1 from './SignUpPage1'
import styles from '../../styles/HomeStatic.module.scss'

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
        const mainContainer = document.querySelector('#auth-main-container');
        const mainContainerImages = document.querySelectorAll('#auth-main-container > div > img');
        // if(window.innerWidth > "830"){
        //     mainContainer.style.transform = "scale(1)";

        //     for(let i=0;i<mainContainerImages.length;i++){
        //         if(mainContainerImages[i].tagName == "IMG"){
        //             mainContainerImages[i].style.transform = "scale(1)";
        //             mainContainerImages[i].style.transformOrigin = "none";
        //         }
        //     }
        // }
        // else{
            // mainContainer.style.transform = `scale(${window.innerWidth / parseInt(800)})`;
            // for(let i=0;i<mainContainerImages.length;i++){
            //     if(mainContainerImages[i].tagName == "IMG"){
            //         mainContainerImages[i].style.transform = `scale(${window.innerWidth / parseInt(800)})`;
            //         mainContainerImages[i].style.transformOrigin = "20% 0%";
            //     }
            // }
        // }

        let horizontalScaling, verticalScaling;

        if(window.innerWidth > "830"){
            horizontalScaling = 1;
        }else{
            horizontalScaling = window.innerWidth / parseInt(800)
        }

        if(window.innerHeight > "630"){
            verticalScaling = 1;
        }else{
            verticalScaling = window.innerHeight / parseInt(600)
        }

        mainContainer.style.transform = `scale(${Math.min(verticalScaling,horizontalScaling)})`;
        for(let i=0;i<mainContainerImages.length;i++){
            if(mainContainerImages[i].tagName == "IMG"){
                mainContainerImages[i].style.transform = `scale(${Math.min(verticalScaling,horizontalScaling)})`;
                mainContainerImages[i].style.transformOrigin = "20% 0%";
            }
        }

    }

    return (
        <div className={styles['auth-modal']}> 
             <div className={`${styles['main-container']}`} id="auth-main-container">
                
                <div className={`col-6 ${styles['auth-intro']}`}>
                    <img src="/truckApp_logo_transparent.png" className="px-3 mt-5"></img>
                    <p className="mx-4 mt-5 text-light text-bold text-center">Start your Journey with India’s best app for tranporters</p>
                    <img src="/devices.png" className="mt-5 mx-2"></img>
                </div>
                <div className="col-6 bg-light">
                    {Component[signInStage]}
                </div>
                <Cancel onClick={props.CloseAuthModal} className={`position-absolute ${styles['close-btn']}`} />
             </div>

        </div>
    )
}
