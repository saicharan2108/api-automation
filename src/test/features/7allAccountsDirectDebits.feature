Feature: All Accounts Direct Debits

  Scenario: Retrieve all direct debits for all accounts
    Given I have the necessary API details for direct debits
    When I send a request to the all accounts direct debits API
    Then I should receive a successful direct debits response
    And the response payload should contain the direct debits details
