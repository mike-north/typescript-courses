import { ITeam } from "./types";

export function isTypedArray<T>(arg: unknown[], guard: (toTest: unknown) => toTest is T): arg is T[] {
    return Array.isArray(arg) && arg.every(guard)
}

export function isTeam(arg: unknown): arg is ITeam {
    return (
        typeof arg === "object"
        && 'iconUrl' in arg
        && typeof arg.iconUrl !== 'undefined'

        && 'name' in arg
        && typeof arg.name !== 'undefined'

        && 'id' in arg
        && typeof arg.id !== 'undefined'

        && 'channels' in arg
        && typeof arg.channels !== 'undefined'
        && Array.isArray(arg.channels)
    )
}
