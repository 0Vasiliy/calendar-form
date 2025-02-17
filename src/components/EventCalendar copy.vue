<!-- <template>
  <div>
    <FullCalendar v-bind:options="options"/>
    <EventModal 
      :isVisible="isModalVisible" 
      :eventData="selectedEvent" 
      :isEdit="isEditMode" 
      :onSave="handleSave" 
      :onDelete="handleDelete" 
      :onClose="closeModal" 
    />
  </div>
</template>
<script setup>
import {ref, reactive, watch } from 'vue'
import '@fullcalendar/core'
import FullCalendar from '@fullcalendar/vue3'
import DayGridPlagin from '@fullcalendar/daygrid'
import TimeGridPlagin from '@fullcalendar/timegrid'
import ListPlagin from '@fullcalendar/list'
import InteractionPlagin from '@fullcalendar/interaction'
import useEvents from '../composables/useEvents.js'
import EventModal from './EventModal.vue'
const { getEvents, createEvent, updateEvent, deleteEvent} = useEvents()

const id =ref(10)
const options = reactive({
    plugins: [DayGridPlagin, TimeGridPlagin, ListPlagin, InteractionPlagin],
    initalView: 'dayGridMonth',
    headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,ListDay'
    },
    editable: true,
    selectable: true,
    weekends: true,
    // select: (arg) => {
    //     id.value = id.value +1

    //     const cal = arg.view.calendar
    //     cal.unselect()
    //     cal.addEvent({
    //         id:'${id.value}',
    //         title:'NewEvent ${id.value}',
    //         start: arg.start,
    //         end: arg.end,
    //         allDay: true
    //     })
    // },
    select: (arg) => {
        openModal({
            title: '',
            start: arg.start,
            end: arg.end,
            allDay: true
        })
    },
    eventClick: (arg) => {
      if(arg.event){
        arg.event.remove()
      }
    },
    events: [],
    eventAdd: (arg) =>{
        createEvent({
            id: arg.event.id,
            title: arg.event.title,
            start: arg.event.start,
            end: arg.event.end,
            allDay: arg.event.allDay
        })
    },
    eventChange: (arg) =>{
        updateEvent({
            id: arg.event.id,
            title: arg.event.title,
            start: arg.event.start,
            end: arg.event.end,
            allDay: arg.event.allDay
        },arg.event.id)
    },
    eventRemove: (arg) =>{
        deleteEvent(arg.event.id)
    }
})
options.events = getEvents.value
watch(getEvents,() => {
    options.events = getEvents.value
}
)
const openModal = (eventData, isEdit = false) => {
    selectedEvent.value = eventData
    isEditMode.value = isEdit
    isModalVisible.value = true
}

const closeModal = () => {
    isModalVisible.value = false
    selectedEvent.value = {}
}

const handleSave = (eventData) => {
    if (isEditMode.value) {
        updateEvent(eventData)  // Логика обновления события
    } else {
        createEvent(eventData)  // Логика создания события
    }
    closeModal()
}

const handleDelete = () => {
    deleteEvent(selectedEvent.value.id)  // Логика удаления события
    closeModal()
}
</script>
<style scoped>
    
</style> -->