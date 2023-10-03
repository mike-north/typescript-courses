/// <reference types="cypress" />

describe('full stack typescript course page', () => {
  beforeEach(() => {
    cy.visit(
      'http://localhost:8000/course/full-stack-typescript',
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
      'Full Stack TypeScript',
    );
  });
  it('summary is present', () => {
    cy.contains('Combine TypeScript').should('exist');
  });
  it('logo is present', () => {
    cy.get('main > header > img')
      .should('exist')
      .should('have.attr', 'src', '/full-stack-ts.png');
  });
  it('clicking on a section works', () => {
    cy.get('.course-article__title')
      .contains('Intro')
      .click();
    cy.waitForRouteChange();
    cy.location('href').should(
      'include',
      'course/full-stack-typescript/01',
    );
    cy.get('h2').should('have.length.above', 1);
  });
});
