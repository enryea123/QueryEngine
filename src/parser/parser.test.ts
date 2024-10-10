/// <reference types="jest" />

import { parseCsv } from './parser';
import fs from 'fs';
import { Readable } from 'stream';

const mockCsvData = `id,name,age
1,John,25
2,Jane,30
3,Doe,27`;

const mockCsvDataAllStrings = `id,name,age
one,John,twenty-five
two,Jane,thirty
three,Doe,twenty-seven`;

const mockCsvDataMixed = `id,name,age
1,John,25
three,Jane,30
3,Doe,27`;

jest.mock('fs');

describe('CSV Parsing', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    function mockFileSystem(csvContent: string) {
        // Mock the createReadStream to return the CSV content
        (fs.createReadStream as jest.Mock).mockImplementation(() => {
            const readable = new Readable();
            readable.push(csvContent);
            readable.push(null); // No more data
            return readable;
        });
    }

    it('should parse CSV with numeric and string columns', async () => {
        mockFileSystem(mockCsvData);

        const data = await parseCsv();
        expect(data).toEqual([
            { id: 1, name: 'John', age: 25 },
            { id: 2, name: 'Jane', age: 30 },
            { id: 3, name: 'Doe', age: 27 },
        ]);
    });

    it('should parse CSV where all values are strings', async () => {
        mockFileSystem(mockCsvDataAllStrings);

        const data = await parseCsv();
        expect(data).toEqual([
            { id: 'one', name: 'John', age: 'twenty-five' },
            { id: 'two', name: 'Jane', age: 'thirty' },
            { id: 'three', name: 'Doe', age: 'twenty-seven' },
        ]);
    });

    it('should handle CSV with mixed types in columns', async () => {
        mockFileSystem(mockCsvDataMixed);

        const data = await parseCsv();
        expect(data).toEqual([
            { id: '1', name: 'John', age: 25 },
            { id: 'three', name: 'Jane', age: 30 },
            { id: '3', name: 'Doe', age: 27 },
        ]);
    });

    it('should return empty array when CSV file is empty', async () => {
        mockFileSystem('');

        const data = await parseCsv();
        expect(data).toEqual([]);
    });

    it('should throw an error if CSV parsing fails', async () => {
        // Simulate an error from createReadStream
        (fs.createReadStream as jest.Mock).mockImplementation(() => {
            const readable = new Readable();
            readable.emit('error', new Error('Failed to read CSV'));
            return readable;
        });

        await expect(parseCsv()).rejects.toThrow('Failed to read CSV');
    });
});
