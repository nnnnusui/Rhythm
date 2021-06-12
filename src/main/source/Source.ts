import { SoundCloud, SoundCloudProps } from "./SoundCloud";
import { YouTube, YouTubeProps } from "./YouTube";

type KindAndArgument<T extends (...args: any) => any> = {
  kind: ReturnType<T>["kind"];
} & Parameters<T>[0];
type Arguments =
  | KindAndArgument<typeof SoundCloud>
  | KindAndArgument<typeof YouTube>;

type Source = SoundCloudProps | YouTubeProps;
const Source = (args: Arguments) => {
  const element = document.createElement("div");
  element.classList.add("source");
  switch (args.kind) {
    case "SoundCloud":
      return SoundCloud(args);
    case "YouTube":
      return YouTube(args);
  }
};

export { Source };
