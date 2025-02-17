<!-- <template>
    <div v-if="isVisible" class="modal-overlay">
      <div class="modal-content">
        <h3>{{ isEdit ? 'Редактировать событие' : 'Добавить новое событие' }}</h3>
        <input v-model="eventData.title" placeholder="Название события" />
        <input v-model="eventData.start" type="datetime-local" />
        <input v-model="eventData.end" type="datetime-local" />
        <button @click="saveEvent">{{ isEdit ? 'Сохранить' : 'Добавить' }}</button>
        <button @click="deleteEvent" v-if="isEdit">Удалить</button>
        <button @click="closeModal">Закрыть</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const props = defineProps({
    isVisible: Boolean,
    eventData: Object,
    isEdit: Boolean,
    onSave: Function,
    onDelete: Function,
    onClose: Function
  })
  
  const eventDataRef = ref({ ...props.eventData })
  
  const saveEvent = () => {
    props.onSave(eventDataRef.value)
  }
  
  const deleteEvent = () => {
    props.onDelete()
  }
  
  const closeModal = () => {
    eventDataRef.value = {}
    props.onClose()
  }
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    backdrop-filter: blur(5px);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .modal-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
  }
  </style> -->
  <template>
    <div v-if="isVisible" class="modal-overlay">
        <div class="modal-content">
            <h3>{{ isEdit ? 'Редактировать событие' : 'Добавить новое событие' }}</h3>
            <input v-model="eventDataRef.title" placeholder="Название события" required />
            <input v-model="eventDataRef.start" type="datetime-local" required />
            <input v-model="eventDataRef.end" type="datetime-local" required />
            <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div> <!-- Сообщение об ошибке -->
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
    if (validateEventData()) {
        props.onSave(eventDataRef.value)
        closeModal() // Закрываем модальное окно после сохранения
    }
}

const deleteEvent = () => {
    props.onDelete()
    closeModal() // Закрываем модальное окно после удаления
}

const closeModal = () => {
    eventDataRef.value = {}
    errorMessage.value = '' // Сбрасываем сообщение об ошибке
    props.onClose()
}
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    backdrop-filter: blur(5px);
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.error-message {
    color: red;
    margin-top: 10px;
}
</style>