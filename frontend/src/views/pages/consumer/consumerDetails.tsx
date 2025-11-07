import React from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ConsumerDetaiks from '@/components/Consumer/ConsumerDetails';
import { Container, Nav, Spinner } from 'react-bootstrap';
import TransactionList from '@/components/Consumer/TransactionList';
import ManPowerOrderList from '@/components/Consumer/ManPowerOrderList';
import AmbulanceBookingsList from '@/components/Consumer/AmbulanceBookingList';

const consumerDetails = () => {

    const baseURL = (import.meta as any).env?.VITE_PATH ?? "";

    const { id } = useParams();
    const [loading, setLoading] = React.useState(true);
    const [ConsumerData, setConsumerData] = React.useState<any>(null);
    const [activeTab, setActiveTab] = React.useState(1);
    const [TransactionListData, setTransactionListData] = React.useState<any>(null);
    const [ManPowerOrdersListData, setManPowerOrdersListData] = React.useState<any>(null);
    const [AmbulanceBookingsListData, setAmbulanceBookingsListData] = React.useState<any>(null);

    const tabs = [
        { eventKey: 1, title: "Consumer Details" },
        { eventKey: 2, title: "Transaction List" },
        { eventKey: 3, title: "Manpower Orders List" },
        { eventKey: 4, title: "Ambulance Bookings List" },
    ];


    const fetchConsumerDetails = async () => {
        try{
            setLoading(true);
            const res = await axios.post(`${baseURL}/consumer/consumer_detail/${id}`);
            console.log("Consumer Details:", res.data?.jsonData);
            setConsumerData(res.data?.jsonData);
        } catch (error) {
            console.error("Error fetching consumer details:", error);
        } finally {
            setLoading(false);
        }
    }


    const fetchTransactionList = async () => {
        try{
            setLoading(true);
            const res = await axios.post(`${baseURL}/consumer/consumer_transaction_list/${id}`);
            console.log("Consumer Transaction List:", res.data?.data);
            setTransactionListData(res.data?.data);
        } catch (error) {
            console.error("Error fetching consumer transaction list:", error);
        } finally {
            setLoading(false);
        }
    }


    const fetchManPowerOrdersList = async () => {
        try{
            setLoading(true);
            const res = await axios.post(`${baseURL}/consumer/consumer_manpower_orders_list/${id}`);
            console.log("Consumer ManPower Orders List:", res.data?.data);
            setManPowerOrdersListData(res.data?.data);
        } catch (error) {
            console.error("Error fetching consumer transaction list:", error);
        } finally {
            setLoading(false);
        }
    }

    const fetchAmbulanceBookingsList = async () => {
        try{
            setLoading(true);
            const res = await axios.post(`${baseURL}/consumer/consumer_ambulance_bookings_list/${id}`);
            console.log("Consumer Ambulance Bookings List:", res.data);
            setAmbulanceBookingsListData(res.data?.jsonData);
        } catch (error) {
            console.error("Error fetching consumer transaction list:", error);
        } finally {
            setLoading(false);
        }
    }

    React.useEffect(() => {
        switch (activeTab) {
            case 1:
                if (!ConsumerData) fetchConsumerDetails();
                break;
            case 2:
                if (!TransactionListData) fetchTransactionList();
                break;
            case 3:
                if (!ManPowerOrdersListData) fetchManPowerOrdersList();
                break;
            case 4:
                if (!AmbulanceBookingsListData) fetchAmbulanceBookingsList();
                break;
            default:
                break;
        }
    }, [activeTab, id]);


    const renderTabContent = () => {
        switch (activeTab) {
            case 1:
                return ConsumerData ? (
                    <ConsumerDetaiks 
                        data={ConsumerData}
                    />

                ):( loading ? (
                    <div className='text-center p-5'>
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-3">Loading consumer details...</p>
                    </div>
                ) : (
                    <div className='text-center p-5'>
                        <p className='text-muted'>No vendor Data Found</p>
                    </div>
                ));
            case 2:
                return TransactionListData ? (
                  <TransactionList
                    data={TransactionListData}
                  />
                ) : ( loading ? (
                    <div className="text-center p-5">
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-3">Loading transaction list...</p>
                    </div>
                ) : (
                  <div className="text-center p-5">
                    <p className="text-muted">No Transaction List Data Found</p>
                  </div>
                ));
            case 3:
                return ManPowerOrdersListData ? (
                  <ManPowerOrderList 
                    data={ManPowerOrdersListData}
                  />
                ): ( loading ? (
                    <div className='text-center p-5'>
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-3">Loading manpower orders list...</p>
                    </div>
                ) : (
                    <div className='text-center p-5'>
                        <p className='text-muted'>No Manpower Orders List Data Found</p>
                    </div>
                ));
            case 4:
                return AmbulanceBookingsListData ? (
                  <AmbulanceBookingsList 
                    data={AmbulanceBookingsListData}
                  />
                ): ( loading ? (
                    <div className='text-center p-5'>
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-3">Loading ambulance bookings list...</p>
                    </div>
                ) : (
                    <div className='text-center p-5'>
                        <p className='text-muted'>No Ambulance Bookings List Data Found</p>
                    </div>
                ));
            default:
                return null;
        }
    }


  return (
    <Container fluid className="p-2">
      {loading && activeTab === 1 && !ConsumerData ? (
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
            {renderTabContent()}
          </div>
        </div>
      )}
    </Container>
  )
}

export default consumerDetails




/*

consumer_city_id
consumer_email_id
consumer_id
consumer_mobile_no
consumer_my_referal_code
consumer_name
consumer_refered_by
consumer_registred_date
consumer_status
consumer_wallet_amount

*/