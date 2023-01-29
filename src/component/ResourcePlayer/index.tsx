import {
  Component,
} from "solid-js";

import styles from "./index.module.styl";
import SoundCloudWidget from "./SoundCloudWidget";

type Props = {
  url: string
}

const This: Component<Props> = (props) => {

  return (
    <div
      class={styles.Root}
    >
      <SoundCloudWidget
        url={props.url}
        use={(widget) => widget.setVolume(5)}
      />
    </div>
  );
};

export default This;
