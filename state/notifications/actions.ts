import { createAction } from '@reduxjs/toolkit'

export interface InternalNotificationMessage {
    id: string;
    title: string;
    text: string;
    smalltext?: string;
    type: 'info' | 'success' | 'error' | 'warning';
}

export const addNotification = createAction<InternalNotificationMessage>('notifications/addNotification')
export const removeNotification = createAction<{
    id: string
  }>('notifications/removeNotification')
export const clearAllNotifications = createAction('notifications/clearAllNotifications')
