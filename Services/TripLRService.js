import { API,Storage } from "aws-amplify";
import moment from "moment";

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
    params.lr_date = parseInt((new Date(moment(params.lr_date).format("YYYY-MM-DD")).getTime()) / 1000);
    params.lr_number = params.lr_number.toString()
    if(params.insurance_value && params.insurance_value !== ""){
        params.insurance_value = parseInt(params.insurance_value)
    }
    if(params.insured_on_date && params.insured_on_date !== ""){
        params.insured_on_date = (new Date(moment(params.insured_on_date).format("YYYY-MM-DD")).getTime()) / 1000
    }
    if(params.invoice_value && params.invoice_value !== ""){
        params.invoice_value = (new Date(moment(params.invoice_value).format("YYYY-MM-DD")).getTime()) / 1000
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


async function uploadSignature(blob,progressCallback){
    console.log(blob);
    const response = await Storage.put(blob.name, blob, {
        contentType: blob.type,
        customPrefix: {
            private: `prod/private/`
        },
        level: 'private'
    });

    const signedURL = await Storage.get(response.key, {
        level: 'private',
        customPrefix: {
            private: `prod/private/`
        },
        expires: 600000
    });
    return signedURL
}

export { getStates, getPackagingType, createLR, uploadSignature }

