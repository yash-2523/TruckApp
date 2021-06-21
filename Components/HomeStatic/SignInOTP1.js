import { Button } from '@material-ui/core';
import { useContext, useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';
import { toast } from 'react-toastify';
import { AuthModalContext } from '../../Context/AuthModalContext';
import { GlobalLoadingContext } from '../../Context/GlobalLoadingContext';
import { SetOtp } from '../../Services/AuthServices';

export default function SignInOTP1() {

    const [phoneNo,setPhoneNo] = useState("")
    const { SignInStage, SignInData } = useContext(AuthModalContext);
    const [signInStage,setSignInStage] = SignInStage;
    const [signInData,setSignInData] = SignInData;
    const {setGlobalLoading} = useContext(GlobalLoadingContext)

    function handleOnChange(value, data, event, formattedValue) {
        setPhoneNo(formattedValue.replace(/\s/g,'').replace('-',''));
    }

    let HandleSubmit = (e) => {
        e.preventDefault();
        
        if(phoneNo.length !== 13){
            toast.error("Invalid Phone Number")
            return
        }
        setGlobalLoading(true);
        SetOtp(phoneNo).then((SetOtpResponse) => {
            setGlobalLoading(false)
            if(SetOtpResponse.status !== 200){
            toast.error("Unable to Send Otp");  
            return
            }
            setSignInData({
                phoneNumber: phoneNo
            })
            setSignInStage(1)
        }).catch(err => {
            setGlobalLoading(false);
            toast.error("Unable to Send OTP")
            return
        });
        
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
        </div>
    )
}
