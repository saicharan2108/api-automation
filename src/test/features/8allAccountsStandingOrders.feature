Feature: All Accounts Standing Orders

  Scenario: Retrieve all accounts standing orders
    Given I have the necessary API details for standing orders
    When I send a request to the all accounts standing orders API
    Then I should receive a successful response for all accounts standing orders
    And the response payload should contain the account standing order details
