import create from 'zustand'
import immerMiddleware from './immerMiddleware'

const initialState = {
  bucket: '',
  couchbaseUrl: '',
  loading: false,
  locales: [],
  priority: 0,
}

const useGeneralStore = create(immerMiddleware(set => ({
  ...initialState,
  setLoading: val => set(state => {
    state.loading = val
  }),
  reset: () => set(() => initialState),
  set: fn => set(fn),
})))

export default useGeneralStore
