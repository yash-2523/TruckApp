import { Button } from '@material-ui/core';
import { KeyboardBackspaceOutlined } from '@material-ui/icons';
import React from 'react'
import OtpInput from 'react-otp-input';
import { useState } from 'react';
import { useContext } from 'react';
import { AuthModalContext } from '../../Context/AuthModalContext';

export default function SignUpPage2() {

    const [OTP,setOTP] = useState("");
    const { AuthMethod , SignInStage , SignUpStage, SignUpData } = useContext(AuthModalContext);
    const [signUpStage,setSignUpStage] = SignUpStage;
    const [signUpData,setSignUpData] = SignUpData;

    let HandleSubmit = (e) => {
        e.preventDefault();
        console.log(OTP)
    }

    return (
        <>
        <Button onClick={() => setSignUpStage(0)} className="mt-3 ml-2" startIcon={<KeyboardBackspaceOutlined />} color="default">Back</Button>
        <div className="mt-4 px-3 py-5 opt-verification-container">

            <h3>Phone Verification</h3>
            <p className="mt-3">We have sent a confirmation code you should get it soon.</p>
            <p className="mt-3"> Send To: {signUpData.phoneNumber}</p>
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
