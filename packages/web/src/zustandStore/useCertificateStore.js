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
  submitFilter: ({ typeOfGoods, bookingDateFrom, bookingDateTo }) => set(state => {
    state.filter.typeOfGoods = typeOfGoods
    state.filter.bookingDateFrom = bookingDateFrom
    state.filter.bookingDateTo = bookingDateTo
    state.openFilter = !state.openFilter
  }),
})))

export default useCertificateStore
