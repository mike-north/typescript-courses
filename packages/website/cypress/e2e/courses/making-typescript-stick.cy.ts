/// <reference types="cypress" />

describe('Making typescript stick course page', () => {
  beforeEach(() => {
    cy.visit(
      'http://localhost:8000/course/making-typescript-stick',
    ).waitForRouteChange();
  });

  it('course sections appear', () => {
    cy.get('.course-article__title').should(
      'have.length.above',
      4,
    );
  });

  it('title is present', () => {
    cy.get('h1').should(
      'contain.text',
      'Making TypeScript Stick',
    );
  });
  it('summary is present', () => {
    cy.contains('Tackle a series').should('exist');
  });
  it('logo is present', () => {
    cy.get('main > header > img')
      .should('exist')
      .should('have.attr', 'src', '/making-typescript-stick.png');
  });
  it('clicking on a section works', () => {
    cy.get('.course-article__title')
      .contains('Intro')
      .click();
    cy.waitForRouteChange();
    cy.location('href').should(
      'include',
      'course/making-typescript-stick/01',
    );
    cy.get('h2').should('have.length.above', 1);
  });
});
