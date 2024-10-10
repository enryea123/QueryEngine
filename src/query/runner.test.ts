/// <reference types="jest" />

import { queryRunner } from './runner';
import { DataRow } from '../model/data';
import { Query, QueryFilter, QueryOperator } from '../model/query';

describe('queryRunner', () => {
    const mockData: DataRow[] = [
        { id: 1, name: 'John', age: 25 },
        { id: 2, name: 'Jane', age: 30 },
        { id: 3, name: 'Doe', age: 27 },
    ];

    it('should return projected rows when no filter applied', () => {
        const projection: string[] = ['id', 'name'];
        const query: Query = { projection, filter: null };

        const result = queryRunner(mockData, query);

        expect(result).toEqual([
            { id: 1, name: 'John' },
            { id: 2, name: 'Jane' },
            { id: 3, name: 'Doe' },
        ]);
    });

    it('should return projected rows that meet the filter criteria', () => {
        const projection: string[] = ['id', 'name'];
        const filter: QueryFilter = {
            column: 'age',
            operator: QueryOperator.GREATER,
            value: '26',
        };
        const query: Query = { projection, filter };

        const result = queryRunner(mockData, query);

        expect(result).toEqual([
            { id: 2, name: 'Jane' },
            { id: 3, name: 'Doe' },
        ]);
    });

    it('should return an empty array if no rows meet the filter criteria', () => {
        const projection: string[] = ['id', 'name'];
        const filter: QueryFilter = {
            column: 'age',
            operator: QueryOperator.GREATER,
            value: '35',
        };
        const query: Query = { projection, filter };

        const result = queryRunner(mockData, query);

        expect(result).toEqual([]);
    });

    it('should handle equality filter correctly', () => {
        const projection: string[] = ['id', 'name'];
        const filter: QueryFilter = {
            column: 'age',
            operator: QueryOperator.EQUAL,
            value: '30',
        };
        const query: Query = { projection, filter };

        const result = queryRunner(mockData, query);

        expect(result).toEqual([{ id: 2, name: 'Jane' }]);
    });

    it('should return an empty array when no rows match the equality filter', () => {
        const projection: string[] = ['id', 'name'];
        const filter: QueryFilter = {
            column: 'age',
            operator: QueryOperator.EQUAL,
            value: '40',
        };
        const query: Query = { projection, filter };

        const result = queryRunner(mockData, query);

        expect(result).toEqual([]);
    });

    it('should return projected rows with different projection fields', () => {
        const projection: string[] = ['id', 'age'];
        const filter: QueryFilter = {
            column: 'age',
            operator: QueryOperator.GREATER,
            value: '24',
        };
        const query: Query = { projection, filter };

        const result = queryRunner(mockData, query);

        expect(result).toEqual([
            { id: 1, age: 25 },
            { id: 2, age: 30 },
            { id: 3, age: 27 },
        ]);
    });

    it('should handle empty data gracefully', () => {
        const projection: string[] = ['id', 'name'];
        const filter: QueryFilter = {
            column: 'age',
            operator: QueryOperator.GREATER,
            value: '20',
        };
        const query: Query = { projection, filter };

        const result = queryRunner([], query);

        expect(result).toEqual([]);
    });
});
