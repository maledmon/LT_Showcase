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
})