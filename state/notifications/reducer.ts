import { createReducer } from '@reduxjs/toolkit';
import { addNotification, removeNotification, clearAllNotifications, InternalNotificationMessage } from './actions';

export interface NotificationMessage {
    title: string;
    text: string;
    smalltext?: string;
    type: 'info' | 'success' | 'error' | 'warning';
}

export const initialState: InternalNotificationMessage[] = [];

export default createReducer(initialState, (builder) =>
    builder
        .addCase(addNotification, (notifications, { payload: { id, title, text, smalltext, type } }) => {
            notifications.push({ id: id, ...{ title, text, type, smalltext } });
        })
        .addCase(removeNotification, (notifications, { payload: { id } }) => {
            return notifications.filter((m) => m.id !== id);
        })
        .addCase(clearAllNotifications, () => {
            return [];
        }),
);
