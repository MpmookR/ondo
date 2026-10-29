/** Vite's `?raw` import (Storybook only): the file's text as a string. */
declare module '*.css?raw' {
  const text: string;
  export default text;
}
