import { API } from "aws-amplify"

async function getBalance(){
    try{
        return await API.post('backend','/get_balance',{});
    }catch(err){
        return false;
    }
}

async function getSummary(token){
    try{
        return await API.post('backend','/get_summary',{
            body:{
                token: token
            }
        })
    }catch(err){
        return err;
    }
}

export {getBalance, getSummary}