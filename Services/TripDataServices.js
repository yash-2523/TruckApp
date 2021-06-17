import API from "@aws-amplify/api";

async function getTrips(token,status){
    try{
        return await API.post('backend','/get_trips',{
            body: {
                "token": token,
                "key": "PK",
                "status": status
            }
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