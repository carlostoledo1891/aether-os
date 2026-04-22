import type { CSSProperties } from 'react'
import { W } from '../../app/canvas/canvasTheme'
import { Z } from './mapStacking'

export const MAP_CONTROL_TRIGGER_SIZE = 32
export const MAP_CONTROL_PANEL_MIN_WIDTH = 196
export const MAP_CONTROL_POPOVER_GAP = 8
export const WORKSPACE_CONTROL_EDGE = 10
export const WORKSPACE_CONTROL_EDGE_COMPACT = 6
export const WORKSPACE_CONTROL_GAP = 6
export const WORKSPACE_CONTROL_COLUMN_PADDING = 6
export const WORKSPACE_CHAT_BOTTOM = 20
export const WORKSPACE_CHAT_BOTTOM_MOBILE = 12
export const WORKSPACE_CHAT_MAX_WIDTH = 'min(760px, calc(100vw - 32px))'
export const WORKSPACE_CHAT_MAX_WIDTH_MOBILE = 'calc(100vw - 20px)'
export const WORKSPACE_CHAT_EXPANDED_MAX_HEIGHT = 'min(28vh, 260px)'
export const WORKSPACE_CHAT_EXPANDED_MAX_HEIGHT_MOBILE = 'min(31vh, 260px)'
export const WORKSPACE_FLOATING_BOTTOM_CLEARANCE = 72

export function getWorkspaceChromeCssVars(): CSSProperties {
  return {
    ['--workspace-control-edge' as const]: `${WORKSPACE_CONTROL_EDGE}px`,
    ['--workspace-control-edge-compact' as const]: `${WORKSPACE_CONTROL_EDGE_COMPACT}px`,
    ['--workspace-control-gap' as const]: `${WORKSPACE_CONTROL_GAP}px`,
    ['--workspace-control-column-padding' as const]: `${WORKSPACE_CONTROL_COLUMN_PADDING}px`,
    ['--workspace-chat-bottom' as const]: `${WORKSPACE_CHAT_BOTTOM}px`,
    ['--workspace-chat-bottom-mobile' as const]: `${WORKSPACE_CHAT_BOTTOM_MOBILE}px`,
    ['--workspace-chat-width' as const]: WORKSPACE_CHAT_MAX_WIDTH,
    ['--workspace-chat-width-mobile' as const]: WORKSPACE_CHAT_MAX_WIDTH_MOBILE,
    ['--workspace-chat-expanded-max-height' as const]: WORKSPACE_CHAT_EXPANDED_MAX_HEIGHT,
    ['--workspace-chat-expanded-max-height-mobile' as const]: WORKSPACE_CHAT_EXPANDED_MAX_HEIGHT_MOBILE,
    ['--workspace-floating-bottom-clearance' as const]: `${WORKSPACE_FLOATING_BOTTOM_CLEARANCE}px`,
    ['--workspace-chat-z' as const]: `${Z.workspaceChat}`,
  } as CSSProperties
}

export const mapControlRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
}

export const mapControlColumnStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  gap: 6,
}

export const mapControlFloatingColumnStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  gap: 'var(--workspace-control-gap, 6px)',
  padding: 'var(--workspace-control-column-padding, 6px)',
  background: W.glass03,
  border: `1px solid ${W.border2}`,
  borderRadius: W.radius.lg,
  boxShadow: W.shadowMd,
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
}

export const mapControlAnchorStyle: CSSProperties = {
  position: 'relative',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
}

export function getMapControlTriggerStyle(active = false): CSSProperties {
  return {
    width: MAP_CONTROL_TRIGGER_SIZE,
    height: MAP_CONTROL_TRIGGER_SIZE,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: W.radius.md,
    border: `1px solid ${active ? W.border3 : W.border2}`,
    background: active ? W.cardHover : W.mapControlBg,
    boxShadow: W.shadowSm,
    cursor: 'pointer',
    color: active ? W.text1 : W.icon,
    transition: 'background 0.15s ease, border-color 0.15s ease, color 0.15s ease',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
  }
}

export const mapControlPanelStyle: CSSProperties = {
  background: W.card,
  border: `1px solid ${W.border2}`,
  borderRadius: W.radius.lg,
  boxShadow: W.shadowMd,
  padding: '10px 10px 9px',
  minWidth: MAP_CONTROL_PANEL_MIN_WIDTH,
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
}

export const mapControlPopoverStyle: CSSProperties = {
  position: 'absolute',
  left: '50%',
  bottom: `calc(100% + ${MAP_CONTROL_POPOVER_GAP}px)`,
  transform: 'translateX(-50%)',
  zIndex: Z.mapPopup,
}

export const mapControlSidePopoverStyle: CSSProperties = {
  position: 'absolute',
  top: '50%',
  right: `calc(100% + ${MAP_CONTROL_POPOVER_GAP}px)`,
  transform: 'translateY(-50%)',
  zIndex: Z.mapPopup,
}

export const mapControlHeaderStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 4,
  position: 'sticky',
  top: 0,
  background: W.card,
  zIndex: 1,
  paddingBottom: 4,
}

export const mapControlHeaderLabelStyle: CSSProperties = {
  fontSize: 9,
  fontWeight: 700,
  color: W.text3,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
}

export const mapControlCloseButtonStyle: CSSProperties = {
  width: 18,
  height: 18,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'transparent',
  border: 'none',
  borderRadius: W.radius.xs,
  cursor: 'pointer',
  color: W.iconMuted,
  padding: 0,
}

export function getMapControlMenuRowStyle(active = false): CSSProperties {
  return {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    width: '100%',
    padding: '7px 8px',
    background: active ? W.cardHover : 'transparent',
    border: `1px solid ${active ? W.border3 : 'transparent'}`,
    borderRadius: W.radius.sm,
    cursor: 'pointer',
    textAlign: 'left',
    color: active ? W.text1 : W.text2,
    fontSize: 10,
    fontWeight: active ? 700 : 500,
    fontFamily: 'var(--font-ui)',
  }
}

export const mapControlMetaTextStyle: CSSProperties = {
  fontSize: 8,
  color: W.text4,
  fontFamily: 'var(--font-mono)',
  lineHeight: 1.35,
}
