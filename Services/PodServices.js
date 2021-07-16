import { Storage, API } from 'aws-amplify'
import { currentUser } from './AuthServices';

const S3Upload = async (blob, progressCallback) => {
    // const response = await Storage.put(fileName, blob, {
    //     contentType: contentType,
    //     customPrefix: {
    //         private: `prod/private/`
    //     },
    //     level: 'private',
    //     progressCallback: progress => {
    //         if (progressCallback) {
    //             progressCallback(progress.loaded, progress.total)
    //         }
    //         // console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
    //     }
    // })

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

const SubmitPod = (tripId, date, link) => {
    try {
        return API.post('dev', '/submit_pod', {
            body: {
                "trip_id": tripId,
                "date": Math.floor(date.valueOf() / 1000),
                "s3_key": link
            }
        })
    } catch (error) {
        return false
    }
}

export { S3Upload, SubmitPod }