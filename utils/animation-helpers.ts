import { AnimationTheme, PositionType, BehaviorType } from "../types/lottie-animations"; // Fixed import path

// Type guard functions
export const isValidTheme = (theme: string): theme is AnimationTheme => {
  return ["mindful", "growth", "comfort", "nature"].includes(theme);
};

export const isValidPosition = (position: string): position is PositionType => {
  return ["floating", "walking", "corner", "center", "sidebar"].includes(position);
};

export const isValidBehavior = (behavior: string): behavior is BehaviorType => {
  return ["continuous", "interval", "scroll-trigger", "hover-trigger"].includes(behavior);
};

// Theme color helpers
export const getThemeColors = (
  theme: AnimationTheme
): {
  primary: string;
  secondary: string;
  glow: string;
} => {
  const colorMap = {
    mindful: {
      primary: "#a78bfa",
      secondary: "#c4b5fd",
      glow: "radial-gradient(circle, #a78bfa, transparent)",
    },
    growth: {
      primary: "#34d399",
      secondary: "#6ee7b7",
      glow: "radial-gradient(circle, #34d399, transparent)",
    },
    comfort: {
      primary: "#f472b6",
      secondary: "#f9a8d4",
      glow: "radial-gradient(circle, #f472b6, transparent)",
    },
    nature: {
      primary: "#60a5fa",
      secondary: "#93c5fd",
      glow: "radial-gradient(circle, #60a5fa, transparent)",
    },
  };

  return colorMap[theme];
};

export const getAnimationDuration = (behavior: BehaviorType): number => {
  const durationMap: Record<BehaviorType, number> = {
    continuous: 8,
    interval: 12,
    "scroll-trigger": 3,
    "hover-trigger": 2,
  };

  return durationMap[behavior];
};

// Position helpers
export const getPositionClasses = (position: PositionType): string => {
  const classMap: Record<PositionType, string> = {
    floating: "fixed top-20 right-5 z-50",
    walking: "fixed bottom-8 left-0 z-50",
    corner: "fixed bottom-4 right-4 z-50",
    center: "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50",
    sidebar: "fixed top-1/3 right-2 z-50",
  };

  return classMap[position];
};
