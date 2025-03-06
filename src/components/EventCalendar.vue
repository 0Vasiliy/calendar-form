<template>
  <div class="event-calendar">
    <h1> Календарь записи событий</h1>
    <FullCalendar v-bind:options="options" />
    <EventModal 
      :isVisible="isModalVisible" 
      :eventData="selectedEvent" 
      :isEdit="isEditMode" 
      @save="handleSave" 
      @delete="handleDelete" 
      @close="closeModal" 
    />
    <div class="event-web">©Все права защищены.Web-Студия ЛИС.</div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue';
import '@fullcalendar/core';
import FullCalendar from '@fullcalendar/vue3';
import DayGridPlugin from '@fullcalendar/daygrid';
import TimeGridPlugin from '@fullcalendar/timegrid';
import ListPlugin from '@fullcalendar/list';
import InteractionPlugin from '@fullcalendar/interaction';
import useEvents from '../composables/useEvents.js';
import EventModal from './EventModal.vue';
import allLocales from '@fullcalendar/core/locales-all';
const { getEvents, createEvent, updateEvent, deleteEvent, setEvents } = useEvents();

const isModalVisible = ref(false);
const selectedEvent = ref(null);
const isEditMode = ref(false);
const events = ref([]);

onMounted(async () => {
  await setEvents();
  events.value = getEvents.value;
});

const options = reactive({
  plugins: [DayGridPlugin, TimeGridPlugin, ListPlugin, InteractionPlugin], 
  initialView:'dayGridMonth',
  locales: allLocales,
  locale: 'ru',
  headerToolbar: {
      left: 'prev,next today',
      center: 'title', 
      right: 'dayGridMonth,timeGridWeek,timeGridDay,list', 
  },
  events: [
    {
      display: 'background',
      backgroundColor: 'yellow',
      color: 'yellow',
    }
  ],
  eventResizableFromStart: true,
  eventDurationEditable: true,
  eventDragMinDistance: true,
  eventResize: true,
  eventStartEditable: true,
  nowIndicator: true,
  eventBackgroundColor:'teal',
  eventColor: 'gray',
  editable: true, 
  selectable: true, 
  weekends: true, 
  events: events.value, 
  select: (arg) => {
      isEditMode.value = false;
      selectedEvent.value = {
          title: '',
          start: arg.start, 
          end: arg.end, 
          allDay: true 
      };
      isModalVisible.value = true;
  },

  eventClick: (info) => {
      isEditMode.value = true;
      selectedEvent.value = {
          id: info.event.id, 
          title: info.event.title, 
          start: info.event.start, 
          end: info.event.end, 
          allDay: info.event.allDay 
      };
      isModalVisible.value = true;
  },

  // Обработчик перетаскивания события
  eventDrop: async (info) => {
    const updatedEvent = {
      id: info.event.id,
      title: info.event.title,
      start: info.event.start,
      end: info.event.end,
      allDay: info.event.allDay
    };

    try {
      // Обновляем событие в Firebase
      await updateEvent(updatedEvent, updatedEvent.id);

      // Обновляем локальное состояние
      const index = events.value.findIndex(event => event.id === updatedEvent.id);
      if (index !== -1) {
        events.value[index] = updatedEvent;
      }
    } catch (error) {
      console.error('Ошибка при обновлении события: ', error);
      // Если произошла ошибка, можно откатить изменение в календаре
      info.revert();
    }
  }
});

const handleSave = async (eventData) => {
  if (isEditMode.value) {
      await updateEvent(eventData, eventData.id);
      const index = events.value.findIndex(event => event.id === eventData.id);
      if (index !== -1) {
          events.value[index] = eventData;
      }
  } else {
      const newEvent = await createEvent(eventData);
      events.value.push(newEvent);
  }
  closeModal(); 
};

const handleDelete = async () => {
  await deleteEvent(selectedEvent.value.id);
  events.value = events.value.filter(event => event.id !== selectedEvent.value.id);
  closeModal(); 
};

const closeModal = () => {
  isModalVisible.value = false;
  selectedEvent.value = null;
};

watch(events, (newEvents) => {
  options.events = newEvents.map(event => ({
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end,
      allDay: event.allDay
  }));
}, { deep: true });

</script>
<style>
.event-calendar{
  max-width: 1620px;
  margin: 0 auto;
}
h1{
  text-align: center;
  color: gray;
}
.fc-button-group{
  gap: 5px;
}
.event-web{
  color: gray;
  font-size: 14px;
  display: flex;
  justify-content: flex-end;
  padding: 15px;
}
@media (max-width: 750px){
.fc .fc-button{
  padding: 2px;
}
.fc .fc-toolbar-title{
  font-size: 1.3em;
}
.fc-event-title{
  font-size: 12px;
}
}
@media (max-width:550px){
  .fc .fc-toolbar{
    flex-direction: column;
}
.fc .fc-toolbar-title {
   padding:2px 0px 5px 0px;
 }  
.fc-event-title{
  font-size: 10px;
}  
.fc .fc-col-header-cell-cushion{
  font-size: 12px;
}   
.event-web{
font-size: 12px;
justify-content: center;
}
.fc-direction-ltr .fc-daygrid-event .fc-event-time{
  margin-right: 1px;
  font-size: 10px;
}
}
</style>
