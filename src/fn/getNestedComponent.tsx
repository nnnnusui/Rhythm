import { JSX } from "solid-js";

/** @public */
export const getNestedComponent = (...providers: HasChild[]): HasChild => {
  return (p) => {
    const Folded = providers.reduce((Sum, It) => (p) => (
      <Sum>
        <It>{p.children}</It>
      </Sum>
    ));
    return <Folded>{p.children}</Folded>;
  };
};
type HasChild = (p: { children: JSX.Element }) => JSX.Element;
