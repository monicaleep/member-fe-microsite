describe("Presentations Page", () => {
  it("should load presentations and allow for search", () => {
    cy.visit("/presentations");

    // all should load
    cy.getByTestId("presentation-row").should("have.length", 11);

    // allow for searching by name
    cy.getByTestId("presentation-search").type("transform customized");
    cy.getByTestId("presentation-row").should("have.length", 1);

    // allow for searching by email
    cy.getByTestId("presentation-search").clear();
    cy.getByTestId("presentation-search").type("gmail");
    cy.getByTestId("presentation-row").should("have.length", 6);
  });
});
