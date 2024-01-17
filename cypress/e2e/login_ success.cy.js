describe("Login", () => {
  it("logs in with valid credentials", () => {
    cy.visit("/login");

    cy.get('input[placeholder="Email"]').type("riadh@gmail.com");
    cy.get('input[placeholder="Password"]').type("123456789");
    cy.get('input[placeholder="OTP Code"]').type("402368");

    cy.get('button[type="submit"]').click();

    cy.url().should("include", "/createTicket");
  });
});
