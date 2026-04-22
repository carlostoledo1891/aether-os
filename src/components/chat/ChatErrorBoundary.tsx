import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'
import { W } from '../../app/canvas/canvasTheme'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ChatErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[VeroChat ErrorBoundary]', error, info.componentStack)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div
        style={{
          position: 'fixed',
          left: '50%',
          bottom: 'var(--workspace-chat-bottom, 20px)',
          transform: 'translateX(-50%)',
          width: 'var(--workspace-chat-width, min(760px, calc(100vw - 32px)))',
          zIndex: 'var(--workspace-chat-z, 80)',
          pointerEvents: 'none',
        }}
      >
        <div
          role="alert"
          style={{
            pointerEvents: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '12px 14px',
            borderRadius: 18,
            border: `1px solid ${W.red}30`,
            background: `color-mix(in srgb, ${W.panel} 90%, transparent)`,
            boxShadow: '0 18px 48px rgba(0, 0, 0, 0.32)',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
          }}
        >
          <AlertTriangle size={14} style={{ color: W.red, flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: W.text2 }}>
              Chat temporarily unavailable
            </div>
            <div style={{ fontSize: 10, color: W.text4, lineHeight: 1.45 }}>
              {this.state.error?.message ?? 'The workspace chat hit an unexpected error.'}
            </div>
          </div>
          <button
            type="button"
            onClick={this.handleRetry}
            style={{
              padding: '5px 10px',
              borderRadius: 10,
              border: `1px solid ${W.red}40`,
              background: 'transparent',
              color: W.red,
              cursor: 'pointer',
              fontSize: 10,
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            Retry
          </button>
        </div>
      </div>
    )
  }
}
