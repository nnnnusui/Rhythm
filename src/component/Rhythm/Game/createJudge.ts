import { batch, createEffect, untrack } from "solid-js";

import { Objects } from "~/fn/objects";
import { Id } from "~/type/struct/Id";
import { Wve } from "~/type/struct/Wve";
import { createSoundEffectPlayer } from "./createSoundEffectPlayer";
import { Judge } from "./Judge";

/**
 * TODO: impl flick
 */
export const createJudge = (p: {
  time: number;
  judgeDelay: number;
  notesMap: Record<Id, Note[]>;
  seVolume: number;
}) => {
  const se = createSoundEffectPlayer({
    get volume() { return p.seVolume; },
  });
  const judgeMsMap: Record<JudgeKind, number> = {
    perfect: 40,
    great: 100,
    good: 160,
    bad: 210,
    miss: 240,
  };
  const findJudgeKindByDiffMs = (diffMs: number): JudgeKind | undefined => {
    return Objects.entries(judgeMsMap)
      .find(([, ms]) => diffMs <= ms)
      ?.[0];
  };

  const judgedMap = Wve.create<Record<Id, Judge>>({});
  const state = Wve.create({
    latestJudge: undefined as Judge | undefined,
    activeMap: {} as Record<Id, boolean>,
    lastReleaseTimeMap: {} as Record<Id, number>,
  });
  const latestJudge = state.partial("latestJudge");
  const lastReleaseTimeMap = state.partial("lastReleaseTimeMap");
  const activeMap = state.partial("activeMap");

  const setJudge = (noteId: Id, judge: Judge) => {
    se.playJudge(judge.kind);
    latestJudge.set(judge);
    judgedMap.set(noteId, judge);
  };

  const findMayBeJudgedNotes = (notes: Note[]) => {
    return notes.flatMap((note) => {
      if (judgedMap()[note.id]) return [];
      const untilSecond = p.judgeDelay + note.offsetSeconds - p.time;
      const diffMs = Math.abs(untilSecond) * 1000;
      const judgeKind = findJudgeKindByDiffMs(diffMs);
      if (judgeKind == null) return [];
      const judge: Judge = {
        kind: judgeKind,
        untilSecond,
        diffMs,
      };
      return [{ note, judge }];
    });
  };

  const onPress = (judgeAreaId: string) => {
    activeMap.set(judgeAreaId, true);
    se.playTap();
    batch(() => {
      const mayBeJudgedNotes = findMayBeJudgedNotes(p.notesMap[judgeAreaId] ?? []);
      (() => { // judge press notes: only once
        const pressNotes = mayBeJudgedNotes.filter(({ note }) => note.judgeKinds.includes("press"));
        const head = pressNotes[0];
        if (head == null) return;
        const { note, judge } = head;
        setJudge(note.id, judge);
      })();
      (() => { // judge trace notes: bulk judgement
        const traceNotes = mayBeJudgedNotes.filter(({ note }) => note.judgeKinds.includes("trace"));
        return traceNotes
          .filter(({ note }) => note.offsetSeconds <= p.time)
          .map(({ note, judge }) => {
            const currentJudge = judgedMap()[note.id];
            if (currentJudge && currentJudge.diffMs < judge.diffMs) return false;
            setJudge(note.id, judge);
          });
      })();
    });
  };

  const onRelease = (judgeAreaId: string) => {
    activeMap.set(judgeAreaId, false);
    lastReleaseTimeMap.set(judgeAreaId, p.time);
    batch(() => {
      const mayBeJudgedNotes = findMayBeJudgedNotes(p.notesMap[judgeAreaId] ?? []);
      (() => { // judge release notes: only once
        const releaseNotes = mayBeJudgedNotes.filter(({ note }) => note.judgeKinds.includes("release"));
        const head = releaseNotes[0];
        if (head == null) return;
        const { note, judge } = head;
        setJudge(note.id, judge);
      })();
      (() => { // judge trace notes: bulk judgement
        const traceNotes = mayBeJudgedNotes.filter(({ note }) => note.judgeKinds.includes("trace"));
        return traceNotes
          .filter(({ note }) => note.offsetSeconds >= p.time)
          .map(({ note, judge }) => {
            const currentJudge = judgedMap()[note.id];
            if (currentJudge && currentJudge.diffMs < judge.diffMs) return;
            setJudge(note.id, judge);
          });
      })();
    });
  };

  const traceNotesMap = () => {
    const traceNotes = Objects.values(p.notesMap).flatMap((it) => it.filter((note) => note.judgeKinds.includes("trace")));
    return Objects.groupBy(traceNotes, (it) => it.judgeAreaId);
  };
  let latestTime = 0;
  createEffect(() => { // judge trace notes: on hold
    const currentTime = p.time;
    const beforeTime = latestTime;
    latestTime = p.time;
    batch(() => {
      Objects.entries(activeMap())
        .forEach(([judgeAreaId, active]) => {
          if (!active) return;
          const justNotes = traceNotesMap()[judgeAreaId]
            ?.filter((note) => {
              const judgeSecond = p.judgeDelay + note.offsetSeconds;
              return judgeSecond <= currentTime && beforeTime <= judgeSecond;
            });
          justNotes?.forEach((note) => {
            setJudge(note.id, {
              kind: "perfect",
              untilSecond: 0,
              diffMs: 0,
            });
          });
        });
    });
  });

  createEffect(() => { // judge overlook (miss)
    const notesMap = p.notesMap;
    const time = p.time;
    untrack(() => {
      Objects.values(notesMap)
        .flatMap((it) => it)
        .forEach((note) => {
          if (judgedMap()[note.id]) return;
          const untilJudge = p.judgeDelay + note.offsetSeconds - time;
          if (untilJudge > 0) return;
          const diffMs = Math.abs(untilJudge) * 1000;
          if (judgeMsMap["miss"] > diffMs) return;
          const judge = {
            kind: "miss",
            untilSecond: untilJudge,
            diffMs,
          };
          latestJudge.set(judge);
          judgedMap.set(note.id, judge);
        });
    });
  });

  return {
    onPress,
    onRelease,
    latestJudge,
    judgedMap,
    activeMap,
  };
};

type JudgeKind = "perfect" | "great" | "good" | "bad" | "miss";
type Note = {
  id: string;
  offsetSeconds: number;
  judgeKinds: string[];
  judgeAreaId: string;
};
