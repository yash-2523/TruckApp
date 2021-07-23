import { Step, Stepper, StepLabel, FormControlLabel, RadioGroup, Radio, TextField, Avatar, InputLabel, InputAdornment } from "@material-ui/core";
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
import uploadSizeValidation from "../../../uploadSizeValidation";

export default function TripLR(){

    const LRSteps = [
        {
            label: "Trip Details",
            content: <TripDetailsForm />
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
            label: "Goods Details",
            content: <GoodDetailsForm />
        },
        {
            label: "signature",
            content: <SignatureDetails />
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
        consignorDetails: false,
        consigneeDetails: false,
        signatureDetails: false,
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
            truck_number: tripDetails.truck_number
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
                if(key!=="truck_number" && tripFormDetails[key]===""){
                    isValid=false;
                }
            })
            setTripFormDetailsIsValid(isValid);
        },[tripFormDetails])

        let getTableRowScaling = () => {
            const TripDetailsForm = document.getElementById('trip-details-form');
            const TableRow = document.querySelectorAll('tr');
            for(let i=0;i<TableRow.length;i++){
                if(TableRow[i].offsetWidth > TripDetailsForm.offsetWidth){
                    TableRow[i].style.transform = `scale(${TripDetailsForm.offsetWidth / TableRow[i].offsetWidth})`;
                    TableRow[i].style.transformOrigin = "0% center"
                }else{
                    TableRow[i].style.transform = `scale(1)`;
                    TableRow[i].style.transformOrigin = "0% center"
                }
            }
            
        }

        return (
            <div className="w-100" id="trip-details-form">
                <div className={`mb-lg-3 mb-md-2 mb-0 ${styles['form-index']}`}>
                    <div>1</div> Trip Details
                </div>
                <table className={`w-100 ${TripsDataStyles['table']} ${styles['trip-details-info']}`}>
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
                            {/* <td><Icon className="mx-1"><INRIcon className="mt-1 inr-icon" /></Icon>  {tripDetails.freight_amount}</td> */}
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan="3">
                                <div className="w-100 d-flex justify-content-between align-items-center p-2">
                                    <p>Freight Amount*</p>
                                    <span><Icon className="mx-1"><INRIcon className="mt-1 inr-icon" /></Icon>  {tripDetails.freight_amount}</span>
                                </div>
                            </td>
                        </tr>
                    </tfoot>
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
                    <Button variant="outlined" onClick={() => router.push(`/trip/${tripId}`)} className="me-2">Cancel</Button>
                    <Button variant="contained" disabled={!tripFormDetailsIsValid} color="primary" onClick={() => {setLrDetails({...lrDetails,tripDetails: tripFormDetails});setActiveStep(prev => prev + 1)}}>Save & Next</Button>
                </div>
            </div>
        )
        
    }

    function ConsignorFieldsForm(){

        const [showExtraAddressField,setShowExtraAddressField] = useState(false);
        const [consignorFormDetails,setConsignorFormDetails] = useState(lrDetails.consignorDetails ? lrDetails.consignorDetails : {
            lr_number: tripDetails.lr_number || "",
            lr_date: moment().format('YYYY-MM-DD'),
            consignor_name: "",
            consignor_gstin_number: "",
            consignor_phone: "",
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
                if((key==="consignor_name" || key==="lr_nmber" || key==="lr_date" || key==="consignor_gstin_number" || key==="consignor_phone" || key==="consignor_address") && consignorFormDetails[key]===""){
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
                    <TextField 
                        label="Mobile Number"
                        className={`col-lg-5 col-md-6 col-10`}
                        variant="outlined" 
                        type="number" 
                        required
                        value={consignorFormDetails.consignor_phone}
                        onChange={(e) => setConsignorFormDetails({...consignorFormDetails,consignor_phone: e.target.value})}
                        error={consignorFormDetails.consignor_phone==="" || consignorFormDetails.consignor_phone.length !== 10}
                    />
                    <TextField 
                        label="Invoice Number"
                        className={`col-lg-12 col-md-6 col-10`}
                        variant="outlined" 
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
                
                <div className={`w-100 my-3 px-lg-0 px-md-2 px-2 d-flex justify-content-lg-between justify-content-md-between flex-wrap justify-content-start align-items-center`} style={{columnGap: "0.7rem",rowGap: "0.7rem"}}>
                    <Button variant="outlined" onClick={() => {setLrDetails({...lrDetails,consignorDetails: consignorFormDetails});setActiveStep(prev => prev - 1)}}>Back</Button>
                    <div className="d-flex align-itens-center">
                        <Button variant="outlined" onClick={() => router.push(`/trip/${tripId}`)} className="me-2">Cancel</Button>
                        <Button variant="contained" color="primary" disabled={!consignorFormDetailsIsValid} onClick={() => {setLrDetails({...lrDetails,consignorDetails: consignorFormDetails});setActiveStep(prev => prev + 1)}}>Save & Next</Button>
                    </div>
                    
                </div>    

            </div>

        )
        
    }

    function ConsigneeDetailsForm() {
        
        const [showExtraAddressField,setShowExtraAddressField] = useState(false);

        const [consigneeFormDetails,setConsigneeFormDetails] = useState(lrDetails.consigneeDetails ? lrDetails.consigneeDetails : {
            consignee_name: "",
            consignee_gstin_number: "",
            consignee_address: "",
            consignee_address_2: "",
            consignee_pin_code: "",
            consignee_state: "",
            consignee_phone: ""

        })
        const [consigneeFormDetailsIsValid,setConsigneeFormDetailsIsValid] = useState(false);

        useEffect(() => {
            let isValid = true;
            Object.keys(consigneeFormDetails).map(key => {
                if((key==="consigee_name" || key==="consignee_gstin_number" || key==="consignee_phone" || key==="consignee_address") && consigneeFormDetails[key]===""){
                    
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
                    <div>1</div> Consignee Details
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
                    <TextField 
                        label="Mobile Number"
                        className={`col-lg-5 col-md-6 col-10`}
                        variant="outlined"  
                        required
                        value={consigneeFormDetails.consignee_phone}
                        onChange={(e) => setConsigneeFormDetails({...consigneeFormDetails,consignee_phone: e.target.value})}
                        error={consigneeFormDetails.consignee_phone==="" || consigneeFormDetails.consignee_phone.length != 10}
                    />
                </div>

                <div className={`mt-4 mb-3 ${styles['form-index']}`}>
                    <div>2</div> Consignee Address
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

                <div className={`w-100 my-3 px-lg-0 px-md-2 px-2 d-flex justify-content-lg-between justify-content-md-between flex-wrap justify-content-start align-items-center`} style={{columnGap: "0.7rem",rowGap: "0.7rem"}}>
                    <Button variant="outlined" onClick={() => {setLrDetails({...lrDetails,consigneeDetails: consigneeFormDetails});setActiveStep(prev => prev - 1)}}>Back</Button>
                    <div className="d-flex align-itens-center">
                        <Button variant="outlined" onClick={() => router.push(`/trip/${tripId}`)} className="me-2">Cancel</Button>
                        <Button variant="contained" disabled={!consigneeFormDetailsIsValid} color="primary" onClick={() => {setLrDetails({...lrDetails,consigneeDetails: consigneeFormDetails});setActiveStep(prev => prev + 1)}}>Save & Next</Button>
                    </div>
                    
                </div>   

            </div>
        )
    }

    function SignatureDetails(){
        const [openSignaturePad,setOpenSignaturePad] = useState(false);
        const [uploadLoader,setUploadLoader] = useState(false);
        const [fileUploadError,setFileUploadError] = useState(false);
        const [signatureDetails,setSignatureDetails] = useState(lrDetails.signatureDetails ? lrDetails.signatureDetails : {
            signature_s3_key: "",
            imageUploadMethod: 0,
            imageSrc: false,
            signatureSrc: false
        })

        let Save = (dataURL) => {
            setOpenSignaturePad(false);
            setSignatureDetails({...signatureDetails,imageSrc: false,signatureSrc: dataURL})
        }

        let Cancel = () => {
            
            setSignatureDetails({...signatureDetails,signature_s3_key: "",imageSrc: false,signatureSrc: false})
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
            if(signatureDetails.signatureSrc !== false){
                setUploadLoader(true)
                try{
                    
                    let imageLink = await uploadSignature(dataURItoBlob(signatureDetails.signatureSrc),user.identityId);
                    setSignatureDetails({...signatureDetails,signature_s3_key: imageLink})
                    setUploadLoader(false)
                }catch(err){
                    toast.error("Unable to Upload Image")
                    setUploadLoader(false)
                }
            }else if(signatureDetails.imageSrc !== false){
                setUploadLoader(true)
                try{
                    
                    let imageLink = await uploadSignature(signatureDetails.imageSrc,user.identityId);
                    setSignatureDetails({...signatureDetails,signature_s3_key: imageLink})
                    setUploadLoader(false)
                }catch(err){
                    toast.error("Unable to Upload Image")
                    setUploadLoader(false)
                }
                
            }
        }
        return (
            <>
            <div className={`w-100 ${styles['signature-form']}`}>
                <div className="col-11">
                    <div className={`mb-3 ${styles['form-index']}`}>
                        <div>1</div> Add Signature
                    </div>
                    
                    <div className="ms-3">
                        <div className={`d-flex my-2 ${styles['image-upload-method']}`}>
                            <span onClick={() => setSignatureDetails({...signatureDetails,imageUploadMethod: parseInt(0)})} className={`px-2 py-1 ${signatureDetails.imageUploadMethod===0 && styles['active']}`}>Draw</span>
                            <span onClick={() => setSignatureDetails({...signatureDetails,imageUploadMethod: parseInt(1)})} className={`px-2 py-1 ${signatureDetails.imageUploadMethod===1 && styles['active']}`}>Upload</span>
                        </div>
                        <div className={`col-12 position-relative d-flex flex-column justify-content-center align-items-center ${styles['image-upload-container']}`}>

                            {signatureDetails.imageUploadMethod===1 ? 
                            <>
                                {signatureDetails.imageSrc===false ? 
                                    <>
                                        <span className={`mb-4`}>Upload a signature or scan</span>
                                        <Button variant="contained" disabled={signatureDetails.signature_s3_key !== ""} onClick={() => document.getElementById('signature-input').click()}>Select Image</Button>
                                        <input type="file" accept="image/png, image/gif, image/jpeg" id="signature-input" onChange={(e) => {
                                            if(uploadSizeValidation(e)){
                                                setSignatureDetails({...signatureDetails,imageSrc: e.target.files[0],signatureSrc: false});
                                            }else{
                                                setFileUploadError(true);
                                            }
                                            
                                        }} />
                                        {fileUploadError && <p className="mt-2 mx-2 text-danger">File size should be less than 5 MB</p>}
                                    </>

                                :   
                                    <>
                                            <img src={URL.createObjectURL(signatureDetails.imageSrc)}></img>
                                    </>
                            
                                }
                            </>
                            :
                            
                            <>
                                {signatureDetails.signatureSrc===false ?    
                                <>                             
                                    <span className={`mb-4`}>Draw signature</span>
                                    <Button disabled={signatureDetails.signature_s3_key !== ""} variant="contained" onClick={() => setOpenSignaturePad(true)}>Draw</Button>
                                </>
                                :
                                    <img src={signatureDetails.signatureSrc} className={`${styles['signature-img-container']}`}></img>
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
                         <div className={`d-flex flex-wrap justify-content-evenly align-items-center`} style={{rowGap: '0.7rem'}}>   
                            <p className={`mt-4 me-4 ${styles['upload-image-info-text']}`}>By signing this document with an electronic signature. I agree that such signature will be as valid as handwritten signature to the extent allowed by local law</p>

                            <div className="mt-4 d-flex justify-content-around align-items-center">
                                <Button variant="contained" className="me-3" disabled={uploadLoader} color="default" onClick={Cancel}>Cancel</Button>
                                <Button variant="contained" onClick={UploadSignature} className={styles['accept-and-sign-btn']} disabled={uploadLoader || signatureDetails.signature_s3_key !== "" || (signatureDetails.imageSrc===false && signatureDetails.signatureSrc===false)}>Accept & Sign</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

                <div className={`w-100 my-3 px-lg-0 px-md-2 px-2 d-flex justify-content-lg-between justify-content-md-between flex-wrap justify-content-start align-items-center`} style={{columnGap: "0.7rem",rowGap: "0.7rem"}}>
                    <Button variant="outlined" onClick={() => {setLrDetails({...lrDetails,signatureDetails: signatureDetails});setActiveStep(prev => prev - 1)}}>Back</Button>
                    <div className="d-flex align-itens-center">
                        <Button variant="outlined" onClick={() => router.push(`/trip/${tripId}`)} className="me-2">Cancel</Button>
                        <Button variant="contained" color="primary" disabled={signatureDetails.signature_s3_key===""} onClick={() => {setLrDetails({...lrDetails,signatureDetails: signatureDetails});setActiveStep(prev => prev + 1)}}>Save & Next</Button>
                    </div>
                    
                </div>  
            </>
        )
    }

    function GoodDetailsForm(){

        let initialObject = {
            packaging_type: "",
            material_name: "",
            is_insured: false,
            no_of_articles: "",
            goods_invoice_number: ""
        }

        if(tripDetails.weight !== undefined){
            console
            initialObject['weight'] = tripDetails.weight!=="" ? tripDetails.weight : "";
            initialObject['weight_unit'] = tripDetails.weight_unit!=="" ? (tripDetails.weight_unit==="kg" ? "KG" : "Tonne") : "KG";
            initialObject['rate'] = tripDetails.rate!=="" ? tripDetails.rate : "";
            initialObject['rate_unit'] = `per ${tripDetails.weight_unit!=="" ? (tripDetails.weight_unit==="kg" ? "KG" : "Tonne") : "KG"}`;
        }

        const [goodsFormDetails,setGoodsFormDetails] = useState(lrDetails.goodsDetails ? lrDetails.goodsDetails : initialObject)
        const [goodsFormDetailsIsValid,setGoodsFormDetailsIsValid] = useState(false);

        useEffect(() => {
            let isValid = true;
            Object.keys(goodsFormDetails).map(key => {
                if((key==="packaging_type" || key==="material_name" || key==="weight" || key==="weight_unit" || key==="rate" || key==="rate_unit" || key==="no_of_articles") && goodsFormDetails[key]===""){  
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
                        label="No. of Articles"
                        variant="outlined"
                        className={`col-lg-5 col-md-6 col-10`}
                        type="number"
                        value={goodsFormDetails.no_of_articles}
                        onChange={(e) => setGoodsFormDetails({...goodsFormDetails,no_of_articles: e.target.value})}
                        required
                        error={goodsFormDetails.no_of_articles === ""}
                    />

                    {tripDetails.weight!==undefined && 
                    // <div className={`d-flex flex-column justify-content-between col-lg-5 col-md-6 col-10`}>
                    //     Actual Weight
                    //     <div className="w-100 d-flex justify-content-between align-items-center">

                            <TextField 
                                label="Weight"
                                className="col-lg-5 col-md-6 col-10"
                                variant="outlined"
                                value={goodsFormDetails.weight}
                                required
                                error={goodsFormDetails.weight === ""}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment>
                                            {goodsFormDetails.weight_unit}
                                        </InputAdornment>
                                    )
                                }}
                            />
                            // <TextField 
                            //     className="col-3"
                            //     variant="outlined"
                            //     value={goodsFormDetails.weight_unit}
                            //     required
                            //     error={goodsFormDetails.weight_unit === ""}   
                            // ></TextField>

                        // </div>
                    // </div> 
                    }
                    {tripDetails.rate!==undefined && 
                    // <div className={`d-flex flex-column justify-content-between col-lg-5 col-md-6 col-10`}>
                    //     Actual Rate
                    //     <div className="w-100 d-flex justify-content-between align-items-center">

                            <TextField 
                                label="Rate"
                                className="col-lg-5 col-md-6 col-10"
                                variant="outlined"
                                value={goodsFormDetails.rate}
                                required
                                error={goodsFormDetails.rate === ""}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment>
                                            {goodsFormDetails.rate_unit}
                                        </InputAdornment>
                                    )
                                }}
                            />
                            /* <TextField 
                                className="col-3"
                                variant="outlined"
                                value={goodsFormDetails.rate_unit}
                                required
                                error={goodsFormDetails.rate_unit === ""}
                            ></TextField>

                        </div>
                    </div>  */
                    }
                    <div className={`d-flex flex-lg-row flex-md-column flex-column justify-content-between align-items-center col-lg-5 col-md-6 col-10 p-2 ${styles['goods-insured']}`}>
                        Are goods Insured ?
                        <div className={`d-flex justify-content-between align-items-center`}>
                            <Button onClick={() => setGoodsFormDetails({...goodsFormDetails,is_insured: true})} className={"me-2 " + (goodsFormDetails.is_insured ? styles['active'] : "")} variant="contained">Yes</Button>
                            <Button onClick={() => setGoodsFormDetails({...goodsFormDetails,is_insured: false})} className={!goodsFormDetails.is_insured ? styles['active'] : ""} variant="contained">No</Button>
                        </div>    
                    </div>            
                </div>

                <div className={`w-100 my-3 px-lg-0 px-md-2 px-2 d-flex justify-content-lg-between justify-content-md-between flex-wrap justify-content-start align-items-center`} style={{columnGap: "0.7rem",rowGap: "0.7rem"}}>
                    <Button variant="outlined" onClick={() => {setLrDetails({...lrDetails,goodsDetails: goodsFormDetails});setActiveStep(prev => prev - 1)}}>Back</Button>
                    <div className="d-flex align-itens-center">
                        <Button variant="outlined" onClick={() => router.push(`/trip/${tripId}`)} className="me-2">Cancel</Button>
                        <Button variant="contained" color="primary" disabled={!goodsFormDetailsIsValid} onClick={() => {setLrDetails({...lrDetails,goodsDetails: goodsFormDetails});setActiveStep(prev => prev + 1)}}>Save & Next</Button>
                    </div>
                    
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
                          {return (i!==5 && 
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
            if(createLRResponse && createLRResponse.success){
                
                window.open(createLRResponse.link,'_blank')
                setGlobalLoading(false)
                setActiveStep(6)
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

                <h4 className={`mt-4 mx-lg-3 mx-md-2 mx-1 mb-2 ${styles['active-form-label']}`}>{LRSteps[(activeStep < 5) ? activeStep : 5].label}</h4>                        
                <div className={`w-100 border-3 px-lg-3 px-md-2 px-1 py-3 ${styles['active-form-container']}`}>
                    {LRSteps[(activeStep < 5) ? activeStep : 5].content}
                </div>
            </div> }   
        </>
        
    )
}