import { ref, onMounted } from 'vue';
import { fetchEvents, storeEvents, mutateEvents, destroyEvents } from '../api/events.js';

export default function useEvents() {
    const getEvents = ref([]);

    // Функция для загрузки событий из Firebase
    const setEvents = async () => {
        try {
            const events = await fetchEvents();
            if (events) {
                // Преобразуем объект событий в массив, добавляя ID
                getEvents.value = Object.keys(events).map(key => ({
                    id: key,
                    ...events[key]
                }));
            }
        } catch (error) {
            console.error('Ошибка получения событий: ', error);
        }
    };
    const createEvent = async (event) => {
        try {
          // Преобразуем даты в формат ISO
          const formattedEvent = {
            ...event,
            start: new Date(event.start).toISOString(),
            end: new Date(event.end).toISOString(),
          };
          const newEventId = await storeEvents(formattedEvent);
          const newEvent = { id: newEventId, ...formattedEvent };
          getEvents.value.push(newEvent);
          return newEvent;
        } catch (error) {
          console.error('Ошибка при создании события: ', error);
        }
      };
      
      const updateEvent = async (event, id) => {
        try {
          // Преобразуем даты в формат ISO
          const formattedEvent = {
            ...event,
            start: new Date(event.start).toISOString(),
            end: new Date(event.end).toISOString(),
          };
          await mutateEvents(formattedEvent, id);
          const index = getEvents.value.findIndex(ev => ev.id === id);
          if (index !== -1) {
            getEvents.value[index] = { ...getEvents.value[index], ...formattedEvent };
          }
        } catch (error) {
          console.error('Ошибка при обновлении события: ', error);
        }
      };
    // Функция для удаления события
    const deleteEvent = async (id) => {
        try {
            await destroyEvents(id); // Удаляем событие из Firebase
            getEvents.value = getEvents.value.filter(ev => ev.id !== id); // Удаляем событие из локального списка
        } catch (error) {
            console.error('Ошибка при удалении события: ', error);
        }
    };

    // При монтировании компонента загружаем события
    onMounted(setEvents);

    return {
        getEvents,
        setEvents,
        createEvent,
        updateEvent,
        deleteEvent
    };
}