describe("Presentations Page", () => {
  const presentationId = "7415a027-865c-4112-aff4-f617cc3093d2";
  const presentationDetailUrl = `presentations/${presentationId}`;
  const presentationFavoriteToggle = `favorite-${presentationId}`;
  it("should load presentations and allow for search", () => {
    cy.visit("/presentations");

    // all should load
    cy.getByTestId("presentation-row").should("have.length", 11);

    // allow for searching by name
    cy.getByTestId("presentation-search").type("transform customized");
    cy.getByTestId("presentation-row").should("have.length", 1);

    // allow for searching by email -- this will break
    cy.getByTestId("presentation-search").clear();
    cy.getByTestId("presentation-search").type("gmail");
    cy.getByTestId("presentation-row").should("have.length", 6);
  });

  it("should link to presentation detail page", () => {
    cy.visit("/presentations");

    cy.getByTestId("presentation-search").type("transform customized");
    cy.getByTestId("presentation-row").should("have.length", 1);
    cy.getByTestId("presentation-row").within(()=>{
      cy.get('a').click()
    })
    cy.url().should("include", presentationDetailUrl);
    cy.contains("transform customized e-markets");
  });

  it("should show 404 if linking to unknown presentation page", () => {
    cy.visit("/presentations/foo", { failOnStatusCode: false });
    cy.contains("Presentation not found");
  });

  it("should allow for favoriting/unfavoriting", () => {
    cy.visit("/presentations");
    // initial state is unfavorited
    cy.getByTestId(presentationFavoriteToggle).contains("♡");
    // toggle to be favorited
    cy.getByTestId(presentationFavoriteToggle).click();
    cy.getByTestId(presentationFavoriteToggle).contains("♥️");

    // toggle off
    cy.getByTestId(presentationFavoriteToggle).click();
    cy.getByTestId(presentationFavoriteToggle).contains("♡");
  });

  it("should persist favorites across sessions", () => {
    cy.visit("/presentations");
    // initial state is unfavorited
    cy.getByTestId(presentationFavoriteToggle).contains("♡");
    // toggle to be favorited
    cy.getByTestId(presentationFavoriteToggle).click();
    cy.getByTestId(presentationFavoriteToggle).contains("♥️");

    cy.reload();
    cy.getByTestId(presentationFavoriteToggle).contains("♥️");
  });

  it("should persist favorites across search", () => {
    cy.visit("/presentations");
    // initial state is unfavorited
    cy.getByTestId(presentationFavoriteToggle).contains("♡");
    // toggle to be favorited
    cy.getByTestId(presentationFavoriteToggle).click();
    cy.getByTestId(presentationFavoriteToggle).contains("♥️");

    cy.getByTestId("presentation-search").type("transform customized");
    // ensure search has finished before asserting favorited row
    cy.getByTestId("presentation-row").should("have.length", 1);
    cy.getByTestId(presentationFavoriteToggle).contains("♥️");
  });

  it("should allow for favoriting on list page, favorite persists on detail page", () => {
    cy.visit("/presentations");
    // initial state is unfavorited
    cy.getByTestId(presentationFavoriteToggle).contains("♡");
    // toggle to be favorited
    cy.getByTestId(presentationFavoriteToggle).click();
    cy.getByTestId(presentationFavoriteToggle).contains("♥️");

    // toggle off
    cy.visit(presentationDetailUrl);
    cy.getByTestId(presentationFavoriteToggle).contains("♥️");
  });

  it("should allow for favoriting on detail page, favorite persists on list page", () => {
    cy.visit(presentationDetailUrl);
    cy.getByTestId(presentationFavoriteToggle).contains("♡");
    cy.getByTestId(presentationFavoriteToggle).click();
    cy.getByTestId(presentationFavoriteToggle).contains("♥️");

    // toggle off
    cy.visit("/presentations");
    cy.getByTestId(presentationFavoriteToggle).contains("♥️");
  });

  it("should take favorited ids from session cookie", () => {
    const sessionObj = {
      favorite_presentations: [
        "326fb434-e199-427f-a523-042969cb4a86",
        "7307b163-dcbe-4d12-ad18-43f5b7af1528",
      ],
    };
    const encodedCookie = btoa(JSON.stringify(sessionObj));
    cy.setCookie("session", encodedCookie);
    cy.visit("/presentations");
    // all presentations in session cookie should be favorited
    sessionObj.favorite_presentations.forEach((presentationId) => {
      cy.getByTestId(`favorite-${presentationId}`).contains("♥️");
    });

    // other presentations should not be favorited
    cy.getByTestId(presentationFavoriteToggle).contains("♡");
  });
});
