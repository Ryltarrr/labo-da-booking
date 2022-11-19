import type { Tuple, DefaultMantineColor } from "@mantine/core";

type ExtendedCustomColors = "brand" | "brandBlue" | DefaultMantineColor;

declare module "@mantine/core" {
  export interface MantineThemeColorsOverride {
    colors: Record<ExtendedCustomColors, Tuple<string, 10>>;
  }
}
