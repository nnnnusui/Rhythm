const SoundEffectPlayer = (context: AudioContext) => {
  type Id = string;
  const store = new Map<Id, AudioBufferSourceNode>();
  const getDefault = (id: Id) => {
    const defaultId = id.replace(/\..*$/, ".default");
    return store.get(defaultId);
  };
  const get = (id: Id) => {
    const byId = store.get(id);
    return byId ? byId : getDefault(id);
  };
  return {
    storeByFetch: (id: Id, url: string) => {
      const source = context.createBufferSource();
      fetch(url).then((response) =>
        response
          .arrayBuffer()
          .then((it) =>
            context.decodeAudioData(it).then((it) => (source.buffer = it))
          )
      );
      store.set(id, source);
    },
    play: (id: Id) => {
      const sound = get(id);
      if (!sound) return;
      const source = context.createBufferSource();
      source.buffer = sound.buffer;
      source.connect(context.destination);
      source.start();
    },
  };
};

type SoundEffectPlayer = ReturnType<typeof SoundEffectPlayer>;
export { SoundEffectPlayer };
