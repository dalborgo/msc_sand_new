import create from 'zustand'
import immerMiddleware from './immerMiddleware'
import { getCountryList, getCountryListForPorts, getTypeOfGoods, getPortList } from '@adapter/common/src/msc'

const insuranceTypes = [
  'door-to-door',
  'port-to-port',
  'door-to-port',
  'port-to-door',
]

const initialState = {
  confirmedValues: {},
  countryDischargeSelected: null,
  countryList: getCountryList(),
  countryListForPorts: getCountryListForPorts(),
  countryLoadingSelected: null,
  dischargePorts: [],
  insuranceSelected: '',
  insuranceTypes,
  loadingPorts: [],
  openConfirmDialog: false,
  typesOfGoods: getTypeOfGoods(),
}

const useNewBookingStore = create(immerMiddleware(set => ({
  ...initialState,
  reset: () => set(() => initialState),
  setOpenConfirmDialog: val => set(state => {
    state.openConfirmDialog = val
  }),
  handleCloseConfirmDialog: () => set(state => {
    state.openConfirmDialog = false
  }),
  setConfirmedValues: val => set(state => {
    state.confirmedValues = val
  }),
  setInsuranceSelected: val => set(state => {
    state.insuranceSelected = val
  }),
  setLoadingPorts: ({value: country}) => set(state => {
    state.loadingPorts = getPortList(country)
  }),
  setDischargePorts: ({value: country}) => set(state => {
    state.dischargePorts = getPortList(country)
  }),
  set: fn => set(fn),
})))

export default useNewBookingStore
