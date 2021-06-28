import { API } from "aws-amplify"

async function getBalance(){
    try{
        return await API.post('backend','/get_balance',{});
    }catch(err){
        return false;
    }
}

function getSummary(token,query=""){    
    return API.post('backend','/get_summary',{
        body:{
            token: token,
            name: query
        }
    })

    
}

export {getBalance, getSummary}