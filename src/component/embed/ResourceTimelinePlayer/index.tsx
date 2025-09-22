import { Show, For, Switch, Match, createMemo } from "solid-js";

import { Objects } from "~/fn/objects";
import { useOperated } from "~/fn/signal/root/useOperated";
import { HeadlessProps } from "~/type/component/HeadlessProps";
import { SourceControlNode, SourceMap } from "../ResourcePlayer";
import { SoundCloudPlayer } from "../SoundCloudPlayer";
import { YouTubePlayer } from "../YouTubePlayer";

export const ResourceTimelinePlayer = (p: HeadlessProps<{
  sourceMap: SourceMap;
  timeline: SourceControlNode[];
  playing: boolean;
  offset: number;
  time: number;
  volume: number;
  preload?: boolean;
}>) => {
  const operated = useOperated();
  const preload = () => p.preload ?? false;
  const getLastAction = (sourceId: string) => {
    const reversedTargetTimeline = p.timeline
      .filter((it) => it.sourceId === sourceId)
      .reverse();
    return (ms: number) => {
      const lastAction = reversedTargetTimeline
        .find((it) => it.offsetSeconds * 1000 <= ms);
      return lastAction;
    };
  };
  const sourceMap = createMemo(() => p.sourceMap);
  const getLastActionMap = () => Objects.modify(
    sourceMap(),
    (entries) => entries
      .map(([key]) => ([key, getLastAction(key)])),
  );

  return (
    <div {...HeadlessProps.getStyles(p)}>
      <Show when={operated()}>
        <For each={Object.entries(sourceMap())}>{([sourceId, it]) => {
          const sourceOffsetMs = () => (it.offset ?? 0) * 1000;
          const lastAction = () => getLastActionMap()[sourceId]?.(p.time - Math.min(sourceOffsetMs(), 0));
          const playing = () => p.playing && lastAction()?.action === "play";
          const seekTo = () => p.offset - sourceOffsetMs() + ((lastAction()?.offset ?? 0) * 1000) - ((lastAction()?.offsetSeconds ?? 0) * 1000);
          return (
            <Switch>
              <Match when={Objects.when(it, (it) => it.kind === "YouTube")}>{(source) => (
                <YouTubePlayer
                  videoId={source().videoId}
                  playing={playing()}
                  seekTo={seekTo()}
                  volume={p.volume}
                  preload={preload()}
                />
              )}</Match>
              <Match when={Objects.when(it, (it) => it.kind === "SoundCloud")}>{(source) => (
                <SoundCloudPlayer
                  url={source().url}
                  playing={playing()}
                  seekTo={seekTo()}
                  volume={p.volume}
                  preload={preload()}
                />
              )}</Match>
            </Switch>
          );
        }}</For>
      </Show>
    </div>
  );
};
