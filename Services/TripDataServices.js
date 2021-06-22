import API from "@aws-amplify/api";
import moment from "moment";

async function getTrips(token,status, from_date = null, to_date = null,customerId=null){
    if(from_date===null || from_date==="" || to_date===null || to_date===""){
        
        from_date = null;
        to_date = null;
    }
    else{
        from_date = ((new Date(from_date).getTime()) / 1000);
        to_date = ((new Date(moment(new Date(to_date)).add(1,'days').format("YYYY-MM-DD")).getTime()) / 1000);
    }
    let params = {
        "token": token,
        "key": "PK",
        "status": status,
        "from_date": from_date,
        "to_date": to_date,
    }
    if(customerId !== null){
        params['customer_uid'] = customerId;
    }
    try{
        return await API.post('backend','/get_trips',{
            body: params
        });
    }catch(err){
        return false;
    }
}

async function deleteTrip(id){
    try{
        return await API.post('backend','/delete_trip',{
            body: {
                trip_id: id
            }
        });
    }catch(err){
        return false;
    }
}

async function getTripDetails(id){
    try{
        return await API.post('backend','/get_trip_details',{
            body: {
                trip_id: id
            }
        });
    }catch(err){
        return false;
    }
}

async function CreateTransactionAdvance(tripDetails,role,paymentDetails){
    let params = {
        role: role,
        customer_name : tripDetails.customer_name,
        customer_phone : tripDetails.customer_phone,
        trip_id : tripDetails.trip_id,
        mode: paymentDetails.paymentMode,
        advance_amount: parseInt(paymentDetails.paymentAmount),
        advance_date: (new Date(paymentDetails.paymentDate).getTime()) / 1000,
        advance_note : paymentDetails.paymentNote
    }
    try{
        return await API.post('backend','/create_transaction',{
            body: params
        });
    }catch(err){
        return false;
    }
}
async function CreateTransactionExpense(tripDetails,role,expenseDetails){
    let params = {
        role: role,
        customer_name : tripDetails.customer_name,
        customer_phone : tripDetails.customer_phone,
        trip_id : tripDetails.trip_id,
        mode: expenseDetails.expenseMode,
        expense_type: expenseDetails.expenseType,
        expense_amount: parseInt(expenseDetails.expenseAmount),
        expense_date: (new Date(expenseDetails.expenseDate).getTime()) / 1000,
        expense_note : expenseDetails.expenseNote
    }
    try{
        return await API.post('backend','/create_transaction',{
            body: params
        });
    }catch(err){
        return false;
    }
}

async function getExpense(){
    try{
        return await API.post('backend','/get_expense_types',{});
    }catch(err){
        return false;
    }
}

async function getBill(idx){
    try{
        return await API.post('backend','/get_bill',{
            body:{
                trip_id: idx
            }
        })
    }catch(err){
        return false;
    }
}

export {getTrips, deleteTrip, getTripDetails, CreateTransactionAdvance, getExpense, CreateTransactionExpense, getBill}