describe("Ticket List Display", () => {
  it("displays user tickets correctly", () => {
    cy.request("POST", "http://localhost:3000/user/login", {
      email: "riadh@gmail.com",
      password: "123456789",
      otp: "556910",
    }).then((response) => {
      const token = response.body.token;
      const userId = response.body.user._id;

      cy.visit("/ticketList", {
        onBeforeLoad(win) {
          win.localStorage.setItem("token", token);
          win.localStorage.setItem("user_id", userId);
        },
      });

      cy.get(".ant-spin").should("not.exist");

      // Check if ticket cards are visible
      cy.get(".ant-card").should("have.length.greaterThan", 0);
    });
  });
});
