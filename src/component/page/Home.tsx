import {
  Component,
  createSignal,
} from "solid-js";

import styles from "./Home.module.styl";

const Home: Component = () => {
  const [text, setText] = createSignal("");

  return (
    <div
      class={styles.Home}
    >
      <h1>Hello.</h1>
      <input
        type="text"
        value={text()}
        onChange={(e) => setText(e.currentTarget.value)}
        name=""
      />
      <p>{text()}</p>
    </div>
  );
};

export default Home;
