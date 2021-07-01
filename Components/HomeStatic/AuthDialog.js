import { Cancel } from '@material-ui/icons'
import { useContext, useEffect } from 'react'
import { AuthModalContext } from '../../Context/AuthModalContext'
import styles from '../../styles/HomeStatic.module.scss'
import SignInOTP1 from './SignInOTP1'
import SignInOTP2 from './SignInOTP2'
import SignUpPage1 from './SignUpPage1';

export default function AuthDialog(props) {


    const { SignInStage } = useContext(AuthModalContext)
    const [signInStage, setSignInStage] = SignInStage;

    const Component = [

        <SignInOTP1 styles={styles} />,
        <SignInOTP2 styles={styles} />,
        <SignUpPage1 styles={styles} />

    ]



    useEffect(() => {
        ChangeScaling()
        window.addEventListener('resize', ChangeScaling)

        return () => {
            window.removeEventListener('resize', ChangeScaling)
        }
    }, [])

    let ChangeScaling = () => {
        const mainContainer = document.querySelector('#auth-main-container');
        const mainContainerImages = document.querySelectorAll('#auth-main-container > div > img');

        let horizontalScaling, verticalScaling;

        if (window.innerWidth > "830") {
            horizontalScaling = 1;
        } else {
            horizontalScaling = window.innerWidth / parseInt(800)
        }

        if (window.innerHeight > "630") {
            verticalScaling = 1;
        } else {
            verticalScaling = window.innerHeight / parseInt(600)
        }

        mainContainer.style.transform = `scale(${Math.min(verticalScaling, horizontalScaling)})`;
        for (let i = 0; i < mainContainerImages.length; i++) {
            if (mainContainerImages[i].tagName == "IMG") {
                mainContainerImages[i].style.transform = `scale(${Math.min(verticalScaling, horizontalScaling)})`;
                mainContainerImages[i].style.transformOrigin = "20% 0%";
            }
        }

    }

    return (
        <div className={styles['auth-modal']}>
            <div className={`${styles['main-container']}`} id="auth-main-container">

                <div className={`col-6 ${styles['auth-intro']}`}>
                    <img src="/truckApp_logo_transparent.png" className="px-3 mt-5"></img>
                    <p className="mx-4 mt-5 text-light text-bold text-center">Start your Journey with India’s best app for transporters</p>
                    <img src="/devices.png" className="mt-5 mx-2"></img>
                </div>
                <div className={`col-6 ${styles['auth-form']}`}>
                    {Component[signInStage]}
                </div>
                <Cancel onClick={props.CloseAuthModal} className={`position-absolute ${styles['close-btn']}`} />
            </div>

        </div>
    )
}
