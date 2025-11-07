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
        mpo_user_id: string;
        mpo_final_price: number;
        mpo_order_date: string;
        mpo_status: number;
    }

    const [newBooking, setNewBooking] = React.useState<Booking[]>([]);

    const fetchnewbookings = async () => {
        try{
            const res = await axios.get(`${basePath}/dashboard/latest_new_ongoing_booking_lists`)
            console.log("API Response of Recent Sessions: ", res.data?.jsonData?.bookingList)
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
                    {newBooking.map((booking, index) => (
                        <tr key={index} onClick={() => handleview(booking.manpower_order_id)}>
                            <td>
                                <div className="d-flex align-items-center">
                                    <div>
                                        <span className="text-muted fs-xs">Vendor</span>
                                        <h5 className="fs-base mb-0">
                                            <Link to="" className="text-body">
                                                {booking.mpo_vendor_id}
                                            </Link>
                                        </h5>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div className="d-flex align-items-center">
                                    <div>
                                        <span className="text-muted fs-xs">Consumer</span>
                                        <h5 className="fs-base mb-0">
                                            <Link to="" className="text-body">
                                                {booking.mpo_user_id}
                                            </Link>
                                        </h5>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span className="text-muted fs-xs">Amount</span>
                                <h5 className="fs-base mb-0 fw-normal">{booking.mpo_final_price}</h5>
                            </td>   
                            <td>
                                <span className="text-muted fs-xs">Date</span>
                                <h5 className="fs-base mb-0 fw-normal">{booking.mpo_order_date}</h5>
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
                    ))}
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