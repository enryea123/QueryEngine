/// <reference types="jest" />

import { QueryOperator } from '../model/query';
import { readQuery } from './reader';

describe('readQuery', () => {
    it('should correctly parse a query with projection and filter', () => {
        const input = 'PROJECT col1, col2 FILTER col3 > "value"';
        const result = readQuery(input);

        expect(result.projection).toEqual(['col1', 'col2']);
        expect(result.filter).toEqual({
            column: 'col3',
            operator: QueryOperator.GREATER,
            value: 'value',
        });
    });

    it('should correctly parse a query with only projection and no filter', () => {
        const input = 'PROJECT col1, col2';
        const result = readQuery(input);

        expect(result.projection).toEqual(['col1', 'col2']);
        expect(result.filter).toBeNull(); // No filter provided
    });

    it('should throw an error if no valid operator is found in filter', () => {
        const input = 'PROJECT col1, col2 FILTER col3 # "value"'; // Invalid operator
        expect(() => readQuery(input)).toThrow(
            'Operator not found in filter expression'
        );
    });

    it('should correctly parse a query with EQUAL operator in the filter', () => {
        const input = 'PROJECT col1 FILTER col3 = "value"';
        const result = readQuery(input);

        expect(result.projection).toEqual(['col1']);
        expect(result.filter).toEqual({
            column: 'col3',
            operator: QueryOperator.EQUAL,
            value: 'value',
        });
    });

    it('should remove surrounding quotes from the filter value', () => {
        const input = 'PROJECT col1 FILTER col3 = "value"';
        const result = readQuery(input);

        expect(result.filter?.value).toBe('value');
    });

    it('should throw an error if the filter part is malformed (no operator)', () => {
        const input = 'PROJECT col1 FILTER col3 "value"'; // Missing operator
        expect(() => readQuery(input)).toThrow(
            'Operator not found in filter expression'
        );
    });

    it('should handle filter values without quotes', () => {
        const input = 'PROJECT col1 FILTER col3 > value';
        const result = readQuery(input);

        expect(result.filter).toEqual({
            column: 'col3',
            operator: QueryOperator.GREATER,
            value: 'value',
        });
    });
});
