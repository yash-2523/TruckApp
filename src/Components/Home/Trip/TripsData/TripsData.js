import React from 'react'
import Operations from './Operations'
import TripTable from './TripTable'

export default function TripsData() {
    return (
        <div className="w-100 h-100 px-lg-3 px-md-2 px-1">
            <Operations />
            <TripTable />
        </div>
    )
}
