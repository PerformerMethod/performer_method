import type { ImageSourcePropType } from "react-native";

export const hero: ImageSourcePropType = require("../assets/hero.webp");

export const portraits: Record<string, ImageSourcePropType> = {
  "cristina-dagostino": require("../assets/people/cristina-dagostino.webp"),
  "oscar-bridges": require("../assets/people/oscar-bridges.webp"),
  "rosie-harris": require("../assets/people/rosie-harris.webp"),
};
