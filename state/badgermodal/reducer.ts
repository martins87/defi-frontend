import { createReducer } from '@reduxjs/toolkit'
import { clearAllBadgerData, updateBadgerData, BadgerModalData } from './actions'

export const initialState: BadgerModalData = {
  masterTokenId: 'weth',
  masterValue: '0',
  masterIsValid: false,
  pair1TokenId: 'dai',
  pair1Value: '0',
  pair1IsValid: false,
  pair2TokenId: 'usdc',
  pair2Value: '0',
  pair2IsValid: false,
}

export default createReducer(initialState, (builder) =>
  builder
    .addCase(updateBadgerData, (badgermodal, { payload: { type, tokenId, value, isValid } }) => {
      let newVal: any = { masterTokenId: tokenId, masterValue: value, masterIsValid: isValid }
      if (type === 'pair1') {
        newVal = { pair1TokenId: tokenId, pair1Value: value, pair1IsValid: isValid }
      } else if (type === 'pair2') {
        newVal = { pair2TokenId: tokenId, pair2Value: value, pair2IsValid: isValid }
      }
      return { ...badgermodal, ...newVal }
    })
    .addCase(clearAllBadgerData, () => {
      return initialState
    })
)
