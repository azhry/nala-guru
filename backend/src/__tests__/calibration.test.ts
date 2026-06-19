import { describe, it, expect } from 'vitest';
import { Calibrator } from '../services/calibration';

describe('Calibrator', () => {
  it('starts at first level with no sessions', () => {
    const c = new Calibrator();
    expect(c.getCurrentLevel()).toBe('counting');
    expect(c.getStreak()).toBe(0);
  });

  it('tracks correct streak', () => {
    const c = new Calibrator();
    c.addSession(true, 'counting');
    c.addSession(true, 'counting');
    c.addSession(true, 'counting');
    expect(c.getStreak()).toBe(3);
  });

  it('resets streak on wrong answer', () => {
    const c = new Calibrator();
    c.addSession(true, 'counting');
    c.addSession(true, 'counting');
    c.addSession(false, 'counting');
    expect(c.getStreak()).toBe(0);
  });

  it('advances level after 80%+ accuracy in last 10', () => {
    const c = new Calibrator();
    for (let i = 0; i < 10; i++) {
      c.addSession(true, 'counting');
    }
    expect(c.getCurrentLevel()).toBe('addition_1');
  });

  it('drops level after 30% or less accuracy', () => {
    const c = new Calibrator();
    c.addSession(false, 'addition_1');
    c.addSession(false, 'addition_1');
    c.addSession(false, 'addition_1');
    expect(c.getCurrentLevel()).toBe('counting');
  });

  it('returns guide text for correct answer', () => {
    const c = new Calibrator();
    const guide = c.getGuide(true, 'counting');
    expect(guide.text).toContain('Great job');
    expect(guide.visuals).toContain('star-burst');
  });

  it('returns how-to-solve guide for wrong answer', () => {
    const c = new Calibrator();
    const guide = c.getGuide(false, 'addition_1');
    expect(guide.text).toContain('fingers');
    expect(guide.visuals.length).toBeGreaterThan(0);
  });

  it('produces correct response matching CONTRACT-002', () => {
    const c = new Calibrator();
    c.addSession(true, 'counting');

    const guide = c.getGuide(true, 'counting');
    expect(guide).toHaveProperty('text');
    expect(guide).toHaveProperty('visuals');
    expect(typeof guide.text).toBe('string');
    expect(Array.isArray(guide.visuals)).toBe(true);
  });
});
