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
  import { ref, reactive } from 'vue';
  import '@fullcalendar/core';
  import FullCalendar from '@fullcalendar/vue3';
  import DayGridPlagin from '@fullcalendar/daygrid';
  import TimeGridPlagin from '@fullcalendar/timegrid';
  import ListPlagin from '@fullcalendar/list';
  import InteractionPlagin from '@fullcalendar/interaction';
  import useEvents from '../composables/useEvents.js';
  import EventModal from './EventModal.vue';
  
  const { getEvents, createEvent, updateEvent, deleteEvent } = useEvents();
  
  const isModalVisible = ref(false);
  const selectedEvent = ref(null);
  const isEditMode = ref(false);
  const id = ref(10); // Начальный ID для события
  
  const options = reactive({
    plugins: [DayGridPlagin, TimeGridPlagin, ListPlagin, InteractionPlagin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,list'
    },
    editable: true,
    selectable: true,
    weekends: true,
    // events: getEvents(), // Загружаем события из useEvents
    select: (arg) => {
      isEditMode.value = false; // Установить режим добавления
      selectedEvent.value = {
        title: '',
        start: arg.start,
        end: arg.end,
        allDay: true
      };
      isModalVisible.value = true; // Открыть модальное окно для нового события
    },
    eventClick: (info) => {
      isEditMode.value = true; // Установить режим редактирования
      selectedEvent.value = { ...info.event }; // Копируем информацию о событии для редактирования
      isModalVisible.value = true; // Открыть модальное окно для редактирования
    }
  });
  
  // Обработчик сохранения события
  const handleSave = async (eventData) => {
    if (isEditMode.value) {
      await updateEvent(eventData); // Обновление события
    } else {
      eventData.id = `${id.value++}`; // Увеличиваем ID при создании нового события
      await createEvent(eventData); // Создаем новое событие
    }
    isModalVisible.value = false; // Закрыть модальное окно
    // Перезагрузить события, если необходимо
    options.events = getEvents();
  };
  
  // Обработчик удаления события
  const handleDelete = async () => {
    if (selectedEvent.value) {
      await deleteEvent(selectedEvent.value.id); // Удаляем событие по ID
      isModalVisible.value = false; // Закрыть модальное окно
      // Перезагрузить события, если необходимо
      options.events = getEvents();
    }
  };
  
  // Закрытие модального окна
  const closeModal = () => {
    isModalVisible.value = false;
  };
  
  </script>