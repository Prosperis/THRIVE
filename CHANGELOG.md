# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2025-11-15

### Added
- Comprehensive test suite with 56 passing tests
- Integration tests for GraphQL API with authentication
- Unit tests for authentication middleware and routes
- Unit tests for GraphQL resolvers
- Test documentation in `TESTING.md`
- Test scripts: `test:integration`, `test:ui`, `test:coverage`
- Initial project setup with React 19, TypeScript, and modern web stack
- GraphQL API with comprehensive CRUD operations
- Authentication system with JWT tokens
- Supabase integration for database operations
- Job application tracking functionality
- Interview preparation tools
- Document management system
- Analytics and reporting features
- Responsive UI with dark mode support
- Accessibility features (WCAG 2.1 AA compliant)

### Fixed
- **Authentication Tests**: Added tests in `auth-routes.test.ts`
  - Added authentication middleware mocking for token validation
- **GraphQL Resolver Tests**: Added tests in `graphql-resolvers.test.ts`
- **Integration Tests**: Added tests in `api/tests/integration`

### Changed
- Improved test isolation and cleanup procedures
- Enhanced error handling in test environment

### Security
- No security-related changes in this release

### Deprecated
- No deprecations in this release

[Unreleased]: https://github.com/adriandarian/thrive/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/adriandarian/thrive/compare/v0.0.0...v0.1.0