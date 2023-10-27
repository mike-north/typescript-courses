/// <reference types="cypress" />

describe('enterprise TS v2 course page', () => {
  beforeEach(() => {
    cy.visit(
      'http://localhost:8000/course/enterprise-v2',
    ).waitForRouteChange();
  });

  it('course sections appear', () => {
    cy.get('.course-article__title').should(
      'have.length.above',
      0,
    );
  });

  it('title is present', () => {
    cy.get('h1').should(
      'contain.text',
      'Enterprise-Scale TypeScript v2',
    );
  });
  it('summary is present', () => {
    cy.contains('manage large TypeScript code bases').should('exist');
  });
  it('logo is present', () => {
    cy.get('main > header > img')
      .should('exist')
      .should('have.attr', 'src', '/enterprise-ts-v2.png');
  });
  it('clicking on a section works', () => {
    cy.get('.course-article__title')
      .contains('Intro')
      .click();
    cy.waitForRouteChange();
    cy.location('href').should(
      'include',
      'course/enterprise-v2/01',
    );
    cy.get('h2').should('have.length.above', 1);
  });
});
