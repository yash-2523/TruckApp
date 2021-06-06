import { BehaviorSubject } from "rxjs";
import {Auth, Api} from 'aws-amplify'
import 'crypto-js/lib-typedarrays'

const curerntUser = new BehaviorSubject(null);

async function SetOtp(phone_number){
    return fetch('https://2hhp6ajw7b.execute-api.ap-south-1.amazonaws.com/prod/send_otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number : phone_number })
    })
}

async function SignInWithPhoneNoAndOtp(phone_number,otp){
    // console.log(phone_number,otp)
    return await Auth.signIn(phone_number,otp)
}

export { curerntUser, SetOtp, SignInWithPhoneNoAndOtp }