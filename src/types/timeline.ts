export interface TimelineElement {
  id: string;
  name: string;
  type: 'video' | 'audio' | 'text' | 'image';
  startTime: number;
  duration: number;
  track: number;
  properties: {
    [key: string]: any;
  };
  keyframes: KeyframeTrack[];
}

export interface KeyframeTrack {
  property: 'position' | 'rotation' | 'opacity' | 'scale';
  keyframes: Keyframe[];
}

export interface Keyframe {
  time: number;
  value: number | Position | Scale;
  easing: EasingType;
}

export interface Position {
  x: number;
  y: number;
}

export interface Scale {
  x: number;
  y: number;
}

export type EasingType = 
  | 'linear'
  | 'easeInOut'
  | 'easeIn'
  | 'easeOut'
  | 'bounceOut'
  | 'elasticOut';

export interface TimelineRulerProps {
  scale: number;
  duration: number;
  width: number;
  guides?: number[];
  onAddGuide?: (time: number) => void;
  onRemoveGuide?: (time: number) => void;
}

export interface KeyframeEditorProps {
  element: TimelineElement;
  onKeyframeChange: (trackId: string, keyframeId: string, changes: Partial<Keyframe>) => void;
  onKeyframeAdd: (trackId: string, keyframe: Keyframe) => void;
  onKeyframeDelete: (trackId: string, keyframeId: string) => void;
} 