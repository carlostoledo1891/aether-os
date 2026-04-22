export const REQUEST_DEMO_OPEN_EVENT = 'request-demo:open'
export const REQUEST_DEMO_CLOSE_EVENT = 'request-demo:close'

export function openRequestDemo() {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent(REQUEST_DEMO_OPEN_EVENT))
}

export function closeRequestDemo() {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent(REQUEST_DEMO_CLOSE_EVENT))
}
