import { API } from "aws-amplify";

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
    lrDetails.tripDetails.gst_percentage = parseInt(lrDetails.tripDetails.gst_percentage)
    lrDetails.tripDetails.freight_amount = parseInt(lrDetails.tripDetails.freight_amount)
    lrDetails.goodsDetails.weight = parseInt(lrDetails.goodsDetails.weight)
    lrDetails.goodsDetails.rate = parseInt(lrDetails.goodsDetails.rate)
    lrDetails.companyDetails.phone = `+91${lrDetails.companyDetails.phone}`;
    lrDetails.consigneeDetails.lr_date = (new Date(lrDetails.consigneeDetails.lr_date).getTime()) / 1000;
    lrDetails.consignorDetails.lr_date = (new Date(lrDetails.consignorDetails.lr_date).getTime()) / 1000;

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

    try {
        return await API.post('backend', '/create_lr', {
            body: params
        });
    } catch (err) {
        return false;
    }

}

export { getStates, getPackagingType, createLR }

