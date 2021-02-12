import create from 'zustand'
import immerMiddleware from './immerMiddleware'
import { validation } from '@adapter/common'
import isEmpty from 'lodash/isEmpty'

export const initialState = {
  openFilter: false,
  filter: {
    typeOfGoods: '',
    bookingDateFrom: null,
    bookingDateTo: null,
    bookingRef: '',
    countryPortLoading: null,
  },
}

const useCertificateStore = create(immerMiddleware((set, get) => ({
  ...initialState,
  reset: () => set(() => initialState),
  getQueryKey: () => {
    const filter = get().filter
    const endpoint = 'certificates/list'
    const secondaryParams = validation.objectSkipEmpty(filter)
    return isEmpty(secondaryParams) ? endpoint : [endpoint, { ...secondaryParams }]
  },
  switchOpenFilter: () => set(state => {
    state.openFilter = !state.openFilter
  }),
  submitFilter: ({ bookingRef, typeOfGoods, bookingDateFrom, bookingDateTo, countryPortLoading }) => set(state => {
    state.filter.typeOfGoods = typeOfGoods
    state.filter.bookingRef = bookingRef
    state.filter.bookingDateFrom = bookingDateFrom
    state.filter.bookingDateTo = bookingDateTo
    state.filter.countryPortLoading = countryPortLoading
    state.openFilter = !state.openFilter
  }),
})))

export default useCertificateStore
