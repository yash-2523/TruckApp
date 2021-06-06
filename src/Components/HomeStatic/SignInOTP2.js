import Auth from '@aws-amplify/auth';
import { Button } from '@material-ui/core';
import { KeyboardBackspaceOutlined } from '@material-ui/icons';
import React from 'react'
import { useContext } from 'react';
import { useState } from 'react';
import OtpInput from 'react-otp-input';
import { AuthModalContext } from '../../Context/AuthModalContext';
import { SignInWithPhoneNoAndOtp } from '../../Services/AuthServices';
import './style.scss'
import 'crypto-js/lib-typedarrays'

export default function SignInOTP2() {

    const [OTP,setOTP] = useState("");
    const { AuthMethod , SignInStage , SignUpStage, SignInData } = useContext(AuthModalContext);
    const [signInStage,setSignInStage] = SignInStage;
    const [signInData,setSignInData] = SignInData;

    let HandleSubmit = async (e) => {
        e.preventDefault();
        let pass = `TA${OTP}`;
        console.log(pass)
        let SignInResponse = await Auth.signIn(signInData.phoneNumber.replace(/\s/g,'').replace('-',''),pass)
        console.log(SignInResponse);
    }

    return (
        <>
        <Button onClick={() => setSignInStage(1)} className="mt-3 ml-2" startIcon={<KeyboardBackspaceOutlined />} color="default">Back</Button>
        <div className="mt-4 px-3 py-5 opt-verification-container">

            <h3>Phone Verification</h3>
            <p className="mt-3">We have sent a confirmation code you should get it soon.</p>
            <p className="mt-3"> Send To: {signInData.phoneNumber}</p>
            <form onSubmit={(e) => HandleSubmit(e)} className="mt-4 d-flex flex-column align-items-center">                            
                <OtpInput 
                    numInputs={4}
                    className="opt-box"
                    value={OTP}
                    onChange={setOTP}
                />
                <div className="align-self-start d-flex align-items-center px-4 mt-3">
                    <p className="mx-2">I dont’t recived a code </p> <span className="text-primary">Resend</span>
                    
                </div>
                <Button variant="contained" color="primary" disabled={OTP.length !== 4} className="my-3 mx-auto" type="submit">Send OTP</Button>
            </form> 
        </div>
        </>
    )
}
