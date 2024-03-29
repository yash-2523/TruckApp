
import { Accordion, AccordionDetails, AccordionSummary, Button, Icon, InputAdornment, Menu, MenuItem, TextField } from '@material-ui/core';
import { AddCircleRounded, ArrowBackIosOutlined, CheckOutlined, ExpandMoreOutlined, KeyboardBackspaceOutlined, Person, Phone, RoomSharp, SaveOutlined, SpeedOutlined } from '@material-ui/icons';
import { DatePicker } from '@material-ui/pickers';
import moment from 'moment';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { GlobalLoadingContext } from '../../../../Context/GlobalLoadingContext';
import { currentUser } from '../../../../Services/AuthServices';
import { createTrip, getAllCities } from '../../../../Services/CreateTripService';
import { getTripDetails } from '../../../../Services/TripDataServices';
import { getAllTrucks } from '../../../../Services/TruckServices';
import styles from '../../../../styles/CreateTrip.module.scss';
import AddTruckModal from '../../AddTruckModal';
import AvailableTruckIcon from './svg/AvailableTruck.svg';
import OnMarketTruckIcon from './svg/OnMarketTruck.svg';

export default function CreateTrip(props) {

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
        rate: "",
        total: "",
        billingType: "fixed",
        freightAmount: "",
        startKmReading: "",
        startDate: ""
    });
    let TripDetails = async () => {
        setLoading(true)
        try{
            let TripDetailsResponse = await getTripDetails(tripId);
            if(TripDetailsResponse){
                await setEditTrip(TripDetailsResponse);
                let temp = {
                    origin: TripDetailsResponse.origin_city,
                    destination: TripDetailsResponse.destination_city,
                    customerName: TripDetailsResponse.customer_name,
                    customerNumber: TripDetailsResponse.customer_phone?.slice(-10),
                    driverName: TripDetailsResponse.driver_name,
                    truckNumber: TripDetailsResponse.truck_number,
                    rate: "",
                    total: "",
                    billingType: "fixed",
                    freightAmount: TripDetailsResponse.freight_amount,
                    startKmReading: "",
                    startDate: moment(new Date(TripDetailsResponse.trip_start_date * 1000)).format('dd-mm-yyyy')
                }
                setTripDetails({...tripDetails,...temp})
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
        setTripDetails({...tripDetails,billingType: billingTypes[idx],rate: "",total: "",freightAmount: ""});
        
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
        getCities();
        getTrucks()
        if(tripId!==null && tripId !== undefined){
            await TripDetails();
        }
        
    },[])

    useEffect(() => {
        let isValid=true;
        Object.keys(tripDetails).map(key => {
            if(key === "rate" || key==="total"){
                if(tripDetails[key] === "" && tripDetails['billingType']!=="fixed"){
                    isValid=false;
                }
            }
            else{
                if(key !== "startKmReading" && key !== "driverName" && key !== "truckNumber" && tripDetails[key] === ""){
                    isValid=false;
                }
            }
            
        })
        if(tripDetails.customerNumber?.length !== 10){
            isValid=false;
        }
        setDetailsIsValid(isValid);

    },[tripDetails])

    

    return (
        <>

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
                                error={tripDetails.origin === ""}
                                required
                                variant="outlined"
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
                                <option value=""></option>
                                {cities.map((city,i) => 
                                    <option key={`origin_city_${city}_${i}`} value={city}>{` ${city}`}</option>
                                )}

                            </TextField>
                            <TextField 
                                label="Destination"
                                select
                                error={tripDetails.destination === ""}
                                required
                                variant="outlined"
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
                                  disabled={cities === []}
                                value={tripDetails.destination}
                                onChange={(e) => setTripDetails({...tripDetails,destination: e.target.value})}
                            >
                                <option value=""></option>
                                {cities.map((city,i) => 
                                    <option key={`destination_city_${city}_${i}`} value={city}>{` ${city}`}</option>
                                )}

                            </TextField>
                        </div>
                        
                        <div className="d-flex justify-content-between align-items-center">
                            <TextField 
                                variant="outlined"
                                label="Customer Name"
                                error={tripDetails.customerName === ""}
                                required
                                className="col-lg-5 col-md-5 col-sm-10 col-10"
                                value={tripDetails.customerName} onChange={(e) => setTripDetails({...tripDetails,customerName: e.target.value})}
                            />
                            <TextField
                                label="Customer Number"
                                className="col-lg-5 col-md-5 col-sm-10 col-10"
                                type="number"
                                error={tripDetails.customerNumber === "" || tripDetails.customerNumber.length !== 10}
                                required
                                variant="outlined"
                                value={tripDetails.customerNumber} onChange={(e) => setTripDetails({...tripDetails,customerNumber: `${e.target.value}`})}
                            />
                        </div>
                        
                        <div className="d-flex justify-content-between align-items-center">
                            <TextField 
                                label="Driver Name"
                                variant="outlined"
                                className="col-lg-5 col-md-5 col-sm-10 col-10"
                                value={tripDetails.driverName} onChange={(e) => setTripDetails({...tripDetails,driverName: e.target.value})}
                            />
                            
                            <TextField 
                                label="Truck Number"
                                className="col-lg-5 col-md-5 col-sm-10 col-10"
                                inputProps={{list: "trucks"}}
                                name="trucks"
                                value={tripDetails.truckNumber}
                                onChange={(e) => setTripDetails({...tripDetails,truckNumber: e.target.value})}
                                onClick={(e) => handleTruckNoAnchorClick(e)}
                                variant="outlined"
                            />
                            <Menu
                                anchorEl={truckNoAnchorEl}
                                open={Boolean(truckNoAnchorEl)}
                                onClose={handleTruckNoAnchorClose}
                                getContentAnchorEl={null}
                                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                                transformOrigin={{ vertical: "top", horizontal: "center" }}
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
                            
                            <div className="d-flex flex-column justify-content-between align-items-start">
                                Start KM Reading
                                <TextField 
                                    variant="outlined"
                                    className="w-75 mt-lg-4 mt-md-3 mt-2"
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
                                Start Date*
                                <DatePicker 
                                    inputVariant="outlined"
                                    error={tripDetails.startDate === ""}
                                    helperText=""
                                    className="mt-lg-4 mt-md-3 mt-2 text-right"
                                    value={tripDetails.startDate==="" ? null : tripDetails.startDate}
                                    autoOk
                                    format="DD-MM-YYYY"
                                    emptyLabel="Enter Start Date"
                                    onChange={(e) => setTripDetails({...tripDetails,startDate: e})}
                                />
                            </div>
                        </div>

                        <div className="w-100 mt-5 d-flex justify-content-evely align-items-center flex-wrap">
                            {tripDetails.billingType !== billingTypes[0] && <div className="d-flex flex-column justify-content-between align-items-center">
                                {`Rate ${tripDetails.billingType}*`}
                                <TextField 
                                    variant="outlined"
                                    placeholder={`rate ${tripDetails.billingType}`}
                                    className="w-75 mt-3 mb-2"
                                    error={tripDetails.rate === ""}
                                    type="number"
                                    InputProps={{
                                        startAdornment: (
                                          <InputAdornment position="start">
                                            <b>₹</b>
                                          </InputAdornment>
                                        ),
                                    }}
                                    value={tripDetails.rate}
                                    onChange={(e) => setTripDetails({...tripDetails,rate: e.target.value,freightAmount: (tripDetails.total) * e.target.value})}
                                />
                            </div>
                            }
                            {tripDetails.billingType !== billingTypes[0] && <div className="d-flex flex-column justify-content-between align-items-center">
                                {`Total ${tripDetails.billingType.split('-')[1]}*`}
                                <TextField 
                                    variant="outlined"
                                    placeholder={`total ${tripDetails.billingType.split('-')[1]}`}
                                    className="w-75 mt-3 mb-2"
                                    type="number"
                                    error={tripDetails.total === ""}
                                    value={tripDetails.total}
                                    onChange={(e) => setTripDetails({...tripDetails,total: e.target.value,freightAmount: e.target.value * (tripDetails.rate)})}
                                />
                            </div>
                            }
                            <div className="d-flex flex-column justify-content-between align-items-center">
                                Total Freight Amount*
                                <TextField variant="outlined" 
                                value={tripDetails.freightAmount}
                                onChange={(e) => setTripDetails({...tripDetails,freightAmount: e.target.value})}
                                disabled={tripDetails.billingType !== billingTypes[0]}
                                type="number"
                                error={tripDetails.freightAmount === ""}
                                InputProps={{
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <b>₹</b>
                                      </InputAdornment>
                                    ),
                                  }}
                                className={`mt-3 mb-2 w-75 ${styles['freight-amount-input']}`}></TextField>
                            </div>
                        </div>                                    
                    </AccordionDetails>
                </Accordion> }
                <div className="mt-4 pb-4 d-flex align-items-center justify-content-center">
                    {editTrip ? <Button startIcon={<SaveOutlined />} className="w-25 py-3" variant="contained" color="primary">Save</Button> :
                    <Button disabled={!detailsIsValid} onClick={HandleCreateTrip} className="w-25 py-3" variant="contained" color="primary">Confirm</Button>
                    }
                </div>
            </div>
            <AddTruckModal open={addTruckModalOpen} truckListUpdate={getTrucks} close={AddTruckModalClose} />  
            </>}                                  
        </>
    )
}
