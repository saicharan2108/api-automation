Feature: All Accounts Transactions

  Scenario: Verify all accounts transactions details from API response
    Given I have the necessary API details for all accounts transactions
    When I send a request to the all accounts transactions API
    Then I should receive a successful response for all accounts transactions
    And the response payload should contain the account transactions details
