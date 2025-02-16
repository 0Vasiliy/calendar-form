<template>
    <FullCalendar v-bind:options="options"/>
</template>
<script setup>
import {ref, reactive } from 'vue'
import '@fullcalendar/core'
import FullCalendar from '@fullcalendar/vue3'
import DayGridPlagin from '@fullcalendar/daygrid'
import TimeGridPlagin from '@fullcalendar/timegrid'
import ListPlagin from '@fullcalendar/list'
import InteractionPlagin from '@fullcalendar/interaction'
// import useEvents from '../composables/useEvents.js'

const id =ref(10)
const options = reactive({
    plugins: [DayGridPlagin, TimeGridPlagin, ListPlagin, InteractionPlagin],
    initalView: 'dayGridMonth',
    headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,ListDay'
    },
    editable: true,
    selectable: true,
    weekends: true,
    select: (arg) => {
        id.value = id.value +1

        const cal = arg.view.calendar
        cal.unselect()
        cal.addEvent({
            id:'${id.value}',
            title:'NewEvent ${id.value}',
            start: arg.start,
            end: arg.end,
            allDay: true
        })
    },
    eventClick: (arg) => {
        console.log(arg.event.title)
    }
})
</script>
<style scoped>
    
</style>