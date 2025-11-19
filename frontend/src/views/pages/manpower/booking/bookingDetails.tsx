import axios from 'axios';
import React from 'react';
import { Container, Spinner, Nav } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import BookingDetailsForm from '@/components/Booking/BookingDetailsForm';
import TransactionList from '@/components/Booking/TransactionList';
import PickupVendorList from '@/components/Booking/PickupVendorList';
import RejectList from '@/components/Booking/RejectList';
import AcceptList from '@/components/Booking/AcceptList';

const BookingDetails = () => {

  const baseURL = (import.meta as any).env?.VITE_PATH ?? "";

  const { id } = useParams();
  const [bookingData, setBookingData] = React.useState<any>(null);
  const [transactionData, setTransactionData] = React.useState<any>(null);
  const [vendorData, setVendorData] = React.useState<any>(null);
  const [rejectData, setRejectData] = React.useState<any>(null);
  const [acceptData, setAcceptData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState(1);

  const tabs = [
    { eventKey: 1, title: 'Booking Details' },
    { eventKey: 2, title: 'Transaction List' },
    { eventKey: 3, title: 'PickUp City Vendor List' },
    { eventKey: 4, title: 'Reject List' },
    { eventKey: 5, title: 'Accept List' },
  ];

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${baseURL}/booking/booking_detail/${id}`);
      setBookingData(response.data.jsonData.booking[0]);
      console.log(response.data.jsonData.booking[0]);
    } catch (error) {
      console.error("Error fetching booking details:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchTransactionList = async () => {
    try {
      setLoading(true);
      // console.log("Fetching transaction list for booking ID:", id);
      const response = await axios.post(`${baseURL}/booking/booking_transaction_list/${id}`);
      setTransactionData(response.data?.jsonData?.transactions[0]);
      console.log("Transaction details",response.data);
    } catch (error) {
      console.error("Error fetching transaction details:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVendorList = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${baseURL}/booking/booking_pickup_city_vendor_list/${id}`);
      setVendorData(response.data?.jsonData?.vendors[0]);
      console.log("vendor list: ",response.data.jsonData.vendors[0]);
    }
    catch (error) {
      console.error("Error fetching vendor list:", error);
    }
    finally {
      setLoading(false);
    }
  };

  const fetchRejectList = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${baseURL}/booking/booking_reject_list/${id}`);
      setRejectData(response.data.jsonData.rejects[0]);
      console.log("reject list: ",response.data.jsonData.rejects[0]);
    }
    catch (error) {
      console.error("Error fetching reject list:", error);
    }
    finally {
      setLoading(false);
    }
  };

  const fetchAcceptList = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${baseURL}/booking/booking_accept_list/${id}`);
      setAcceptData(response.data.jsonData.accept[0]);
      console.log("accept list: ",response.data.jsonData.accept[0]);
    }
    catch (error) {
      console.error("Error fetching accept list:", error);
    }
    finally {
      setLoading(false);
    }
  };


  React.useEffect(() => {
    switch (activeTab) {
      case 1:
        if (!bookingData) fetchBookingDetails();
        break;
      case 2:
        if (!transactionData) fetchTransactionList();
        break;
      case 3:
        if (!vendorData) fetchVendorList();
        break;
      case 4:
        if (!rejectData) fetchRejectList();
        break;
      case 5:
        if (!acceptData) fetchAcceptList();
        break;
      default:
        break;
    }
  }, [activeTab, id]);

  const handleFieldUpdate = async (field: string, value: string) => {
    try {
      // Update API call
      await axios.put(`${baseURL}/booking/booking_data_update/${id}`, {
        [field]: value
      });
      
      // Update local state
      setBookingData((prev: any) => ({
        ...prev,
        [field]: value
      }));
      
      console.log(`Updated ${field} to ${value}`);
    } catch (error) {
      console.error("Error updating booking:", error);
    }
  };

  const renderTabContent = (tabKey: number) => {
    switch(tabKey) {
      case 1:
        return bookingData ? (
          <BookingDetailsForm
            data={bookingData}
            onUpdate={handleFieldUpdate}
            editable={true}
          />
        ) : (
          loading ? (
            <div className="text-center p-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Loading booking details...</p>
            </div>
          ) : (
            <div className="text-center p-5">
              <p className="text-muted">No booking data found</p>
            </div>
          )
        );
      case 2:
        return transactionData ? (
          <TransactionList 
            data={transactionData} 
          />
        ):(
          loading ? (
            <div className="text-center p-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Loading transaction list...</p>
            </div>
          ) : (
            <div className='text-center p-5'>
              <p className="text-muted">No Transaction Data Found</p>
            </div>
          )
        )
      case 3:
        return vendorData ? (
          <PickupVendorList
            data={vendorData}
          />
        ):(
          loading ? (
            <div className="text-center p-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Loading vendor list...</p>
            </div>
          ) : (
            <div className='text-center p-5'>
              <p className="text-muted">No Vendor Data Found</p>
            </div>
          )
        )
      case 4:
        return rejectData ? (
          <RejectList
            data={rejectData}
          />
        ):(
          loading ? (
            <div className="text-center p-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Loading reject list...</p>
            </div>
          ) : (
            <div className='text-center p-5'>
              <p className="text-muted">No Reject Data Found</p>
            </div>
          )
        )
      case 5:
        return acceptData ? (
          <AcceptList
            data={acceptData}
          />
        ):(
          loading ? (
            <div className="text-center p-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Loading accept list...</p>
            </div>
          ) : (
            <div className='text-center p-5'>
              <p className="text-muted">No Accept Data Found</p>
            </div>
          )
        )
      default:
        return null;
    }
  };

  return (
    <Container fluid className="p-2">
      {loading && activeTab === 1 && !bookingData ? (
        <div className="text-center p-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading booking details...</p>
        </div>
      ) : (
        <div className="m-3 ms-0">
          <Nav variant="tabs" className="mb-3">
            {tabs.map(tab => (
              <Nav.Item key={tab.eventKey}>
                <Nav.Link
                  active={activeTab === tab.eventKey}
                  onClick={() => setActiveTab(tab.eventKey)}
                  style={{ cursor: 'pointer' }}
                >
                  {tab.title}
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
          <div className="tab-content">
            {renderTabContent(activeTab)}
          </div>
        </div>
      )}
    </Container>
  );
};

export default BookingDetails;


/*
manpower_order_id
mpo_address_id
mpo_bank_ref_no
mpo_coupon_discount
mpo_created_at
mpo_final_price
mpo_gst_amount
mpo_gst_percentage
mpo_health_card_charges
mpo_health_card_discount
mpo_order_date
mpo_otp
mpo_payment_mobile
mpo_payment_mode
mpo_payment_type
mpo_status
mpo_transection_id
mpo_transfer_amount
mpo_updated_at
mpo_user_id
mpo_vender_picture
mpo_  vendor_id
mpo_vendor_mobile
mpo_vendor_name
mpod_assign_time
mpod_company_charge
mpod_instruction
mpod_offer_amount
mpod_period_duration
mpod_period_type
mpod_price
mpod_product_id
mpod_product_quantity
mpod_status
mpod_tax
mpod_till_date
mpod_vendor_id
mpod_vendor_name
mpod_vendor_number
mpod_verify_otp
*/