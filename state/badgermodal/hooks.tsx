import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateBadgerData, BadgerModalInput, InputType, clearAllBadgerData } from './actions';

import { AppDispatch, AppState } from '../index';


export function userBadgerModalUpdater(): (input:BadgerModalInput) => void {
    const dispatch = useDispatch<AppDispatch>();
    return useCallback(
        (input) => {
            dispatch(updateBadgerData(input));
        },
        [dispatch],
    );
}

export function useBadgerDataOfType(type: InputType) {
    const state = useSelector<AppState, AppState['badgermodal']>((state) => state.badgermodal);
    let newVal: BadgerModalInput = { type: type, isValid: state.masterIsValid, value: state.masterValue, tokenId: state.masterTokenId }
    if (type === 'pair1') {
      newVal =  { type: type, isValid: state.pair1IsValid, value: state.pair1Value, tokenId: state.pair1TokenId }
    } else if (type === 'pair2') {
        newVal =  { type: type, isValid: state.pair2IsValid, value: state.pair2Value, tokenId: state.pair2TokenId }
    }
    return newVal
}

export function useBadgerAllData() {
    const state = useSelector<AppState, AppState['badgermodal']>((state) => state.badgermodal);
    return state
}

export function resetBadgerModal(): () => void {
    const dispatch = useDispatch<AppDispatch>()
    return useCallback(() => {
      dispatch(clearAllBadgerData())
    }, [dispatch])
  }
