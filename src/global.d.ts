export {};

declare global {
  type VoidCallback<T> = {
    (props: T): void;
  };
}
