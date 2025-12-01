import React from "react";
import { Container } from "react-bootstrap";
import ExportDataWithButtons from "@/views/tables/data-tables/ambulance/driver/";
import { useNavigate } from "react-router-dom";

const Page: React.FC = () => {
  const navigate = useNavigate();
  const [refreshFlag, _setRefreshFlag] = React.useState(0);
  const [activeTab, setActiveTab] = React.useState(1);
  const [_showForm, setShowForm] = React.useState(false);
  

  const handleAddNew = () => {
    navigate("/ambulance/add-driver");
    setShowForm(false);
  };

  const tabs = [
    { key: 1, title: "Drivers" },
    { key: 2, title: "Transaction" },
  ];

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
                {tab.title}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <ExportDataWithButtons
          tabKey={1}
          refreshFlag={refreshFlag}
          onAddNew={handleAddNew}
        />
      </div>
    </Container>
  );
};

export default Page;
