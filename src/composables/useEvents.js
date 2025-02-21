// import { ref, onMounted } from 'vue';
// import { fetchEvents, storeEvents, mutateEvents, destroyEvents } from '../api/events.js';

// // Хук useEvents для управления событиями (добавление, обновление, удаление)
// export default function useEvents() {
//     // Реактивный массив для хранения списка событий
//     const getEvents = ref([]);

//     // Функция для загрузки событий из базы данных
//     const setEvents = async () => {
//         try {
//             // Загружаем события из Firebase
//             getEvents.value = await fetchEvents();
//         } catch (error) {
//             console.error('Ошибка получения событий: ', error);
//         }
//     };

//     // Функция для создания нового события
//     const createEvent = async (event) => {
//         try {
//             // Сохраняем событие в Firebase и получаем его ID
//             const newEvent = await storeEvents(event);
//             // Добавляем новое событие в локальный список
//             getEvents.value.push(newEvent);
//         } catch (error) {
//             console.error('Ошибка при создании события: ', error);
//         }
//     };

//     // Функция для обновления существующего события
//     const updateEvent = async (event, id) => {
//         try {
//             // Обновляем событие в Firebase
//             await mutateEvents(event, id);
//             // Обновляем событие в локальном списке
//             const index = getEvents.value.findIndex(ev => ev.id === id);
//             if (index !== -1) {
//                 getEvents.value[index] = { ...getEvents.value[index], ...event };
//             }
//         } catch (error) {
//             console.error('Ошибка при обновлении события: ', error);
//         }
//     };

//     // Функция для удаления события
//     const deleteEvent = async (id) => {
//         try {
//             // Удаляем событие из Firebase
//             await destroyEvents(id);
//             // Удаляем событие из локального списка
//             getEvents.value = getEvents.value.filter(ev => ev.id !== id);
//         } catch (error) {
//             console.error('Ошибка при удалении события: ', error);
//         }
//     };

//     // При монтировании компонента загружаем события
//     onMounted(setEvents);

//     // Возвращаем функции и данные для использования в компонентах
//     return {
//         getEvents,
//         setEvents,
//         createEvent,
//         updateEvent,
//         deleteEvent
//     };
// }
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

    // Функция для создания нового события
    const createEvent = async (event) => {
        try {
            const newEventId = await storeEvents(event); // Сохраняем событие в Firebase
            const newEvent = { id: newEventId, ...event }; // Добавляем ID к событию
            getEvents.value.push(newEvent); // Добавляем событие в локальный список
            return newEvent; // Возвращаем новое событие с ID
        } catch (error) {
            console.error('Ошибка при создании события: ', error);
        }
    };

    // Функция для обновления существующего события
    const updateEvent = async (event, id) => {
        try {
            await mutateEvents(event, id); // Обновляем событие в Firebase
            const index = getEvents.value.findIndex(ev => ev.id === id);
            if (index !== -1) {
                getEvents.value[index] = { ...getEvents.value[index], ...event }; // Обновляем событие в локальном списке
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