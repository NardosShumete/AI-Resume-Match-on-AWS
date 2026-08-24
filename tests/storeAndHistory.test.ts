import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useResumeStore } from '../src/stores/useResumeStore';

describe('Resume Store & LocalStorage Guest History Unit Tests', () => {
  beforeEach(() => {
    useResumeStore.getState().reset();
  });

  it('1. loadExampleData populates store fields correctly and sets pdfState to success', () => {
    const { loadExampleData } = useResumeStore.getState();
    loadExampleData();

    const state = useResumeStore.getState();
    expect(state.pdfState).toBe('success');
    expect(state.resumeMetadata).not.toBeNull();
    expect(state.resumeMetadata?.fileName).toBe('example-fullstack-resume.pdf');
    expect(state.resumeMetadata?.wordCount).toBe(448);
    expect(state.resumeMetadata?.pageCount).toBe(1);
    expect(state.companyName).toBe('Stripe');
    expect(state.jobTitle).toBe('Senior Full-Stack Engineer');
    expect(state.jobDescription.length).toBeGreaterThan(50);
  });

  it('2. Reset operation clears active metadata and form inputs cleanly', () => {
    const { loadExampleData, reset } = useResumeStore.getState();
    loadExampleData();
    reset();

    const state = useResumeStore.getState();
    expect(state.pdfState).toBe('idle');
    expect(state.resumeMetadata).toBeNull();
    expect(state.companyName).toBe('');
    expect(state.jobTitle).toBe('');
    expect(state.jobDescription).toBe('');
    expect(state.analysisResults).toBeNull();
  });

  it('3. LocalStorage persistence loads and saves history gracefully', () => {
    const { loadSampleHistory, clearHistory } = useResumeStore.getState();
    loadSampleHistory();
    expect(useResumeStore.getState().history.length).toBeGreaterThan(0);

    clearHistory();
    expect(useResumeStore.getState().history.length).toBe(0);
  });

  it('4. Corrupted localStorage data does not crash the application', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => '{ invalid corrupt json syntax }',
      setItem: () => {},
    });

    expect(() => {
      useResumeStore.getState();
    }).not.toThrow();
  });
});
