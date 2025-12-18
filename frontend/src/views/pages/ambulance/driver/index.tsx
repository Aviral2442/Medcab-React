import React from "react";
import { Container } from "react-bootstrap";
import ExportDataWithButtons from "@/views/tables/data-tables/ambulance/driver/";
import { useNavigate } from "react-router-dom";

const Page: React.FC = () => {
  const navigate = useNavigate();
  const [refreshFlag, _setRefreshFlag] = React.useState(0);
  const [_showForm, setShowForm] = React.useState(false);
  

  const handleAddNew = () => {
    navigate("/ambulance/add-driver");
    setShowForm(false);
  };


  return (
    <Container fluid className="p-0">

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
