import {
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    CardTitle,
    Table,
} from 'react-bootstrap'
import { TbCircleFilled} from 'react-icons/tb'
import {Link, useNavigate} from 'react-router-dom'
import axios from 'axios'
import React from 'react'

const RecentSessions = () => {
    const navigate = useNavigate()

    const basePath = (import.meta as any).env?.VITE_PATH ?? "";

    interface Booking {
        manpower_order_id: number;
        mpo_vendor_id: string;
        consumer_name: string;
        mpo_final_price: number;
        mpo_order_date: string | number;
        mpo_status: number;
    }

    const [newBooking, setNewBooking] = React.useState<Booking[]>([]);

    const fetchnewbookings = async () => {
        try{
            const res = await axios.get(`${basePath}/dashboard/latest_new_ongoing_booking_lists`)
            // console.log("New and Ongoing Bookings: ", res.data?.jsonData?.bookingList)
            setNewBooking(res.data?.jsonData?.bookingList || [])
        } catch (error){
            console.error("Error fetching Recent Sessions: ", error)
        }
    }

    React.useEffect(() => {
        fetchnewbookings();
    }, [])
    

    const handleview = (id: number) => {
        navigate(`/booking-details/${id}`);
    }

    const dateFormat = (dateValue: string | number) => {
        try {
            // Check if it's a Unix timestamp (number or numeric string)
            const dateStr = String(dateValue);
            let date: Date;

            if (/^\d+$/.test(dateStr)) {
                // It's a Unix timestamp
                const timestamp = parseInt(dateStr);
                // Check if it's in seconds or milliseconds
                date = new Date(timestamp < 10000000000 ? timestamp * 1000 : timestamp);
            } else {
                // It's a date string
                date = new Date(dateValue);
            }

            // Check if date is valid
            if (isNaN(date.getTime())) {
                return dateStr;
            }

            // Format: DD-MMM-YYYY (e.g., 12-Nov-2024)
            const day = String(date.getDate()).padStart(2, '0');
            const month = date.toLocaleString('en-US', { month: 'short' });
            const year = date.getFullYear();

            return `${day}-${month}-${year}`;
        } catch (error) {
            console.error("Error formatting date:", error);
            return String(dateValue);
        }
    }


    return (    
        <Card>
            <CardHeader className="justify-content-between align-items-center border-dashed">
                <CardTitle as="h4" className="mb-0">
                    New & Ongoing Bookings
                </CardTitle>
            </CardHeader>

            <CardBody className="p-0">
                <Table responsive hover size="sm" className="table-custom table-centered table-sm table-nowrap mb-0">
                    <tbody>
                    {newBooking.length > 0 ? (
                        newBooking.map((booking, index) => (
                            <tr key={index} onClick={() => handleview(booking.manpower_order_id)} style={{ cursor: 'pointer' }}>
                                <td>
                                    <div className="d-flex align-items-center">
                                        <div>
                                            <span className="text-muted fs-xs">Vendor</span>
                                            <h5 className="fs-6 mb-0">
                                                <Link to="" className="text-body">
                                                    {booking.mpo_vendor_id || 'Not Assigned'}
                                                </Link>
                                            </h5>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="d-flex align-items-center">
                                        <div>
                                            <span className="text-muted fs-xs">Consumer</span>
                                            <h5 className="fs-6 mb-0">
                                                <Link to="" className="text-body">
                                                    {booking.consumer_name || 'N/A'}
                                                </Link>
                                            </h5>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span className="text-muted fs-xs">Amount</span>
                                    <h5 className="fs-base mb-0 fw-normal">₹{booking.mpo_final_price || 0}</h5>  
                                </td>   
                                <td>
                                    <span className="text-muted fs-xs">Date</span>
                                    <h5 className="fs-base mb-0 fw-normal">{dateFormat(booking.mpo_order_date)}</h5>
                                </td>
                                <td>
                                    <span className="text-muted fs-xs">Status</span>
                                    <h5 className="fs-base mb-0 fw-normal">
                                        <TbCircleFilled
                                            className={`fs-xs ${booking.mpo_status === 1 ? 'text-success' : 'text-warning'}`}/>
                                        {' '}
                                        {booking.mpo_status === 1 ? 'New' : 'Ongoing'}
                                    </h5>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5} className="text-center text-muted py-4">
                                No bookings available
                            </td>
                        </tr>
                    )}
                    </tbody>
                </Table>
            </CardBody>

            <CardFooter className="border-top-0 text-end">
                <div className="text-muted">
                    Last update:{" "}
                    {new Date()
                        .toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                        })
                        .replace(/ /g, " ")}
                </div>
            </CardFooter>
        </Card>
    )
}

export default RecentSessions