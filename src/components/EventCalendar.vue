<template>
  <div>
    <FullCalendar v-bind:options="options" />
    <EventModal 
      :isVisible="isModalVisible" 
      :eventData="selectedEvent" 
      :isEdit="isEditMode" 
      @save="handleSave" 
      @delete="handleDelete" 
      @close="closeModal" 
    />
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
  initialView: 'dayGridMonth', 
  headerToolbar: {
      left: 'prev,next today',
      center: 'title', 
      right: 'dayGridMonth,timeGridWeek,timeGridDay,list' 
  },
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
  await deleteEvent(selectedEvent.value.id); // Удаляем событие из Firebase
  events.value = events.value.filter(event => event.id !== selectedEvent.value.id); // Удаляем событие из локального списка
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