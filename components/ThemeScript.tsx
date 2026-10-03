/**
 * Applies the saved (or system) theme before the first paint. Inlined into the
 * document head so the page never flashes the wrong theme on load.
 */
const script = `
(function () {
  try {
    var stored = localStorage.getItem("theme");
    var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    var dark = stored ? stored === "dark" : prefersDark;
    document.documentElement.classList.toggle("dark", dark);
  } catch (error) {
    /* private mode / storage disabled: fall back to the light theme */
  }
})();
`.trim();

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
