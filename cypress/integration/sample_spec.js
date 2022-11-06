// sample_spec.js created with Cypress
//
// Start writing your Cypress tests below!
// If you're unfamiliar with how Cypress works,
// check out the link below and learn how to write your first test:
// https://on.cypress.io/writing-first-test

// describe("Launch web page", function () {
//   it("should redirect to log in page", function () {
//     cy.visit("http://localhost:8000/");
//   });
// });

// describe("Log in", function () {
//   beforeEach(() => {
//     cy.visit("http://localhost:8000/user/login");
//     cy.get(".ant-form");
//   });
//   it("Enter login credentials", function () {
//     cy.get("#username").type("admin").should("have.value", "admin");
//     cy.get("#password").type("ant.design").should("have.value", "ant.design");
//     cy.get(".ant-form").submit().wait(1000);
//     cy.url().should("include", "Home");
//   });
//   it("Enter incorrect login credentials", function () {
//     cy.get("#username").type("admin").should("have.value", "admin");
//     cy.get("#password").type("wrongpw").should("have.value", "wrongpw");
//     cy.get(".ant-form").submit().wait(1000);
//     cy.url().should("include", "login");
//   });
// });

function goToC4 () {
  cy.get('.ant-select.ant-select-single.ant-select-show-arrow').click()
  cy.get('.ant-select-item-option-content')
    .contains('C4 Worksite')
    .click()
  cy.wait(2000)
}

function goToC4maint () {
  cy.get('.ant-select-selector')
    .eq(1)
    .click()
  cy.get('.ant-select-item-option-content')
    .contains('C4 Worksite')
    .click()
  cy.wait(2000)
}

