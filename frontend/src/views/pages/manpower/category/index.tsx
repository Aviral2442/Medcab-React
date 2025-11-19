import React from "react";
import { Container } from "react-bootstrap";
import ExportDataWithButtons from "@/views/tables/data-tables/manpower/category/";
import AddCategory from "../category/components/AddCategory";
import AddSubCategory from "../category/components/AddSubCategory";
import AddFAQ from "../category/components/AddFAQ";
import AddBanner from "../category/components/AddBanner";
import AddCoupons from "../category/components/AddCoupons";
import AddPriceMapper from "../category/components/AddPriceMapper";

const Page = () => {
  const [activeTab, setActiveTab] = React.useState(1);
  const [showForm, setShowForm] = React.useState(false);
  const [formMode, setFormMode] = React.useState<"add" | "edit">("add");
  const [editData, setEditData] = React.useState<any>(null);

  const tabs = [
    { key: 1, label: "Category" },
    { key: 2, label: "Sub Category" },
    { key: 3, label: "FAQ" },
    { key: 4, label: "Banner" },
    { key: 5, label: "Coupons" },
    { key: 6, label: "Price Mapper" },
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

  const [refreshFlag, setRefreshFlag] = React.useState(0);

  const triggerRefresh = () => setRefreshFlag((prev) => prev + 1);

  const renderSection = (tabKey: number) => {
    if (showForm) {
      switch (tabKey) {
        case 1:
          return (
            <AddCategory
              mode={formMode}
              data={editData}
              onCancel={() => setShowForm(false)}
              onDataChanged={triggerRefresh}
            />
          );
        case 2:
          return (
            <AddSubCategory
              mode={formMode}
              data={editData}
              onCancel={() => setShowForm(false)}
              onDataChanged={triggerRefresh}
            />
          );
        case 3:
          return (
            <AddFAQ
              mode={formMode}
              data={editData}
              onCancel={() => setShowForm(false)}
              onDataChanged={triggerRefresh}
            />
          );
        case 4:
          return (
            <AddBanner
              mode={formMode}
              data={editData}
              onCancel={() => setShowForm(false)}
              onDataChanged={triggerRefresh}
            />
          );
        case 5:
          return (
            <AddCoupons
              mode={formMode}
              data={editData}
              onCancel={() => setShowForm(false)}
              onDataChanged={triggerRefresh}
            />
          );
        case 6:
          return (
            <AddPriceMapper
              mode={formMode}
              data={editData}
              onCancel={() => setShowForm(false)}
              onDataChanged={triggerRefresh}
            />
          );
        default:
          return (
            <AddCategory
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
        onAddNew={handleAddNew}
        onEditRow={handleEditRow}
        refreshFlag={refreshFlag}
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
