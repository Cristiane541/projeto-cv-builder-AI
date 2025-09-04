// Error boundary para falhas críticas
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error
  }

  render() {
    if (this.state.hasError) {
      return <div>Ocorreu um erro.</div>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
