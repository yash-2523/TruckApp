import { API } from "aws-amplify";

async function getStates() {
    try {
        return await API.post('dev', '/get_states', {});
    } catch (err) {
        return false;
    }
}
async function getPackagingType() {
    try {
        return await API.post('dev', '/get_packaging_types', {});
    } catch (err) {
        return false;
    }
}

async function createLR(lrDetails){
    console.log(lrDetails.companyDetails)
    

    

    let params = {}
    let detailsIsValid = true;
    Object.keys(lrDetails).map(key => {
        if(lrDetails[key] === false){
            detailsIsValid = false;
            return false;
        }
        else{
            Object.keys(lrDetails[key]).map(k => {
                if(lrDetails[key][k] !== "" && lrDetails[key][k] !== undefined && lrDetails[key][k] !== null){
                    params[k] = lrDetails[key][k];
                }
            })
        }
    })
    params.gst_percentage = parseInt(params.gst_percentage)
    params.freight_amount = parseInt(params.freight_amount)
    params.weight = parseInt(params.weight)
    params.rate = parseInt(params.rate)
    params.company_phone = `+91${(params.company_phone).toString()}`
    params.lr_date = (new Date(params.lr_date).getTime()) / 1000;
    params.lr_date = (new Date(params.lr_date).getTime()) / 1000;
    if(params.insurance_value && params.insurance_value !== ""){
        params.insurance_value = parseInt(params.insurance_value)
    }
    if(params.insured_on_date && params.insured_on_date !== ""){
        params.insured_on_date = (new Date(params.insured_on_date).getTime()) / 1000
    }
    if(params.invoice_value && params.invoice_value !== ""){
        params.invoice_value = (new Date(params.invoice_value).getTime()) / 1000
    }
    console.log(params)
    try {
        return await API.post('dev', '/create_lr', {
            body: params
        });
    } catch (err) {
        return false;
    }

}

export { getStates, getPackagingType, createLR }

