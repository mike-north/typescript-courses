/// <reference types="cypress" />

describe('TS fundamentals v3 course page', () => {
  beforeEach(() => {
    cy.visit(
      'http://localhost:8000/course/fundamentals-v3',
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
      'TypeScript Fundamentals',
    );
  });
  it('summary is present', () => {
    cy.contains('Learn everything').should('exist');
  });
  it('logo is present', () => {
    cy.get('main > header > img')
      .should('exist')
      .should('have.attr', 'src', '/ts-fundamentals-v3.png');
  });
  it('clicking on a section works', () => {
    cy.get('.course-article__title')
      .contains('Intro')
      .click();
    cy.waitForRouteChange();
    cy.location('href').should(
      'include',
      'course/fundamentals-v3/01',
    );
    cy.get('h2').should('have.length.above', 4);
  });
});
