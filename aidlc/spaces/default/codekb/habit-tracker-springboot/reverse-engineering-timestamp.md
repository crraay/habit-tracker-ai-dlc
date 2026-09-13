# Reverse Engineering Timestamp

- **Performed:** 2026-09-12
- **Store:** NO_STORE / first scan (this staging set only; not published to shared CodeKB)
- **Repo:** habit-tracker-springboot
- **Branch (workspace HEAD ref):** `main`
- **Commit:** `eaae463e4951a8a84ab31406c7fcd8207af7cddb` (read from `.git/refs/heads/main`; `git` CLI was not available in this run)
- **Intent:** `timezone-today`
- **Kind:** `partial` — developer scan did not cover the whole repo deeply
- **Fingerprint:** `unknown` (mint over analyzed paths was not computable)
- **Source:** developer handoff `inception/reverse-engineering/developer-scan-habit-tracker-springboot.md`

Artifacts in this staging directory (this run only):

1. business-overview.md
2. architecture.md
3. code-structure.md
4. api-documentation.md
5. component-inventory.md
6. technology-stack.md
7. dependencies.md
8. code-quality-assessment.md
9. reverse-engineering-timestamp.md

## Scope of Analysis

```yaml
scope_version: 1
kind: partial
intent: timezone-today
fingerprint: unknown
analyzed:
  paths:
    - docs/
    - pom.xml
    - src/main/resources/application.properties
    - src/main/resources/db/migration/
    - src/test/resources/
    - src/main/java/com/kostya/habittracker/entity/
    - src/main/java/com/kostya/habittracker/controller/
    - src/main/java/com/kostya/habittracker/service/impl/
    - src/main/java/com/kostya/habittracker/repository/
    - src/main/java/com/kostya/habittracker/config/
    - src/main/java/com/kostya/habittracker/scheduled/
    - src/main/java/com/kostya/habittracker/filter/
    - src/main/java/com/kostya/habittracker/model/
    - src/main/java/com/kostya/habittracker/dto/
    - src/main/java/com/kostya/habittracker/exception/
    - src/test/java/com/kostya/habittracker/
    - .github/workflows/build-and-test.yml
    - .local/issue-bodies/01-timezone-today.md
  components:
    - Domain Contract
    - Auth
    - User Identity
    - Habit Catalog
    - Check-in
    - Habit Aggregate
    - Statistics
    - Habit Icons
    - Persistence Schema
    - Scheduling
    - Security Filter Chain
shallow:
  paths:
    - src/main/java/com/kostya/habittracker/mapper/
    - src/main/java/com/kostya/habittracker/aspect/
    - src/main/java/com/kostya/habittracker/annotation/
    - src/main/java/com/kostya/habittracker/security/
    - src/main/java/com/kostya/habittracker/util/
    - src/main/resources/application-dev.properties
    - src/main/resources/logback-spring.xml
    - README.md
    - DOCKER.md
    - AGENTS.md
    - HELP.md
    - .github/workflows/build-image.yml
    - .github/workflows/deploy-to-elastic-beanstalk.yml
    - .local/issue-bodies/
    - .mvn/
```
