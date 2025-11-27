import React from "react";
import { Container } from "react-bootstrap";
import ExportDataWithButtons from "@/views/tables/data-tables/content-writing/blogs/";
import { useNavigate } from "react-router-dom";

const Page: React.FC = () => {
    const navigate = useNavigate();
    const [refreshFlag, _setRefreshFlag] = React.useState(0);

    const handleAddNew = () => {
        navigate('/add-blog');
    };

    // const triggerRefresh = () => setRefreshFlag((prev) => prev + 1);

    return (
        <Container fluid className="p-0">
            <ExportDataWithButtons
                tabKey={1}
                refreshFlag={refreshFlag}
                onAddNew={handleAddNew}
                // onDataChanged={triggerRefresh}
            />
        </Container>
    );
}

export default Page;