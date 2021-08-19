const fromUrl = (url: URL) => {
  switch (url.hostname) {
    case "www.youtube.com":
      return "youtube";
    default:
      return "Not supported.";
  }
};

export const Source = {
  fromUrlString: (url: string) => fromUrl(new URL(url)),
  fromUrl,
};
