export interface Filter<T> {
  name: string;
  predicate: (item: T) => boolean;
}
