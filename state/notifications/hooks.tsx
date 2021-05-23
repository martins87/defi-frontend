import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addNotification, removeNotification } from './actions';
import { NotificationMessage } from './reducer';

import { AppDispatch, AppState } from '../index';

export function useNotificationAdder(): (message: NotificationMessage) => string {
    const dispatch = useDispatch<AppDispatch>();
    return useCallback(
        (message: NotificationMessage) => {
            const id = Math.random().toString(36).substr(2, 5)
            dispatch(addNotification({id: id, ...message}));
            return id
        },
        [dispatch],
    );
}

export function useNotificationRemover(): (id:string) => void {
    const dispatch = useDispatch<AppDispatch>();
    return useCallback(
        (id:string) => {
            dispatch(removeNotification({id}));
        },
        [dispatch],
    );
}

export function useAllNotifications() {
    const state = useSelector<AppState, AppState['notifications']>((state) => state.notifications);
    return state
}
