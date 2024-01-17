describe("Ticket Creation", () => {
  it("creates a ticket successfully", () => {
    cy.request("POST", "http://localhost:3000/user/login", {
      email: "riadh@gmail.com",
      password: "123456789",
      otp: "286412",
    }).then((response) => {
      const token = response.body.token;
      const userId = response.body.user._id;

      cy.visit("/createTicket", {
        onBeforeLoad(win) {
          win.localStorage.setItem("token", token);
          win.localStorage.setItem("user_id", userId);
        },
      });

      cy.get('[data-testid="ticket-title"]').type("Example Ticket Title");
      cy.get('[data-testid="ticket-description"]').type(
        "Description of the ticket"
      );

      cy.get('[data-testid="ticket-type"]').click(); // Open the dropdown
      cy.contains("Electricity").click();

      cy.get('button[type="submit"]').click();

      cy.contains("Ticket created successfully").should("be.visible");
    });
  });
});
