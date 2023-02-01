import {
  Component, createEffect, createSignal,
} from "solid-js";

import useSoundCloudWidgetApi, { SoundCloudWidget as Widget } from "@/signal/root/useSoundCloudWidgetApi";

type Props = {
  url: string
  use: (widget: Widget) => void
}
const SoundCloudWidget: Component<Props> = (props) => {
  const [ref, setRef] = createSignal<HTMLIFrameElement>();
  const [getWidget, setWidget] = createSignal<Widget>();
  createEffect(() => {
    const widget = getWidget();
    if (widget) props.use(widget);
  });

  createEffect(() => {
    const iframe = ref();
    if (!iframe) return;
    const SC = useSoundCloudWidgetApi();
    const widget = SC.Widget(iframe);
    widget.bind(
      SC.Widget.Events.READY,
      () => setWidget(widget)
    );
  });

  const params
    = () => new URLSearchParams({
      url: props.url,
      visual: "true",
      show_artwork: "true",
      show_teaser: "false",
      auto_play: "false",
      single_active: "false",
    });
  const src = () => `https://w.soundcloud.com/player/?${params().toString()}`;

  return (
    <iframe
      ref={setRef}
      src={src()}
      allow="autoplay"
    />
  );
};

export default SoundCloudWidget;
