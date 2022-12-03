import { useCallback, useReducer, useState } from "react";
const UNDO = 'UNDO'
const REDO = 'REDO'
const SET = 'SET'
const RESET = "RESET"
type State<T> = {
  past: T[],
  present: T,
  future: T[]
}
type Action<T> = {
  newPresent?: T,
  type: typeof UNDO | typeof REDO | typeof SET | typeof RESET
}
const undoReducer = <T>(state: State<T>, action: Action<T>) => {
  const { past, present, future } = state
  const { type, newPresent } = action
  switch (action.type) {
    case UNDO:
      if (past.length === 0) return state
      // 取过去的最后一个值就是当前的值撤销一步的值
      const previous = past[past.length - 1]
      const newPast = past.slice(0, past.length - 1)
      return {
        past: newPast,
        present: previous,
        future: [present, ...future]
      }
    case REDO:
      if (future.length === 0) return state
      const next = future[0]
      // 删除第一个值就是新的未来的值
      const newFuture = future.slice(1)
      return {
        past: [...past, present],
        present: next,
        future: newFuture
      }
    case SET:
      if (newPresent === present) return state
      return {
        past: [...past, present],
        present: newPresent,
        future: []
      }
    case RESET:
      return {
        past: [],
        present: newPresent,
        future: []
      }
    default:
      break;
  }
  return state
}

export const useUndo = <T>(initialPresent: T) => {
  const [state, dispatch] = useReducer(undoReducer, {
    past: [],
    present: initialPresent,
    future: []
  } as State<T>)
  const conUndo = state.past.length !== 0
  const canRedo = state.future.length !== 0
  //撤销
  const undo = useCallback(() => dispatch({ type: UNDO }), [])
  //前进
  const redo = useCallback(() => dispatch({ type: REDO }), [])
  // 重置
  const set = useCallback((newPresent: T) => dispatch({ type: SET, newPresent }), [])
  const reset = useCallback((newPresent: T) => dispatch({ type: RESET, newPresent }), [])
  return [
    state,
    { undo, redo, reset, set, conUndo, canRedo }
  ] as const
}