export function env<T extends string | number = string>(name: string): T | undefined;
export function env<T extends string | number = string>(name: string, defaultValue: T): T;