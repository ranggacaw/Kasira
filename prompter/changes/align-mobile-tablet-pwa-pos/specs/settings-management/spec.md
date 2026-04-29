## ADDED Requirements
### Requirement: Business Settings
Kasira SHALL provide settings for business identity and locale values used across back-office and receipt surfaces.

#### Scenario: Authorized user updates business settings
- **WHEN** an authorized user saves business name, logo, phone, address, currency, or timezone settings
- **THEN** the application stores the values and makes them available to the affected user-facing surfaces

### Requirement: Receipt and Payment Settings
Kasira SHALL provide settings to configure receipt content and enabled manual payment methods.

#### Scenario: Authorized user updates receipt or payment settings
- **WHEN** an authorized user changes receipt header or footer content, receipt visibility options, or manual payment method toggles
- **THEN** subsequent checkout and receipt flows reflect the saved configuration

### Requirement: PWA Appearance Settings
Kasira SHALL provide settings for the PWA name, short name, theme color, and install assets used by the manifest and splash experience.

#### Scenario: Authorized user updates PWA appearance settings
- **WHEN** an authorized user saves PWA display values or install assets
- **THEN** the next manifest and protected app shell reflect the saved appearance configuration
