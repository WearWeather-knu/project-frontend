import { useTheme } from 'styled-components';
import { create } from 'zustand';

const ACTIVE_SEASON_KEY = 'wear-weather-active-season';
const DEFAULT_SEASON = 'winter';

function readStoredSeason() {
  if (typeof window === 'undefined') return DEFAULT_SEASON;

  return window.localStorage.getItem(ACTIVE_SEASON_KEY) ?? DEFAULT_SEASON;
}

export const useSeasonStore = create((set) => ({
  season: readStoredSeason(),
  setSeason: (season) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(ACTIVE_SEASON_KEY, season);
    }

    set({ season });
  },
}));

export function getActiveSeason() {
  return useSeasonStore.getState().season;
}

export function setActiveSeason(season) {
  useSeasonStore.getState().setSeason(season);
}

export function useSeasonTheme() {
  const theme = useTheme();
  const season = useSeasonStore((state) => state.season);
  const setSeason = useSeasonStore((state) => state.setSeason);
  const resolvedSeason = theme.colors.seasons[season] ? season : DEFAULT_SEASON;
  const seasonTheme = theme.colors.seasons[resolvedSeason];

  return {
    season: resolvedSeason,
    seasonTheme,
    setSeason,
  };
}
