import {
  Component,
} from "solid-js";

import Editor from "../Editor";
import Game from "../Game";
import styles from "./Edit.module.styl";

const Page: Component = () => {

  return (
    <div
      class={styles.Edit}
    >
      <Game />
      <Editor />
    </div>
  );
};

export default Page;
