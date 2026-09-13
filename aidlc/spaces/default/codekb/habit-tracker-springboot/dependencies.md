# Dependencies

**Repo:** habit-tracker-springboot  
**Scan kind:** partial — this file is the dependency inventory. Stack versions: [technology-stack.md](./technology-stack.md). Components: [component-inventory.md](./component-inventory.md).

## Build

Single module. Parent `org.springframework.boot:spring-boot-starter-parent:3.5.5`. No reactor inter-module edges.

## External (from `pom.xml`)

| Coordinate | Scope | Used for |
|------------|-------|----------|
| `spring-boot-starter-actuator` | compile | Health |
| `spring-boot-starter-web` | compile | REST |
| `spring-boot-starter-validation` | compile | Bean Validation (`@PastOrPresent` on track date) |
| `spring-boot-starter-data-jpa` | compile | Entities / repos |
| `spring-boot-starter-security` | compile | Filter chain |
| `org.postgresql:postgresql` | runtime | Production DB |
| `org.projectlombok:lombok` | provided | Boilerplate |
| `org.springdoc:springdoc-openapi-starter-webmvc-ui:2.8.9` | compile | Swagger |
| `io.jsonwebtoken:jjwt:0.12.6` | compile | JWT |
| `org.flywaydb:flyway-core:11.10.3` | compile | Migrations |
| `org.flywaydb:flyway-database-postgresql:11.10.3` | compile | PG support |
| `spring-boot-starter-test` | test | JUnit / Mockito / Spring Test |
| `spring-security-test` | test | Security test helpers |
| `com.h2database:h2` | test | In-memory DB |

Runtime env (not Maven): `JWT_SECRET`, `CORS_ALLOWED_ORIGINS`, datasource URL/user/password, optional `SCHEDULING_TIMEZONE`.

## Internal edges (issue 14 blast radius)

```
Security Filter Chain → Auth, all JWT controllers
Auth → User Identity
User Identity → Persistence Schema
Check-in → Habit Catalog → User Identity
Check-in → Habit Aggregate → Persistence Schema
Scheduling → Habit Aggregate
Statistics → Habit Aggregate (out of package)
Habit Icons → Persistence Schema (out of package)
```

Timezone work should touch **User Identity**, **Persistence Schema**, **Security Filter Chain** (new route only), and a new controller/service. It must **not** add an edge from User Identity to Scheduling, and must **not** add a write from User Identity to Check-in / `habit_log`.

`UserRepository` today cannot express timezone without a new field and persist usage (seed + update). `HabitLogRepository` stays read/write of dates as stored.

## Sibling systems (context, not this JAR)

- habit-tracker-angular — API consumer; needs server `today`.
- habit-tracker-compose — deploy/orchestration; not scanned here.
