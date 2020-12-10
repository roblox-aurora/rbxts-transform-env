export function env<T extends string = string>(name: string): T | undefined;
export function env<T extends string = string>(name: string, defaultValue: T): T;
export function env<T extends number>(name: string): T | undefined;
export function env<T extends number>(name: string, defaultValue: T): T;
export function env<T extends boolean>(name: string): T | undefined;
export function env<T extends boolean>(name: string, defaultValue: T): T;
