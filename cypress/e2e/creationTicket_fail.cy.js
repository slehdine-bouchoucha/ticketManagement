describe("Ticket Creation", () => {
  it("fails to create a ticket when required fields are empty", () => {
    cy.request("POST", "http://localhost:3000/user/login", {
      email: "riadh@gmail.com",
      password: "123456789",
      otp: "386239",
    }).then((response) => {
      const token = response.body.token;
      const userId = response.body.user._id;

      cy.visit("/createTicket", {
        onBeforeLoad(win) {
          win.localStorage.setItem("token", token);
          win.localStorage.setItem("user_id", userId);
        },
      });

      // Do not fill in any required fields

      cy.get('button[type="submit"]').click();

      cy.contains("Please enter a title").should("be.visible");
      cy.contains("Please select a type").should("be.visible");
      cy.contains("Please enter a description").should("be.visible");
    });
  });
});
