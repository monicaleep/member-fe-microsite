const searchPresentations = (query, presentations) => {
  return presentations.filter((pres) => {
    const searchableFields = [pres.topic, pres.presenter];
    return searchableFields.some((field) =>
      field.toLowerCase().includes(query.toLowerCase()),
    );
  });
};

export default searchPresentations;
