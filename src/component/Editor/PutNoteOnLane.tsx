import {
  Component,
} from "solid-js";

import { useGame } from "../../context/game";
import createBoundarySignal from "../../signal/createBoundarySignal";
import Interaction from "./Interacton";

const PutNoteOnLane: Component = () => {
  const [game, { setNotes, Note }] = useGame();
  const [max, setMax] = createBoundarySignal({
    init: 5,
    lowerBound: () => 1,
  });
  const [lane, setLane] = createBoundarySignal({
    init: 1,
    lowerBound: () => 1,
    upperBound: max,
  });
  const sizeUpperBound = () => max() - lane() + 1;
  const [size, setSize] = createBoundarySignal({
    init: 1,
    lowerBound: () => 1,
    upperBound: sizeUpperBound,
  });

  const putNote = () => {
    const time = game.time();
    if (time < 0 ) return;
    const laneSize = 1 / max();
    const left = laneSize * (lane() - 1);
    const width = laneSize * size();
    const note = Note().create({
      time,
      judgeRect: {
        left: left,
        top: 0,
        width: width,
        height: 1,
      },
      styles: {
        note: {
          left: `${left * 100}%`,
          width: `${width * 100}%`,
          height: "1em",
        },
        onStart: {
          top: "0%",
        },
        onJudge: {
          top: "80%",
        },
        onEnd: {
          top: "160%",
        },
        judgePoint: {
          left: `${left * 100}%`,
          width: `${width * 100}%`,
          height: ".4em",
        },
      },
    });
    setNotes((prev) => [...prev, note].sort((it) => it.state.time));
  };

  return (
    <section>
      <h1
        onPointerUp={putNote}
      >
        PutLane
      </h1>
      <Interaction
        onTap={() => lane()}
        onDrag={({ start, current, onTap }) => {
          const startState = onTap();
          if (startState === undefined) return;
          const diff = (current.y - start.y) / 20;
          const move = Math.floor(startState + diff);
          setLane(move);
        }}
      >{({ events, Input }) =>
          <section
            {...events}
          >
            <h1>lane</h1>
            <Input
              value={lane()}
              style={{ width: ".65em" }}
            />
            <span>/{max()}</span>
          </section>
        }</Interaction>
      <Interaction
        onTap={() => size()}
        onDrag={({ start, current, onTap }) => {
          const startState = onTap();
          if (startState === undefined) return;
          const diff = (current.y - start.y) / 20;
          const move = Math.floor(startState + diff);
          setSize(move);
        }}
      >{({ events, Input }) =>
          <section
            {...events}
          >
            <h1>size</h1>
            <Input
              value={size()}
              style={{ width: ".65em" }}
            />
            <span>/{sizeUpperBound()}</span>
          </section>
        }</Interaction>
      <Interaction
        onTap={() => max()}
        onDrag={({ start, current, onTap }) => {
          const startState = onTap();
          if (startState === undefined) return;
          const diff = (current.y - start.y) / 20;
          const move = Math.floor(startState + diff);
          setMax(move);
        }}
      >{({ events, Input }) =>
          <section
            {...events}
          >
            <h1>max</h1>
            <Input
              value={max()}
            />
          </section>
        }</Interaction>
    </section>
  );
};

export default PutNoteOnLane;
