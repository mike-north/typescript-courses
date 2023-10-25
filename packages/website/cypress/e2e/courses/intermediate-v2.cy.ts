/// <reference types="cypress" />

describe('intermediate typescript v2 course page', () => {
  beforeEach(() => {
    cy.visit(
      'http://localhost:8000/course/intermediate-v2',
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
      'Intermediate TypeScript v2',
    );
  });
  it('summary is present', () => {
    cy.contains('Leverage TypeScript').should('exist');
  });
  it('logo is present', () => {
    cy.get('main > header > img')
      .should('exist')
      .should('have.attr', 'src', '/intermediate-ts-v2.png');
  });
  it('clicking on a section works', () => {
    cy.get('.course-article__title')
      .contains('Intro')
      .click();
    cy.waitForRouteChange();
    cy.location('href').should(
      'include',
      'course/intermediate-v2/01',
    );
    cy.get('h2').should('have.length.above', 3);
  });
});
