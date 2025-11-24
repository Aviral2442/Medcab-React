import React from "react";
import { Container } from "react-bootstrap";
import ExportDataWithButtons from "@/views/tables/data-tables/content-writing/city/";
import AddCity from "./components/AddCity";
import AddCityFAQ from "./components/AddCityFAQ";

const Page: React.FC = () => {
    const [activeTab, setActiveTab] = React.useState(1);
    const [showForm, setShowForm] = React.useState(false);
    const [formMode, setFormMode] = React.useState<"add" | "edit">("add");
    const [editData, setEditData] = React.useState<any>(null);
    const [refreshFlag, setRefreshFlag] = React.useState(0);


    const tabs = [
        { key: 1, label: "City" },
        { key: 2, label: "City FAQ" },
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
                        <AddCity
                            mode={formMode}
                            data={editData}
                            onCancel={() => setShowForm(false)}
                            onDataChanged={triggerRefresh}
                        />
                    );
                case 2:
                    return (
                        <AddCityFAQ
                            mode={formMode}
                            data={editData}
                            onCancel={() => setShowForm(false)}
                            onDataChanged={triggerRefresh}
                        />
                    );
                default:
                    return (
                        <AddCity
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
                sectionId={1}
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