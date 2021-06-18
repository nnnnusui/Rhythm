import { SoundCloudProps } from "./SoundCloud";
import { YouTubeProps } from "./YouTube";

type Source = SoundCloudProps | YouTubeProps;

type EventKinds = "play" | "pause" | "restart";
type SourceBuilder<Props> = (
  args: Omit<Props, "kind"> & {
    size: { width: number; height: number };
    onReady: () => void;
  }
) => {
  element: HTMLElement;
  play: () => void;
  pause: () => void;
  restart: () => void;
  addEventListener: (kind: EventKinds, callback: () => void) => void;
};

export { Source, SourceBuilder };
