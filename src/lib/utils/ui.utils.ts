/* Minimal class joiner. Components are written so no two classes
   ever set the same property, so no tailwind-merge is needed. */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}