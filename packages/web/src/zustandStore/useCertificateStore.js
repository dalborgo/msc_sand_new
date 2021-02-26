import create from 'zustand'
import immerMiddleware from './immerMiddleware'
import { validation } from '@adapter/common'
import isEmpty from 'lodash/isEmpty'

export const initialState = {
  openFilter: false,
  filter: {
    bookingDateFrom: null,
    bookingDateTo: null,
    bookingRef: '',
    countryPortDischarge: null,
    countryPortLoading: null,
    maxGoodsValue: '',
    minGoodsValue: '',
    openSoaDialog: false,
    portDischarge: null,
    portLoading: null,
    typeOfGoods: '',
    typeRate: '',
  },
}

const useCertificateStore = create(immerMiddleware((set, get) => ({
  ...initialState,
  reset: () => set(() => initialState),
  setOpenSoaDialog: val => set(state => {
    state.openSoaDialog = val
  }),
  handleCloseSoaDialog: () => set(state => {
    state.openSoaDialog = false
  }),
  getQueryKey: () => {
    const filter = get().filter
    const endpoint = 'certificates/list'
    const secondaryParams = validation.objectSkipEmpty(filter)
    return isEmpty(secondaryParams) ? endpoint : [endpoint, { ...secondaryParams }]
  },
  switchOpenFilter: () => set(state => {
    state.openFilter = !state.openFilter
  }),
  submitFilter: filters => set(state => {
    state.filter = filters
    state.openFilter = !state.openFilter
  }),
})))

export default useCertificateStore
