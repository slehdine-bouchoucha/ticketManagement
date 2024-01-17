describe("Registration", () => {
  it("registers a new user successfully", () => {
    cy.visit("/register");

    cy.get('input[placeholder="Username"]').type("JohnDoe");
    cy.get('input[placeholder="Email"]').type("dali@gmail.com");
    cy.get('input[placeholder="Full Name"]').type("John Doe");
    cy.get('input[placeholder="Password"]').type("password123");

    cy.get('button[type="submit"]').click();

    cy.url().should("include", "/firstLog");
  });
});
