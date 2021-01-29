import create from 'zustand'
import immerMiddleware from './immerMiddleware'

const initialState = {}

const useCertificateStore = create(immerMiddleware(set => ({
  ...initialState,
  reset: () => set(() => initialState),
})))

export default useCertificateStore
