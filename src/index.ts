import { DataRow } from './model/data';
import { parseCsv } from './parser/parser';
import { readQuery } from './query/reader';
import { queryRunner } from './query/runner';

(async () => {
    let data: DataRow[] = [];

    try {
        data = await parseCsv();
    } catch (error) {
        console.error('Error parsing CSV:', error);
    }
    console.log('Parsed data:', data);

    const queries = [
        'PROJECT id, fruit FILTER quantity = "5"',
        'PROJECT fruit FILTER quantity = 5',
        'PROJECT id, fruit FILTER quantity = "five"',
        'PROJECT id, fruit FILTER quantity > "7"',
        'PROJECT id, fruit FILTER quantity > 7',
        'PROJECT id, fruit, year FILTER quantity > 7',
        'PROJECT id, fruit, year FILTER quantity > 77',
        'PROJECT id, fruit, year FILTER quantity < 10',
        'PROJECT id, fruit, year, quantity FILTER id = "222"',
        'PROJECT id, fruit, year, quantity FILTER id = 222',
        'PROJECT id, fruit, year FILTER id = "4bc"',
        'PROJECT id, fruit, year FILTER id = 4bc',
        'PROJECT id, fruit, year FILTER id > 1',
        'PROJECT id, fruit, year FILTER id < 4bc',
        'PROJECT id, fruit, year, quantity',
        'PROJECT id, fruit',
    ];

    for (const query of queries) {
        console.log('\n------');
        console.log('Query:', query);
        const queryResults = queryRunner(data, readQuery(query));
        console.log('Results:', queryResults);
    }
})();
