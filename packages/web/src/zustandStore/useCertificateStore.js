import create from 'zustand'
import immerMiddleware from './immerMiddleware'
import { validation } from '@adapter/common'
import isEmpty from 'lodash/isEmpty'

const initialState = {
  openFilter: false,
  filter: {
    typeOfGoods: '',
    bookingDateFrom: null,
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
  submitFilter: ({ typeOfGoods, bookingDateFrom }) => set(state => {
    state.filter.typeOfGoods = typeOfGoods
    state.filter.bookingDateFrom = bookingDateFrom
    state.openFilter = !state.openFilter
  }),
})))

export default useCertificateStore
