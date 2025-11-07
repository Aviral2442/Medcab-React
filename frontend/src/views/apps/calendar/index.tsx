import {Button, Card, CardBody, Container} from 'react-bootstrap'
import PageTitle from '@/components/PageTitle'
import {LuCalendar} from 'react-icons/lu'
import {useEffect, useRef} from 'react'
import {TbCircleFilled, TbPlus} from 'react-icons/tb'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin, {Draggable} from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import {externalEvents} from '@/views/apps/calendar/data'
import useCalendar from '@/hooks/useCalendar'
import useViewPort from '@/hooks/useViewPort'
import AddEditModal from '@/views/apps/calendar/components/AddEditModal'

const Page = () => {
    const {
        createNewEvent,
        eventData,
        events,
        isEditable,
        onAddEvent,
        onCloseModal,
        onDateClick,
        onDrop,
        onEventClick,
        onEventDrop,
        onRemoveEvent,
        onUpdateEvent,
        show,
    } = useCalendar()

    const {height} = useViewPort()

    const externalEventsEle = useRef<HTMLDivElement | null>(null)

    const draggableInstance = useRef<Draggable | null>(null)

    useEffect(() => {
        if (externalEventsEle.current) {
            draggableInstance.current = new Draggable(externalEventsEle.current, {
                itemSelector: '.external-event',
                eventData: function (eventEl: any) {
                    return {
                        title: eventEl.innerText,
                        classNames: eventEl.getAttribute('data-class'),
                    }
                },
            })
        }

        return () => {
            if (draggableInstance.current) {
                draggableInstance.current.destroy()
            }
        }
    }, [])

    return (
        <Container fluid>
            <PageTitle
                title="Smart Calendar & Event Management"
                subtitle="A beautifully designed, feature-rich calendar component for scheduling, task planning, and event tracking. Fully customizable, responsive, and built to integrate with modern frameworks."
                badge={{
                    title: 'Events & Scheduling',
                    icon: LuCalendar,
                }}
            />

            <div className="outlook-box">
                <Card className="mb-0 d-none d-lg-flex rounded-end-0">
                    <CardBody>
                        <Button variant="primary" className="w-100 btn-new-event" onClick={createNewEvent}>
                            <TbPlus className="me-2 align-middle"/>
                            Create New Event
                        </Button>

                        <div ref={externalEventsEle}>
                            <p className="text-muted mt-2 fst-italic fs-xs mb-3">Drag and drop your event or click in
                                the calendar</p>
                            {externalEvents.map((event) => (
                                <div
                                    key={event.id}
                                    className="external-event fc-event bg-transparent text-body border rounded border-light fw-medium d-flex align-items-center"
                                    data-class="bg-transparent text-body border rounded border-light fw-medium">
                                    <TbCircleFilled className="me-2"/>
                                    {event.title}
                                </div>
                            ))}
                        </div>
                    </CardBody>
                </Card>

                <Card className="h-100 mb-0 rounded-start-0 flex-grow-1 border-start-0">
                    <div className="d-lg-none d-inline-flex card-header">
                        <Button variant="primary" className="btn-new-event" onClick={createNewEvent}>
                            <TbPlus className="me-2 align-middle"/>
                            Create New Event
                        </Button>
                    </div>

                    <CardBody>
                        <FullCalendar
                            initialView="dayGridMonth"
                            plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin]}
                            bootstrapFontAwesome={false}
                            handleWindowResize={true}
                            slotDuration="00:30:00"
                            slotMinTime="07:00:00"
                            slotMaxTime="19:00:00"
                            buttonText={{
                                today: 'Today',
                                month: 'Month',
                                week: 'Week',
                                day: 'Day',
                                list: 'List',
                                prev: 'Prev',
                                next: 'Next',
                            }}
                            headerToolbar={{
                                left: 'prev,next today',
                                center: 'title',
                                right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth',
                            }}
                            height={height - 240}
                            editable={true}
                            selectable={true}
                            droppable={true}
                            events={events}
                            dateClick={onDateClick}
                            eventClick={onEventClick}
                            drop={onDrop}
                            eventDrop={onEventDrop}
                        />
                    </CardBody>
                </Card>
            </div>

            <AddEditModal
                eventData={eventData}
                isEditable={isEditable}
                onAddEvent={onAddEvent}
                onRemoveEvent={onRemoveEvent}
                onUpdateEvent={onUpdateEvent}
                open={show}
                toggle={onCloseModal}
            />
        </Container>
    )
}

export default Page
