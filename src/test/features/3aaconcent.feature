Feature: Consent API Testing

  Scenario: Create account aggregation consent and verify details

    Given I have the generated access token for account aggregation

    When I send a POST request to create an account aggregation consent

    Then I should receive a valid consent URL

    When I navigate to the consent URL

    And I log in and select items for account aggregation

    Then I should verify the consent details for account aggregation
