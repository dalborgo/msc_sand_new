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
    countryPortLoading: null,
    portLoading: null,
    typeOfGoods: '',
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
  submitFilter: ({ bookingRef, portLoading, typeOfGoods, bookingDateFrom, bookingDateTo, countryPortLoading }) => set(state => {
    state.filter.bookingDateFrom = bookingDateFrom
    state.filter.bookingDateTo = bookingDateTo
    state.filter.bookingRef = bookingRef
    state.filter.countryPortLoading = countryPortLoading
    state.filter.portLoading = portLoading
    state.filter.typeOfGoods = typeOfGoods
    state.openFilter = !state.openFilter
  }),
})))

export default useCertificateStore
