describe("Login", () => {
  it("fails login with invalid OTP", () => {
    cy.visit("/login");

    cy.get('input[placeholder="Email"]').type("riadh@gmail.com");
    cy.get('input[placeholder="Password"]').type("123456789");
    cy.get('input[placeholder="OTP Code"]').type("555555");

    cy.get('button[type="submit"]').click();

    cy.on("window:alert", (message) => {
      expect(message).to.equal("Otp not valid");
    });
  });
});
