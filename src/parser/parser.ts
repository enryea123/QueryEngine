import { createReadStream } from 'fs';
import csv from 'csv-parser';
import { ColumnValue, DataRow, DataType } from '../model/data';

// Function to parse CSV and infer types based on the values in each column
export function parseCsv(): Promise<DataRow[]> {
    const results: DataRow[] = [];

    return new Promise((resolve, reject) => {
        createReadStream('data.csv')
            .pipe(csv())
            .on('data', (row: DataRow) => {
                results.push(row); // Collect rows first
            })
            .on('end', () => {
                // First pass: detect column types
                const columnTypes = detectColumnTypes(results);

                // Second pass: convert values based on detected column types
                const typedResults = results.map((row) => {
                    const typedRow: DataRow = {};
                    Object.keys(row).forEach((column) => {
                        typedRow[column] = parseData(
                            row[column],
                            columnTypes[column]
                        );
                    });
                    return typedRow;
                });

                resolve(typedResults);
            })
            .on('error', (err) => reject(err));
    });
}

// Detect column types between string or number. No other types supported at the moment.
function detectColumnTypes(data: DataRow[]): {
    [key: string]: DataType;
} {
    const columnTypes: { [key: string]: DataType } = {};

    data.forEach((row) => {
        Object.keys(row).forEach((column) => {
            const value = row[column] as string;
            const dataType = getDataType(value);

            // Initialize column type as number if it hasn't been checked yet
            if (!columnTypes[column]) {
                columnTypes[column] = dataType;
            }

            // If a single non-numeric value is found, set the column type to string
            if (dataType === DataType.STRING) {
                columnTypes[column] = DataType.STRING;
            }
        });
    });

    return columnTypes;
}

// Parse into the correct DataType
function parseData(value: ColumnValue, type: DataType) {
    if (type === DataType.NUMBER) {
        return parseInt(value as string, 10);
    } else {
        return value;
    }
}

// Helper function to determine the data type of a field
function getDataType(value: string): DataType {
    return /^\d+$/.test(value) ? DataType.NUMBER : DataType.STRING;
}
