import { createAction } from '@reduxjs/toolkit'
import { TokenId } from '../../constants/tokens'

export type InputType = 'master' | 'pair1' | 'pair2'

export interface BadgerModalInput {
  type: InputType
  tokenId: TokenId
  value: string
  isValid: boolean
}

export interface BadgerModalData {
  masterTokenId: TokenId
  masterValue: string
  masterIsValid: boolean
  pair1TokenId: TokenId
  pair1Value: string
  pair1IsValid: boolean
  pair2TokenId: TokenId
  pair2Value: string
  pair2IsValid: boolean
}

export const updateBadgerData = createAction<BadgerModalInput>('badgermodal/updateBadgerData')
export const clearAllBadgerData = createAction('badgermodal/clearAllBadgerData')
