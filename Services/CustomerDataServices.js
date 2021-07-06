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


async function getCustomerTripPdf(fromDate, toDate, customerUid, customerName) {
    try {
        const fromDateUnix = Math.ceil(fromDate.startOf('month').valueOf() / 1000);
        const toDateUnix = Math.ceil(toDate.endOf('month').valueOf() / 1000);
        return await API.post('backend', '/get_customer_trips_pdf', {
            body: {
                "from_date": fromDateUnix,
                "to_date": toDateUnix,
                "customer_name": customerName,
                "customer_uid": customerUid
            }
        })
    } catch (error) {
        console.log(error)
        return false
    }
}


export {getBalance, getSummary, getCustomerTripPdf}