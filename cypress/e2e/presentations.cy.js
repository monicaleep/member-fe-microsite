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

  it("should link to presentation detail page", () => {
    cy.visit("/presentations");

    cy.getByTestId("presentation-search").type("transform customized");
    cy.getByTestId("presentation-row").should("have.length", 1);
    cy.get("a").click();
    cy.url().should(
      "include",
      "/presentations/7415a027-865c-4112-aff4-f617cc3093d2",
    );
    cy.contains("h1", "transform customized e-markets")
  });

  it("should show 404 if linking to unknown presentation page", () => {

    cy.visit("/presentations/foo", {failOnStatusCode: false});
    cy.contains( "Presentation not found")

  })
});
