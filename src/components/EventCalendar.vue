<!-- <template>
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
  import { ref, reactive, watch } from 'vue';
  import '@fullcalendar/core';
  import FullCalendar from '@fullcalendar/vue3';
  import DayGridPlugin from '@fullcalendar/daygrid';
  import TimeGridPlugin from '@fullcalendar/timegrid';
  import ListPlugin from '@fullcalendar/list';
  import InteractionPlugin from '@fullcalendar/interaction';
  import useEvents from '../composables/useEvents.js';
  import EventModal from './EventModal.vue';
  
  const { getEvents, createEvent, updateEvent, deleteEvent } = useEvents();
  
  const isModalVisible = ref(false);
  const selectedEvent = ref(null);
  const isEditMode = ref(false);
  const events = ref([]); // Хранение списока событий
  const id = ref(10); // Начальный ID для события
  
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
    events: events.value, // Загрузка событий
    select: (arg) => {
      isEditMode.value = false; // Установка режима добавления
      selectedEvent.value = {
        id: id.value++, // Увеличение ID для нового события
        title: '',
        start: arg.start,
        end: arg.end,
        allDay: true
      };
      isModalVisible.value = true; // Открыть модальное окно для нового события
    },
    eventClick: (info) => {
      isEditMode.value = true; // Установка режима редактирования
      selectedEvent.value = {
        id: info.event.id,
        title: info.event.title,
        start: info.event.start,
        end: info.event.end,
        allDay: info.event.allDay
      };
      isModalVisible.value = true; // Открытие модального окна на редактирование
    },
    eventRemove: (info) => {
      deleteEvent(info.event.id); // Удаление событие из source (необязательно, если не используем удаление в модальном окне)
    }
  });
  
  const handleSave = async (eventData) => {
    if (isEditMode.value) {
        await updateEvent(eventData); // Вызов функции обновления события
        const index = events.value.findIndex(event => event.id === eventData.id);
        if (index !== -1) {
            events.value[index] = eventData;
        }
    } else {
        const newEventId = await createEvent(eventData); // Вызов функции создания события
        eventData.id = newEventId; // Устанавливаем ID события
        events.value.push(eventData); // Добавляем новое событие в массив
    }
    closeModal(); // Закрыть модальное окно
};

const handleDelete = async () => {
    await deleteEvent(selectedEvent.value.id); // Удаление события
    events.value = events.value.filter(event => event.id !== selectedEvent.value.id); // Обновляем массив событий
    closeModal(); // Закрыть модальное окно
};
  const closeModal = () => {
    isModalVisible.value = false;
    selectedEvent.value = null; // Сбрасываем выбранное событие
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
  
  <style scoped>
  /* Ваши стили при необходимости */
  </style> 
  -->
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
const events = ref([]); // Хранение списка событий

// Загрузка событий при монтировании компонента
onMounted(async () => {
    await setEvents(); // Загружаем события из Firebase
    events.value = getEvents.value; // Синхронизируем локальное состояние с данными из Firebase
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
    events: events.value, // Загрузка событий
    select: (arg) => {
      isEditMode.value = false; // Установка режима добавления
      selectedEvent.value = {
        title: '',
        start: arg.start,
        end: arg.end,
        allDay: true
      };
      isModalVisible.value = true; // Открыть модальное окно для нового события
    },
    eventClick: (info) => {
      isEditMode.value = true; // Установка режима редактирования
      selectedEvent.value = {
        id: info.event.id,
        title: info.event.title,
        start: info.event.start,
        end: info.event.end,
        allDay: info.event.allDay
      };
      isModalVisible.value = true; // Открытие модального окна на редактирование
    }
});

const handleSave = async (eventData) => {
    if (isEditMode.value) {
        await updateEvent(eventData, eventData.id); // Обновляем событие
        const index = events.value.findIndex(event => event.id === eventData.id);
        if (index !== -1) {
            events.value[index] = eventData; // Обновляем событие в локальном списке
        }
    } else {
        const newEvent = await createEvent(eventData); // Создаем новое событие
        events.value.push(newEvent); // Добавляем новое событие в локальный список
    }
    closeModal(); // Закрыть модальное окно
};

const handleDelete = async () => {
    await deleteEvent(selectedEvent.value.id); // Удаляем событие
    events.value = events.value.filter(event => event.id !== selectedEvent.value.id); // Обновляем локальный список
    closeModal(); // Закрыть модальное окно
};

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

<style scoped>
/* Ваши стили при необходимости */
</style>