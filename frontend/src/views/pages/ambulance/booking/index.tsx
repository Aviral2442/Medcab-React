import React from "react";
import { Container } from "react-bootstrap";
import ExportDataWithButtons from "@/views/tables/data-tables/ambulance/booking/";
import BookingList from "./components/AddBooking";

const Page: React.FC = () => {
    const [activeTab, setActiveTab] = React.useState(1);
    const [showForm, setShowForm] = React.useState(false);
    const [formMode, setFormMode] = React.useState<"add" | "edit">("add");
    const [editData, setEditData] = React.useState<any>(null);
    const [refreshFlag, setRefreshFlag] = React.useState(0);


    const tabs = [
        { key: 1, label: "Booking" },
        { key: 2, label: "Regular Booking" },
        { key: 3, label: "Rental Booking" },
        { key: 4, label: "Bulk Booking" },
    ];

    const handleAddNew = () => {
        setFormMode("add");
        setEditData(null);
        setShowForm(true);
    };

    const handleEditRow = (row: any) => {
        setFormMode("edit");
        setEditData(row);
        setShowForm(true);
    };

    const triggerRefresh = () => setRefreshFlag((prev) => prev + 1);

    const renderSection = (tabKey: number) => {
        if (showForm) {
            switch (tabKey) {
                case 1:
                    return (
                        <BookingList
                            mode={formMode}
                            data={editData}
                            onCancel={() => setShowForm(false)}
                            onDataChanged={triggerRefresh}
                        />
                    );
                default:
                    return (
                        <BookingList
                            mode={formMode}
                            data={editData}
                            onCancel={() => setShowForm(false)}
                            onDataChanged={triggerRefresh}
                        />
                    );
            }
        }

        return (
            <ExportDataWithButtons
                tabKey={tabKey}
                refreshFlag={refreshFlag}
                onAddNew={handleAddNew}
                onEditRow={handleEditRow}
                onDataChanged={triggerRefresh}
            />
        );
    };

    return (
        <Container fluid className="p-0">
            <div className="m-3">
                <ul className="nav nav-tabs">
                    {tabs.map((tab) => (
                        <li className="nav-item" key={tab.key}>
                            <button
                                className={`nav-link${activeTab === tab.key ? " active" : ""}`}
                                onClick={() => {
                                    setActiveTab(tab.key);
                                    setShowForm(false);
                                }}
                                type="button"
                            >
                                {tab.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            <div>{renderSection(activeTab)}</div>
        </Container>
    );
};

export default Page;