import { SoundCloudProps } from "./SoundCloud";
import { YouTubeProps } from "./YouTube";

type Source = SoundCloudProps | YouTubeProps;
type SourceBuilder<Props> = (
  args: Omit<Props, "kind"> & {
    size: { width: number; height: number };
    onReady: () => void;
    onPlay: () => void;
    onPause: () => void;
    onRestart: () => void;
  }
) => {
  element: HTMLElement;
  play: () => void;
  pause: () => void;
  restart: () => void;
};

export { Source, SourceBuilder };
