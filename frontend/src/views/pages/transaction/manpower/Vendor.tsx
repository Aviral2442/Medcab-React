import {Container } from "react-bootstrap";
import ExportDataWithButtons from "@/views/tables/data-tables/transaction/manpower/VendorTransaction";
import "rsuite/dist/rsuite.min.css";

const Page = () => {

  return (
    <Container fluid className="p-0">
      <ExportDataWithButtons
        tabKey={1}
        refreshFlag={0}
      />
    </Container>
  );
};

export default Page;
