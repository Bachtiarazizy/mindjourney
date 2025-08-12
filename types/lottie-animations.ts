export type AnimationTheme = "mindful" | "growth" | "comfort" | "nature";
export type PositionType = "floating" | "walking" | "corner" | "center" | "sidebar";
export type BehaviorType = "continuous" | "interval" | "scroll-trigger" | "hover-trigger";

export interface AnimationSize {
  width: number;
  height: number;
}

export interface AnimationPosition {
  top?: string | number;
  bottom?: string | number;
  left?: string | number;
  right?: string | number;
  transform?: string;
}

export interface LottieAnimationData {
  [key: string]: unknown;
}

export interface ThemeAnimations {
  [key: string]: string;
}

export interface AnimationConfig {
  mindful: ThemeAnimations;
  growth: ThemeAnimations;
  comfort: ThemeAnimations;
  nature: ThemeAnimations;
}

export interface LottieCharacterProps {
  animationUrl?: string;
  animationData?: LottieAnimationData;
  size?: AnimationSize;
  position?: PositionType;
  behavior?: BehaviorType;
  theme?: AnimationTheme;
  delay?: number;
  duration?: number;
  className?: string;
  onAnimationComplete?: () => void;
  onAnimationStart?: () => void;
  enableReducedMotion?: boolean;
  zIndex?: number;
}
