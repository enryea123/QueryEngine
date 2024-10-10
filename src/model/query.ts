export enum QueryOperator {
    EQUAL = '=',
    GREATER = '>',
}

export interface QueryFilter {
    readonly column: string;
    readonly operator: QueryOperator;
    readonly value: string;
}

export type Projection = string[];

export interface Query {
    readonly projection: Projection;
    readonly filter: QueryFilter | null;
}
