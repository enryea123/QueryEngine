export enum DataType {
    STRING = 'string',
    NUMBER = 'number',
}

export type ColumnValue = string | number;

export type DataRow = { [key: string]: ColumnValue };
