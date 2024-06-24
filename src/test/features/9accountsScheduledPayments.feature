Feature: Accounts Scheduled Payments API

  Scenario: Verify accounts scheduled payments details from API response
    Given I have the necessary API details for scheduled payments
    When I send a request to the accounts scheduled payments API
    Then I should receive a successful response for scheduled payments
    And the response payload should contain the scheduled payments details
