import { Step, Stepper, StepLabel, FormControlLabel, RadioGroup, Radio, TextField, Avatar, InputLabel } from "@material-ui/core";
import { useContext, useEffect, useState } from "react";
import { Button,Fab,Icon } from '@material-ui/core';
import { LocalShippingOutlined, CachedOutlined, AddOutlined, RemoveOutlined, Cancel, EditOutlined, CheckCircleSharp, CloudUploadOutlined } from '@material-ui/icons'
import TripsDataStyles from '../../../../styles/TripsData.module.scss';
import styles from '../../../../styles/TripLR.module.scss'
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { PulseLoader } from "react-spinners";
import moment from "moment";
import { getTripDetails } from "../../../../Services/TripDataServices";
import INRIcon from '../../svg/InrIcon.svg';
import {currentUser} from '../../../../Services/AuthServices';
import SignaturePadDialog from '../../../SignaturePadDialog'
import { IconButton } from "@material-ui/core";
import { getStates,getPackagingType, createLR, uploadSignature } from "../../../../Services/TripLRService";
import { GlobalLoadingContext } from "../../../../Context/GlobalLoadingContext";
import { DatePicker } from "@material-ui/pickers";

export default function TripLR(){

    const LRSteps = [
        {
            label: "Trip Details",
            content: <TripDetailsForm />
        },
        {
            label: "Company Details",
            content: <CompanyDetailsForm />
        },
        {
            label: "Consignor Details",
            content: <ConsignorFieldsForm />
        },
        {
            label: "Consignee Details",
            content: <ConsigneeDetailsForm />
        },
        {
            label: "Insurance signature",
            content: <InsuranceSignatureForm />
        },
        {
            label: "Material Details",
            content: <GoodDetailsForm />
        },
        {
            label: "Generate LR",
            content: <GenerateLR />
        }
    ]
    const [tripDetails,setTripDetails] = useState(false);
    const [activeStep,setActiveStep] = useState(0);
    const [user,setUser] = useState(currentUser.value)
    const router = useRouter();
    const tripId = router.query.id;
    const {setGlobalLoading} = useContext(GlobalLoadingContext);
    const [states,setStates] = useState([]);
    const [packaginTypes,setPackagingTypes] = useState([])
    
    const [lrDetails,setLrDetails] = useState({
        tripDetails: false,
        companyDetails: false,
        consignorDetails: false,
        consigneeDetails: false,
        insuranceDetails: false,
        goodsDetails: false
    })
    

    useEffect(() => {
        let AuthObservable = currentUser.subscribe(data => {
            setUser(data)
        })
        return () => {
            AuthObservable.unsubscribe();
        }
    },[])

    useEffect(async () => {
        if(!tripId){
            router.push({pathname:'/trip'});
        }else{
            getStates().then(data => {
                if(data){
                    setStates(data);
                }
            }).catch(err => {});
            getPackagingType().then(data => {
                if(data){
                    setPackagingTypes(data);
                }
            }).catch(err => {});

            try{
                let TripDetailsResponse = await getTripDetails(tripId);
                console.log(TripDetailsResponse)
                if(TripDetailsResponse){
                    // if(TripDetailsResponse.lr_created){
                    //     router.push(`/trip/${tripId}`);
                    //     return;
                    // }
                    setTripDetails(TripDetailsResponse);
                    getStepperDisplay()
                }
                else{
                    toast.error("Unable to get Trip");
                    router.push({pathname:'/trip'});
                }
            }catch(err){
                toast.error("Unable to get Trip");
                router.push({pathname:'/trip'});
            }
        }
    },[])

    useEffect(() => {
        window.addEventListener('resize',getStepperDisplay)

        return () => {
            window.removeEventListener('resize',getStepperDisplay)
        }
    },[])

    let getStepperDisplay = () => {
        const Stepper = document.getElementById('stepper');
        let mainContainer = document.querySelector("#main-container")
        if(!Stepper){
            return
        }
        if(490 > mainContainer.offsetWidth){
            Stepper.style.display = "none"
        }else{
            Stepper.style.display = "flex"
        }
    }

    let checkGstNumber = (idx) => {
        let gstRegex = new RegExp('^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[A-Z]{1}[0-9A-Z]{1}$')
        return gstRegex.test(idx);
    }
    let checkPanNumber = (idx) => {
        let PanRegex = new RegExp('^[A-Z]{5}[0-9]{4}[A-Z]{1}$')
        return PanRegex.test(idx);
    }
    let checkEwayNumber = (idx) => {
        let ewayRegex = new RegExp('^[0-9]{12}$')
        return ewayRegex.test(idx);
    }

    let getDate = (milliseconds) => {
        return moment(new Date(milliseconds * 1000)).format('DD-MM-YYYY')
    }

    function TripDetailsForm(){

        const [tripFormDetails,setTripFormDetails] = useState(lrDetails.tripDetails ? lrDetails.tripDetails : {
            trip_id: tripId,
            origin: tripDetails.origin_city,
            destination: tripDetails.destination_city,
            freight_amount: tripDetails.freight_amount,
            freight_paid_by: "consignee",
            gst_percentage: 0,
        })
        const [tripFormDetailsIsValid,setTripFormDetailsIsValid] = useState(false);
        useEffect(() => {
            getTableRowScaling();
            
            window.addEventListener('resize',getTableRowScaling)

            return () => {
                window.removeEventListener('resize',getTableRowScaling)
            }
        },[])

        useEffect(() => {
            let isValid = true;
            Object.keys(tripFormDetails).map(key => {
                if(tripFormDetails[key]===""){
                    isValid=false;
                }
            })
            setTripFormDetailsIsValid(isValid);
        },[tripFormDetails])

        let getTableRowScaling = () => {
            const TripDetailsForm = document.getElementById('trip-details-form');
            const TableRow = document.querySelector('tr');
            if(TableRow.offsetWidth > TripDetailsForm.offsetWidth){
                TableRow.style.transform = `scale(${TripDetailsForm.offsetWidth / TableRow.offsetWidth})`;
                TableRow.style.transformOrigin = "0% center"
            }else{
                TableRow.style.transform = `scale(1)`;
                TableRow.style.transformOrigin = "0% center"
            }
        }

        return (
            <div className="w-100" id="trip-details-form">
                <div className={`mb-lg-3 mb-md-2 mb-0 ${styles['form-index']}`}>
                    <div>1</div> Trip Details
                </div>
                <table className={`w-100 ${TripsDataStyles['table']}`}>
                    <tbody>
                        <tr>
                            <td style={{width: "1%"}}><Fab className={TripsDataStyles[tripDetails.status]} ><LocalShippingOutlined className={TripsDataStyles[tripDetails.status]} /></Fab></td>
                            <td>{getDate(tripDetails.trip_start_date)}</td>
                            <td>{tripDetails.customer_name}</td>
                            <td>{tripDetails.truck_number === "" ? <p className="text-danger">NA</p> : tripDetails.truck_number}</td>
                            <td className="d-flex justify-content-center align-items-center">

                                <div className="d-flex py-1 flex-column justify-content-between align-items-start m-auto">
                                    <div className="d-flex align-items-center justify-content-start">
                                        <span className={TripsDataStyles["dot"]} style={{backgroundColor: "rgba(45, 188, 83, 1)"}}></span>
                                        <span className="mx-1">{tripDetails.origin_city}</span>
                                    </div>
                                    <span className={TripsDataStyles["vertical-line"]}></span>
                                    <div className="d-flex align-items-center justify-content-start">
                                        <span className={TripsDataStyles["dot"]} style={{backgroundColor: "rgba(231, 104, 50, 1)"}}></span>
                                        <span className="mx-1">{tripDetails.destination_city}</span>
                                    </div>
                                </div>
                            </td>
                            <td><span className={TripsDataStyles[tripDetails.status]} style={{background: "transparent"}}><li>{tripDetails.status?.replace('_',' ')}</li></span></td>
                            <td><Icon className="mx-1"><INRIcon className="mt-1 inr-icon" /></Icon>  {tripDetails.freight_amount}</td>
                        </tr>
                    </tbody>
                </table>    
            
                <div className={`mt-lg-3 mt-md-2 mt-0 mb-2 ${styles['form-index']}`}>
                    <div>2</div> Frieght  Paid by
                </div>
                
                <RadioGroup row className="ms-4" value={tripFormDetails.freight_paid_by} onChange={(e) => setTripFormDetails({...tripFormDetails,freight_paid_by: e.target.value})} name="freight-amount-payer">
                    <FormControlLabel value="consignor" control={<Radio style={{color: 'rgba(49, 41, 104, 1)'}} />} label="Consignor" />
                    <FormControlLabel value="consignee" control={<Radio style={{color: 'rgba(49, 41, 104, 1)'}} />} label="Consignee" />
                    <FormControlLabel value="agent" control={<Radio style={{color: 'rgba(49, 41, 104, 1)'}} />} label="Agent" />
                </RadioGroup>

                <InputLabel className="mt-4 mb-2">GST Percentage*</InputLabel>
                <TextField
                    select
                    error={tripFormDetails.freight_paid_by === ""}
                    variant="outlined"
                    value={tripFormDetails.gst_percentage}
                    onChange={(e) => setTripFormDetails({...tripFormDetails,gst_percentage: e.target.value})}
                    SelectProps={{
                        native: true
                    }}
                    className="col-lg-4 col-md-5 col-10"
                >
                     <option value="">
                        Select GST
                    </option>
                    <option value={0}>0%</option>
                    <option value={5}>5%</option>
                    <option value={12}>12%</option>
                    <option value={18}>18%</option>
                </TextField>
                
                <div className="w-100 mt-4 d-flex justify-content-end align-items-center">
                    <Button variant="contained" disabled={!tripFormDetailsIsValid} color="primary" onClick={() => {setLrDetails({...lrDetails,tripDetails: tripFormDetails});setActiveStep(prev => prev + 1)}}>Save & Next</Button>
                </div>
            </div>
        )
        
    }

    function CompanyDetailsForm(){
        const [companyFormDetails,setCompanyFormDetails] = useState(lrDetails.companyDetails ? lrDetails.companyDetails : {
            company_name: user.business_name,
            company_phone: user.phone.slice(3,13),
            company_email: user.email || "",
            company_gstin_number: "",
            company_pan_number: "",
            company_address: "",
            company_pin_code: "",
            company_state: ""
        })
        const [companyFormDetailsIsValid,setCompanyFormDetailsIsValid] = useState(false);

        useEffect(() => {
            let isValid = true;
            Object.keys(companyFormDetails).map(key => {
                if((key==="company_name" || key==="company_phone" || key==="company_gstin_number" || key==="company_address") && companyFormDetails[key]===""){
                    isValid=false;
                }
            })
            if(isValid){
                isValid = checkGstNumber(companyFormDetails.company_gstin_number);
            }
            setCompanyFormDetailsIsValid(isValid);
        },[companyFormDetails])

        return (
            <>
                <div className="d-flex justify-content-center align-items-center">
                    <Avatar className={`${styles.dp} my-3`}>{user && user.name?.split(' ').map(word => word.charAt(0).toUpperCase())}</Avatar>
                </div>
                <div className={`mt-5 pt-4 d-flex flex-wrap justify-content-lg-between justify-content-md-evenly justify-content-evenly align-items-center ${styles['company-details-form-fields']}`}>
                    <TextField 
                        label="Company Name"
                        required
                        value={companyFormDetails.company_name}
                        onChange={(e) => setCompanyFormDetails({...companyFormDetails,company_name: e.target.value})}
                        required
                        error={companyFormDetails.company_name === ""}
                        className={`col-lg-5 col-md-6 col-10`}
                        variant="outlined"
                    />
                    <TextField 
                        label="GST Number"
                        className={`col-lg-5 col-md-6 col-10`}
                        variant="outlined"
                        value={companyFormDetails.company_gstin_number}
                        onChange={(e) => setCompanyFormDetails({...companyFormDetails,company_gstin_number: e.target.value})}
                        required
                        helperText="Eg. 07AZTPJ7932L1ZX"
                        error={!checkGstNumber(companyFormDetails.company_gstin_number)}
                    />
                    <TextField 
                        label="Phone"
                        type="number"
                        className={`col-lg-5 col-md-6 col-10`}
                        variant="outlined"
                        value={companyFormDetails.company_phone}
                        onChange={(e) => setCompanyFormDetails({...companyFormDetails,company_phone: e.target.value})}
                        required
                        error={companyFormDetails.company_phone === "" || companyFormDetails.company_phone.length !== 10}
                    />
                    <TextField 
                        label="PAN"
                        className={`col-lg-5 col-md-6 col-10`}
                        variant="outlined"
                        value={companyFormDetails.company_pan_number}
                        onChange={(e) => setCompanyFormDetails({...companyFormDetails,company_pan_number: e.target.value})}
                        error={!checkPanNumber(companyFormDetails.company_pan_number)}
                        helperText={"Eg. AZTPJ7932L"}
                    />
                    <TextField 
                        label="Email"
                        className={`col-lg-5 col-md-6 col-10`}
                        variant="outlined"
                        value={companyFormDetails.company_email}
                        onChange={(e) => setCompanyFormDetails({...companyFormDetails,company_email: e.target.value})}
                    />
                    <TextField 
                        label="Address"
                        className={`col-lg-5 col-md-6 col-10`}
                        variant="outlined"
                        value={companyFormDetails.company_address}
                        onChange={(e) => setCompanyFormDetails({...companyFormDetails,company_address: e.target.value})}
                        required
                        error={companyFormDetails.company_address === ""}
                    />
                    <TextField 
                        label="Pincode"
                        className={`col-lg-5 col-md-6 col-10`}
                        variant="outlined"
                        value={companyFormDetails.company_pin_code}
                        onChange={(e) => setCompanyFormDetails({...companyFormDetails,company_pin_code: e.target.value})}
                    />
                    <TextField 
                        label="State"
                        select
                        SelectProps={{
                            native: true
                        }}
                        className={`col-lg-5 col-md-6 col-10`}
                        variant="outlined"
                        value={companyFormDetails.company_state}
                        onChange={(e) => setCompanyFormDetails({...companyFormDetails,company_state: e.target.value})}
                    >
                        <option value=""></option>
                        {states.map(state => 
                            <option key={`company_state_${state}`} value={state}>{state}</option>
                        )}
                    </TextField>
                    
                </div>
                <div className={`w-100 my-3 px-lg-0 px-md-2 px-2 d-flex justify-content-between align-items-center`}>
                    <Button variant="outlined" onClick={() => {setLrDetails({...lrDetails,companyDetails: companyFormDetails});setActiveStep(prev => prev - 1)}}>Back</Button>
                    <Button variant="contained" color="primary" disabled={!companyFormDetailsIsValid} onClick={() => {setLrDetails({...lrDetails,companyDetails: companyFormDetails});setActiveStep(prev => prev + 1)}}>Save & Next</Button>
                </div>

            </>
        )
    }

    function ConsignorFieldsForm(){

        const [showExtraAddressField,setShowExtraAddressField] = useState(false);
        const [consignorFormDetails,setConsignorFormDetails] = useState(lrDetails.consignorDetails ? lrDetails.consignorDetails : {
            lr_number: tripDetails.lr_number || "",
            lr_date: moment().format('YYYY-MM-DD'),
            consignor_name: "",
            consignor_gstin_number: "",
            consignor_eway_number: "",
            consignor_address: "",
            consignor_address_2: "",
            consignor_pin_code: "",
            consignor_state: "",

        })
        const [consignorFormDetailsIsValid,setConsignorFormDetailsIsValid] = useState(false);

        useEffect(() => {
            let isValid = true;
            Object.keys(consignorFormDetails).map(key => {
                if((key==="consignor_name" || key==="lr_nmber" || key==="lr_date" || key==="consignor_gstin_number" || key==="consignor_address") && consignorFormDetails[key]===""){
                    isValid=false;
                }
            })
            if(isValid){
                isValid = checkGstNumber(consignorFormDetails.consignor_gstin_number)
            }

            setConsignorFormDetailsIsValid(isValid);
        },[consignorFormDetails])

        return (
            <div className={`${styles['cosignor-form-container']}`}>
                <div className={`mt-4 mb-3 ${styles['form-index']}`}>
                    <div>1</div> LR Details
                </div>
                <div className={`my-3 ms-3 d-flex d-flex flex-wrap justify-content-lg-between justify-content-md-evenly justify-content-evenly align-items-start ${styles['lr-details-form-fields']}`}>
                    <TextField 
                        label="LR Number"
                        type="number"
                        required
                        className={`col-lg-5 col-md-6 col-10`}
                        variant="outlined"
                        value={consignorFormDetails.lr_number}
                        error={consignorFormDetails.lr_number === ""}
                    />
                    <DatePicker 
                        label="Date"
                        inputVariant="outlined"
                        required
                        className={`col-lg-5 col-md-6 col-10`}
                        value={consignorFormDetails.lr_date === "" ? null : consignorFormDetails.lr_date}
                        error={consignorFormDetails.lr_date === ""}
                        format="DD-MM-YYYY"
                        readOnly
                        helperText=""
                    />
                </div>
            
                <div className={`mt-4 mb-3 ${styles['form-index']}`}>
                    <div>2</div> Consignor Details
                </div>

                <div className={`my-3 ms-3 d-flex d-flex flex-wrap justify-content-lg-between justify-content-md-evenly justify-content-evenly align-items-start ${styles['cosignor-details-form-fields']}`}>

                    <TextField 
                        label="Consignor Name"
                        required
                        className={`col-lg-5 col-md-6 col-10`}
                        variant="outlined"    
                        value={consignorFormDetails.consignor_name}
                        onChange={(e) => setConsignorFormDetails({...consignorFormDetails,consignor_name: e.target.value})}
                        error={consignorFormDetails.consignor_name === ""}
                    />
                    <TextField 
                        label="GST Number"
                        required
                        className={`col-lg-5 col-md-6 col-10`}
                        variant="outlined"    
                        value={consignorFormDetails.consignor_gstin_number}
                        onChange={(e) => setConsignorFormDetails({...consignorFormDetails,consignor_gstin_number: e.target.value})}
                        helperText={"Eg. 07AZTPJ7932L1ZX"}
                        error={!checkGstNumber(consignorFormDetails.consignor_gstin_number)}
                    />
                    <TextField 
                        label="E-way Bill Number"
                        className={`col-lg-5 col-md-6 col-10`}
                        variant="outlined"  
                        value={consignorFormDetails.consignor_eway_number}
                        error={!checkEwayNumber(consignorFormDetails.consignor_eway_number)}
                        helperText={"Eg. 180000013456"}
                        onChange={(e) => setConsignorFormDetails({...consignorFormDetails,consignor_eway_number: e.target.value})}
                    />
                </div>

                <div className={`mt-4 mb-3 ${styles['form-index']}`}>
                    <div>3</div> Consignor Address
                </div>

                <div className={`ms-3 mt-3`}>
                    <TextField 
                        label="Address"
                        required
                        multiline
                        rows={3}
                        className="col-10"
                        variant="outlined"
                        value={consignorFormDetails.consignor_address}
                        onChange={(e) => setConsignorFormDetails({...consignorFormDetails,consignor_address: e.target.value})}
                        error={consignorFormDetails.consignor_address === ""}
                    />
                    <Button className={`mt-3 ${styles['add-street-address-2']}`} onClick={() => setShowExtraAddressField(!showExtraAddressField)} >{!showExtraAddressField ? <AddOutlined /> : <RemoveOutlined />} Street Address 2 (optional)</Button>

                    {showExtraAddressField && 
                         <TextField 
                         label="Address"
                         multiline
                         rows={3}
                         className="mt-3 col-10"
                         variant="outlined"
                         value={consignorFormDetails.consignor_address_2}
                        onChange={(e) => setConsignorFormDetails({...consignorFormDetails,consignor_address_2: e.target.value})}
                        />
                    }

                    <div className="mt-3 d-flex align-items-start flex-wrap">
                        <TextField 
                            label="Pin Code"
                            variant="outlined"
                            type="number"
                            className="me-3 mb-2"
                            value={consignorFormDetails.consignor_pin_code}
                            onChange={(e) => setConsignorFormDetails({...consignorFormDetails,consignor_pin_code: e.target.value})}
                        />
                        <TextField 
                            label="State"
                            select
                            SelectProps={{
                                native: true
                            }}
                            variant="outlined"
                            value={consignorFormDetails.consignor_state}
                            onChange={(e) => setConsignorFormDetails({...consignorFormDetails,consignor_state: e.target.value})}
                        >
                            <option value=""></option>
                            {states.map(state => 
                                <option key={`consignor_state_${state}`} value={state}>{state}</option>
                            )}
                        </TextField>
                    </div>
                </div>
                
                <div className={`w-100 my-3 px-lg-0 px-md-2 px-2 d-flex justify-content-between align-items-center`}>
                    <Button variant="outlined" onClick={() => {setLrDetails({...lrDetails,consignorDetails: consignorFormDetails});setActiveStep(prev => prev - 1)}}>Back</Button>
                    <Button variant="contained" color="primary" disabled={!consignorFormDetailsIsValid} onClick={() => {setLrDetails({...lrDetails,consignorDetails: consignorFormDetails});setActiveStep(prev => prev + 1)}}>Save & Next</Button>
                </div>    

            </div>

        )
        
    }

    function ConsigneeDetailsForm() {
        
        const [showExtraAddressField,setShowExtraAddressField] = useState(false);

        const [consigneeFormDetails,setConsigneeFormDetails] = useState(lrDetails.consigneeDetails ? lrDetails.consigneeDetails : {
            lr_number: tripDetails.lr_number || "",
            lr_date: moment().format('YYYY-MM-DD'),
            consignee_name: "",
            consignee_gstin_number: "",
            consignee_address: "",
            consignee_address_2: "",
            consignee_pin_code: "",
            consignee_state: "",

        })
        const [consigneeFormDetailsIsValid,setConsigneeFormDetailsIsValid] = useState(false);

        useEffect(() => {
            let isValid = true;
            Object.keys(consigneeFormDetails).map(key => {
                if((key==="consigee_name" || key==="lr_nmber" || key==="lr_date" || key==="consignee_gstin_number" || key==="consignee_address") && consigneeFormDetails[key]===""){
                    
                    isValid=false;
                }
            })

            if(isValid){
                isValid = checkGstNumber(consigneeFormDetails.consignee_gstin_number);
            }
            setConsigneeFormDetailsIsValid(isValid);
        },[consigneeFormDetails])

        return (
            <div className={`${styles['cosignee-form-container']}`}>
                <div className={`mt-4 mb-3 ${styles['form-index']}`}>
                    <div>1</div> LR Details
                </div>
                <div className={`my-3 ms-3 d-flex d-flex flex-wrap justify-content-lg-between justify-content-md-evenly justify-content-evenly align-items-start ${styles['lr-details-form-fields']}`}>
                    <TextField 
                        label="LR Number"
                        type="number"
                        required
                        className={`col-lg-5 col-md-6 col-10`}
                        variant="outlined"
                        value={consigneeFormDetails.lr_number}
                        error={consigneeFormDetails.lr_number === ""}
                    />
                    <DatePicker 
                        label="Date"
                        inputVariant="outlined"
                        required
                        className={`col-lg-5 col-md-6 col-10`}
                        value={consigneeFormDetails.lr_date === "" ? null : consigneeFormDetails.lr_date}
                        error={consigneeFormDetails.lr_date === ""}
                        format="DD-MM-YYYY"
                        readOnly
                        helperText=""
                    />
                </div>
            
                <div className={`mt-4 mb-3 ${styles['form-index']}`}>
                    <div>2</div> Consignee Details
                </div>

                <div className={`my-3 ms-3 d-flex d-flex flex-wrap justify-content-lg-between justify-content-md-evenly justify-content-evenly align-items-start ${styles['cosignee-details-form-fields']}`}>

                    <TextField 
                        label="Consignee Name"
                        required
                        className={`col-lg-5 col-md-6 col-10`}
                        variant="outlined"    
                        value={consigneeFormDetails.consignee_name}
                        onChange={(e) => setConsigneeFormDetails({...consigneeFormDetails,consignee_name: e.target.value})}
                        error={consigneeFormDetails.consignee_name === ""}
                    />
                    <TextField 
                        label="GST Number"
                        required
                        className={`col-lg-5 col-md-6 col-10`}
                        variant="outlined"  
                        value={consigneeFormDetails.consignee_gstin_number}
                        onChange={(e) => setConsigneeFormDetails({...consigneeFormDetails,consignee_gstin_number: e.target.value})}
                        error={!checkGstNumber(consigneeFormDetails.consignee_gstin_number)}
                        helperText={"Eg. 07AZTPJ7932L1ZX"}  
                    />
                </div>

                <div className={`mt-4 mb-3 ${styles['form-index']}`}>
                    <div>3</div> Consignee Address
                </div>

                <div className={`ms-3 mt-3`}>
                    <TextField 
                        label="Address"
                        required
                        multiline
                        rows={3}
                        className="col-10"
                        variant="outlined"
                        value={consigneeFormDetails.consignee_address}
                        onChange={(e) => setConsigneeFormDetails({...consigneeFormDetails,consignee_address: e.target.value})}
                        error={consigneeFormDetails.consignee_address === ""}
                    />
                    <Button className={`mt-3 ${styles['add-street-address-2']}`} onClick={() => setShowExtraAddressField(!showExtraAddressField)} >{!showExtraAddressField ? <AddOutlined /> : <RemoveOutlined />} Street Address 2 (optional)</Button>

                    {showExtraAddressField && 
                         <TextField 
                         label="Address"
                         required
                         multiline
                         rows={3}
                         className="mt-3 col-10"
                         variant="outlined"
                         value={consigneeFormDetails.consignee_address_2}
                         onChange={(e) => setConsigneeFormDetails({...consigneeFormDetails,consignee_address_2: e.target.value})}
                        />
                    }

                    <div className="mt-3 d-flex align-items-start flex-wrap">
                        <TextField 
                            label="Pin Code"
                            variant="outlined"
                            type="number"
                            className="me-3 mb-2"
                            value={consigneeFormDetails.consignee_pin_code}
                            onChange={(e) => setConsigneeFormDetails({...consigneeFormDetails,consignee_pin_code: e.target.value})}
                        />
                        <TextField 
                            label="State"
                            select
                            SelectProps={{
                                native: true
                            }}
                            variant="outlined"
                            value={consigneeFormDetails.consignee_state}
                            onChange={(e) => setConsigneeFormDetails({...consigneeFormDetails,consignee_state: e.target.value})}
                        >
                            <option value=""></option>
                            {states.map(state => 
                                <option key={`consignee_state_${state}`} value={state}>{state}</option>
                            )}
                        </TextField>
                    </div>
                </div>
                
                <div className={`w-100 my-3 px-lg-0 px-md-2 px-2 d-flex justify-content-between align-items-center`}>
                    <Button variant="outlined" onClick={() => {setLrDetails({...lrDetails,consigneeDetails: consigneeFormDetails});setActiveStep(prev => prev - 1)}}>Back</Button>
                    <Button variant="contained" disabled={!consigneeFormDetailsIsValid} color="primary" onClick={() => {setLrDetails({...lrDetails,consigneeDetails: consigneeFormDetails});setActiveStep(prev => prev + 1)}}>Save & Next</Button>
                </div>    

            </div>
        )
    }

    function InsuranceSignatureForm(){

        const [imageSrc,setImageSrc] = useState(false);
        const [signatureSrc,setSignatureSrc] = useState(false);
        const [imageUploadMethod,setImageUploadMethod] = useState(0);
        const [openSignaturePad,setOpenSignaturePad] = useState(false);
        const [uploadLoader,setUploadLoader] = useState(false)
        const [insuranceFormDetails,setInsuranceFormDetails] = useState(lrDetails.insuranceDetails ? lrDetails.insuranceDetails : {
            insurance_provider: "", 
            insurance_policy_number: "",
            insured_on_date: "",
            insurance_risk_type: "",
            insurance_value: "",
            goods_invoice_number: "",
            invoice_value: "",
            signature_s3_key: "",
            is_insured: true
        })

        console.log(insuranceFormDetails)

        let Save = (dataURL) => {
            setSignatureSrc(dataURL)
            setOpenSignaturePad(false);
            setImageSrc(false);
        }

        let Cancel = () => {
            setImageSrc(false);
            setSignatureSrc(false);
            setInsuranceFormDetails({...insuranceFormDetails,signature_s3_key: ""})
        }

        function dataURItoBlob(dataURI) {
            // convert base64/URLEncoded data component to raw binary data held in a string
            var byteString;
            if (dataURI.split(',')[0].indexOf('base64') >= 0)
                byteString = atob(dataURI.split(',')[1]);
            else
                byteString = unescape(dataURI.split(',')[1]);
        
            // separate out the mime component
            var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        
            // write the bytes of the string to a typed array
            var ia = new Uint8Array(byteString.length);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
        
            return new Blob([ia], {type:mimeString});
        }

        let UploadSignature = async () => {
            if(signatureSrc !== false){
                setUploadLoader(true)
                try{
                    
                    let imageLink = await uploadSignature(dataURItoBlob(signatureSrc));
                    setInsuranceFormDetails({...insuranceFormDetails,signature_s3_key: imageLink})
                    setUploadLoader(false)
                }catch(err){
                    toast.error("Unable to Upload Image")
                    setUploadLoader(false)
                }
            }else if(imageSrc !== false){
                setUploadLoader(true)
                try{
                    
                    let imageLink = await uploadSignature(imageSrc);
                    console.log(imageLink)
                    setInsuranceFormDetails({...insuranceFormDetails,signature_s3_key: imageLink})
                    setUploadLoader(false)
                }catch(err){
                    toast.error("Unable to Upload Image")
                    setUploadLoader(false)
                }
                
            }
        }

        return (
            <div className={`${styles['insurance-signature-form']}`}>

                <div className={`mt-4 mb-3 ${styles['form-index']}`}>
                    Insured
                </div>
                <RadioGroup row className="ms-4" value={insuranceFormDetails.is_insured} onChange={(e) => setInsuranceFormDetails({...insuranceFormDetails,is_insured: e.target.value === "true"})} name="is-insured">
                    <FormControlLabel value={true} control={<Radio style={{color: 'rgba(49, 41, 104, 1)'}} />} label="Yes" />
                    <FormControlLabel value={false} control={<Radio style={{color: 'rgba(49, 41, 104, 1)'}} />} label="No" />
                </RadioGroup>

                {insuranceFormDetails.is_insured===true && 
                <>
                <div className={`mt-4 mb-3 ${styles['form-index']}`}>
                    <div>1</div> Add Insurance
                </div>

                <div className={`my-3 ms-3 d-flex d-flex flex-wrap justify-content-lg-between justify-content-md-start justify-content-start align-items-center ${styles['add-insurance-form-fields']}`}>
                    <TextField 
                        label="Insurance Provider"
                        className={`col-lg-5 col-md-6 col-10`}
                        variant="outlined"
                        value={insuranceFormDetails.insurance_provider}
                        onChange={(e) => setInsuranceFormDetails({...insuranceFormDetails,insurance_provider: e.target.value})}
                    />
                    <TextField 
                        label="Insurance Policy No."
                        className={`col-lg-5 col-md-6 col-10`}
                        variant="outlined"
                        value={insuranceFormDetails.insurance_policy_number}
                        onChange={(e) => setInsuranceFormDetails({...insuranceFormDetails,insurance_policy_number: e.target.value})}
                    />
                    <DatePicker 
                        label="Date"
                        inputVariant="outlined"
                        required
                        className={`col-lg-5 col-md-6 col-10`}
                        value={insuranceFormDetails.insured_on_date === "" ? null : insuranceFormDetails.insured_on_date}
                        error={insuranceFormDetails.insured_on_date === ""}
                        onChange={(e) => setInsuranceFormDetails({...insuranceFormDetails,insured_on_date: e})}
                        format="DD-MM-YYYY"
                        helperText=""
                    />

                    <div class={`col-lg-5 col-md-6 col-10 d-flex flex-column justify-cotent-between ${styles['risk-types']}`}>
                        Risk Type
                        <div className={`d-flex align-items-center flex-wrap`}>
                            <Button variant={insuranceFormDetails.insurance_risk_type==="high" ? "contained" : "outlined"} className={insuranceFormDetails.insurance_risk_type==="high" ? `${styles['active']}` : ""} onClick={() => setInsuranceFormDetails({...insuranceFormDetails,insurance_risk_type: "high"})}>High</Button>
                            <Button variant={insuranceFormDetails.insurance_risk_type==="low" ? "contained" : "outlined"} className={insuranceFormDetails.insurance_risk_type==="low" ? `${styles['active']}` : ""} onClick={() => setInsuranceFormDetails({...insuranceFormDetails,insurance_risk_type: "low"})}>Low</Button>
                            
                        </div>
                    </div>
                    <TextField variant="outlined" className={`col-lg-5 col-md-6 col-10`} value={insuranceFormDetails.insurance_value} onChange={(e) => setInsuranceFormDetails({...insuranceFormDetails,insurance_value: e.target.value})} label="Insured Value" type="number" />
                </div>  

                <div className={`w-100 mt-5 d-flex flex-wrap justify-content-lg-between justify-content-md-start justify-content-evenly align-items-start ${styles['insurance-details-form-fields']}`}>
                    <div className="col-lg-5 col-md-8 col-11">
                        <div className={`mb-3 ${styles['form-index']}`}>
                            <div>2</div> Add Insurance
                        </div>

                        <div className={`ms-3`}>
                            <TextField 
                                label="Invoice Value"
                                className={`col-12 mb-3`}
                                variant="outlined"
                                value={insuranceFormDetails.invoice_value}
                                onChange={(e) => setInsuranceFormDetails({...insuranceFormDetails,invoice_value: e.target.value})}
                            />
                            <TextField 
                                label="Good Invoice No."
                                className={`col-12 mb-3`}
                                variant="outlined"
                                value={insuranceFormDetails.goods_invoice_number}
                                onChange={(e) => setInsuranceFormDetails({...insuranceFormDetails,goods_invoice_number: e.target.value})}
                            />
                        </div>

                    </div>
                    <div className="col-lg-5 col-md-8 col-11">
                        <div className={`mb-3 ${styles['form-index']}`}>
                            <div>3</div> Add Signature
                        </div>
                        
                        <div className="ms-3">
                            <div className={`d-flex my-2 ${styles['image-upload-method']}`}>
                                <span onClick={() => setImageUploadMethod(0)} className={`px-2 py-1 ${imageUploadMethod===0 && styles['active']}`}>Draw</span>
                                <span onClick={() => setImageUploadMethod(1)} className={`px-2 py-1 ${imageUploadMethod===1 && styles['active']}`}>Upload</span>
                            </div>
                            <div className={`col-12 position-relative d-flex flex-column justify-content-center align-items-center ${styles['image-upload-container']}`}>

                                {imageUploadMethod===1 ? 
                                <>
                                    {imageSrc===false ? 
                                        <>
                                            <span className={`mb-4`}>Upload a signature or scan</span>
                                            <Button variant="contained" onClick={() => document.getElementById('signature-input').click()}>Select Image</Button>
                                            <input type="file" id="signature-input" onChange={(e) => {setImageSrc(e.target.files[0]);setSignatureSrc(false)}} />
                                        </>

                                    :   
                                        <>
                                                <img src={URL.createObjectURL(imageSrc)}></img>
                                        </>
                                
                                    }
                                </>
                                :
                                
                                <>
                                    {signatureSrc===false ?    
                                    <>                             
                                        <span className={`mb-4`}>Draw signature</span>
                                        <Button variant="contained" onClick={() => setOpenSignaturePad(true)}>Draw</Button>
                                    </>
                                    :
                                     <img src={signatureSrc} className={`${styles['signature-img-container']}`}></img>
                                    }

                                    <SignaturePadDialog open={openSignaturePad} save={Save} close={() => setOpenSignaturePad(false)} />

                                </>
                                
                                }

                                {uploadLoader && <div className={`position-absolute w-100 h-100 d-flex justify-content-center align-items-center ${styles['uploading-loder']}`}>
                                    <div className="d-flex flex-column align-items-center">
                                        <CloudUploadOutlined />
                                        Uploading...
                                    </div>
                                </div>}
                                
                            </div>

                            <p className={`mt-4 ${styles['upload-image-info-text']}`}>By signing this document with an electronic signature. I agree that such signature will be as valid as handwritten signature to the extent allowed by local law</p>

                            <div className="mt-4 d-flex justify-content-around align-items-center">
                                <Button variant="contained" disabled={uploadLoader} color="default" onClick={Cancel}>Cancel</Button>
                                <Button variant="contained" onClick={UploadSignature} className={styles['accept-and-sign-btn']} disabled={uploadLoader || insuranceFormDetails.signature_s3_key !== ""}>Accept & Sign</Button>
                            </div>
                        </div>
                    </div>
                </div>              

                <div className="mt-5 d-flex justify-content-center align-items-center">
                    <span className={`${styles['insurance-signature-info-text']} p-3`}>These information ware added during opening account .please check if it is correct and continue final resistration.</span>
                </div>

                </> }

                <div className={`w-100 my-3 px-lg-0 px-md-2 px-2 d-flex justify-content-between align-items-center`}>
                    <Button variant="outlined" onClick={() => {setLrDetails({...lrDetails,insuranceDetails: insuranceFormDetails});setActiveStep(prev => prev - 1)}}>Back</Button>
                    <Button variant="contained" color="primary" onClick={() => {setLrDetails({...lrDetails,insuranceDetails: insuranceFormDetails});setActiveStep(prev => prev + 1)}}>Save & Next</Button>
                </div> 

            </div>
        )
    }

    function GoodDetailsForm(){

        const [goodsFormDetails,setGoodsFormDetails] = useState(lrDetails.goodsDetails ? lrDetails.goodsDetails : {
            packaging_type: "",
            material_name: "",
            container_name: "",
            hsn_code: "",
            weight: "",
            weight_unit: "kg",
            rate: "",
            rate_unit: "kg"
        })
        const [goodsFormDetailsIsValid,setGoodsFormDetailsIsValid] = useState(false);

        useEffect(() => {
            let isValid = true;
            Object.keys(goodsFormDetails).map(key => {
                if((key==="packaging_type" || key==="material_name" || key==="weight" || key==="weight_unit" || key==="rate" || key==="rate_unit") && goodsFormDetails[key]===""){
                    console.log(key,goodsFormDetails[key])    
                    isValid=false;
                }
            })
            setGoodsFormDetailsIsValid(isValid);
        },[goodsFormDetails])

        return (
            <div className={`${styles['good-details-form']}`}>
                <div className={`mt-4 mb-3 ${styles['form-index']}`}>
                    <div>1</div> Add Good Types
                </div>

                <div className={`my-3 ms-3 d-flex d-flex flex-wrap justify-content-lg-between justify-content-md-evenly justify-content-evenly align-items-start ${styles['good-details-form-fields']}`}>

                    <TextField 
                        label="Packaging Type"
                        variant="outlined"
                        select 
                        SelectProps={{
                            native: true
                        }}
                        className={`col-lg-5 col-md-6 col-10`}
                        value={goodsFormDetails.packaging_type}
                        onChange={(e) => setGoodsFormDetails({...goodsFormDetails,packaging_type: e.target.value})}
                        required
                        error={goodsFormDetails.packaging_type === ""}
                    >
                        <option value=""></option>
                        {packaginTypes.map(pacakageType => 
                            <option key={`${pacakageType}`} value={pacakageType}>{pacakageType}</option>
                        )}
                    </TextField>
                    <TextField 
                        label="Material Name"
                        variant="outlined"
                        className={`col-lg-5 col-md-6 col-10`}
                        value={goodsFormDetails.material_name}
                        onChange={(e) => setGoodsFormDetails({...goodsFormDetails,material_name: e.target.value})}
                        required
                        error={goodsFormDetails.material_name === ""}
                    />
                    <TextField 
                        label="Container Name"
                        variant="outlined"
                        className={`col-lg-5 col-md-6 col-10`}
                        value={goodsFormDetails.container_name}
                        onChange={(e) => setGoodsFormDetails({...goodsFormDetails,container_name: e.target.value})}
                    />
                    <TextField 
                        label="HSN Name"
                        variant="outlined"
                        className={`col-lg-5 col-md-6 col-10`}
                        value={goodsFormDetails.hsn_code}
                        onChange={(e) => setGoodsFormDetails({...goodsFormDetails,hsn_code: e.target.value})}
                    />

                    <div className={`d-flex flex-column justify-content-between col-lg-5 col-md-6 col-10`}>
                        Actual Weight
                        <div className="w-100 d-flex justify-content-between align-items-center">

                            <TextField 
                                label="Weight"
                                className="col-8"
                                variant="outlined"
                                value={goodsFormDetails.weight}
                                onChange={(e) => setGoodsFormDetails({...goodsFormDetails,weight: e.target.value})}
                                required
                                error={goodsFormDetails.weight === ""}
                            />
                            <TextField 
                                select
                                SelectProps={{
                                    native: true
                                }}
                                className="col-3"
                                variant="outlined"
                                value={goodsFormDetails.weight_unit}
                                onChange={(e) => setGoodsFormDetails({...goodsFormDetails,weight_unit: e.target.value})}
                                required
                                error={goodsFormDetails.weight_unit === ""}
                                
                            >
                                <option value="kg">kg</option>
                                <option value="mt">mt</option>
                                <option value="qtl">qtl</option>
                                <option value="ltr">ltr</option>

                            </TextField>

                        </div>
                    </div>
                    <div className={`d-flex flex-column justify-content-between col-lg-5 col-md-6 col-10`}>
                        Actual Rate
                        <div className="w-100 d-flex justify-content-between align-items-center">

                            <TextField 
                                label="Rate"
                                className="col-8"
                                variant="outlined"
                                value={goodsFormDetails.rate}
                                onChange={(e) => setGoodsFormDetails({...goodsFormDetails,rate: e.target.value})}
                                required
                                error={goodsFormDetails.rate === ""}
                            />
                            <TextField 
                                select
                                SelectProps={{
                                    native: true
                                }}
                                className="col-3"
                                variant="outlined"
                                value={goodsFormDetails.rate_unit}
                                onChange={(e) => setGoodsFormDetails({...goodsFormDetails,rate_unit: e.target.value})}
                                required
                                error={goodsFormDetails.rate_unit === ""}
                            >
                                <option value="kg">kg</option>
                                <option value="mt">mt</option>
                                <option value="qtl">qtl</option>
                                <option value="ltr">ltr</option>

                            </TextField>

                        </div>
                    </div>

                </div>
                
                <div className={`w-100 my-3 px-lg-0 px-md-2 px-2 d-flex justify-content-between align-items-center`}>
                    <Button variant="outlined" onClick={() => {setLrDetails({...lrDetails,goodsDetails: goodsFormDetails});setActiveStep(prev => prev - 1)}}>Back</Button>
                    <Button variant="contained" color="primary" disabled={!goodsFormDetailsIsValid} onClick={() => {setLrDetails({...lrDetails,goodsDetails: goodsFormDetails});setActiveStep(prev => prev + 1)}}>Save & Next</Button>
                </div> 

            </div>
        )
    }

    function VerticalStepperIcon(props){
        return (
            <span className={`${styles['vertical-stepper-icon']}`}>
                {props.idx}
            </span>
        )
    }

    function GenerateLR(){
        return (
            <div className={`my-2 ${styles['vertical-stepper']}`}>
                <Stepper className={`w-100`} activeStep={5} orientation="vertical">
                    {LRSteps.map((step,i) => 
                          {return (i!==6 && 
                                <Step className="w-100 text-start" key={`vertical_${step.label}`} icon>
                                    <StepLabel icon={<VerticalStepperIcon idx={i+1} />} className="w-100 d-flex justify-content-between">
                                        <div className="w-100 d-flex justify-content-between align-items-center">
                                            {step.label}
                                            <div className="d-flex justify-content-between align-items-center">
                                                <IconButton className="me-1" onClick={() => setActiveStep(i)}><EditOutlined/></IconButton>
                                                <CheckCircleSharp style={{color: "rgba(45, 188, 83, 1)"}} />
                                            </div>
                                        </div>
                                    </StepLabel>
                                </Step>
                            )
                            }
                        
                    )}
                </Stepper>
                <div className="mt-4 d-flex justify-content-center align-items-center">            
                <Button variant="contained" onClick={CreateLR} className={`w-50 px-lg-0 px-md-0 px-2 py-lg-3 py-md-3 px-1 ${styles['generate-lr-btn']}`}>Generate receipt</Button>
                </div>
            </div>
        )
    }

    async function CreateLR(){
        
        
        setGlobalLoading(true);
        try{
            let createLRResponse = await createLR(lrDetails);
            console.log(createLRResponse)
            if(createLRResponse && createLRResponse.success){
                
                window.open(createLRResponse.link,'_blank')
                setGlobalLoading(false)
                setActiveStep(7)
            }
            else{
                toast.error("Unable to Create LR");
                setGlobalLoading(false)
            }
        }catch(err){
            toast.error("Unable to Create LR");
            setGlobalLoading(false)
        }
    }

    return (
        <>
            {tripDetails===false ? <div className="w-100 mt-5 py-3 text-center p-0"><PulseLoader size={15} margin={2} color="#36D7B7" /></div> 
                :
            <div className="w-100 mt-4 mb-2 px-lg-3 px-md-2 px-1">
                <Stepper alternativeLabel activeStep={activeStep} id="stepper">
                    {LRSteps.map(step => 
                        <Step key={step.label}>
                            <StepLabel>{step.label}</StepLabel>
                        </Step>
                    )}
                </Stepper>

                <h4 className={`mt-4 mx-lg-3 mx-md-2 mx-1 mb-2 ${styles['active-form-label']}`}>{LRSteps[(activeStep < 6) ? activeStep : 6].label}</h4>                        
                <div className={`w-100 border-3 px-lg-3 px-md-2 px-1 py-3 ${styles['active-form-container']}`}>
                    {LRSteps[(activeStep < 6) ? activeStep : 6].content}
                </div>
            </div> }   
        </>
        
    )
}