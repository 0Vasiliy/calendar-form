import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, push, update, remove, get } from 'firebase/database';

// Конфигурация Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBjP3AEJNKVFp07ROomynZ_QzNYyzsug_4",
    authDomain: "vet-onlain.firebaseapp.com",
    databaseURL: "https://vet-onlain-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "vet-onlain",
    storageBucket: "vet-onlain.firebasestorage.app",
    messagingSenderId: "140746709659",
    appId: "1:140746709659:web:2d91a30a8a23c86eb4043e"
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Функция для получения всех событий из базы данных
export const fetchEvents = async () => {
    const eventsRef = ref(database, 'events'); // Ссылка на узел 'events' в базе данных
    const snapshot = await get(eventsRef); // Получаем данные
    return snapshot.val(); // Возвращаем данные в формате объекта
}

// Функция для добавления нового события в базу данных
export const storeEvents = async (event) => {
    const eventsRef = ref(database, 'events'); // Ссылка на узел 'events'
    const newEventRef = push(eventsRef); // Создаем новый узел с уникальным ID
    await set(newEventRef, event); // Сохраняем событие в Firebase
    return newEventRef.key; // Возвращаем ID нового события
}

// Функция для обновления существующего события в базе данных
export const mutateEvents = async (event, id) => {
    const eventRef = ref(database, `events/${id}`); // Ссылка на конкретное событие по ID
    await update(eventRef, event); // Обновляем данные события
}

// Функция для удаления события из базы данных
export const destroyEvents = async (id) => {
    const eventRef = ref(database, `events/${id}`); // Ссылка на конкретное событие по ID
    await remove(eventRef); // Удаляем событие из Firebase
}