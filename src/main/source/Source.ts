import { SoundCloud, SoundCloudProps } from "./SoundCloud";
import { YouTube, YouTubeProps } from "./YouTube";

type EventKinds = "play" | "pause" | "restart";
type Source = {
  element: HTMLElement;
  play: () => void;
  pause: () => void;
  restart: () => void;
  addEventListener: (kind: EventKinds, callback: () => void) => void;
};
type CommonProps = {
  size: { width: number; height: number };
  onReady: () => void;
};
type SourceBuilder<Props> = (args: Omit<Props, "kind"> & CommonProps) => Source;

type SourceProps = SoundCloudProps | YouTubeProps;
const Source = {
  from: (args: SourceProps & CommonProps): Source => {
    switch (args.kind) {
      case "YouTube":
        return YouTube(args);
      case "SoundCloud":
        return SoundCloud(args);
    }
  },
};
export { Source, SourceBuilder, SourceProps };
