import { DataRow } from '../model/data';
import { Query } from '../model/query';
import { shouldKeepRow } from './filter';

export function queryRunner(data: DataRow[], query: Query): DataRow[] {
    return data.reduce((results: DataRow[], row: DataRow) => {
        // Check if the row should be kept based on the filter
        if (shouldKeepRow(row, query.filter)) {
            const projectedRow: DataRow = {};
            // Extract projection
            query.projection.forEach((column) => {
                if (column in row) {
                    projectedRow[column] = row[column];
                }
            });
            // Add the projected row to the results
            results.push(projectedRow);
        }
        return results;
    }, []);
}
