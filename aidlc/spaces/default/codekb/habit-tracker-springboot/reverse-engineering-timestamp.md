# Reverse Engineering Timestamp — habit-tracker-springboot

| Field | Value |
|-------|--------|
| **Date** | 2026-09-14 |
| **Intent** | 260914-full-repo-scan |
| **Repository** | habit-tracker-springboot |
| **Git commit (HEAD)** | `0785ab0b3b7fb5c408f387b62239d22c7b68729a` |
| **Synthesis** | Architect full rescan from developer handoff only (staging, not published) |

## Scope of Analysis

```yaml
scope_version: 1
kind: full
intent: 260914-full-repo-scan
fingerprint: 5fb048d893308721e8db4846887b756a641a6e05
analyzed:
  paths:
    - ./
    - ./pom.xml
    - ./Dockerfile
    - ./AGENTS.md
    - ./README.md
    - ./DOCKER.md
    - ./docs/domain.md
    - ./src/main/resources/application.properties
    - ./src/main/resources/db/migration/
    - ./src/main/java/com/kostya/habittracker/
    - ./src/test/java/com/kostya/habittracker/
    - ./src/test/resources/application-test.properties
    - ./.github/workflows/build-and-test.yml
    - ./.github/workflows/build-image.yml
    - ./.github/workflows/deploy-to-elastic-beanstalk.yml
    - ./.cursor/rules/habit-domain.mdc
  components:
    - REST API Adapters
    - Authentication Services
    - Security and JWT
    - Habit Management Service
    - Check-in Tracking Service
    - Statistics Service
    - User Clock Service
    - Habit Icon Service
    - Streak and Aggregate Service
    - Persistence Layer
    - Domain Entities
    - Infrastructure Configuration
    - External Systems
shallow:
  paths:
    - ./mvnw
    - ./mvnw.cmd
    - ./.mvn/wrapper/
    - ./LICENSE
    - ./.dockerignore
    - ./.git/
```
