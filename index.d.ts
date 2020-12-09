export function env<T extends string | number | boolean = string>(name: string): T | undefined;
export function env<T extends string | number | boolean = string>(name: string, defaultValue: T): T;