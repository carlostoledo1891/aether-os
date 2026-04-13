import { Component, type ErrorInfo, type ReactNode } from 'react'
import { W } from '../app/canvas/canvasTheme'

interface Props {
  children: ReactNode
  fallbackMessage?: string
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[VeroChain ErrorBoundary]', error, info.componentStack)
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null })
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          height: '100%', gap: 16, padding: 32,
          background: W.canvas, color: W.text2,
        }}>
          <div style={{
            padding: '24px 32px', borderRadius: W.radius.lg,
            background: W.panel, border: `1px solid ${W.border}`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
            maxWidth: 420, textAlign: 'center',
          }}>
            <div style={{ fontSize: 36 }}>⚠</div>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: W.text1 }}>
              {this.props.fallbackMessage ?? 'Something went wrong'}
            </h2>
            <p style={{ margin: 0, fontSize: 12, color: W.text3, lineHeight: 1.5 }}>
              An unexpected error occurred. Click below to reload.
            </p>
            {this.state.error && (
              <pre style={{
                margin: 0, fontSize: 10, color: W.red, fontFamily: 'var(--font-mono)',
                padding: '8px 12px', borderRadius: W.radius.sm,
                background: W.redSubtle, border: `1px solid ${W.red}30`,
                maxWidth: '100%', overflow: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-word',
              }}>
                {this.state.error.message}
              </pre>
            )}
            <button type="button" onClick={this.handleReload} style={{
              padding: '8px 20px', borderRadius: W.radius.sm,
              background: W.violet, border: 'none', cursor: 'pointer',
              color: W.textInverse, fontSize: 12, fontWeight: 700,
              boxShadow: `0 0 12px ${W.violetGlow}`,
            }}>
              Reload
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
