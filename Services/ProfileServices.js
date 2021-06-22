import API from "@aws-amplify/api";

async function updateUser(name,email){
    console.log('updateUser called',name,email)
    try{
        return await API.post('backend','/update_user',{
            body: {
                "name": name,
                "email": email
            }
        })
    }catch(err){
        return false;
    }
}

export {updateUser}