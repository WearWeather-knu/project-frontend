import { useTheme } from 'styled-components';

const ACTIVE_SEASON_KEY = 'wear-weather-active-season';
const DEFAULT_SEASON = 'spring';

export function getActiveSeason() {
  if (typeof window === 'undefined') return DEFAULT_SEASON;

  return window.localStorage.getItem(ACTIVE_SEASON_KEY) ?? DEFAULT_SEASON;
}

export function setActiveSeason(season) {
  if (typeof window === 'undefined') return;

  window.localStorage.setItem(ACTIVE_SEASON_KEY, season);
}

export function useSeasonTheme() {
  const theme = useTheme();
  const season = getActiveSeason();
  const seasonTheme = theme.colors.seasons[season] ?? theme.colors.seasons[DEFAULT_SEASON];

  return {
    season,
    seasonTheme,
  };
}
