/** @public */
export const generateColors = (resolution: {
  hue: number;
  saturation: number;
  lightness: number;
}) => {
  const hueResolution = () => resolution.hue;
  const saturationResolution = () => resolution.saturation;
  const lightnessResolution = () => resolution.lightness;
  const minHue = 0;
  const maxHue = 360;
  const hueRange = maxHue - minHue;
  const minSaturation = 60;
  const maxSaturation = 100;
  const saturationRange = maxSaturation - minSaturation;
  const minLightness = 20;
  const maxLightness = 80;
  const lightnessRange = maxLightness - minLightness;

  const hueStep = hueRange / hueResolution();
  const saturationStep = saturationRange / saturationResolution();
  const lightnessStep = lightnessRange / lightnessResolution();
  const colors = [...Array(hueResolution())].flatMap((_, hueIndex) => {
    const hue = maxHue - hueIndex * hueStep;
    return [...Array(saturationResolution())].flatMap((_, saturationIndex) => {
      const saturation = maxSaturation - saturationIndex * saturationStep;
      return [...Array(lightnessResolution())].map((_, lightnessIndex) => {
        const lightness = maxLightness - lightnessIndex * lightnessStep;
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
      });
    });
  });
  return colors;
};
