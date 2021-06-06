import { Button, InputAdornment, TextField } from '@material-ui/core'
import { Add, Search } from '@material-ui/icons'
import React, { useContext, useRef } from 'react'
import { TripContext } from '../../../../Context/TripContext'
import './style.scss'
import useTrip from './useTrip'

export default function Operations() {

    const {TripPage} = useContext(TripContext);
    const [tripPage,setTripPage] = TripPage;
    const searchRef = useRef("")
    const monthRef = useRef("")
    const statusRef = useRef("")
    const {HandleOperation} = useTrip();

    return (
        <div className="w-100 mt-4 d-flex justify-content-between align-items-center flex-lg-row flex-md-row flex-column operations">
            <div>
                <TextField
                    id="input-with-icon-textfield"
                    label="Search"
                    inputRef={searchRef}
                    onChange={() => HandleOperation(searchRef.current.value,monthRef.current.value,statusRef.current.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        ),
                    }}
                />
            </div>
            <div className="d-flex align-items-center justify-content-evenly flex-wrap">
                <TextField
                    select
                    label="Months"
                    inputRef={monthRef}
                    onChange={() => HandleOperation(searchRef.current.value,monthRef.current.value,statusRef.current.value)}
                    SelectProps={{
                        native: true,
                    }}
                    value="0"
                >
                    <option value="0">All Trips</option>
                    <option value="1">1 month</option>
                    <option value="3">3 month</option>
                    <option value="6">6 month</option>
                </TextField>
                <TextField
                    select
                    label="Status"
                    inputRef={statusRef}
                    onChange={() => HandleOperation(searchRef.current.value,monthRef.current.value,statusRef.current.value)}
                    SelectProps={{
                        native: true,
                    }}
                    value="0"
                >
                    <option value="0">Active Trips</option>
                    <option value="1">Completed</option>
                    <option value="2">Started</option>
                </TextField>
                <Button startIcon={<Add />} onClick={() => setTripPage(1)} variant="contained" color="primary">Create Trip</Button>
            </div>
        </div>
    )
}
