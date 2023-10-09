/// <reference types="cypress" />

describe('Intermediate typescript v1 course page', () => {
  beforeEach(() => {
    cy.visit(
      'http://localhost:8000/course/intermediate-v1',
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
      'have.text',
      'Intermediate TypeScript v1',
    );
  });
  it('summary is present', () => {
    cy.contains('Leverage TypeScript').should('exist');
  });
  it('logo is present', () => {
    cy.get('main > header > img')
      .should('exist')
      .should('have.attr', 'src', '/intermediate-ts.png');
  });
  it('clicking on a section works', () => {
    cy.get('.course-article__title')
      .contains('Intro')
      .click();
    cy.waitForRouteChange();
    cy.location('href').should(
      'include',
      'course/intermediate-v1/01',
    );
    cy.get('h2').should('have.length.above', 4);
  });
});
