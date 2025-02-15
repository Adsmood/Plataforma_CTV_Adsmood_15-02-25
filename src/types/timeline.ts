export type ElementType = 
  | 'video'
  | 'audio'
  | 'text'
  | 'image'
  | 'button'
  | 'carousel'
  | 'gallery'
  | 'trivia'
  | 'qr'
  | 'choice'
  | 'select';

export interface Position {
  x: number;
  y: number;
}

export interface Scale {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export type EasingType = 
  | 'linear'
  | 'easeInOut'
  | 'easeIn'
  | 'easeOut'
  | 'bounceOut'
  | 'elasticOut';

export interface Keyframe {
  time: number;
  value: number | Position | Scale;
  easing: EasingType;
}

export interface KeyframeTrack {
  property: 'position' | 'rotation' | 'opacity' | 'scale';
  keyframes: Keyframe[];
}

export interface ElementProperties {
  text?: string;
  url?: string;
  style?: {
    fontSize?: string;
    fontWeight?: string | number;
    color?: string;
    backgroundColor?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

export interface TimelineElement {
  id: string;
  name: string;
  type: ElementType;
  position: Position;
  size: Size;
  content: any;
  zIndex: number;
  isVisible: boolean;
  startTime: number;
  duration: number;
  track: number;
  properties: ElementProperties;
  keyframes: KeyframeTrack[];
}

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