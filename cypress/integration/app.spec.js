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