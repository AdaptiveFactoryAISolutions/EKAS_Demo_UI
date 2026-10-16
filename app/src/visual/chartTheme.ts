/** Chart chrome follows the saved appearance. Series color stays Highcharts' own palette. */
export type ChartFrame = { surface: string; text: string; muted: string; line: string; tooltip: string };

const light: ChartFrame = { surface: '#ffffff', text: '#1c1c1a', muted: '#5c5b57', line: '#e4e3df', tooltip: '#ffffff' };
const dark: ChartFrame = { surface: '#1f1f1f', text: '#f3f3f1', muted: '#c4c4be', line: '#3a3a3a', tooltip: '#2a2a2a' };

export function chartFrame(theme?: string | null): ChartFrame {
  const mode = theme ?? (typeof document === 'undefined' ? 'light' : document.documentElement.dataset.theme);
  return mode === 'dark' ? dark : light;
}
