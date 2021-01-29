import create from 'zustand'
import immerMiddleware from './immerMiddleware'
import { getCountryList, getTypeOfGoods, getPortList } from '@adapter/common/src/msc'

const insuranceTypes = [
  'door-to-door',
  'port-to-port',
  'door-to-port',
  'port-to-door',
]

const initialState = {
  insuranceSelected: '',
  countryLoadingSelected: null,
  countryDischargeSelected: null,
  loadingPorts: [],
  dischargePorts: [],
  insuranceTypes,
  countryList: getCountryList(),
  typesOfGoods: getTypeOfGoods(),
}

const useNewBookingStore = create(immerMiddleware(set => ({
  ...initialState,
  reset: () => set(() => initialState),
  setInsuranceSelected: val => set(state => {
    state.insuranceSelected = val
  }),
  setLoadingPorts: ({value: country}) => set(state => {
    state.loadingPorts = getPortList(country)
  }),
  setDischargePorts: ({value: country}) => set(state => {
    state.dischargePorts = getPortList(country)
  }),
})))

export default useNewBookingStore
