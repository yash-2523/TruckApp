export default function uploadSizeValidation(e){
    let isValid = true;
    for(let i=0;i<e.target.files.length;i++){
        let fileSize = (e.target.files[i].size / 1024) / 1024;
        console.log(e.target.files[i],fileSize)
        if(fileSize > 5){
            isValid=false;
            break;
        }
    }
    return isValid;
}