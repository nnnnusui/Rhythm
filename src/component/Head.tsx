import {
  Title,
  Meta,
  Link,
} from "@solidjs/meta";
import {
  Component,
} from "solid-js";

const Head: Component = () => {
  return (
    <>
      <Meta name="viewport" content="width=device-width, initial-scale=1" />
      <Meta name="charset" content="utf-8" />
      <Meta name="theme-color" content="#6e6e6e" />
      <Link rel="icon" type="image/ico" href="/src/assets/favicon.ico" />
      <Title>Rhythm</Title>
    </>
  );
};

export default Head;
