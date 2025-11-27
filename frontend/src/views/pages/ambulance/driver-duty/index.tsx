import React from "react";
import { Container } from "react-bootstrap";
import ExportDataWithButtons from "@/views/tables/data-tables/ambulance/driver-location/";
import { useNavigate } from "react-router-dom";
const Page: React.FC = () => {
  const navigate = useNavigate();

  const [refreshFlag, _setRefreshFlag] = React.useState(0);
  
  const handleMap = () => {
    navigate('/ambulance/driver-duty-map');
  };

  return (
    <Container fluid className="p-0">
        <ExportDataWithButtons  
        tabKey={1}
        refreshFlag={refreshFlag}
        onMap={handleMap}
        onDataChanged={() => {}}
      />
    </Container>
  );
};

export default Page;