import { createAsync, query } from "@solidjs/router";

import styles from "./YouTubeOption.module.css";

export const YouTubeOption = (p: {
  videoId: string;
}) => {
  const info = createAsync(() => getOEmbedInfo(p.videoId)());

  return (
    <div class={styles.YouTubeOption}>
      <span class={styles.Title}>{info()?.title}</span>
      <div class={styles.SubTexts}>
        <span>-</span>
        <div class={styles.VideoId}>{p.videoId}</div>
      </div>
    </div>
  );
};

const getOEmbedInfo = (videoId: string) => {
  const oEmbedPath = () => getOEmbedPath(videoId);
  return query(() => fetch(oEmbedPath()).then(asInfo), oEmbedPath());
};

const getOEmbedPath = (videoId: string) => {
  const baseUrl = "https://www.youtube.com/oembed";
  const videoUrl = new URL("https://www.youtube.com/watch");
  videoUrl.searchParams.set("v", videoId);
  const url = new URL(baseUrl);
  url.searchParams.set("url", videoUrl.toString());
  return url.toString();
};

type YouTubeVideoInfo = {
  title: string;
};
const asInfo = async (response: Response) => {
  return await response.json() as YouTubeVideoInfo;
};
