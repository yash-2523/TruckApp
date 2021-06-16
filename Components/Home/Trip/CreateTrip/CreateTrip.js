
import { Accordion, AccordionDetails, AccordionSummary, Button, Icon, InputAdornment, Menu, MenuList, MenuItem, TextField,} from '@material-ui/core'
import { AddCircleRounded, ArrowBackIosOutlined, CancelOutlined, CheckOutlined, Close, ExpandMoreOutlined, KeyboardBackspaceOutlined, RoomSharp, SaveOutlined, SpeedOutlined } from '@material-ui/icons'
import React, { useContext, useEffect, useState } from 'react';
import {getAllCities, createTrip} from '../../../../Services/CreateTripService'
import {getTripDetails} from '../../../../Services/TripDataServices'
import { TripContext } from '../../../../Context/TripContext';
import AddTruckModal from './AddTruckModal';
import styles from '../../../../styles/CreateTrip.module.scss'
import AvailableTruckIcon from './svg/AvailableTruck.svg'
import OnMarketTruckIcon from './svg/OnMarketTruck.svg';
import { getAllTrucks } from '../../../../Services/TruckServices';
import { currentUser } from '../../../../Services/AuthServices';
import { toast } from 'react-toastify';
import { GlobalLoadingContext } from '../../../../Context/GlobalLoadingContext';
import moment from 'moment';
import router, { useRouter } from 'next/router';
import { PulseLoader } from 'react-spinners';

