import { Keyframe, Position, Scale, EasingType } from '../types/timeline';

const easingFunctions = {
  linear: (t: number) => t,
  easeInOut: (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  easeIn: (t: number) => t * t,
  easeOut: (t: number) => 1 - Math.pow(1 - t, 2),
  bounceOut: (t: number) => {
    const n1 = 7.5625;
    const d1 = 2.75;

    if (t < 1 / d1) {
      return n1 * t * t;
    } else if (t < 2 / d1) {
      return n1 * (t -= 1.5 / d1) * t + 0.75;
    } else if (t < 2.5 / d1) {
      return n1 * (t -= 2.25 / d1) * t + 0.9375;
    } else {
      return n1 * (t -= 2.625 / d1) * t + 0.984375;
    }
  },
  elasticOut: (t: number) => {
    return t === 0 ? 0 :
           t === 1 ? 1 :
           Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1;
  },
};

export const interpolateValue = (
  time: number,
  keyframes: Keyframe[],
  duration: number
): number | Position | Scale => {
  if (keyframes.length === 0) return 0;
  if (keyframes.length === 1) return keyframes[0].value;

  // Encontrar los keyframes entre los que está el tiempo actual
  const sortedKeyframes = [...keyframes].sort((a, b) => a.time - b.time);
  let startFrame = sortedKeyframes[0];
  let endFrame = sortedKeyframes[sortedKeyframes.length - 1];

  for (let i = 0; i < sortedKeyframes.length - 1; i++) {
    if (time >= sortedKeyframes[i].time && time <= sortedKeyframes[i + 1].time) {
      startFrame = sortedKeyframes[i];
      endFrame = sortedKeyframes[i + 1];
      break;
    }
  }

  // Calcular el progreso entre los dos keyframes
  const progress = (time - startFrame.time) / (endFrame.time - startFrame.time);
  const easedProgress = easingFunctions[endFrame.easing](progress);

  // Interpolar los valores según su tipo
  if (typeof startFrame.value === 'number' && typeof endFrame.value === 'number') {
    return startFrame.value + (endFrame.value - startFrame.value) * easedProgress;
  }

  if (typeof startFrame.value === 'object' && typeof endFrame.value === 'object') {
    const startPos = startFrame.value as Position | Scale;
    const endPos = endFrame.value as Position | Scale;
    return {
      x: startPos.x + (endPos.x - startPos.x) * easedProgress,
      y: startPos.y + (endPos.y - startPos.y) * easedProgress,
    };
  }

  return startFrame.value;
};

export const getPropertyAtTime = (
  time: number,
  keyframes: Keyframe[],
  duration: number,
  defaultValue: number | Position | Scale
): number | Position | Scale => {
  if (keyframes.length === 0) return defaultValue;
  return interpolateValue(time, keyframes, duration);
}; 