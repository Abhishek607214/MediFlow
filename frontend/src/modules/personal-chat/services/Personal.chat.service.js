import api from "../../../services/api";

// Get chat messages
export const getPersonalChatMessages = async (
    appointmentId
) => {
    const response = await api.get(
        `/personal-chat/${appointmentId}`
    );

    return response.data;
};


// Send chat message
export const sendPersonalChatMessage = async (
    appointmentId,
    message
) => {
    const response = await api.post(
        `/personal-chat/${appointmentId}/message`,
        {
            message
        }
    );

    return response.data;
};


// Mark messages as read
export const markPersonalChatMessagesAsRead = async (
    appointmentId
) => {
    const response = await api.put(
        `/personal-chat/${appointmentId}/read`
    );

    return response.data;
};