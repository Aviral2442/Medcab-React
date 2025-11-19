import React from "react";
import { Container } from "react-bootstrap";
import ExportDataWithButtons from "@/views/tables/data-tables/ambulance/category";
import AddCategory from "../category/components/AddCategory";
import Addfacilities from "../category/components/Addfacilities";
import AddAmbulanceFAQ from "../category/components/AddAmbulanceFAQ";

const Page = () => {
  const [activeTab, setActiveTab] = React.useState(1);
  const [showForm, setShowForm] = React.useState(false);
  const [formMode, setFormMode] = React.useState<"add" | "edit">("add");
  const [editData, setEditData] = React.useState<any>(null);
  const [refreshFlag, setRefreshFlag] = React.useState(0);

  const tabs = [
    { key: 1, label: "Category" },
    { key: 2, label: "FAQ" },
    { key: 3, label: "Facilities" },
  ];

  const handleAddNew = React.useCallback(() => {
    setFormMode("add");
    setEditData(null);
    setShowForm(true);
  }, []);

  const handleEditRow = React.useCallback((row: any) => {
    setFormMode("edit");
    setEditData(row);
    setShowForm(true);
  }, []);

  const triggerRefresh = React.useCallback(() => {
    setRefreshFlag((prev) => prev + 1);
  }, []);

  const handleCancel = React.useCallback(() => {
    setShowForm(false);
  }, []);

  const renderSection = React.useMemo(() => {
    if (showForm) {
      switch (activeTab) {
        case 1:
          return (
            <AddCategory
              mode={formMode}
              data={editData}
              onCancel={handleCancel}
              onDataChanged={triggerRefresh}
            />
          );
        case 2:
          return (
            <Addfacilities
              mode={formMode}
              data={editData}
              onCancel={handleCancel}
              onDataChanged={triggerRefresh}
            />
          );
        case 3:
          return (
            <AddAmbulanceFAQ
              mode={formMode}
              data={editData}
              onCancel={handleCancel}
              onDataChanged={triggerRefresh}
            />
          );
        default:
          return null;
      }
    }
    return (
      <ExportDataWithButtons
        tabKey={activeTab}
        onAddNew={handleAddNew}
        onEditRow={handleEditRow}
        refreshFlag={refreshFlag}
        onDataChanged={triggerRefresh}
      />
    );
  }, [showForm, activeTab, formMode, editData, refreshFlag, handleAddNew, handleEditRow, handleCancel, triggerRefresh]);

  return (
    <Container fluid className="p-0">
      <div className="m-3">
        <ul className="nav nav-tabs">
          {tabs.map((tab) => (
            <li className="nav-item" key={tab.key}>
              <button
                className={`nav-link ${activeTab === tab.key ? "active" : ""}`}
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
      <div>{renderSection}</div>
    </Container>
  );
};

export default Page;
