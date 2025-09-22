import { For } from "solid-js";

import { Objects } from "~/fn/objects";
import { Timer } from "~/fn/signal/createTimer";
import { ResourcePosition } from "~/fn/signal/root/usePlaybackState";
import { Id } from "~/type/struct/Id";
import { ResourceTimelinePlayer } from "../ResourceTimelinePlayer";

import styles from "./ResourcePlayer.module.css";

/** @public */
export const ResourcePlayer = (p: {
  resourceBundleMap: Record<Id, ParResourcePlayerProps>;
  selectedId: Id | undefined;
  timer: Timer;
  volume: number;
  position: ResourcePosition | undefined;
}) => {

  const cssVariables = () => {
    const bounds = p.position;
    if (!bounds) return;
    return {
      "--top": `${bounds.top}px`,
      "--left": `${bounds.left}px`,
      "--width": `${bounds.width}px`,
      "--height": `${bounds.height}px`,
      "--z-index": bounds.inFront ? "1" : undefined,
      "--border-radius": bounds.borderRadius ? `${bounds.borderRadius}px` : undefined,
    };
  };

  return (
    <div class={styles.ResourcePlayer}
      style={cssVariables()}
    >
      <For each={Objects.values(p.resourceBundleMap)}>{(it) => (
        <ResourceTimelinePlayer
          class={styles.ResourceTimelinePlayer}
          classList={{
            [styles.Hidden]: !(p.selectedId === it.id),
          }}
          sourceMap={it.sourceMap}
          timeline={it.timeline}
          playing={p.selectedId === it.id && p.timer.measuring}
          offset={p.timer.offset}
          time={p.timer.current}
          volume={p.volume}
        />
      )}</For>
    </div>
  );
};

type ParResourcePlayerProps = {
  id: Id;
  sourceMap: SourceMap;
  timeline: SourceControlNode[];
};

type SourceId = string;
type Source
  = { kind: "YouTube"; videoId: string; offset?: number }
  | { kind: "SoundCloud"; url: string; offset?: number };

/** @public */
export type SourceMap = Record<SourceId, Source>;

/** @public */
export type SourceControlNode = {
  offsetSeconds: number;
  sourceId: string;
  action: "play" | "pause";
  offset?: number;
};
