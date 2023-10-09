/// <reference types="cypress" />

describe('course list page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8000').waitForRouteChange();
  });

  it('displays multiple courses', () => {
    cy.get('.course-summary').should('have.length', 4);
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
  it('course top nav has the correct courses', () => {
    cy.get('.course-summary:nth-child(2) header h3 a').click();
    cy.get('li.course-tab a').should("have.length", 4);
    cy.get('li.course-tab a').should("contain.text", "TypeScript Fundamentals v3Intermediate TypeScript v1Making TypeScript StickFull Stack TypeScript");
  });
});
