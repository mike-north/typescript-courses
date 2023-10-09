/// <reference types="cypress" />

// Welcome to Cypress!
//
// This spec file contains a variety of sample tests
// for a todo list app that are designed to demonstrate
// the power of writing tests in Cypress.
//
// To learn more about how Cypress works and
// what makes it such an awesome testing tool,
// please read our getting started guide:
// https://on.cypress.io/introduction-to-cypress

describe('course list page', () => {
  beforeEach(() => {
    // Cypress starts out with a blank slate for each test
    // so we must tell it to visit our website with the `cy.visit()` command.
    // Since we want to visit the same URL at the start of all our tests,
    // we include it in our beforeEach function so that it runs before each test
    cy.visit('http://localhost:8000').waitForRouteChange();
  });

  it('displays multiple courses', () => {
    // We use the `cy.get()` command to get all elements that match the selector.
    // Then, we use `should` to assert that there are two matched items,
    // which are the two default items.
    cy.get('.course-summary').should('have.length', 4);

    // We can go even further and check that the default todos each contain
    // the correct text. We use the `first` and `last` functions
    // to get just the first and last matched elements individually,
    // and then perform an assertion with `should`.
    // cy.get('.todo-list li').first().should('have.text', 'Pay electric bill')
    // cy.get('.todo-list li').last().should('have.text', 'Walk the dog')
  });

  it('clicking TS-fundamentals v3 course link visits the course page', () => {
    cy.contains('TypeScript Fundamentals v3').click();
    cy.location('href').should(
      'include',
      'course/fundamentals-v3',
    );
    cy.get('h1').should(
      'have.text',
      'TypeScript Fundamentals v3',
    );
    cy.get('.course-article__title').should(
      'have.length.at.least',
      5,
    );
  });
  it('clicking TS-intermediate v1 course link visits the course page', () => {
    cy.contains('Intermediate TypeScript').click();
    cy.location('href').should(
      'include',
      'course/intermediate-v1',
    );
    cy.get('h1').should(
      'have.text',
      'Intermediate TypeScript v1',
    );
    cy.get('.course-article__title').should(
      'have.length.at.least',
      5,
    );
  });
  it('clicking TS-fullstack v1 course link visits the course page', () => {
    cy.contains('Full Stack TypeScript').click();
    cy.location('href').should(
      'include',
      'course/full-stack-typescript',
    );
    cy.get('h1').should(
      'have.text',
      'Full Stack TypeScript',
    );
    cy.get('.course-article__title').should(
      'have.length.at.least',
      5,
    );
  });
  it('clicking make-TS-stick v1 course link visits the course page', () => {
    cy.contains('Making TypeScript Stick').click();
    cy.location('href').should(
      'include',
      'course/making-typescript-stick',
    );
    cy.get('h1').should(
      'have.text',
      'Making TypeScript Stick',
    );
    cy.get('.course-article__title').should(
      'have.length.at.least',
      5,
    );
  });
});
