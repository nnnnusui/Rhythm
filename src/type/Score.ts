import {
  JSX,
} from "solid-js";

type Note = {
  time: number
  keyframes: Keyframe[]
  style: JSX.CSSProperties
  judge: {
    style: JSX.CSSProperties
  }
}

type Score = {
  notes: Note[]
}

export default Score;
