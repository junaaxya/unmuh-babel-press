import assert from 'node:assert/strict';
import { calculatePaginationRange } from '../src/lib/pagination.js';

const scenarios = [
  {
    name: 'less than page size (8 of 12)',
    input: { page: 1, limit: 12, total: 8, currentCount: 8 },
    expected: { start: 1, end: 8 },
  },
  {
    name: 'exactly one full page (12 of 12)',
    input: { page: 1, limit: 12, total: 12, currentCount: 12 },
    expected: { start: 1, end: 12 },
  },
  {
    name: 'second page with remainder (16 total, 4 shown)',
    input: { page: 2, limit: 12, total: 16, currentCount: 4 },
    expected: { start: 13, end: 16 },
  },
  {
    name: 'large dataset mid page',
    input: { page: 5, limit: 12, total: 120, currentCount: 12 },
    expected: { start: 49, end: 60 },
  },
];

for (const scenario of scenarios) {
  const result = calculatePaginationRange(scenario.input);
  assert.deepStrictEqual(
    result,
    scenario.expected,
    `Scenario "${scenario.name}" failed. Expected ${JSON.stringify(
      scenario.expected,
    )} but received ${JSON.stringify(result)}`,
  );
}

console.log('All pagination scenarios passed successfully.');
