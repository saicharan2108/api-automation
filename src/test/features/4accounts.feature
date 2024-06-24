Feature: Account API

  Scenario: Verify account details from API response
    Given I have the necessary API details
    When I send a request to the account API
    Then I should receive a successful response
    And the response payload should contain the account details
