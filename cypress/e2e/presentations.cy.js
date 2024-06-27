describe("Presentations Page", () => {
  it("should load presentations and allow for search", () => {
    cy.visit("/presentations");

    // all should load
    cy.get("[data-testId=presentation-row]").should("have.length", 11);

    // allow for searching by name
    cy.get("[data-testId=presentation-search]").type("transform customized");
    cy.get("[data-testId=presentation-row]").should("have.length", 1);

    // allow for searching by email
    cy.get("[data-testId=presentation-search]").clear();
    cy.get("[data-testId=presentation-search]").type("gmail");
    cy.get("[data-testId=presentation-row]").should("have.length", 6);
  });
});
