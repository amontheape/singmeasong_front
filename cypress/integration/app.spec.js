describe("Home Page Tests", () => {
  beforeEach( () => {
    cy.clearDatabase()
  })

  it("should create and list recommendations", () => {
    const recommendations = [
      {name: "Innerbloom", youtubeLink: "https://www.youtube.com/watch?v=Tx9zMFodNtA"},
      {name: "Won't get lost", youtubeLink: "https://www.youtube.com/watch?v=xW0Eorfq-vQ"},
      {name: "Don't you worry child", youtubeLink: "https://www.youtube.com/watch?v=1y6smkh6c-0"}
    ]

    cy.intercept("POST", "/recommendations").as("createRec")
    cy.intercept("GET", "/recommendations").as("getRec")

    cy.visit("http://localhost:3000")

    recommendations.forEach( (rec, i) => {
      cy.get('[data-cy=name]').type(recommendations[i].name)
      cy.get('[data-cy=link]').type(recommendations[i].youtubeLink)
      cy.get('[data-cy=submit]').click()

      cy.wait('@createRec')
      cy.wait('@getRec')
    })

    cy.get('[data-cy=container]').should( ($container) => expect($container).to.have.length(3))
  })
})

describe("Random Page Tests", () => {
  it("should list a single random recommendation", () => {
    cy.intercept("GET", "/recommendations/*").as("getRandom")
    cy.visit("http://localhost:3000/random")

    cy.wait('@getRandom')
    cy.get('[data-cy=container]').should( ($container) => expect($container).to.have.length(1))
  })
})

describe("Top Page Tests", () => {
  it("should list top recommendations ordered by score", () => {
    cy.intercept("POST", "/recommendations/*/upvote").as("upvoteRec")
    cy.intercept("POST", "/recommendations/*/downvote").as("downvoteRec")

    cy.visit("http://localhost:3000/top")

    const upVoteTestNumber = 5
    for ( let i = 0 ; i < upVoteTestNumber; i++ ) {
      cy.get('[data-cy=upvote]').first().click()
      cy.wait('@upvoteRec')
    }

    const downVoteTestNumber = 3
    for ( let i = 0 ; i < downVoteTestNumber; i++ ) {
      cy.get('[data-cy=downvote]').last().click()
      cy.wait('@downvoteRec')
    }

    cy.get('[data-cy=score]').first().should('contain', upVoteTestNumber)
    cy.get('[data-cy=score]').last().should('contain', -downVoteTestNumber)
  })
})
