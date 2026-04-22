export const REQUEST_DEMO_OPEN_EVENT = 'request-demo:open'
export const REQUEST_DEMO_CLOSE_EVENT = 'request-demo:close'

export type RequestDemoOpenDetail = { relatedTarget?: HTMLElement | null }

export function openRequestDemo(relatedTarget?: HTMLElement | null) {
  if (typeof window === 'undefined') return
  window.dispatchEvent(
    new CustomEvent<RequestDemoOpenDetail>(REQUEST_DEMO_OPEN_EVENT, {
      detail: { relatedTarget: relatedTarget ?? null },
    }),
  )
}

export function closeRequestDemo() {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent(REQUEST_DEMO_CLOSE_EVENT))
}
