
import { Button } from '@material-ui/core';
import { KeyboardBackspaceOutlined } from '@material-ui/icons';
import 'crypto-js/lib-typedarrays';
import { useContext, useEffect, useState } from 'react';
import OtpInput from 'react-otp-input';
import { toast } from 'react-toastify';
import { AuthModalContext } from '../../Context/AuthModalContext';
import { GlobalLoadingContext } from '../../Context/GlobalLoadingContext';
import { SetOtp, SignInWithPhoneNoAndOtp } from '../../Services/AuthServices';
import styles from '../../styles/HomeStatic.module.scss';

export default function SignInOTP2() {

    const [OTP,setOTP] = useState("");
    const { SignInStage,  SignInData } = useContext(AuthModalContext);
    const [signInStage,setSignInStage] = SignInStage;
    const [signInData,setSignInData] = SignInData;
    const [resend,setResend] = useState(false);

    const {setGlobalLoading} = useContext(GlobalLoadingContext)

    useEffect(() => {
        setTimeout(() => {
            setResend(true);
        },1000*60)

        return () => {
            clearTimeout()
        }
    },[])

    let HandleSubmit = async (e) => {
        e.preventDefault();
        let pass = `TA${OTP}`;
        let username = signInData.phoneNumber;
        setGlobalLoading(true);
        let SignInResponse = await SignInWithPhoneNoAndOtp(username,pass);
        setGlobalLoading(false);
        if(!SignInResponse){
            toast.error("Unable to Verify")
            return
        }
        if(!SignInResponse.isExistingUser){
            setSignInStage(2);
        }
    }

    let ResendOtp = async () => {
        setGlobalLoading(true);
        let SetOpt = await SetOtp(signInData.phoneNumber);
        setGlobalLoading(false)
        if(SetOpt.status !== 200){
          toast.error("Unable to Send Otp");  
          return
        }
        setResend(false);
        setTimeout(() => {
            setResend(true);
        },1000*60)
    }

    return (
        <>
        <Button onClick={() => setSignInStage(0)} className="mt-3 ml-2" startIcon={<KeyboardBackspaceOutlined />} color="default">Back</Button>
        <div className={`mt-4 px-3 py-5 ${styles['otp-verification-container']}`}>

            <h3>Phone Verification</h3>
            <p className="mt-3">We have sent a confirmation code you should get it soon.</p>
            <p className="mt-3"> Send To: {signInData.phoneNumber}</p>
            <form onSubmit={(e) => HandleSubmit(e)} className="mt-4 d-flex flex-column align-items-center">                            
                <OtpInput 
                    numInputs={4}
                    className={`${styles['otp-box']}`}
                    value={OTP}
                    onChange={setOTP}
                />
                <div className="align-self-start d-flex align-items-center px-4 mt-3">
                    <p className="mx-2">I dont’t recived a code </p> <Button disabled={!resend} onClick={ResendOtp} color="primary">Resend</Button>
                    
                </div>
                <Button variant="contained" color="primary" disabled={OTP.length !== 4} className="my-3 mx-auto" type="submit">Send OTP</Button>
            </form> 
        </div>
        </>
    )
}
