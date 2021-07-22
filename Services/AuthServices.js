import { BehaviorSubject } from 'rxjs';
import { Auth, API } from 'aws-amplify'
import 'crypto-js/lib-typedarrays'

const currentUser = new BehaviorSubject("loading");


async function SetOtp(phone_number) {
    return fetch('https://2hhp6ajw7b.execute-api.ap-south-1.amazonaws.com/prod/send_otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: phone_number })
    })
}

async function SignInWithPhoneNoAndOtp(phone_number, otp) {

    try {
        let signInResponse = await Auth.signIn(phone_number, otp);


        try {

            let userDetails = await API.post('backend', '/get_user_details', {});;
            if (userDetails.isExistingUser) {
                currentUser.next(userDetails);
            }
            return userDetails;
        }
        catch (err) {
            return false;
        }
    }
    catch (err) {
        return false;
    }

}

async function getUser() {
    try {

        let userCredentials = await Auth.currentCredentials();
        try {
            let res = await API.post('backend', '/get_user_details', {});
            if (res.isExistingUser) {
                currentUser.next({ ...res, ...userCredentials });
            }
            else {
                currentUser.next(null);
            }
        } catch (err) {
            currentUser.next(null)
        }
    } catch (err) {
        currentUser.next(null);
    }
}

async function CreateUser(name, phone, role, email) {


    let params = {
        "business_name": name,
        "name": name,
        "role": role,
        "phone": phone,
    }
    if(email!==""){
        params['email'] = email;
    }
    try {
        let newUser = await API.post('backend', '/create_user', {

            body: params
        });
        if (newUser.success == false) {
            return false;
        }
        else {
            try {
                await getUser()
                return true;
            } catch (err) {
                return false;
            }
        }
    } catch (err) {

        return false;
    }
}

async function SignOut() {
    try {
        let SignOutResponse = await Auth.signOut();
        currentUser.next(null)
        return true;
    } catch (err) {
        return false;
    }
}



export { currentUser, SetOtp, SignInWithPhoneNoAndOtp, SignOut, CreateUser, getUser }

