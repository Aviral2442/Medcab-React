import React, { useEffect } from "react";
import { Container } from "react-bootstrap";
import { useParams } from "react-router-dom";
import ExportDataWithButtons from "@/views/tables/data-tables/content-writing/city/";
import AddCity from "./components/AddCity";
import AddCityFAQ from "./components/AddCityFAQ";

// Map section names to their IDs
const sectionMap: Record<string, number> = {
  'ambulance': 1,
  'manpower': 2,
  'video-consultation': 3,
  'pathology': 4,
};

const Page: React.FC = () => {
    const params = useParams();
    const [activeTab, setActiveTab] = React.useState(1);
    const [showForm, setShowForm] = React.useState(false);
    const [formMode, setFormMode] = React.useState<"add" | "edit">("add");
    const [editData, setEditData] = React.useState<any>(null);
    const [refreshFlag, setRefreshFlag] = React.useState(0);

    // Get section ID from URL params
    const currentSectionId = sectionMap[params.section || 'ambulance'] || 1;

    // Reset state when section changes
    useEffect(() => {
        console.log("Section changed to:", params.section, "ID:", currentSectionId);
        setActiveTab(1); // Reset to first tab
        setShowForm(false); // Close form
        setRefreshFlag((prev) => prev + 1); // Trigger data refresh
    }, [params.section, currentSectionId]);

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
                            sectionId={currentSectionId}
                        />
                    );
                case 2:
                    return (
                        <AddCityFAQ
                            mode={formMode}
                            data={editData}
                            onCancel={() => setShowForm(false)}
                            onDataChanged={triggerRefresh}
                            sectionId={currentSectionId}
                        />
                    );
                default:
                    return (
                        <AddCity
                            mode={formMode}
                            data={editData}
                            onCancel={() => setShowForm(false)}
                            onDataChanged={triggerRefresh}
                            sectionId={currentSectionId}
                        />
                    );
            }
        }

        return (
            <ExportDataWithButtons
                key={`section-${currentSectionId}-tab-${tabKey}`} // Force re-render on section change
                tabKey={tabKey}
                refreshFlag={refreshFlag}
                onAddNew={handleAddNew}
                onEditRow={handleEditRow}
                onDataChanged={triggerRefresh}
                sectionId={currentSectionId}
            />
        );
    };

    console.log("Rendering Page with Section ID:", currentSectionId);

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