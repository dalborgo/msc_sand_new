import create from 'zustand'
import immerMiddleware from './immerMiddleware'

export const initialState = {
  openFilter: false,
  filter: {
    typeOfGoods: '',
  },
}

const useCertificateStore = create(immerMiddleware(set => ({
  ...initialState,
  reset: () => set(() => initialState),
  switchOpenFilter: () => set(state => {
    state.openFilter = !state.openFilter
  }),
  submitFilter: ({ typeOfGoods }) => set(state => {
    state.filter.typeOfGoods = typeOfGoods
    state.openFilter = !state.openFilter
  }),
})))

export default useCertificateStore
