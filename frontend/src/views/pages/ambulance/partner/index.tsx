import React from 'react'
import { Container } from 'react-bootstrap'
import ExportDataWithButtons from '@/views/tables/data-tables/ambulance/partner/'
import { useNavigate } from 'react-router-dom'

const Page: React.FC = () => {

  const navigate = useNavigate();
  const [refreshFlag, _setRefreshFlag] = React.useState(0);

  const handleAddNew = () => {
    navigate('/ambulance/partner/add-partner')
  }


  return (
    <Container fluid className="p-0">
        <ExportDataWithButtons  
        tabKey={1}
        refreshFlag={refreshFlag}
        onAddNew={handleAddNew}
      />
    </Container>
  )
}

export default Page