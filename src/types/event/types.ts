export type EventMap<Element = HTMLElement> = Element extends Document
    ? DocumentEventMap
    : HTMLElementEventMap
