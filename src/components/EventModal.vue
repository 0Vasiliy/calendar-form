<template>
    <div v-if="isVisible" class="modal-overlay">
        <div class="modal-content">
            <h3>{{ isEdit ? 'Редактировать событие' : 'Добавить новое событие' }}</h3>
            <input v-model="eventDataRef.title" placeholder="Название события" required />
            <input v-model="eventDataRef.start" type="date" required />
            <input v-model="eventDataRef.end" type="date" required />
            <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
            <button @click="saveEvent">{{ isEdit ? 'Сохранить' : 'Добавить' }}</button>
            <button @click="deleteEvent" v-if="isEdit">Удалить</button>
            <button @click="closeModal">Закрыть</button>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
    isVisible: Boolean,
    eventData: Object,
    isEdit: Boolean,
    onSave: Function,
    onDelete: Function,
    onClose: Function
})

const eventDataRef = ref({ ...props.eventData })
const errorMessage = ref('')

watch(() => props.eventData, (newVal) => {
    if (newVal) {
        eventDataRef.value = { ...newVal }
    }
})

const validateEventData = () => {
    if (!eventDataRef.value.title || !eventDataRef.value.start || !eventDataRef.value.end) {
        errorMessage.value = 'Все поля обязательны для заполнения.'
        return false
    }
    if (new Date(eventDataRef.value.start) >= new Date(eventDataRef.value.end)) {
        errorMessage.value = 'Начало события должно быть раньше окончания.'
        return false
    }
    errorMessage.value = ''
    return true
}

const saveEvent = () => {
  // Устанавливаем значения по умолчанию, если start или end не указаны
  if (!eventDataRef.value.start) {
    eventDataRef.value.start = new Date().toISOString();
  }
  if (!eventDataRef.value.end) {
    const endDate = new Date(eventDataRef.value.start);
    endDate.setHours(endDate.getHours() + 1); // Устанавливаем end на час позже start
    eventDataRef.value.end = endDate.toISOString();
  }

  if (validateEventData()) {
    props.onSave(eventDataRef.value);
    closeModal();
  }
};
const deleteEvent = () => {
    if (confirm('Вы уверены, что хотите удалить это событие?')) {
        props.onDelete(eventDataRef.value.id);
        closeModal();
    }
};

const closeModal = () => {
    eventDataRef.value = {}
    errorMessage.value = ''
    props.onClose()
}
</script>

<style scoped>
.modal-overlay {
    width: 400px;
    height: 400px;
    background: #DCDCDC;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    backdrop-filter: blur(5px);
    display: flex;
    align-items: center;
    justify-content: center; 
    z-index: 10000;
    border: 2px solid gray;
    border-radius: 4px;
}

.modal-content { 
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
input, button{
    padding: 10px;
    border: 2px solid gray;
    border-radius: 4px;
}
.error-message {
    color: red;
    margin-top: 10px;
}
@media(max-width: 700px){
    .modal-overlay{
        width: 300px;
        height: 350px;
    }
}
</style>