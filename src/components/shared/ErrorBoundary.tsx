// shared/ErrorBoundary.tsx — Catches render errors, shows recovery UI
import { Component, type ReactNode } from 'react';

interface Props { children: ReactNode; }
interface State { hasError: boolean; error: Error | null; }

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-dvh flex items-center justify-center bg-bg px-8">
          <div className="text-center max-w-xs">
            <div className="text-4xl mb-4 text-text-muted/40">△</div>
            <h1 className="text-lg font-medium mb-2 text-text-heading">algo deu errado</h1>
            <p className="text-xs text-text-muted mb-6 leading-relaxed">
              {this.state.error?.message ?? 'erro inesperado'}
            </p>
            <button
              onClick={this.handleReset}
              className="bg-accent text-white rounded-xl px-6 py-2.5 text-sm font-medium"
            >
              voltar pro inicio
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
