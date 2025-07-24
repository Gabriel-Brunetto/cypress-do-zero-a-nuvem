Cypress.Commands.add('fillMandatoryFieldsAndSubmit', (data = {
  firstName: 'Gabs',
  lastName: 'Brunetto',
  email: 'gabibq@yahoo.com.br',
  text: 'Testando...'
}) => {
  cy.get('input[name="firstName"]').type(data.firstName)
  cy.get('input[name="lastName"]').type(data.lastName)
  cy.get('input[type="email"]').type(data.email)
  cy.get('textarea[name="open-text-area"]').type(data.text) //o padrão é 10ms
  cy.contains('button', 'Enviar').click()
})