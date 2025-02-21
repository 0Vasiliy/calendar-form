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

// Используем хук useEvents для управления событиями
const { getEvents, createEvent, updateEvent, deleteEvent, setEvents } = useEvents();

// Состояние для управления видимостью модального окна
const isModalVisible = ref(false);

// Состояние для хранения выбранного события
const selectedEvent = ref(null);

// Состояние для определения режима (редактирование или добавление)
const isEditMode = ref(false);

// Реактивный массив для хранения списка событий
const events = ref([]);

// Загрузка событий при монтировании компонента
onMounted(async () => {
    await setEvents(); // Загружаем события из Firebase
    events.value = getEvents.value; // Синхронизируем локальное состояние с данными из Firebase
});

// Конфигурация FullCalendar
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

    // Обработчик выделения ячейки (добавление нового события)
    select: (arg) => {
        isEditMode.value = false; // Устанавливаем режим добавления
        selectedEvent.value = {
            title: '',
            start: arg.start, 
            end: arg.end, 
            allDay: true 
        };
        isModalVisible.value = true; // Открываем модальное окно
    },

    // Обработчик клика по событию (редактирование существующего события)
    eventClick: (info) => {
        isEditMode.value = true; // Устанавливаем режим редактирования
        selectedEvent.value = {
            id: info.event.id, 
            title: info.event.title, 
            start: info.event.start, 
            end: info.event.end, 
            allDay: info.event.allDay 
        };
        isModalVisible.value = true; // Открываем модальное окно
    }
});

// Обработчик сохранения события
const handleSave = async (eventData) => {
    if (isEditMode.value) {
        // Режим редактирования: обновляем событие
        await updateEvent(eventData, eventData.id);
        const index = events.value.findIndex(event => event.id === eventData.id);
        if (index !== -1) {
            events.value[index] = eventData; // Обновляем событие в локальном списке
        }
    } else {
        // Режим добавления: создаем новое событие
        const newEvent = await createEvent(eventData);
        events.value.push(newEvent); // Добавляем новое событие в локальный список
    }
    closeModal(); 
};

// Обработчик удаления события
const handleDelete = async () => {
    await deleteEvent(selectedEvent.value.id); // Удаляем событие из Firebase
    events.value = events.value.filter(event => event.id !== selectedEvent.value.id); // Удаляем событие из локального списка
    closeModal(); 
};

// Закрытие модального окна
const closeModal = () => {
    isModalVisible.value = false;
    selectedEvent.value = null; // Сбрасываем выбранное событие
};

// Следим за изменениями в events и обновляем календарь
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
