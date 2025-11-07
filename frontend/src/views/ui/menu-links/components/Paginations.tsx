import ComponentCard from '@/components/ComponentCard'
import {Col, Pagination, Row} from 'react-bootstrap'
import {LuArrowLeft, LuArrowRight} from 'react-icons/lu'
import {TbChevronLeft, TbChevronRight} from 'react-icons/tb'

const DefaultPagination = () => {
    const items = []
    for (let number = 1; number <= 3; number++) {
        items.push(<Pagination.Item key={number}>{number}</Pagination.Item>)
    }
    return (
        <>
            <h5 className="mb-2 pb-1">Default Pagination</h5>
            <Pagination className="mb-0">
                <Pagination.Prev/>
                {items}
                <Pagination.Next/>
            </Pagination>
        </>
    )
}

const SizingPagination = () => {
    const items = []
    for (let number = 1; number <= 3; number++) {
        items.push(<Pagination.Item key={number}>{number}</Pagination.Item>)
    }
    return (
        <>
            <h5 className="mb-2 pb-1">Sizing</h5>
            <nav>
                <Pagination size="lg">
                    <Pagination.Prev/>
                    {items}
                    <Pagination.Next/>
                </Pagination>
                <Pagination size="sm" className="mb-0">
                    <Pagination.Prev/>
                    {items}
                    <Pagination.Next/>
                </Pagination>
            </nav>
        </>
    )
}

const AlignmentPagination = () => {
    return (
        <>
            <div className="mt-4">
                <h5 className="mb-2 pb-1">Alignment</h5>
                <Pagination className="justify-content-center">
                    <Pagination.Prev disabled>Previous</Pagination.Prev>
                    <Pagination.Item>{1}</Pagination.Item>
                    <Pagination.Item>{2}</Pagination.Item>
                    <Pagination.Item>{3}</Pagination.Item>
                    <Pagination.Next>Next</Pagination.Next>
                </Pagination>
                <Pagination className="justify-content-end">
                    <Pagination.Prev disabled>Previous</Pagination.Prev>
                    <Pagination.Item>{1}</Pagination.Item>
                    <Pagination.Item>{2}</Pagination.Item>
                    <Pagination.Item>{3}</Pagination.Item>
                    <Pagination.Next>Next</Pagination.Next>
                </Pagination>
            </div>
        </>
    )
}

const DisabledAndActive = () => {
    return (
        <>
            <h5 className="mb-2 pb-1">Disabled and active states</h5>
            <Pagination className="mb-0">
                <Pagination.Prev disabled>Previous</Pagination.Prev>
                <Pagination.Item>{1}</Pagination.Item>
                <Pagination.Item active>{2}</Pagination.Item>
                <Pagination.Item>{3}</Pagination.Item>
                <Pagination.Next>Next</Pagination.Next>
            </Pagination>
        </>
    )
}

const BoxedPagination = () => {
    return (
        <>
            <div className="mt-4">
                <h5 className="mb-2 pb-1">Boxed Pagination</h5>
                <nav>
                    <Pagination className="pagination-boxed">
                        <Pagination.Prev/>
                        <Pagination.Item>1</Pagination.Item>
                        <Pagination.Item>2</Pagination.Item>
                        <Pagination.Item active>3</Pagination.Item>
                        <Pagination.Item>4</Pagination.Item>
                        <Pagination.Item>5</Pagination.Item>
                        <Pagination.Next/>
                    </Pagination>
                    <Pagination className="pagination-lg pagination-boxed">
                        <Pagination.Prev/>
                        <Pagination.Item>1</Pagination.Item>
                        <Pagination.Item>2</Pagination.Item>
                        <Pagination.Item active>3</Pagination.Item>
                        <Pagination.Item>4</Pagination.Item>
                        <Pagination.Item>5</Pagination.Item>
                        <Pagination.Next/>
                    </Pagination>
                    <Pagination className="pagination-sm pagination-boxed mb-0">
                        <Pagination.Prev/>
                        <Pagination.Item>1</Pagination.Item>
                        <Pagination.Item>2</Pagination.Item>
                        <Pagination.Item active>3</Pagination.Item>
                        <Pagination.Item>4</Pagination.Item>
                        <Pagination.Item>5</Pagination.Item>
                        <Pagination.Next/>
                    </Pagination>
                </nav>
            </div>
        </>
    )
}

const CustomIconPagination = () => {
    return (
        <>
            <div className="mt-4">
                <h5 className="mb-2 pb-1">Custom Icon Pagination</h5>
                <Pagination className="pagination-boxed">
                    <Pagination.Prev>
                        <TbChevronLeft/>
                    </Pagination.Prev>
                    <Pagination.Item>1</Pagination.Item>
                    <Pagination.Item active>2</Pagination.Item>
                    <Pagination.Item>3</Pagination.Item>
                    <Pagination.Item>4</Pagination.Item>
                    <Pagination.Item>5</Pagination.Item>
                    <Pagination.Next>
                        <TbChevronRight className="align-middle"/>
                    </Pagination.Next>
                </Pagination>
                <Pagination className="pagination-boxed">
                    <Pagination.Prev>
                        <LuArrowLeft/>
                    </Pagination.Prev>
                    <Pagination.Item>1</Pagination.Item>
                    <Pagination.Item>2</Pagination.Item>
                    <Pagination.Item active>3</Pagination.Item>
                    <Pagination.Item>4</Pagination.Item>
                    <Pagination.Item>5</Pagination.Item>
                    <Pagination.Next>
                        <LuArrowRight/>
                    </Pagination.Next>
                </Pagination>
            </div>
        </>
    )
}

const RoundedPagination = () => {
    return (
        <>
            <div className="mt-4">
                <h5 className="mb-2 pb-1">Rounded Pagination</h5>
                <nav>
                    <Pagination className="pagination-rounded pagination-boxed mb-0">
                        <Pagination.Prev/>
                        <Pagination.Item>1</Pagination.Item>
                        <Pagination.Item>2</Pagination.Item>
                        <Pagination.Item active>3</Pagination.Item>
                        <Pagination.Item>4</Pagination.Item>
                        <Pagination.Item>5</Pagination.Item>
                        <Pagination.Next/>
                    </Pagination>
                </nav>
            </div>
        </>
    )
}

const Paginations = () => {
    return (
        <>
            <ComponentCard title="Pagination Variations" isCollapsible>
                <Row>
                    <Col lg={6}>
                        <DefaultPagination/>
                        <AlignmentPagination/>
                        <DisabledAndActive/>
                        <CustomIconPagination/>
                    </Col>
                    <Col lg={6}>
                        <SizingPagination/>
                        <BoxedPagination/>
                        <RoundedPagination/>
                    </Col>
                </Row>
            </ComponentCard>
        </>
    )
}

export default Paginations
