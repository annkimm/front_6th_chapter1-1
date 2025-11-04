/**
 * Observer 패턴 기반 Store
 * 상태 변경시 구독자들에게 자동으로 알림
 */

type Listener<T> = (state: T) => void;

export function createStore<T>(initialState: T) {
  let state = initialState;
  const listeners = new Set<Listener<T>>();

  return {
    getState: () => state,

    setState: (newState: Partial<T>) => {
      state = { ...state, ...newState };
      // 모든 구독자에게 알림
      listeners.forEach((listener) => listener(state));
    },

    subscribe: (listener: Listener<T>) => {
      listeners.add(listener);
      // cleanup 함수 반환
      return () => listeners.delete(listener);
    },

    reset: () => {
      state = initialState;
      listeners.forEach((listener) => listener(state));
    },
  };
}
