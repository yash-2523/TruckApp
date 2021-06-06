import { Button } from '@material-ui/core'
import React from 'react'
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css'
import { useState } from 'react';
import { useContext } from 'react';
import { AuthModalContext } from '../../Context/AuthModalContext';
import { Link } from 'react-router-dom';
import { SetOtp } from '../../Services/AuthServices';

export default function SignInOTP1() {

    const [phoneNo,setPhoneNo] = useState("")
    const { AuthMethod , SignInStage , SignUpStage, SignInData } = useContext(AuthModalContext);
    const [signInStage,setSignInStage] = SignInStage;
    const [signInData,setSignInData] = SignInData;

    function handleOnChange(value, data, event, formattedValue) {
        setPhoneNo(formattedValue.trim());
    }

    let HandleSubmit = async(e) => {
        e.preventDefault();
        
        
        let SetOpt = await SetOtp(phoneNo);
        if(SetOpt.status !== 200){
          // show Error
          console.log(SetOpt);
          return
        }
        setSignInData({
            phoneNumber: phoneNo
        })
        setSignInStage(2)
    }  

    return (
        <div className="mt-4 px-3 py-5">
            <form onSubmit={(e) => HandleSubmit(e)} className="d-flex flex-column align-items-center">

                <PhoneInput
                  onChange={(value,data,event,formattedValue) => handleOnChange(value,data,event,formattedValue)}  
                  inputStyle={{width: '100%'}}
                />

                <Button variant="contained" color="primary" className="my-3 mx-auto" type="submit">Request OTP</Button>
            </form>   

            <p className="text-center text-secondary">Or</p>

            <Link><p className="text-center text-primary" onClick={() => setSignInStage(0)}>Sign In with Email and Password</p></Link> 
        </div>
    )
}
