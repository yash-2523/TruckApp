import { API } from "aws-amplify";

async function getAllTrucks() {
    try {
        return await API.post('backend', '/get_trucks', {
            body: {
                "is_available": "all"
            }
        })
    } catch (err) {
        return false;
    }
}

async function getTruckTypes() {
    try {
        return await API.post('backend', '/get_truck_types', {});
    } catch (err) {
        return false;
    }
}

async function createTruck(truckDetails) {
    let params = {
        container_type: truckDetails.containerType,
        truck_type: truckDetails.truckType,
        truck_number: truckDetails.truckNumber
    }

    try {
        return await API.post('backend', '/create_truck', {
            body: params
        })
    } catch (err) {
        return err;
    }
}

export { getAllTrucks, getTruckTypes, createTruck }