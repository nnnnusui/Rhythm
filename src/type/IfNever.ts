export type IfNever<T, True, Else = never> =
  [T] extends [never]
    ? True
    : Else;
