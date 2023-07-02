import { create } from 'zustand';
import { persist } from 'zustand/middleware';
const useCurrency = create(
  persist(
    (set, get) => ({
      currency: 'INR',
      setCurrency: params => {
        set(state => ({ currency: params.currency }));
      }
    }),
    { name: 'currency' }
  )
);
export default useCurrency;
