const searchPresentations = (query, presentations) => {
  return presentations.filter((pres) => {
    const searchableFields = [pres.name, pres.firstName, pres.lastName];
    return searchableFields.some((field) =>
      field.toLowerCase().includes(query.toLowerCase()),
    );
  });
};

export default searchPresentations;
