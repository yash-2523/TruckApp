import API from "@aws-amplify/api";
import moment from "moment";

async function getAllCities(){
    try{
        return await API.post('backend','/get_cities',{});
    }catch(err){
        return false;
    }
}

async function createTrip(tripDetails,role){
    let params = {
        customer_name: tripDetails.customerName,
        customer_phone: `+91${tripDetails.customerNumber}`,
        origin_city : tripDetails.origin,
        destination_city : tripDetails.destination,
        role : role,
        billing_type : tripDetails.billingType.replace('-','_'),
        freight_amount: parseInt(tripDetails.freightAmount),
        trip_start_date: (new Date(moment(tripDetails.startDate).format("YYYY-MM-DD")).getTime()) / 1000
    }
    if(tripDetails.billingType !== "fixed"){
        params[`${tripDetails.billingType.split('-')[1]}`] = parseInt(tripDetails.total);
        params[`rate_${tripDetails.billingType.replace('-','_')}`] = parseInt(tripDetails.rate);
        
    }
    if(tripDetails.startKmReading !== ""){
        params[`start_km_reading`] = parseInt(tripDetails.startKmReading)
    }
    if(tripDetails.truckNumber !== ""){
        params[`truck_id`] = tripDetails.truckNumber
    }
    if(tripDetails.startKmReading !== ""){
        params[`driver_name`] = tripDetails.driverName
    }
    console.log(params)
    try{
        return await API.post('backend','/create_trip',{
            body: params
        })
    }catch(err){
        return false;
    }
}

export {getAllCities, createTrip}