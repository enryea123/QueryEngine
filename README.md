## How to Run

Install dependencies:

```
npm install
```

Build and run unit tests with:

```
npm run release
```

Execute the program with the example queries defined in `index.ts`:

```
npm run start
```

## Design Decisions and tradeoffs

Overall, in the design I had to sacrifice the extensibility of the code to complete it in 5 hours.
Both in the CSV parsing, query parsing, and running part, there are several possible edge cases that
are not properly handled. I had to keep the code simple in those case to save time.

I've tried to keep separated the data and query definitions, to make it easier to extend the code for
new data types or query operators. However, with more time I could have increased the separation even more,
to avoid touching critical files when making a change in the future.

I've achieved >98% code coverage with unit tests, and I've added other tools like a linter.

### CSV Parser

I've decided to use an external library (`csv-parser`) to parse the CSV data.
This simplified the implementation, but has the drawback of preventing fine-grained control over
the parsing (edge cases).

The chosen library is quite fast, and better than anything I could have implemented myself in a couple hours,
it can convert CSV into JSON at at rate of around 90000 rows per second
([source](https://www.npmjs.com/package/csv-parser)).

In the CSV parser, I need to do 2 passes on the data, to first validate the data type of a column, to prevent
casting to the wrong type the initial entries of a column (e.g. first 3 rows are numerical, but 4th is
alphanumeric). Having the schema beforehand would help speed up this step, by removing the validation step.

### Query Filtering

In the filtering part, I've decided to override the behavior of the given operators (`=`, `>`, `<`), to allow
more control and extensibility in the future. I could have alternatively just compared the results (e.g. `===`),
but for a query engine I feel the operators should have a broader, more robust definition, especially if more
data types that could be added in the future.

Adding new operators (e.g. `!=`) is straightforward. However, adding a sorting operator would
require more time to implement. For the sorting, we could use a built-in `sort` function and use a lambda to
determine the column to use for the sorting, something like: `data.sort((a, b) => (a.col1 < b.col1 ? -1 : 1))`.

### Query Reader

I've decided to create a small parser, from a query string (`PROJECT col1, col2 FILTER col3 > 10`).
The reader is basic and can be broken easily by injesting malformed queries, I didn't have time to make it solid.
Also, the parser only accepts a single filter. It would be easy to extend it to multiple filters, by performing
multiple splits and store them into an array of filters (would also require changes in the runner code).

### Query Runner

For the query runner part, I've decided to use `reduce` to filter out the rows and then extract the projection
in a single pass. This is faster than filtering first, and then having a second pass to extract it.

## Large Datasets Support

Given the time available, I could not optimize the code for large datasets. Data is currently processed
on a simple row by row basis. Below are some possible improvements.

### Indexing

This would allow faster filtering, and could be implemented on frequently queried columns.
Hash-based indexing can be used for equality filters (lookup `O(1)`), or B-Trees for partial
ordering operators (lookup `O(logN)`). For multiple filters we could also consider composite indexes.

### Batching, Parallelization, Caching

Queries could be optimized with batching, for instance allowing to submit multiple queries in parallel,
and store and reuse intermediate results across queries.

Parallelization (multithreading): break down queries into smaller tasks that can be processed independently.

Caching could be used to store in memory common expensive queries (could be done for intermediate results as well).

### Storage

Sharding large datasets could distribute queries across different nodes to run in parallel.

Swap could be used to prevent out of memory issues while running queries on large datasets.

Compress the data, for instance storing it by column, or by encoding numeric data.
