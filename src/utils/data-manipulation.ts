export function deepCopy<T>(data:T) {
    return JSON.parse(JSON.stringify(data));
}