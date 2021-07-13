const awsmobile = {
    "Auth": {
        "userPoolId": "ap-south-1_n9UhmEDnz",
        "userPoolWebClientId": "3bl0aj6olpkhq9vuer1ktup6b8",
        "identityPoolId": "ap-south-1:d95853da-e697-4946-94b6-a47dd7c37590",
        "region": "ap-south-1",
        "authenticationFlowType": "USER_SRP_AUTH"
    },
    Storage: {
        AWSS3: {
            bucket: 'data-truckapp', //REQUIRED -  Amazon S3 bucket name
            region: 'ap-south-1', //OPTIONAL -  Amazon service region
        }
    },
    "API": {
        "endpoints": [
            {
                "name": "backend",
                "endpoint": "https://2hhp6ajw7b.execute-api.ap-south-1.amazonaws.com/prod",
                "region": "ap-south-1"
            },
            {
                "name": "dev",
                "endpoint": "https://ilxpildqpd.execute-api.ap-south-1.amazonaws.com/dev",
                "region": "ap-south-1"
            }
        ]
    },
};
export default awsmobile;
