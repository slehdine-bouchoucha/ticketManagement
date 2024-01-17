describe("Ticket Cancellation", () => {
  it("cancels a ticket successfully", () => {
    cy.request("POST", "http://localhost:3000/user/login", {
      email: "riadh@gmail.com",
      password: "123456789",
      otp: "466728",
    }).then((response) => {
      const token = response.body.token;
      const userId = response.body.user._id;

      cy.visit("/ticketList", {
        onBeforeLoad(win) {
          win.localStorage.setItem("token", token);
          win.localStorage.setItem("user_id", userId);
        },
      });

      cy.get(".ant-spin").should("not.exist"); // Ensure the loading spinner is gone

      cy.get('[data-testid="cancel-ticket-popover"]').first().click();

      cy.contains("OK", { timeout: 10000 }).click();

      cy.contains(".ant-tag", "CLOSED").should("be.visible");
    });
  });
});
