/// <reference types="cypress" />

describe('course list page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8000').waitForRouteChange();
  });

  it('displays multiple courses', () => {
    cy.get('.course-summary').should('have.length', 5);
  });

  it('clicking TS-fundamentals v4 course link visits the course page', () => {
    cy.contains('TypeScript Fundamentals v4').click();
    cy.location('href').should(
      'include',
      'course/fundamentals-v4',
    );
    cy.get('h1').should(
      'have.text',
      'TypeScript Fundamentals v4',
    );
    cy.get('.course-article__title').should(
      'have.length.at.least',
      5,
    );
  });
  it('clicking TS-intermediate v2 course link visits the course page', () => {
    cy.contains('Intermediate TypeScript v2').click();
    cy.location('href').should(
      'include',
      'course/intermediate-v2',
    );
    cy.get('h1').should(
      'have.text',
      'Intermediate TypeScript v2',
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
  it('clicking Enterprise-Scale TypeScript v2 course link visits the course page', () => {
    cy.contains('Enterprise-Scale TypeScript').click();
    cy.location('href').should(
      'include',
      'course/enterprise-v2',
    );
    cy.get('h1').should(
      'have.text',
      'Enterprise-Scale TypeScript v2',
    );
    cy.get('.course-article__title').should(
      'have.length.at.least',
      5,
    );
  });
  it('course top nav has the correct courses', () => {
    cy.get('.course-summary:nth-child(2) header h3 a').click();
    cy.get('li.course-tab a').should("contain.text", "TypeScript Fundamentals v4Intermediate TypeScript v2Making TypeScript StickEnterprise-Scale TypeScript v2Full Stack TypeScript");
    cy.get('li.course-tab a').should("have.length", 5);
  });
});
