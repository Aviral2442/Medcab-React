import {Card, CardBody, CardFooter, CardHeader, CardTitle, Table} from 'react-bootstrap'
import {apiPerformanceMetricsTable} from '@/views/dashboard/data'
import axios from 'axios'
import React from 'react'

const APIPerformanceMetrics = () => {

    const basePath = (import.meta as any).env?.VITE_PATH ?? "";

    interface VendorTransaction {
        vendor_transection_id: string;
        vendor_name: string;
        vendor_transection_amount: string;
        vendor_transection_note: string;
        vendor_transection_time_unix: string;
    }

    const [data, setData] = React.useState<VendorTransaction[]>([]);

    const fetchVendorTransactions = async () => {
        try{
            const res = await axios.get(`${basePath}/dashboard/get_latest_5_vendor_transaction_list`)
            // console.log("API Response of Vendor Transactions: ", res.data)
            setData(res.data?.jsonData?.vendorTransList || [])
        } catch (error){
            console.error("Error fetching Vendor Transactions: ", error)
        }
    }

    React.useEffect(() => {
        fetchVendorTransactions();
    }, [])

    return (
        <Card>
            <CardHeader className="border-dashed">
                <CardTitle as="h4" className="mb-0">
                    Vendors Transaction
                </CardTitle>
            </CardHeader>

            <CardBody className="p-0">
                <Table responsive size="sm" className="table-centered table-nowrap table-custom mb-0">
                    <thead className="bg-light-subtle thead-sm">
                    <tr className="text-uppercase fs-xxs">
                        {apiPerformanceMetricsTable.headers.map((header) => (
                            <th key={header}>{header}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {data.map((row, idx) => (
                        <tr key={idx}>
                            <td>{row.vendor_transection_id}</td>
                            <td>{row.vendor_name}</td>
                            <td>₹{row.vendor_transection_amount}</td>
                            <td>{row.vendor_transection_note}</td>
                                                            <td>{(() => {
                                    const ts = Number(row.vendor_transection_time_unix);
                                    if (!ts || Number.isNaN(ts)) return '-';
                                    const date = new Date(ts < 1e12 ? ts * 1000 : ts); // handle seconds vs milliseconds
                                    date.toLocaleString = () => {
                                        const d = String(date.getDate()).padStart(2, '0');
                                        const m = String(date.getMonth() + 1).padStart(2, '0');
                                        const y = date.getFullYear();
                                        return `${d}-${m}-${y}`;    
                                    };
                                    return date.toLocaleString();
                                })()}</td>
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

export default APIPerformanceMetrics
