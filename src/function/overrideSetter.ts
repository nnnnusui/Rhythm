import { Setter } from "solid-js";

type OverwriteArgs<T> = {
  current: T
  prev: T
}
type Props<T> = {
  setter: Setter<T>,
  overwrite: (args: OverwriteArgs<T>) => T
}
const overwriteSetter
  = <T>(props: Props<T>): Setter<T> =>
    <Setter<T>>(
      (it) =>
        props.setter((prev) => {
          const current
            = typeof it === "function"
              ? (it as CallableFunction)(prev)
              : it
              ;
          const overwrited
            = props.overwrite({
              current,
              prev,
            });
          return overwrited;
        })
    );

export default overwriteSetter;
