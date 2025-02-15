import { Keyframe, Position, Scale, EasingType, KeyframeTrack } from '../types/timeline';

type PropertyType = KeyframeTrack['property'];
type DefaultValues = {
  [K in PropertyType]: K extends 'position' | 'scale' 
    ? { x: number; y: number }
    : number;
};

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

const DEFAULT_VALUES: DefaultValues = {
  position: { x: 0, y: 0 },
  scale: { x: 1, y: 1 },
  rotation: 0,
  opacity: 1,
} as const;

export const interpolateValue = (
  time: number,
  keyframes: Keyframe[],
  duration: number,
  property: KeyframeTrack['property']
): number | Position | Scale => {
  try {
    // Validación de parámetros
    if (typeof time !== 'number' || isNaN(time)) {
      console.warn('Tiempo inválido proporcionado');
      return DEFAULT_VALUES[property];
    }

    if (typeof duration !== 'number' || duration <= 0) {
      console.warn('Duración inválida proporcionada');
      return DEFAULT_VALUES[property];
    }

    // Validación de tiempo y keyframes
    if (!Array.isArray(keyframes) || keyframes.length === 0) {
      return DEFAULT_VALUES[property];
    }
    
    if (time < 0) time = 0;
    if (time > duration) time = duration;
    
    // Validar estructura de keyframes
    const validKeyframes = keyframes.filter(kf => {
      if (!kf || typeof kf.time !== 'number' || kf.value === undefined) {
        console.warn('Keyframe inválido encontrado y filtrado');
        return false;
      }
      if (kf.time < 0 || kf.time > duration) {
        console.warn('Keyframe fuera de rango encontrado y filtrado');
        return false;
      }
      return true;
    });

    if (validKeyframes.length === 0) {
      console.warn('No se encontraron keyframes válidos');
      return DEFAULT_VALUES[property];
    }
    
    if (validKeyframes.length === 1) return validKeyframes[0].value;

    // Ordenar keyframes por tiempo
    const sortedKeyframes = validKeyframes.sort((a, b) => a.time - b.time);
    
    // Si el tiempo está fuera del rango de keyframes, usar el valor más cercano
    if (time <= sortedKeyframes[0].time) return sortedKeyframes[0].value;
    if (time >= sortedKeyframes[sortedKeyframes.length - 1].time) {
      return sortedKeyframes[sortedKeyframes.length - 1].value;
    }
    
    // Encontrar los keyframes entre los que está el tiempo actual usando búsqueda binaria
    let startIndex = 0;
    let endIndex = sortedKeyframes.length - 1;
    
    while (startIndex < endIndex - 1) {
      const midIndex = Math.floor((startIndex + endIndex) / 2);
      if (time < sortedKeyframes[midIndex].time) {
        endIndex = midIndex;
      } else {
        startIndex = midIndex;
      }
    }
    
    const startFrame = sortedKeyframes[startIndex];
    const endFrame = sortedKeyframes[endIndex];

    // Validar frames
    if (!startFrame || !endFrame) {
      console.warn('Frames de interpolación no válidos');
      return DEFAULT_VALUES[property];
    }

    // Calcular el progreso entre los dos keyframes
    const timeDiff = endFrame.time - startFrame.time;
    if (timeDiff <= 0) {
      console.warn('Diferencia de tiempo inválida entre keyframes');
      return startFrame.value;
    }

    const progress = (time - startFrame.time) / timeDiff;
    let easingType = endFrame.easing || 'linear';
    
    if (!easingFunctions[easingType]) {
      console.warn(`Función de easing '${easingType}' no encontrada, usando 'linear'`);
      easingType = 'linear';
    }

    const easedProgress = easingFunctions[easingType](progress);

    // Interpolar los valores según su tipo
    if (typeof startFrame.value === 'number' && typeof endFrame.value === 'number') {
      return startFrame.value + (endFrame.value - startFrame.value) * easedProgress;
    }

    if (typeof startFrame.value === 'object' && typeof endFrame.value === 'object') {
      const startPos = startFrame.value as Position | Scale;
      const endPos = endFrame.value as Position | Scale;
      
      // Validación más exhaustiva de valores de posición/escala
      if (!startPos || !endPos ||
          typeof startPos.x !== 'number' || typeof startPos.y !== 'number' ||
          typeof endPos.x !== 'number' || typeof endPos.y !== 'number' ||
          isNaN(startPos.x) || isNaN(startPos.y) ||
          isNaN(endPos.x) || isNaN(endPos.y)) {
        console.warn('Valores de posición o escala inválidos');
        return DEFAULT_VALUES[property];
      }

      // Normalizar valores según el tipo de propiedad
      if (property === 'scale') {
        // La escala no debería ser negativa o cero
        const minScale = 0.01;
        startPos.x = Math.max(minScale, startPos.x);
        startPos.y = Math.max(minScale, startPos.y);
        endPos.x = Math.max(minScale, endPos.x);
        endPos.y = Math.max(minScale, endPos.y);
      } else if (property === 'position') {
        // La posición no debería ser NaN o infinita
        if (!Number.isFinite(startPos.x) || !Number.isFinite(startPos.y) ||
            !Number.isFinite(endPos.x) || !Number.isFinite(endPos.y)) {
          console.warn('Valores de posición infinitos o NaN');
          return DEFAULT_VALUES[property];
        }
      }
      
      return {
        x: startPos.x + (endPos.x - startPos.x) * easedProgress,
        y: startPos.y + (endPos.y - startPos.y) * easedProgress,
      };
    }

    console.warn('Tipo de valor no soportado');
    return DEFAULT_VALUES[property];
  } catch (error) {
    console.error('Error en interpolación:', error);
    return DEFAULT_VALUES[property];
  }
};

export const getPropertyAtTime = (
  time: number,
  keyframes: Keyframe[],
  duration: number,
  property: KeyframeTrack['property']
): number | Position | Scale => {
  if (!Array.isArray(keyframes) || keyframes.length === 0) {
    return DEFAULT_VALUES[property];
  }
  return interpolateValue(time, keyframes, duration, property);
}; 