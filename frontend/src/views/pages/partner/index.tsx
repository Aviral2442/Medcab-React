import React from 'react'
import { Container } from 'react-bootstrap'
import ExportDataWithButtons from '@/views/tables/data-tables/partner-data'

const Page: React.FC = () => {
  return (
    <Container fluid className="p-2">
        <ExportDataWithButtons  
        tabKey={1}
        refreshFlag={0}
      />
    </Container>
  )
}

export default Page