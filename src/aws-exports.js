const awsmobile = {
    "Auth": {
        "userPoolId": "ap-south-1_n9UhmEDnz",
        "userPoolWebClientId": "3bl0aj6olpkhq9vuer1ktup6b8",
        "identityPoolId": "ap-south-1:d95853da-e697-4946-94b6-a47dd7c37590",
        "region": "ap-south-1",
        "authenticationFlowType": "USER_SRP_AUTH"
    },
    "API": {
        "endpoints": [
            {
                "name": "backend",
                "endpoint": "https://lq2xp7fojg.execute-api.ap-south-1.amazonaws.com/functions/get_user_details",
                "region": "ap-south-1"
            }
        ]
    },
};
export default awsmobile;
