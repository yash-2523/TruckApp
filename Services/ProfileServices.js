import API from "@aws-amplify/api";

async function updateUser(name,email,businessName){
    try{
        return await API.post('backend','/update_user',{
            body: {
                "name": name,
                "email": email,
                "business_name":businessName
            }
        })
    }catch(err){
        return false;
    }
}

export {updateUser}