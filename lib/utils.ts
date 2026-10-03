import { clsx, type ClassValue } from "clsx";

/**
 * Tiny class-name combiner. Kept deliberately minimal: this project does not
 * need a full variant system, just predictable conditional classes.
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
