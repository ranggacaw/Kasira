## ADDED Requirements
### Requirement: PWA Install Flow and Standalone Shell Adaptation
Kasira SHALL expose a clear installable PWA experience for supported mobile and tablet browsers, including install entry points, complete install metadata, and shell spacing that remains usable in standalone display mode.

#### Scenario: Eligible user opens a supported browser
- **WHEN** an authenticated user visits a protected route on a browser that supports PWA installation
- **THEN** the application can surface an install entry point or install guidance without blocking the primary workflow

#### Scenario: User launches the installed app
- **WHEN** a user opens Kasira from the installed PWA icon on a phone or tablet
- **THEN** the application renders in standalone mode with safe-area-aware header, navigation, and action spacing suited to touch interaction
