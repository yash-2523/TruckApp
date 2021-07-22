import { API,Storage } from "aws-amplify";
import moment from "moment";
import { getShortLivedUrl } from "./TripDataServices";

async function getStates() {
    try {
        return await API.post('backend', '/get_states', {});
    } catch (err) {
        return false;
    }
}
async function getPackagingType() {
    try {
        return await API.post('backend', '/get_packaging_types', {});
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
                if(lrDetails[key][k] !== "" && lrDetails[key][k] !== undefined && lrDetails[key][k] !== null && k!=="imageUploadMethod" && k!=="imageSrc" && k!=="signatureSrc"){
                    params[k] = lrDetails[key][k];
                }
            })
        }
    })
    params.gst_percentage = parseInt(params.gst_percentage)
    params.freight_amount = parseInt(params.freight_amount)
    params.weight = parseInt(params.weight)
    params.rate = parseInt(params.rate)
    params.no_of_articles = parseInt(params.no_of_articles)
    
    params.consignor_phone = `+91${(params.consignor_phone).toString()}`
    params.consignee_phone = `+91${(params.consignee_phone).toString()}`
    params.lr_date = parseInt((new Date(moment(params.lr_date).format("YYYY-MM-DD")).getTime()) / 1000);
    params.lr_number = params.lr_number.toString()

    console.log(JSON.stringify(params))
    try {
        return await API.post('backend', '/create_lr', {
            body: params
        });
    } catch (err) {
        return false;
    }

}


async function uploadSignature(blob,uid,progressCallback){
    console.log(blob);
    let seconds = parseInt(new Date().getTime());
    console.log(blob.name)
    console.log(`prod/private/${uid}/lr_sign/${seconds}-${blob.name}`)
    const response = await Storage.put(`lr_sign/${seconds}-sign.${blob.type.split('/')[1]}`, blob, {
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
    console.log(response.key,response)
    return `prod/private/${uid}/${response.key}`;
    // return await getShortLivedUrl(response.key,"lr");

}

export { getStates, getPackagingType, createLR, uploadSignature }

