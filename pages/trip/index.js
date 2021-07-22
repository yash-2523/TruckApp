import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Operations from '../../Components/Home/Trip/TripsData/Operations'
import TripTable from '../../Components/Home/Trip/TripsData/TripTable'
import { currentUser } from '../../Services/AuthServices';
import { getTrips, searchTrips } from '../../Services/TripDataServices';

export default function Trip() {

    const [tripData, setTripData] = useState("loading");
    const [status, setStatus] = useState("all");
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(currentUser.value);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const router = useRouter();
    useEffect(() => {
        let AuthObservable = currentUser.subscribe((data) => {
            setUser(data);
        })
        return () => {
            AuthObservable.unsubscribe()
        }
    }, [])

    useEffect(async () => {
        if (user === null || user === "loading") {
            return;
        }
        setLoading(true);
        try {
            let data = await getTrips("", status);
            if (data) {
                setTripData(data.trips);
                setToken(data.token);
            }
            else {
                setTripData([])
            }
            setLoading(false);

        } catch (err) {
            setTripData([])
            setLoading(false);
        }

        return () => {
            setToken("")
        }
    }, [])



    let HandleOperation = async (from_date, to_date, trip_status, search) => {
        setFromDate(from_date);
        setToDate(to_date)
        setTripData("loading")
        setStatus(trip_status)
        setToken("");
        try {

            if (search.length > 0) {
                let trips = await searchTrips(search, trip_status, from_date, to_date)
                console.log("Trips", trips)
                setTripData(trips);
            }
            else {
                let data = await getTrips("", trip_status, from_date, to_date);
                if (data) {
                    setTripData(data.trips);
                    setToken(data.token)
                }
                else {
                    setTripData([]);
                    setToken("")
                }
            }
        } catch (err) {
            setTripData([])
            setToken("");
        }

    }

    let LoadMoreTrips = async () => {
        setLoading(true);
        try {
            let data = await getTrips(token, status, fromDate, toDate);
            if (data) {
                setTripData([...tripData, ...data.trips]);
                setToken(data.token);
            }
            setLoading(false);

        } catch (err) {
            setLoading(false);
        }
    }

    let RefreshTrips = async () => {
        setLoading(true);
        setTripData("loading")
        setToken("");
        try {
            let data = await getTrips("", status, fromDate, toDate);
            if (data) {
                setTripData(data.trips);
                setToken(data.token);
            }
            else {
                setTripData([])
            }
            setLoading(false);

        } catch (err) {
            setTripData([])
            setLoading(false);
        }
    }


    return (
        <>
            {(user !== null && user !== "loading") &&
                <div className="w-100 h-100 px-lg-3 px-md-2 px-1">
                    <Operations Operations={{ tripData, HandleOperation, token, loading, LoadMoreTrips, RefreshTrips }} />
                    <TripTable Operations={{ tripData, HandleOperation, token, loading, LoadMoreTrips, RefreshTrips }} />
                </div>
            }
        </>
    )
}
