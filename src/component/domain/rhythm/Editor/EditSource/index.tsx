import { For, Match, Switch } from "solid-js";
import uuid from "ui7";

import { SourceMap } from "~/component/embed/ResourcePlayer";
import { Objects } from "~/fn/objects";
import { Wve } from "~/type/struct/Wve";
import { Option } from "./Option";
import { SoundCloudOption } from "./SoundCloudOption";
import { YouTubeOption } from "./YouTubeOption";

import styles from "./EditSource.module.css";

/** @public */
export const EditSource = (p: {
  sourceMap: Wve<SourceMap>;
  sourceId: Wve<undefined | string>;
  action: Wve<undefined | "play" | "pause">;
}) => {
  const sourceMap = Wve.from(() => p.sourceMap);
  const selectedId = Wve.from(() => p.sourceId);
  const mode = Wve.from(() => p.action);
  const sourceEntries = () => Object.entries(sourceMap());

  return (
    <fieldset class={styles.EditSource}>
      <legend>Source</legend>
      <input placeholder="assign by url"
        type="url"
        onChange={(event) => {
          const source = getSourceByUrl(event.currentTarget.value);
          event.currentTarget.value = "";
          if (!source) return;
          const id = uuid();
          sourceMap.set(id, source);
        }}
      />
      <div class={styles.ModeSelect}>
        <button
          type="button"
          onClick={() => mode.set("play")}
          disabled={mode() === "play"}
        >play</button>
        <button
          type="button"
          onClick={() => mode.set("pause")}
          disabled={mode() === "pause"}
        >pause</button>
        <button
          type="button"
          onClick={() => mode.set(undefined)}
          disabled={mode() === undefined}
        >none</button>
      </div>
      <span class={styles.SelectedId}>
        selected: {selectedId()}
      </span>
      <For each={sourceEntries()}>{([id, source], index) => (
        <Option
          sourceId={id}
          selected={id === selectedId()}
          select={() => selectedId.set((prev) => id === prev ? undefined! : id)}
          remove={() => {
            sourceMap.set(id, undefined!);
            const prev = sourceEntries()[index() - 1] ?? sourceEntries()[index()];
            selectedId.set(prev?.[0]);
          }}
        >
          <Switch>
            <Match when={Objects.when(source, (it) => it.kind === "YouTube")}>{(source) => (
              <YouTubeOption
                videoId={source().videoId}
              />
            )}</Match>
            <Match when={Objects.when(source, (it) => it.kind === "SoundCloud")}>{(source) => (
              <SoundCloudOption
                url={source().url}
              />
            )}</Match>
            <Match when={true}>{(
              <div>{source.kind}</div>
            )}</Match>
          </Switch>
        </Option>
      )}</For>
    </fieldset>
  );
};

const getSourceByUrl = (urlStr: string): SourceMap[string] | undefined => {
  const url = new URL(urlStr);
  if (url.host.includes("youtube.com")) {
    const videoId = url.searchParams.get("v");
    if (!videoId) return;
    return {
      kind: "YouTube",
      videoId,
    };
  }
  if (url.host.includes("youtu.be")) {
    const videoId = url.pathname.split("/").reverse()[0];
    if (!videoId) return;
    return {
      kind: "YouTube",
      videoId,
    };
  }
  if (url.host.includes("soundcloud.com")) {
    return {
      kind: "SoundCloud",
      url: urlStr,
    };
  }
};
