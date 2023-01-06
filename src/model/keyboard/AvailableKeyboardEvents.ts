// check this! https://dev.to/hansott/how-to-check-if-string-is-member-of-union-type-1j4m
const AllKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'KeyB', 'Enter'] as const;

type AvailableKeyboardEventsTuple = typeof AllKeys;
type AvailableKeyboardEvent = AvailableKeyboardEventsTuple[number];

export function isAvailableKeyboardEvent(value: string): value is AvailableKeyboardEvent {
  return AllKeys.includes(value as AvailableKeyboardEvent);
}

export default AvailableKeyboardEvent;