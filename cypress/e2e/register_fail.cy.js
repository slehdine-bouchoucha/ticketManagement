describe("Registration", () => {
  it("displays error for existing email", () => {
    cy.visit("/register"); // Replace with the correct URL for your registration page

    // Stub the request to simulate an error response for an existing email
    cy.intercept("POST", "/register", (req) => {
      const { email } = req.body;
      if (email === "existing@example.com") {
        req.reply({
          statusCode: 401,
          body: {
            code: 401,
            message: "Email is already taken",
          },
        });
      }
    }).as("registerRequest");

    // Fill out the registration form with data having an existing email
    cy.get('input[placeholder="Username"]').type("JohnDoe");
    cy.get('input[placeholder="Email"]').type("test2@gmail.com");
    cy.get('input[placeholder="Full Name"]').type("John Doe");
    cy.get('input[placeholder="Password"]').type("password123");

    // Submit the form
    cy.get('button[type="submit"]').click();

    // Check if the alert is displayed with the correct error message
    cy.on("window:alert", (message) => {
      expect(message).to.equal("Email is already taken");
    });
  });
});
