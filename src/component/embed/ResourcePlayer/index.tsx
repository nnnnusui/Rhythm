import { createMemo, For, Match, Show, Switch } from "solid-js";

import { useOperated } from "~/fn/context/OperatedContext";
import { Objects } from "~/fn/objects";
import { SoundCloudPlayer } from "../SoundCloudPlayer";
import { YouTubePlayer } from "../YouTubePlayer";

import styles from "./ResourcePlayer.module.css";

/** @public */
export const ResourcePlayer = (p: {
  sourceMap: SourceMap;
  timeline: SourceControlNode[];
  playing: boolean;
  offset: number;
  time: number;
  preload?: boolean;
}) => {
  const operated = useOperated();
  const preload = () => p.preload ?? false;
  const getLastAction = (sourceId: string) => {
    const reversedTargetTimeline = p.timeline
      .filter((it) => it.sourceId === sourceId)
      .reverse();
    return (time: number) => {
      const lastAction = reversedTargetTimeline
        .find((it) => it.time * 1000 <= time);
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
    <div class={styles.ResourcePlayer}>
      <Show when={operated()}>
        <For each={Object.entries(sourceMap())}>{([sourceId, it]) => {
          const sourceOffsetMs = () => (it.offset ?? 0) * 1000;
          const lastAction = () => getLastActionMap()[sourceId]?.(p.time - Math.min(sourceOffsetMs(), 0));
          const playing = () => p.playing && lastAction()?.action === "play";
          const seekTo = () => p.offset - sourceOffsetMs() + ((lastAction()?.offset ?? 0) * 1000);
          return (
            <Switch>
              <Match when={Objects.when(it, (it) => it.kind === "YouTube")}>{(source) => (
                <YouTubePlayer
                  videoId={source().videoId}
                  playing={playing()}
                  seekTo={seekTo()}
                  preload={preload()}
                />
              )}</Match>
              <Match when={Objects.when(it, (it) => it.kind === "SoundCloud")}>{(source) => (
                <SoundCloudPlayer
                  url={source().url}
                  playing={playing()}
                  seekTo={seekTo()}
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

type SourceId = string;
type Source
  = { kind: "YouTube"; videoId: string; offset?: number }
  | { kind: "SoundCloud"; url: string; offset?: number };

/** @public */
export type SourceMap = Record<SourceId, Source>;

/** @public */
export type SourceControlNode = {
  time: number;
  sourceId: string;
  action: "play" | "pause";
  offset?: number;
};
