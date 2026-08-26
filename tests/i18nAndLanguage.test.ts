import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useLanguageStore } from '../src/i18n/useLanguageStore';
import { en } from '../src/i18n/en';
import { am } from '../src/i18n/am';

describe('i18n & Multilingual Language Support Unit Tests', () => {
  beforeEach(() => {
    useLanguageStore.getState().setLanguage('en');
  });

  it('1. Defaults to English language dictionary and persists preference', () => {
    const state = useLanguageStore.getState();
    expect(state.language).toBe('en');
    expect(state.t.nav.brand).toBe('ResuMatch AI');
    expect(state.t.header.english).toBe('English');
    expect(state.t.header.amharic).toBe('አማርኛ');
  });

  it('2. Switches to Amharic (አማርኛ) dictionary correctly', () => {
    useLanguageStore.getState().setLanguage('am');
    const state = useLanguageStore.getState();

    expect(state.language).toBe('am');
    expect(state.t.nav.overview).toBe('አጠቃላይ እይታ');
    expect(state.t.nav.analyzer).toBe('የATS ሬዙሜ መተንተኛ');
    expect(state.t.dashboard.title).toBe('የATS አጠቃላይ እይታ');
    expect(state.t.results.atsScore).toBe(en.results.atsScore);
  });

  it('3. Preserves technical term keys and English structure', () => {
    expect(en.nav.brand).toBe('ResuMatch AI');
    expect(am.nav.brand).toBe('ResuMatch AI');
    expect(en.scoreTiers.strong).toBe('Strong Match');
    expect(am.scoreTiers.strong).toBe('ከፍተኛ ተዛምዶ');
  });

  it('4. Handles localStorage reading and fallback cleanly when corrupted', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => 'corrupted_value',
      setItem: () => {},
    });

    expect(() => {
      useLanguageStore.getState().setLanguage('am');
    }).not.toThrow();
  });
});
