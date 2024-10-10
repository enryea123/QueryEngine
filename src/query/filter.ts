import { ColumnValue, DataRow, DataType } from '../model/data';
import { QueryFilter, QueryOperator } from '../model/query';

export function shouldKeepRow(
    row: DataRow,
    filter: QueryFilter | null
): boolean {
    if (!filter) {
        return true;
    }

    const value = row[filter.column];
    if (filter.operator === QueryOperator.EQUAL) {
        return isEqualQueryOperator(value, filter.value);
    } else if (filter.operator === QueryOperator.GREATER) {
        return isGreaterQueryOperator(value, filter.value);
    } else if (filter.operator === QueryOperator.SMALLER) {
        return isSmallerQueryOperator(value, filter.value);
    }
    return false;
}

function isEqualQueryOperator(
    columnValue: ColumnValue,
    filterValue: string
): boolean {
    if (typeof columnValue === DataType.NUMBER) {
        return (columnValue as number) === parseInt(filterValue as string, 10);
    } else if (typeof columnValue === DataType.STRING) {
        return (columnValue as string) === filterValue;
    } else {
        throw new Error('Cannot compare values of unsupported types');
    }
}

function isGreaterQueryOperator(
    columnValue: ColumnValue,
    filterValue: string
): boolean {
    if (typeof columnValue === DataType.NUMBER) {
        return (columnValue as number) > parseInt(filterValue as string, 10);
    } else if (typeof columnValue === DataType.STRING) {
        return (columnValue as string) > filterValue; // String lexicographical comparison
    } else {
        throw new Error('Cannot compare values of unsupported types');
    }
}

function isSmallerQueryOperator(
    columnValue: ColumnValue,
    filterValue: string
): boolean {
    if (typeof columnValue === DataType.NUMBER) {
        return (columnValue as number) < parseInt(filterValue as string, 10);
    } else if (typeof columnValue === DataType.STRING) {
        return (columnValue as string) < filterValue; // String lexicographical comparison
    } else {
        throw new Error('Cannot compare values of unsupported types');
    }
}
