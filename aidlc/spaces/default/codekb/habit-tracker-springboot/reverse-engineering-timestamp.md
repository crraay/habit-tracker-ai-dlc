# Reverse Engineering Timestamp — habit-tracker-springboot

| Field | Value |
|-------|--------|
| **Date** | 2026-10-14 |
| **Intent** | 261013-f1-springboot-ci |
| **Repository** | habit-tracker-springboot |
| **Git commit (scan)** | `803c68843c530857a78ac8e792acefc29e46decf` |
| **Synthesis** | Architect focused merge (STALE store): CI/test paths from developer link 1 |

Prior full-repo synthesis (2026-09-14, intent `260914-full-repo-scan`) remains in store prose; this run extends CI, Maven test, and automated test inventory only.

## Scope of Analysis

```yaml
scope_version: 1
kind: partial
intent: 261013-f1-springboot-ci
fingerprint: 2099a82b7f847867af32405392cb4661bfaa845d
analyzed:
  paths:
    - ./.github/workflows/build-image.yml
    - ./.github/workflows/build-and-test.yml
    - ./pom.xml
    - ./src/test/java/
    - ./src/test/resources/application-test.properties
  components:
    - REST API Adapters
    - User Clock Service
    - Persistence Layer
    - Infrastructure Configuration
    - External Systems
shallow:
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
    - ./src/main/
    - ./mvnw
    - ./mvnw.cmd
    - ./.mvn/wrapper/
    - ./LICENSE
    - ./.dockerignore
    - ./.git/
```
