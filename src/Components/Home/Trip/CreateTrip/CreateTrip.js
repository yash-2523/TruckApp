import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Button, FormControl, Icon, InputAdornment, InputLabel, Menu, MenuItem, Select, TextField,} from '@material-ui/core'
import { AddCircleRounded, ArrowBackIosOutlined, CancelOutlined, CheckOutlined, Close, ExpandMoreOutlined, KeyboardBackspaceOutlined, RoomSharp, SpeedOutlined } from '@material-ui/icons'
import React, { useContext, useState } from 'react'
import { TripContext } from '../../../../Context/TripContext';
import './style.scss'
import {ReactComponent as TruckIcon} from './svg/Truck.svg'

export default function CreateTrip() {

    const {TripPage} = useContext(TripContext);
    const [tripPage,setTripPage] = TripPage;
    const [truckNoAnchorEl, setTruckNoAnchorEl] = useState(null);
    const [truckNoValue,setTruckNoValue] = useState("");

    const handleTruckNoAnchorClick = (event) => {
        setTruckNoAnchorEl(event.currentTarget);
    };

    const handleTruckNoAnchorClose = () => {
        setTruckNoAnchorEl(null);
    };

    return (
        <>
            <Button startIcon={<KeyboardBackspaceOutlined />} onClick={() => setTripPage(0)}>Trips</Button>

            <div className="px-3 mt-5">
                <div className="px-4 rounded-2 py-3 route-details">
                    <form className="w-100 d-flex flex-column">
                        <div className="d-flex justify-content-between align-items-center">
                            <FormControl className="col-5">
                                <InputLabel htmlFor="origin"><RoomSharp className="mb-1" style={{color: "green"}} /> Origin</InputLabel>
                                <Select native defaultValue="" id="origin">
                                    <option aria-label="None" value="" />
                                    <optgroup label="Category 1">
                                        <option value={1}>Option 1</option>
                                        <option value={2}>Option 2</option>
                                    </optgroup>
                                    <optgroup label="Category 2">
                                        <option value={3}>Option 3</option>
                                        <option value={4}>Option 4</option>
                                    </optgroup>
                                </Select>
                            </FormControl>
                            <FormControl  className="col-5">
                                <InputLabel htmlFor="destination"><RoomSharp className="mb-1" style={{color: "red"}} /> Destination</InputLabel>
                                <Select native className="mb-2" defaultValue="" id="destination">
                                    <option aria-label="None" value="" />
                                    <optgroup label="Category 1">
                                        <option value={1}>Option 1</option>
                                        <option value={2}>Option 2</option>
                                    </optgroup>
                                    <optgroup label="Category 2">
                                        <option value={3}>Option 3</option>
                                        <option value={4}>Option 4</option>
                                    </optgroup>
                                </Select>
                            </FormControl>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                            <TextField 
                                label="Customer Name"
                                className="col-5"
                            />
                            <TextField 
                                label="Truck Registration Number"
                                className="col-5"
                                inputProps={{list: "trucks"}}
                                name="trucks"
                                value={truckNoValue}
                                onChange={(e) => setTruckNoValue(e.target.value)}
                                onClick={(e) => handleTruckNoAnchorClick(e)}
                            />
                            <Menu
                                anchorEl={truckNoAnchorEl}
                                open={Boolean(truckNoAnchorEl)}
                                onClose={handleTruckNoAnchorClose}
                                style={{marginTop: "45px"}}
                                InputLabelProps={{ shrink: true }}
                                className="truck-number-menu-list" 
                            >
                                <div className="w-100 mb-3 d-flex justify-content-around align-items-center">
                                    <p onClick={handleTruckNoAnchorClose}><ArrowBackIosOutlined />Back</p>
                                    <Button variant="outlined" endIcon={<AddCircleRounded style={{color: "green"}} />}>Add New Truck</Button>
                                </div>
                                <b className="mb-3 mx-3">Select Truck</b>
                                <MenuItem className="mt-2">{
                                    <div onClick={() => setTruckNoValue("GU UK 485D")} className="d-flex justify-content-between align-items-center available-trucks-list">
                                        GU UK 485D
                                        <Icon><TruckIcon /></Icon>
                                        Available
                                    </div>
                                }</MenuItem>
                                <MenuItem>{
                                    <div onClick={() => setTruckNoValue("GU UK 485D")} className="d-flex justify-content-between align-items-center available-trucks-list">
                                        GU UK 485D
                                        <Icon><TruckIcon /></Icon>
                                        Available
                                    </div>
                                }</MenuItem>
                                <MenuItem>{
                                    <div onClick={() => setTruckNoValue("GU UK 485D")} className="d-flex justify-content-between align-items-center available-trucks-list">
                                        GU UK 485D
                                        <Icon style={{color:"red"}}><TruckIcon /></Icon>
                                        Available
                                    </div>
                                }</MenuItem>
                            </Menu>
                        </div>
                        <Button type="Submit" className="align-self-end" color="primary" variant="contained">Submit</Button>
                    </form>
                </div>
                
                <Accordion className="mt-4">
                    <AccordionSummary
                    expandIcon={<ExpandMoreOutlined />}
                    aria-controls="panel1a-content"
                    >
                        Add Billing Deatils
                    </AccordionSummary>
                    <AccordionDetails className="d-flex flex-column">
                        <div className="w-100 d-flex justify-content-between align-items-end add-billing-details">
                            <div className="d-flex align-items-end">
                                <Button className={true ? "active" : ""} variant={true ? "contained" : "outlined"} endIcon={true && <CheckOutlined />}>Fixed</Button>
                                <Button variant={false ? "contained" : "outlined"} endIcon={false && <CheckOutlined />}>PER TON</Button>
                                <Button variant={false ? "contained" : "outlined"} endIcon={false && <CheckOutlined />}>Per KG</Button>
                                <Button variant={false ? "contained" : "outlined"} endIcon={false && <CheckOutlined />}>Per KM</Button>
                            </div>   
                            <div className="d-flex flex-column justify-content-between align-items-center">
                                Start KM Reading
                                <TextField 
                                    className="w-50 mt-4"
                                    type="number"
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
                                    className="mt-4"
                                    type="date"
                                    InputLabelProps={{
                                    shrink: true,
                                    }}
                                />
                            </div>
                        </div>

                        <div className="w-100 mt-5 d-flex justify-content-between align-items-end">
                            <div className="d-flex flex-column justify-content-between align-items-center">
                                Total Freight Amount
                                <Button variant="outlined" className="mt-3">Rs. 50,000</Button>
                            </div>
                            <AccordionActions>
                                <Button variant="outlined" endIcon={<Close />}>Cancel</Button>
                                <Button variant="contained" color="primary">Confirm</Button>
                            </AccordionActions>
                        </div>                                    
                    </AccordionDetails>
                </Accordion>

                <Accordion className="mt-4">
                    <AccordionSummary
                        expandIcon={<ExpandMoreOutlined />}
                        aria-controls="panel1a-content"
                    >
                        Add Consigner Details
                    </AccordionSummary>                                   
                </Accordion>  

                <Accordion className="mt-4">
                    <AccordionSummary
                        expandIcon={<ExpandMoreOutlined />}
                        aria-controls="panel1a-content"
                    >
                        Add Goods Details
                    </AccordionSummary>                                   
                </Accordion>                                                                      
            </div>

        </>
    )
}
