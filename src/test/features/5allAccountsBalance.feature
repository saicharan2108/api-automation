Feature: All Accounts Balance

  Scenario: Verify all accounts balance details from API response
    Given I have the necessary API details for all accounts balance
    When I send a request to the all accounts balance API
    Then I should receive a successful response for all accounts balance
    And the response payload should contain the account balance details
