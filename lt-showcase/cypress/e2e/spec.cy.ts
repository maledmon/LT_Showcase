describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')
  })

  it('displays loading message while data is loading', () => {
    cy.contains('Loading...').should('be.visible')
  })

  it('displays products after data is loaded', () => {
    cy.wait(2000)
    cy.get('.MuiCard-root').should('have.length.gt', 0)
  })

  it('opens modal when clicking on a product and then closes it', () => {
    cy.wait(2000)
    cy.get('.MuiCard-root').first().click()
    cy.get('.MuiDialog-root').should('be.visible')
    cy.wait(2000)
    cy.get('.DialogCloseButton ').click()
  })

  it('changes the number of results on page depending on what is selected', () => {
    cy.wait(2000)
    cy.get('.MuiCard-root').should('have.length', 10)
    cy.get('#results-per-page-select').click();
    cy.get('.MuiButtonBase-root:nth-child(2)').click();
    cy.wait(1000)
    cy.get('.MuiCard-root').should('have.length', 25)
    cy.get('#results-per-page-select').click();
    cy.get('.MuiButtonBase-root:nth-child(3)').click();
    cy.wait(1000)
    cy.get('.MuiCard-root').should('have.length', 50)
  })

  it('searches and displays 2 results when searching for "test"', () => {
    cy.get('#search-input').click();
    cy.get('#search-input').type('test');
    cy.get('button[aria-label="Search"]').click();
    cy.get('.MuiCard-root').should('have.length', 2)
  })
})