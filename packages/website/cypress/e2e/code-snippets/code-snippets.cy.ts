/// <reference types="cypress" />

describe('code snippet interactions', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8000/course/fundamentals-v4/07-interfaces-and-type-aliases/').waitForRouteChange()
  })
  
  it('Code snippet is found', () => {
    // Code snippet found
    cy.get('.post-body > .shiki.twoslash.lsp:nth-child(6)').should('exist').should('contain.text', 'function printAmount')
  })
  
  it('"Popover" tooltips from ^? are present', () => {
    cy.get('.post-body > .shiki.twoslash.lsp:nth-child(6) :nth-child(10) > .popover').should('contain.text', 'currency: string')
  })

  it('Hover tooltips work', () => {
      cy.get('.post-body > .shiki.twoslash.lsp:nth-child(6) data-lsp[lsp="function printAmount(amt: Amount): void"]')
        .should('exist').trigger('mouseover')
      cy.get('#twoslash-mouse-hover-info').should('contain.text', "function printAmount(amt: Amount): void")
    })
    it('Rendered errors work', () => {
        cy.get('.post-body > .shiki.twoslash.lsp:nth-child(15)').should('exist').should('contain.text', 'type Amount')
        cy.get('.post-body > .shiki.twoslash.lsp:nth-child(15) code > span.error:nth-child(2)')
            .should('exist')
            .should('contain.text', 'Duplicate identifier')

    })
    it('Code complete for |^ works', () => {
        cy.get('.post-body > .shiki.twoslash.lsp:nth-child(21)').should('exist').should('contain.text', 'newYearsEve')
        cy.get('.post-body > .shiki.twoslash.lsp:nth-child(21) .inline-completions').should('exist').should('contain.text', 'getDay')
    })
    it('Code highlighting works', () => {
        cy.get('.post-body > .shiki.twoslash.lsp:nth-child(49)').should('exist').should('contain.text', 'jumpToHeight')
        cy.get('.post-body > .shiki.twoslash.lsp:nth-child(49) .highlight').should('exist').should('contain.text', 'string')
    })
})
