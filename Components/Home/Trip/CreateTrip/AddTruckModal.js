import { Button, Checkbox, Dialog, DialogActions, FormControl, FormControlLabel, FormGroup, Icon, Radio, RadioGroup, TextField } from '@material-ui/core'
import React, { useContext, useEffect, useState } from 'react'
import MiniTruckIcon from './svg/MiniTruck.svg'
import OpenBodyTruckIcon from './svg/OpenBodyTruck.svg'
import ClosedContainerTruckIcon from './svg/ClosedContainerTruck.svg'
import TrailerTruckIcon from './svg/TrailerTruck.svg'
import styles from '../../../../styles/CreateTrip.module.scss'
import { getTruckTypes, createTruck } from '../../../../Services/TruckServices'
import { PulseLoader } from 'react-spinners'
import { GlobalLoadingContext } from '../../../../Context/GlobalLoadingContext'
import { toast } from 'react-toastify'

export default function AddTruckModal(props) {

    const [truckTypes,setTruckTypes] = useState([]);
    const [detailsIsValid,setDetailsIsValid] = useState(false);
    const {setGlobalLoading} = useContext(GlobalLoadingContext)
    const [truckDetails,setTruckDetails] = useState({
        truckType: {
            marketTruck: false,
            myTruck: false
        },
        containerType: "",
        truckNumber: "",
        customerName: ""
    })
    let TruckIcons = [
        <MiniTruckIcon />,
        <OpenBodyTruckIcon />,
        <ClosedContainerTruckIcon />,
        <TrailerTruckIcon />
    ]

    let Init = () => {
        setTruckDetails({
            truckType: {
                marketTruck: false,
                myTruck: false
            },
            containerType: "",
            truckNumber: "",
            customerName: ""
        })
        
    }

    let HandleCreatetruck = async () => {
        if(!detailsIsValid){
            toast.error("invalid data");
            return;
        }
        setGlobalLoading(true);
        try{
            let createTruckResponse = await createTruck(truckDetails);
            if(createTruckResponse.success){
                setGlobalLoading(false);
                if(props.truckListUpdate){
                    props.truckListUpdate()
                }
                toast.success(createTruckResponse.message);
                Init();
                props.close();
            }
            else{
                setGlobalLoading(false);
                toast.error("It seems like Truck Already Exists")
            }
            
        }catch(err){
            setGlobalLoading(false)
        }
    }

    useEffect(async () => {

        try{
            let getAllTruckTypes = await getTruckTypes();
            if(getAllTruckTypes){
                setTruckTypes(getAllTruckTypes);
            }
        }catch(err){

        }
    },[])

    useEffect(() => {
        let isValid=true;
        Object.keys(truckDetails).map(key => {
            if(key !== 'customerName' && truckDetails[key] === ""){
                isValid=false;
            }
        })
        if(!truckDetails.truckType.myTruck  && !truckDetails.truckType.marketTruck){
            isValid=false;
        }
        setDetailsIsValid(isValid)
    },[truckDetails])

    return (
        <Dialog fullWidth open={props.open} hideBackdrop disableBackdropClick onClose={props.close} maxWidth="lg">
            <form className={`d-flex justify-content-between align-items-center w-100 px-lg-3 px-md-2 px-0 py-2 ${styles['add-truck-form']}`}>
                <div className="col-lg-6 col-md-6 col-11 mx-auto">
                    <h3 className="mt-3">Add Truck</h3>
                    <h6 className="mt-3">Select a truck Type</h6>

                    <RadioGroup className={`d-flex flex-column my-2 ${styles['truck-types']}`} value={truckDetails.containerType} onChange={(e) => setTruckDetails({...truckDetails,containerType: e.target.value})}>
                        {truckTypes.length<=0 ? <PulseLoader size={15} margin={2} color="#36D7B7" /> : truckTypes.map((truck,i) => 
                            <div className={`d-flex px-2 justify-content-between align-items-center py-1 ${styles[truck.toString().replaceAll('/','-').replaceAll(' ','-').toLowerCase()]}`}>
                                <Icon>{TruckIcons[i]}</Icon>
                                {truck}
                                <Radio value={truck} name="truckType" />
                            </div>
                        )}
                    </RadioGroup>
                </div>

                <div className="col-lg-6 col-md-6 col-11 mx-auto px-lg-3 px-md-2 px-0">
                    <h3>Registration Number</h3>
                    <TextField 
                        className="col-lg-8 col-md-8 col-11 mt-4 mx-auto"
                        label="Vehicle  Registration Number"
                        required
                        value={truckDetails.truckNumber}
                        onChange={(e) => setTruckDetails({...truckDetails,truckNumber: e.target.value})}
                    />

                    <h5 className="mt-4">Ownership</h5>

                    <FormGroup row>
                        <FormControlLabel label="Market Truck" control={<Checkbox style={{color: "rgba(231, 104, 50, 1)"}} checked={truckDetails.truckType.marketTruck} onChange={(e) => setTruckDetails({...truckDetails,truckType: {...truckDetails.truckType,marketTruck: e.target.checked,myTruck: false}})} />}></FormControlLabel>
                        <FormControlLabel label="My Truck" control={<Checkbox style={{color: "rgba(231, 104, 50, 1)"}} checked={truckDetails.truckType.myTruck} onChange={(e) => setTruckDetails({...truckDetails,truckType: {...truckDetails.truckType,myTruck: e.target.checked,marketTruck: false}})} />}></FormControlLabel>
                    </FormGroup>
                    <DialogActions className="mt-4 d-flex align-items-center">
                        <Button variant="outlined" onClick={props.close}>Close</Button>
                        <Button variant="contained" disabled={!detailsIsValid} onClick={HandleCreatetruck} color="primary">Confirm</Button>
                    </DialogActions>
                </div>
            </form>
        </Dialog>
    )
}
