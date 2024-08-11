import { ErrorBoundaryProps } from 'next/dist/client/components/error-boundary'
import React from 'react'

type State = { hasError: boolean }

class ErrorBoundary extends React.Component<ErrorBoundaryProps, State> {
  constructor(props: ErrorBoundaryProps) {
    super(props)

    // Define a state variable to track whether is an error or not
    this.state = { hasError: false }
  }
  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI

    return { hasError: true }
  }
  componentDidCatch(error: any, errorInfo: any) {
    // You can use your own error logging service here
    console.log({ error, errorInfo })
  }
  render() {
    // Check if the error is thrown
    if (this.state.hasError) {
      // You can render any custom fallback UI
      // return (
      //   <div>
      //     <h2>Oops, there is an error!</h2>
      //     <button type="button" onClick={() => this.setState({ hasError: false })}>
      //       Try again?
      //     </button>
      //   </div>
      // )
    }

    // Return children components in case of no error
    return this.props.children
  }
}

export default ErrorBoundary
