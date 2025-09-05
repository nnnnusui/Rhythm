import { Component, ComponentProps } from "solid-js";

import { HeadlessProps } from "./HeadlessProps";

/** @public */
export type StyledProps<
  C extends Component<any>,
> = ComponentProps<C> extends HeadlessProps<infer T>
  ? T
  : never;
