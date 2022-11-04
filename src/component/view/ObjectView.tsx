import {
  Component,
  Index,
} from "solid-js";

import styles from "./ObjectView.module.styl";


type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  object: any
}
const ObjectView: Component<Props>
  = (props) => (<>{
    typeof props.object !== "object"
      ? (
        <p
          class={styles.Value}
          data-value={props.object}
        >
          {props.object}
        </p>
      )
      : (
        <Index each={Object.keys(props.object)}>{(key) => (
          <section
            class={styles.ObjectView}
          >
            <h1>{key()}</h1>
            <ObjectView object={props.object[key()]} />
          </section>
        )}</Index>
      )
  }</>);

export default ObjectView;
