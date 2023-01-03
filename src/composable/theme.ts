import type { Theme } from "@/stores/themes";

export function setTheme(theme: Theme): void {
  localStorage.setItem('theme', theme);
}

export function openThemePage(): void {
  setThemePage(true);
}

export function closeThemePage(): void {
  setThemePage(false);
}

export function setThemePage(open: boolean): void {
  localStorage.setItem('themePage', `${open}`);
}

export function isThemePage(): boolean {
  return localStorage.getItem('themePage') === 'true';
}