export default function CreateTrip(props) {

    // const {TripPage, TripId, EditTrip} = useContext(TripContext);
    // const [tripPage,setTripPage] = TripPage;
    const router = useRouter();
    const tripId = router.query.id;
    const {setGlobalLoading} = useContext(GlobalLoadingContext)
    const [truckNoAnchorEl, setTruckNoAnchorEl] = useState(null);
    const [truckNoValue,setTruckNoValue] = useState("");
    const [addTruckModalOpen,setAddTruckModalOpen] = useState(false)
    const billingTypes = ["fixed","per-tonne","per-kg","per-km"];
    const [detailsIsValid,setDetailsIsValid] = useState(false);
    const [cities,setCities] = useState([]);
    const [trucks,setTrucks] = useState([]);
    const [editTrip,setEditTrip] = useState(false);
    const [loading,setLoading] = useState(false);
    const [tripDetails,setTripDetails] = useState({
        origin: "",
        destination: "",
        customerName: "",
        customerNumber: "",
        driverName: "",
        truckNumber: "",
        rate: parseInt(0),
        total: parseInt(0),
        billingType: "fixed",
        freightAmount: parseInt(0),
        startKmReading: parseInt(0),
        startDate: ""
    });
    let TripDetails = async () => {
        setLoading(true)
        try{
            let TripDetailsResponse = await getTripDetails(tripId);
            if(TripDetailsResponse){
                await setEditTrip(TripDetailsResponse);
                setLoading(false)
            }
            else{
                toast.error("Unable to get Trip");
                setLoading(false)
                router.push({pathname:'/trip'});
            }
        }catch(err){
            toast.error("Unable to get Trip");
            setLoading(false)
            router.push({pathname:'/trip'});
        }
    }

    const handleTruckNoAnchorClick = (event) => {
        setTruckNoAnchorEl(event.currentTarget);
    };

    const handleTruckNoAnchorClose = () => {
        setTruckNoAnchorEl(null);
    };

    let AddTruckModalClose = () => {
        setAddTruckModalOpen(false);
    }

    let BillingTypeChange = (idx) => {
        setTripDetails({...tripDetails,billingType: billingTypes[idx],rate: 0,total: 0,freightAmount: 0});
        
    }

    let getCities = async () => {
        try{
            let allCities = await getAllCities();
            if(allCities){
                setCities(allCities);
            }
        }
        catch(err){
            
        }
    }

    let getTrucks = async () => {
        try{
            let allTrucks = await getAllTrucks();
            if(allTrucks){
                setTrucks(allTrucks);
            }
        }
        catch(err){
        }
    }

    let HandleCreateTrip = async () => {
        let user = currentUser.value;
        if(!detailsIsValid || !user?.role){
            toast.error("Invalid Data")
            return;
        }
        setGlobalLoading(true);
        try{
            let CreateTripResponse = await createTrip(tripDetails,user.role);
            setGlobalLoading(false);
            if(CreateTripResponse && CreateTripResponse.success){
                
                toast.success(CreateTripResponse.message);
                router.push({pathname: `/trip/${CreateTripResponse.trip_id}`})
            }
            else{
                toast.error("Unable to create Trip")
            }
            
        }catch(err){
            setGlobalLoading(false);
        }

    }

    useEffect(async () => {
        
        if(tripId!==null && tripId !== undefined){
            await TripDetails();
            let temp = {
                origin: editTrip.origin_city,
                destination: editTrip.destination_city,
                customerName: editTrip.customer_name,
                customerNumber: editTrip.customer_phone?.slice(-10),
                driverName: editTrip.driver_name,
                truckNumber: editTrip.truck_number,
                rate: parseInt(0),
                total: parseInt(0),
                billingType: "fixed",
                freightAmount: editTrip.freight_amount,
                startKmReading: parseInt(0),
                startDate: moment(new Date(editTrip.trip_start_date)).format('dd-mm-yyyy')
            }
            setTripDetails({...tripDetails,...temp})
        }
        getCities();
        getTrucks()
    },[])

    useEffect(() => {
        let isValid=true;
        Object.keys(tripDetails).map(key => {
            if(tripDetails[key] === ""){
                isValid=false;
            }
        })
        if(tripDetails.customerNumber.length !== 10){
            isValid=false;
        }

        setDetailsIsValid(isValid);

    },[tripDetails])

    

    return (
        <>
            <Button className="mt-4" startIcon={<KeyboardBackspaceOutlined />} onClick={() => router.push({pathname: '/trip'})}>Trips</Button>

            {loading ? <div className="w-100 mt-5 py-3 text-center"><PulseLoader size={15} margin={2} color="#36D7B7" /></div> 
                :
            <>    
            <div className={`px-lg-3 px-md-2 px-1 mt-5 ${styles['create-trip-container']}`}>
                <div className={`px-4 rounded-2 py-3 ${styles['route-details']}`}>
                    <form className="w-100 d-flex flex-column">
                        <div className="d-flex justify-content-between align-items-center">
                            <TextField 
                                label="Origin"
                                select
                                SelectProps={{
                                    native: "true"
                                }}
                                className="col-lg-5 col-md-5 col-sm-10 col-10"
                                InputProps={{
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <RoomSharp className="mb-1" style={{color: "green"}} />
                                      </InputAdornment>
                                    ),
                                  }}
                                value={tripDetails.origin}
                                onChange={(e) => setTripDetails({...tripDetails,origin: e.target.value})}
                            >
                                <option aria-label="None" value="" />
                                {cities.map(city => 
                                    <option key={`origin_city_${city}`} value={city}>{city}</option>
                                )}

                            </TextField>
                            <TextField 
                                label="Destination"
                                select
                                SelectProps={{
                                    native: "true"
                                }}
                                
                                className="col-lg-5 col-md-5 col-sm-10 col-10"
                                InputProps={{
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <RoomSharp className="mb-1" style={{color: "red"}} />
                                      </InputAdornment>
                                    ),
                                  }}
                                value={tripDetails.destination}
                                onChange={(e) => setTripDetails({...tripDetails,destination: e.target.value})}
                            >
                                <option aria-label="None" value="" />
                                {cities.map(city => 
                                    <option key={`destination_city_${city}`} value={city}>{city}</option>
                                )}

                            </TextField>
                        </div>
                        
                        <div className="d-flex justify-content-between align-items-center">
                            <TextField 
                                label="Customer Name"
                                className="col-lg-5 col-md-5 col-sm-10 col-10"
                                value={tripDetails.customerName} onChange={(e) => setTripDetails({...tripDetails,customerName: e.target.value})}
                            />
                            <TextField
                                label="Customer Number"
                                className="col-lg-5 col-md-5 col-sm-10 col-10"
                                type="number"
                                value={tripDetails.customerNumber} onChange={(e) => setTripDetails({...tripDetails,customerNumber: `${e.target.value}`})}
                            />
                        </div>
                        
                        <div className="d-flex justify-content-between align-items-center">
                            <TextField 
                                label="Driver Name"
                                className="col-lg-5 col-md-5 col-sm-10 col-10"
                                value={tripDetails.driverName} onChange={(e) => setTripDetails({...tripDetails,driverName: e.target.value})}
                            />
                            <TextField 
                                label="Truck Registration Number"
                                className="col-lg-5 col-md-5 col-sm-10 col-10"
                                inputProps={{list: "trucks"}}
                                name="trucks"
                                value={tripDetails.truckNumber}
                                onChange={(e) => setTripDetails({...tripDetails,truckNumber: e.target.value})}
                                onClick={(e) => handleTruckNoAnchorClick(e)}
                            />
                            <Menu
                                anchorEl={truckNoAnchorEl}
                                open={Boolean(truckNoAnchorEl)}
                                onClose={handleTruckNoAnchorClose}
                                style={{marginTop: "45px",width: "300px"}}
                                
                                InputLabelProps={{ shrink: true }}
                                className={styles['truck-number-menu-list']}
                                PopoverClasses={{paper: styles['menu-paper']}}
                            >
                                <div className="w-100 mb-3 d-flex justify-content-around align-items-center">
                                    <p onClick={handleTruckNoAnchorClose}><ArrowBackIosOutlined />Back</p>
                                    <Button variant="outlined" onClick={() => setAddTruckModalOpen(true)} endIcon={<AddCircleRounded style={{color: "green"}} />}>Add New Truck</Button>
                                </div>
                                <b className="mb-3 mx-3">Select Truck</b>
                                <div className={`w-100 ${styles['available-truck-list']}`}>

                                    {trucks.map(truck => 
                                         <MenuItem key={truck.truck_number} className="mt-2">{
                                            <div onClick={() => setTripDetails({...tripDetails,truckNumber: truck.truck_number})} className={`w-100 d-flex justify-content-between align-items-center ${styles['available-trucks-list']}`}>
                                                <span className="col-5 overflow-scroll">{truck.truck_number}</span>
                                                <Icon className="col-3 text-center mx-0 mt-2">{truck.is_available ? <AvailableTruckIcon /> : <OnMarketTruckIcon />}</Icon>
                                                <p className={"col-4 text-end" + (truck.is_available ? " text-success": " text-danger")}>{truck.is_available ? "Available" : "On Market"}</p>
                                            </div>
                                        }</MenuItem>
                                    )}
                                </div>
                            </Menu>
                        </div>
                    </form>
                </div>
                
                {editTrip===false && <Accordion className="mt-4">
                    <AccordionSummary
                    expandIcon={<ExpandMoreOutlined />}
                    aria-controls="panel1a-content"
                    >
                        Add Billing Deatils
                    </AccordionSummary>
                    <AccordionDetails className={`d-flex flex-column ${styles['create-trip-accordian-details']}`}>
                        <div className={`w-100 d-flex justify-content-between align-items-end ${styles['add-billing-details']}`}>
                            <div className="d-flex justify-content-evenly align-items-end flex-wrap">
                                
                                <Button className={tripDetails.billingType === billingTypes[0] ? styles["active"] : ""} variant={tripDetails.billingType === billingTypes[0] ? "contained" : "outlined"} onClick={() => BillingTypeChange(0)} endIcon={tripDetails.billingType === billingTypes[0] && <CheckOutlined />}>{billingTypes[0].replace('-',' ')}</Button>
                                <Button className={tripDetails.billingType === billingTypes[1] ? styles["active"] : ""} variant={tripDetails.billingType === billingTypes[1] ? "contained" : "outlined"} onClick={() => BillingTypeChange(1)} endIcon={tripDetails.billingType === billingTypes[1] && <CheckOutlined />}>{billingTypes[1].replace('-',' ')}</Button>
                                <Button className={tripDetails.billingType === billingTypes[2] ? styles["active"] : ""} variant={tripDetails.billingType === billingTypes[2] ? "contained" : "outlined"} onClick={() => BillingTypeChange(2)} endIcon={tripDetails.billingType === billingTypes[2] && <CheckOutlined />}>{billingTypes[2].replace('-',' ')}</Button>
                                <Button className={tripDetails.billingType === billingTypes[3] ? styles["active"] : ""} variant={tripDetails.billingType === billingTypes[3] ? "contained" : "outlined"} onClick={() => BillingTypeChange(3)} endIcon={tripDetails.billingType === billingTypes[3] && <CheckOutlined />}>{billingTypes[3].replace('-',' ')}</Button>
                            </div>   
                            {tripDetails.billingType !== billingTypes[0] && <div className="d-flex flex-column justify-content-between align-items-center">
                                {`Rate ${tripDetails.billingType}`}
                                <TextField 
                                    placeholder={`rate ${tripDetails.billingType}`}
                                    className="w-50 mt-lg-4 mt-md-3 mt-2"
                                    value={tripDetails.rate}
                                    onChange={(e) => setTripDetails({...tripDetails,rate: e.target.value,freightAmount: (tripDetails.total) * e.target.value})}
                                />
                            </div>
                            }
                            {tripDetails.billingType !== billingTypes[0] && <div className="d-flex flex-column justify-content-between align-items-center">
                                {`Total ${tripDetails.billingType.split('-')[1]}`}
                                <TextField 
                                    placeholder={`total ${tripDetails.billingType.split('-')[1]}`}
                                    className="w-50 mt-lg-4 mt-md-3 mt-2"
                                    value={tripDetails.total}
                                    onChange={(e) => setTripDetails({...tripDetails,total: e.target.value,freightAmount: e.target.value * (tripDetails.rate)})}
                                />
                            </div>
                            }
                            <div className="d-flex flex-column justify-content-between align-items-center">
                                Start KM Reading
                                <TextField 
                                    className="w-50 mt-lg-4 mt-md-3 mt-2"
                                    type="number"
                                    value={tripDetails.startKmReading}
                                    onChange={(e) => setTripDetails({...tripDetails,startKmReading: e.target.value})}
                                    InputProps={{
                                        startAdornment: (
                                          <InputAdornment position="start">
                                            <SpeedOutlined style={{color: "rgba(231, 104, 50, 1)"}} />
                                          </InputAdornment>
                                        ),
                                      }}
                              
                                />
                            </div>  
                            <div className="d-flex flex-column justify-content-between align-items-start"> 
                                Start Date
                                <TextField
                                    className="mt-lg-4 mt-md-3 mt-2"
                                    type="date"
                                    value={tripDetails.startDate}
                                    onChange={(e) => setTripDetails({...tripDetails,startDate: e.target.value})}
                                    InputLabelProps={{
                                    shrink: true,
                                    }}
                                />
                            </div>
                        </div>

                        <div className="w-100 mt-5 d-flex justify-content-between align-items-end">
                            <div className="d-flex flex-column justify-content-between align-items-center">
                                Total Freight Amount
                                <TextField variant="outlined" 
                                value={tripDetails.freightAmount}
                                onChange={(e) => setTripDetails({...tripDetails,freightAmount: e.target.value})}
                                disabled={tripDetails.billingType !== billingTypes[0]}
                                InputProps={{
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        Rs
                                      </InputAdornment>
                                    ),
                                  }}
                                className="mt-3"></TextField>
                            </div>
                        </div>                                    
                    </AccordionDetails>
                </Accordion> }
                <div className="mt-4 pb-4 d-flex align-items-center justify-content-center">
                    {editTrip ? <Button startIcon={<SaveOutlined />} variant="contained" color="primary">Save</Button> :
                    <Button disabled={!detailsIsValid} onClick={HandleCreateTrip} variant="contained" color="primary">Confirm</Button>
                    }
                </div>
            </div>
            <AddTruckModal open={addTruckModalOpen} truckListUpdate={getTrucks} close={AddTruckModalClose} />  
            </>}                                  
        </>
    )
}