describe('Direct to Site Page', function () {
  const currentTime = new Date().getTime()
  it('Login', () => {
    cy.visit('http://159.138.89.74:8000/user/login')
    cy.get('.ant-form')
    cy.get('#username')
      .type('admin')
      .should('have.value', 'admin')
    cy.get('#password')
      .type('ant.design')
      .should('have.value', 'ant.design')
    cy.get('.ant-form')
      .submit()
      .wait(1000)
    cy.url().should('include', 'home')
  })

  it('Redirect to site page', function () {
    cy.contains('[class=ant-pro-menu-item-title]', 'Dashboard').click()
    cy.contains('[class=ant-pro-menu-item-title]', 'Site')
      .parent()
      .parent()
      .click()
      .wait(1000)
    cy.url().should('include', 'site')
  })

  it('Check site building', () => {
    cy.wait(2000)
    goToC4()
    cy.get('#root').click(620, 280)
    cy.get('#root').dblclick(620, 280)
    cy.get('.ant-btn.ant-btn-link.ant-btn-icon-only').click()
  })

  it('Delete site building', () => {
    goToC4()
    cy.wait(1000)
    cy.get('#root').click(620, 280)
    cy.get('.ant-btn.ant-btn-default')
      .eq(6)
      .click()
    cy.wait(1000)
    cy.get('[class=ant-modal-footer]')
      .first()
      .children('.ant-btn-primary')
      .click()
    cy.wait(1000)
    cy.get('span').contains('Successfully Deleted Building Shape')
  })

  it('Draw site building', () => {
    cy.get('.ant-btn.ant-btn-button').click()
    cy.wait(1000)
    cy.get('.ant-select-selection-search-input')
      .last()
      .click()
    cy.get('.ant-select-item-option-content')
      .contains('C4 building C')
      .click()
    cy.get('[class=ant-modal-footer]')
      .last()
      .children('.ant-btn-primary')
      .click()
    cy.wait(1000)
    cy.get('#root').click(570, 248)
    cy.get('#root').click(650, 270)
    cy.get('#root').click(640, 315)
    cy.get('#root').click(575, 295)
    cy.get('#root').click(570, 248)
    cy.wait(1000)
    cy.get('span').contains('Successfully Inserted Building Shape')
  })

  /*it(()=>{})
  it(()=>{})
  it(()=>{})
  it(()=>{})*/

  it('Go to maintenance dashboard', () => {
    cy.contains('[class=ant-pro-menu-item-title]', 'Maintenance')
      .parent()
      .parent()
      .click()
      .wait(1000)
    cy.url().should('include', 'maintenance')
    goToC4maint()
  })

  it('Check preset error', () => {
    cy.get('span')
      .contains('Preset')
      .click()
    cy.get('[class=ant-input-number-input-wrap]').clear()
    cy.get('div').contains('Please enter a value!')
  })

  it('Check preset', () => {
    cy.get('[class=ant-input-number-input-wrap]').type('1')
    cy.get('.ant-select-selector')
      .eq(5)
      .click()
    cy.get('div')
      .contains('Month(s)')
      .click()
    cy.wait(1000)
    cy.get('[class=ant-modal-footer]')
      .eq(1)
      .children('.ant-btn-primary')
      .click()
    cy.get('[class=ant-modal-footer]')
      .eq(3)
      .children('.ant-btn-primary')
      .click()
    cy.get('span')
      .contains('Preset')
      .click()
    cy.get('span').contains('Month(s)')
  })

  it('Check Search bar error', () => {
    cy.get('.ant-modal-close-x')
      .eq(1)
      .click()
    cy.get('[class=ant-input]')
      .first()
      .type('{enter}')
    cy.wait(1000)
    cy.get('span').contains('No maintenance is found for this sensor!')
    cy.get('[class=ant-input]')
      .first()
      .type('sensor4')
      .type('{enter}')
    cy.wait(1000)
    cy.get('span').contains('No maintenance is found for this sensor!')
  })

  it('Check Search bar', () => {
    cy.get('[class=ant-input]')
      .first()
      .clear()
      .type('11111C4')
      .type('{enter}')
    cy.wait(1000)
    cy.get('h1').contains('11111C4')
    cy.get('[class=ant-modal-close-x]')
      .last()
      .click()
  })

  it('Check new maintenance error', () => {
    cy.get('span')
      .contains('Schedule', { timeout: 10000 })
      .click()
    cy.get('[class=ant-modal-footer]')
      .eq(2)
      .children('.ant-btn-primary')
      .click()
    cy.get('div').contains('Please enter the Deveui!')
    cy.get('div').contains('Please enter who is reponsible!')
  })

  it('Check new maintenance', () => {
    cy.get('[class=ant-form-item-control-input-content]')
      .eq(7)
      .click()
    cy.get('.ant-select-item-option-content').contains("11111C4").click()
    cy.get('[class=ant-form-item-control-input-content]')
      .eq(8)
      .type('TESTING123')
    cy.get('[class=ant-form-item-control-input-content]')
      .eq(9)
      .type(currentTime)
    cy.get('[class=ant-modal-footer]')
      .eq(2)
      .children('.ant-btn-primary')
      .click()
    cy.wait(1000)
    cy.get('[class=ant-modal-footer]')
      .last()
      .children('.ant-btn-primary')
      .click()
    cy.wait(2500)
    cy.get(
      '.ant-picker-cell-inner.ant-picker-calendar-date.ant-picker-calendar-date-today'
    )
      .children('.ant-picker-calendar-date-content')
      .children('.events')
      .children()
      .children()
      .click()
    cy.wait(2000)
    cy.get('.ant-table-cell').contains(currentTime)
  })
  /*it('Complete maintenance and check',()=>{
    cy.get('.ant-table-cell').contains(currentTime).next().children().children().click()
    cy.get('[class=ant-modal-footer]')
      .last()
      .children('.ant-btn-primary')
      .click()
    cy.get(".ant-modal-close-x").last().click()
  })*/
  it('Reset preset', () => {
    cy.get('.ant-modal-close-x')
      .last()
      .click()
    cy.get('span')
      .contains('Preset')
      .click()
    cy.get('.ant-select-selector')
      .eq(5)
      .click()
    cy.get('div')
      .contains('Day(s)')
      .click()  
    cy.get('[class=ant-input-number-input-wrap]').clear().type('15')
    cy.wait(1000)
    cy.get('[class=ant-modal-footer]')
      .eq(1)
      .children('.ant-btn-primary')
      .click()
    cy.get('[class=ant-modal-footer]')
      .eq(3)
      .children('.ant-btn-primary')
      .click()
    cy.get('span')
      .contains('Preset')
      .click()
    cy.get('span').contains('Day(s)')
  })
})

// describe("Direct to Site Page", function () {
//   beforeEach(() => {
//     cy.visit("http://localhost:8000/user/login");
//     cy.get(".ant-form");
//     cy.get("#username").type("admin").should("have.value", "admin");
//     cy.get("#password").type("ant.design").should("have.value", "ant.design");
//     cy.get(".ant-form").submit().wait(1000);
//     cy.url().should("include", "Home");
//   });

//   it("Redirect to site page", function () {
//     cy.contains("[class=ant-pro-menu-item-title]", "Dashboard").click();
//     cy.contains("[class=ant-pro-menu-item-title]", "Site")
//       .parent()
//       .parent()
//       .click()
//       .wait(1000);
//     cy.url().should("include", "site");
//     it("Change Site Project", function () {
//       cy.get(".ant-select-selector").click();
//     });
//   });
// });

// describe("My First Test", function () {
//   it("FInd element", function () {
//     cy.visit("http://localhost:8000/user/login");
//     cy.contains("type").click();
//     cy.url().should('include', '/commands/action')
//     cy.get('.action-email').type('fake@email.com').should('have.value', 'fake@email.com')
//   });
// });
