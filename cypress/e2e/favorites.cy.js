describe('Favorites Page', ()=>{
    const presentationId = "7415a027-865c-4112-aff4-f617cc3093d2";
    const presentationFavoriteToggle = `favorite-${presentationId}`;
    it("should display no presentations found for favorites if none exist", ()=>{
        cy.visit("/favorites");
        cy.getByTestId("no-favorites").contains('No presentations found')
    })
    it('should display favorites set from the presentation page', ()=>{
        cy.visit("/presentations");
        // initial state is unfavorited
        cy.getByTestId(presentationFavoriteToggle).contains("♡");
        // toggle to be favorited
        cy.getByTestId(presentationFavoriteToggle).click();
        cy.getByTestId(presentationFavoriteToggle).contains("♥️");
        cy.visit('/favorites')
        cy.getByTestId("presentation-row").should("have.length", 1);
        cy.getByTestId(presentationFavoriteToggle).contains("♥️");

    })
})
