import {describe, expect, it} from 'vitest';
import {parse} from './start.js';

describe('Parsing', () => {
  it('parses, I guess', () => {
    const text = parse('../fixtures/index.d.ts');
    expect(text).toBeTruthy();
  });
});
