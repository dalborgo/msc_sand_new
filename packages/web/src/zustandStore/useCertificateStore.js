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
    countryPortDischarge: null,
    portLoading: null,
    portDischarge: null,
    typeOfGoods: '',
    minGoodsValue: '',
    maxGoodsValue: '',
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
  submitFilter: ({
    minGoodsValue,
    maxGoodsValue,
    portDischarge,
    countryPortDischarge,
    bookingRef,
    portLoading,
    typeOfGoods,
    bookingDateFrom,
    bookingDateTo,
    countryPortLoading,
  }) => set(state => {
    state.filter.bookingDateFrom = bookingDateFrom
    state.filter.bookingDateTo = bookingDateTo
    state.filter.bookingRef = bookingRef
    state.filter.countryPortLoading = countryPortLoading
    state.filter.countryPortDischarge = countryPortDischarge
    state.filter.portLoading = portLoading
    state.filter.portDischarge = portDischarge
    state.filter.typeOfGoods = typeOfGoods
    state.filter.minGoodsValue = minGoodsValue
    state.filter.maxGoodsValue = maxGoodsValue
    state.openFilter = !state.openFilter
  }),
})))

export default useCertificateStore
