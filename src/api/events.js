const baseURL = 'http://localhost:3011';

export const fetchEvents = async () => {
    const response = await fetch(`${baseURL}/events`);
    return await response.json();
}

export const storeEvents = async (event) => {
    return await fetch(`${baseURL}/events`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(event)
    });
}

export const mutateEvents = async (event, id) => {
    return await fetch(`${baseURL}/events/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(event)
    });
}

export const destroyEvents = async (id) => {
    return await fetch(`${baseURL}/events/${id}`, {
        method: 'DELETE'
    });
}