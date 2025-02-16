import { ref, onMounted } from 'vue'
import { fetchEvents, storeEvents, mutateEvents, destroyEvents} from '../api/events.js'

export default function useEvents(){
    const getEvents = ref([]),

    const setEvents = async () => {
        getEvents.value = await fetchEvents()
    }
    const createEvent = async (event) => {
       storeEvents(event)
    }
    const updateEvent = async (event,id) => {
        mutateEvents(event,id)
    }
    const deleteEvent = async (id) => {
        destroyEvents(id)
    }
    onMounted(setEvents)

    return {
        getEvents,
        setEvents,
        createEvent,
        updateEvent,
        deleteEvent
    }
}
