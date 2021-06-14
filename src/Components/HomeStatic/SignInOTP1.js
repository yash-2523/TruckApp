import { Button } from '@material-ui/core'
import React from 'react'
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css'
import { useState } from 'react';
import { useContext } from 'react';
import { AuthModalContext } from '../../Context/AuthModalContext';
import { Link } from 'react-router-dom';
import { SetOtp } from '../../Services/AuthServices';
import { toast, } from 'react-toastify';
import { GlobalLoadingContext } from '../../Context/GlobalLoadingContext';


export default function SignInOTP1() {

    const [phoneNo,setPhoneNo] = useState("")
    const { SignInStage, SignInData } = useContext(AuthModalContext);
    const [signInStage,setSignInStage] = SignInStage;
    const [signInData,setSignInData] = SignInData;
    const {setGlobalLoading} = useContext(GlobalLoadingContext)
    function handleOnChange(value, data, event, formattedValue) {
        setPhoneNo(formattedValue.replace(/\s/g,'').replace('-',''));
    }

    let HandleSubmit = async(e) => {
        e.preventDefault();
        if(phoneNo.length !== 13){
            toast.error("Invalid Phone Number")
            return
        }
        setGlobalLoading(true);
        let SetOpt = await SetOtp(phoneNo);
        setGlobalLoading(false)
        if(SetOpt.status !== 200){
          toast.error("Unable to Send Otp");  
          return
        }
        setSignInData({
            phoneNumber: phoneNo
        })
        setSignInStage(1)
    }  

    return (
        <div className="mt-4 px-3 py-5">
            <p className="text-secondary">Hello, nice to meet you</p>   
            <h4 className="mt-1 mb-5">Get moving with Truckapp.Ai</h4>
            <form onSubmit={(e) => HandleSubmit(e)} className="d-flex flex-column align-items-center">
                <PhoneInput
                  onlyCountries={["in"]}  
                  country={"in"}
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
