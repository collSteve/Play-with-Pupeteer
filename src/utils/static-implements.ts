export function staticImplements<T>() {
    return <U extends T>(constructor: U) => {constructor};
}

export type StaticImplements<I extends new (...args: any[]) => any, C extends I> = InstanceType<I>;
