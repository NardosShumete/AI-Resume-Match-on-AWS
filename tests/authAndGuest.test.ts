import { describe, it, expect } from 'vitest';
import { useAuthStore } from '../src/stores/useAuthStore';

describe('Auth & Guest Access Unit Tests', () => {
  it('1. Initial auth state defaults to isAuthenticated: true with Guest Explorer user', () => {
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user).not.toBeNull();
    expect(state.user?.name).toBe('Guest Explorer');
    expect(state.user?.email).toBe('guest@resumatch.local');
  });

  it('2. Login updates user state cleanly', async () => {
    const { login } = useAuthStore.getState();
    await login('candidate@example.com');
    const updatedState = useAuthStore.getState();
    expect(updatedState.isAuthenticated).toBe(true);
    expect(updatedState.user?.email).toBe('candidate@example.com');
  });

  it('3. Logout resets state back to default Guest Explorer mode without locking user out', () => {
    const { logout } = useAuthStore.getState();
    logout();
    const guestState = useAuthStore.getState();
    expect(guestState.isAuthenticated).toBe(true);
    expect(guestState.user?.name).toBe('Guest Explorer');
  });
});
