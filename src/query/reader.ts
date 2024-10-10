import { Projection, Query, QueryFilter, QueryOperator } from '../model/query';

export function readQuery(input: string): Query {
    // Split the input string into parts, only supports one filter
    const [projectPart, filterPart] = input
        .split('FILTER ')
        .map((part) => part.trim());

    // Extract projection columns
    const projection: Projection = projectPart
        .replace('PROJECT ', '')
        .split(',')
        .map((col) => col.trim());

    // Parse the filter part if it exists
    let filter: QueryFilter | null = null;
    if (filterPart) {
        let operator: QueryOperator | undefined;
        // Find the first operator occurrence
        for (const char of filterPart) {
            if (Object.values(QueryOperator).includes(char as QueryOperator)) {
                operator = char as QueryOperator;
                break;
            }
        }

        if (operator === undefined) {
            throw new Error('Operator not found in filter expression');
        }

        // Split by the operator pattern
        const pattern = ' ' + operator + ' ';
        if (filterPart.includes(pattern)) {
            const [column, value] = filterPart.split(pattern);
            filter = {
                column,
                operator,
                value: value.replace(/^['"]|['"]$/g, ''), // Remove surrounding quotes
            };
        }
    }

    return { projection, filter };
}
