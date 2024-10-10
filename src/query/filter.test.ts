/// <reference types="jest" />

import { shouldKeepRow } from './filter';
import { ColumnValue, DataRow } from '../model/data';
import { QueryFilter, QueryOperator } from '../model/query';

describe('shouldKeepRow', () => {
    it('should return true if no filter is provided', () => {
        const row: DataRow = { col1: 'value1', col2: 42 };
        const result = shouldKeepRow(row, null);
        expect(result).toBe(true);
    });

    it('should return true for equal filter with matching value', () => {
        const row: DataRow = { col1: 'value1', col2: 42 };
        const filter: QueryFilter = {
            column: 'col1',
            operator: QueryOperator.EQUAL,
            value: 'value1',
        };
        const result = shouldKeepRow(row, filter);
        expect(result).toBe(true);
    });

    it('should return false for equal filter with non-matching value', () => {
        const row: DataRow = { col1: 'value1', col2: 42 };
        const filter: QueryFilter = {
            column: 'col1',
            operator: QueryOperator.EQUAL,
            value: 'differentValue',
        };
        const result = shouldKeepRow(row, filter);
        expect(result).toBe(false);
    });

    it('should throw an error for equal filter with unsupported types', () => {
        const row: DataRow = { col1: true as unknown as ColumnValue };
        const filter: QueryFilter = {
            column: 'col1',
            operator: QueryOperator.EQUAL,
            value: 'someValue',
        };

        expect(() => shouldKeepRow(row, filter)).toThrow(
            'Cannot compare values of unsupported types'
        );
    });

    it('should return true for greater filter with numeric comparison', () => {
        const row: DataRow = { col1: 'value1', col2: 42 };
        const filter: QueryFilter = {
            column: 'col2',
            operator: QueryOperator.GREATER,
            value: '40',
        };
        const result = shouldKeepRow(row, filter);
        expect(result).toBe(true);
    });

    it('should return false for greater filter with numeric comparison', () => {
        const row: DataRow = { col1: 'value1', col2: 39 };
        const filter: QueryFilter = {
            column: 'col2',
            operator: QueryOperator.GREATER,
            value: '40',
        };
        const result = shouldKeepRow(row, filter);
        expect(result).toBe(false);
    });

    it('should return true for greater filter with string comparison', () => {
        const row: DataRow = { col1: 'value2', col2: 'value1' };
        const filter: QueryFilter = {
            column: 'col1',
            operator: QueryOperator.GREATER,
            value: 'value1',
        };
        const result = shouldKeepRow(row, filter);
        expect(result).toBe(true);
    });

    it('should return false for greater filter with string comparison', () => {
        const row: DataRow = { col1: 'value1', col2: 'value2' };
        const filter: QueryFilter = {
            column: 'col1',
            operator: QueryOperator.GREATER,
            value: 'value2',
        };
        const result = shouldKeepRow(row, filter);
        expect(result).toBe(false);
    });

    it('should return false for greater filter with different types comparison', () => {
        const row: DataRow = { col1: 'value1', col2: 42 };
        const filter: QueryFilter = {
            column: 'col1',
            operator: QueryOperator.GREATER,
            value: 'value2',
        };
        const result = shouldKeepRow(row, filter);
        expect(result).toBe(false);
    });

    it('should throw an error for greater filter with unsupported types', () => {
        const row: DataRow = { col1: true as unknown as ColumnValue };
        const filter: QueryFilter = {
            column: 'col1',
            operator: QueryOperator.GREATER,
            value: 'someValue',
        };

        expect(() => shouldKeepRow(row, filter)).toThrow(
            'Cannot compare values of unsupported types'
        );
    });

    it('returns false for unsupported operator', () => {
        const row: DataRow = { col1: 'value1', col2: 2 };
        const filter: QueryFilter = {
            column: 'col1',
            operator: 'UNSUPPORTED_OPERATOR' as QueryOperator,
            value: 'value1',
        };
        expect(shouldKeepRow(row, filter)).toBe(false);
    });
});
