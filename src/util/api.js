module.exports.parseQuery = query => {
  // Destructure fields from query._fields and convert it into an array by splitting on ','
  const fields = query._fields ? query._fields.split(',') : undefined;

  // Destructure q from query._q
  const q = query._q;

  // Destructure start from query._start
  const start = query._start;

  // Destructure end from query._end
  const end = query._end;

  // Destructure limit from query._limit
  const limit = query._limit;

  // Destructure page from query._page
  const page = query._page;

  // Destructure sort from query._sort and split it on ',' to convert it into an array
  const sort = query._sort ? query._sort.split(',') : undefined;

  // Destructure order from query._order, split it on ',' and convert it to lowercase
  const order = (query._order ? query._order.split(',') : ['asc']).map(s =>
    s.toLowerCase()
  );

  // Delete all the extracted properties from the query object
  delete query._fields;
  delete query._q;
  delete query._start;
  delete query._end;
  delete query._limit;
  delete query._page;
  delete query._sort;
  delete query._order;

  // If there are any remaining properties in the query object, assign it to the filter variable
  const filter = Object.keys(query).length > 0 ? query : undefined;

  // Return an object containing all the extracted properties
  return {
    fields,
    filter,
    q,
    start,
    end,
    page,
    limit,
    sort,
    order
  };
};

