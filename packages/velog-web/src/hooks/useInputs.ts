import { useReducer, useCallback, useMemo } from 'react'

type UseInputsAction = {
  name: string
  value: string
}

function reducer<T extends Record<string, string>>(state: T, action: UseInputsAction | null) {
  if (!action) {
    const initialState: any = {}
    Object.keys(state).forEach((key) => {
      initialState[key] = ''
    })
    return initialState
  }
  return {
    ...state,
    [action.name]: action.value,
  }
}

export default function useInputs<T extends Record<string, any>>(defaultValues: T) {
  const values = useMemo(() => defaultValues, [defaultValues])
  const [inputs, dispatch] = useReducer(reducer, values)

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      name: e.target.name,
      value: e.target.value.trim(),
    })
  }, [])
  const onReset = useCallback(() => {
    dispatch(null)
  }, [])
  return { inputs, onChange, onReset, dispatch } as {
    inputs: T
    onChange: typeof onChange
    onReset: typeof onReset
    dispatch: typeof dispatch
  }
}
