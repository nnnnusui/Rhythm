import { createAsync, query } from "@solidjs/router";

import styles from "./SoundCloudOption.module.css";

export const SoundCloudOption = (p: {
  url: string;
}) => {
  const info = createAsync(() => getOEmbedInfo(p.url)());

  return (
    <div class={styles.SoundCloudOption}>
      <span class={styles.Title}>{info()?.title}</span>
    </div>
  );
};

const getOEmbedInfo = (videoId: string) => {
  const oEmbedPath = () => getOEmbedPath(videoId);
  return query(() => fetch(oEmbedPath()).then(asInfo), oEmbedPath());
};

const getOEmbedPath = (sourceUrl: string) => {
  const baseUrl = "https://soundcloud.com/oembed";
  const url = new URL(baseUrl);
  url.searchParams.set("url", sourceUrl);
  return url.toString();
};

type SoundCloudMusicInfo = {
  title: string;
};
const asInfo = async (response: Response) => {
  return await response.json() as SoundCloudMusicInfo;
};
