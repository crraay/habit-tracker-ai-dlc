# Contract Summary — intent `260914-full-repo-scan`

Brownfield **planning-only** intent (FR2). Formal contracts for inter-unit boundaries and the browser-facing API surface, derived from `contract-design-questions.md` (confirmed) and upstream `unit-of-work.md`, `unit-of-work-dependency.md`, `components.md`, `requirements.md`.

**Canonical OpenAPI snapshot (U2):** `habit-tracker-angular/swagger/api-docs.json` (OpenAPI 3.1). **Semantic owner (U1):** Spring Boot controllers in `habit-tracker-springboot`. Regenerate SPA client with `npm run generate-api` after snapshot updates.

## Sources

- `inception/units-generation/unit-of-work.md` — unit boundaries U1/U2/U3
- `inception/units-generation/unit-of-work-dependency.md` — DAG and integration table
- `inception/domain-design/components.md` — logical components and REST ownership
- `inception/domain-design/decisions.md` — ADR-005 OpenAPI client adapter
- `inception/requirements-analysis/requirements.md` — FR1.1 as-built API catalogue scope
- `habit-tracker-springboot/src/main/java/com/kostya/habittracker/config/WebSecurityConfig.java` — public vs authenticated routes
- `habit-tracker-angular/nginx.conf` — production `/api/` reverse proxy to backend

## Contracts overview

| # | Provider Unit | Consumer | Mechanism | Owner |
|---|---------------|----------|-----------|-------|
| C1 | `u1-habit-tracker-springboot` | `u2-habit-tracker-angular` | Sync HTTPS REST + Bearer JWT; OpenAPI 3.1 path groups below | U1 owns API semantics; U2 owns checked-in OpenAPI snapshot |
| C1-ext | `u1-habit-tracker-springboot` | External: browser (U2) | Same REST as C1; SPA calls same-origin `/api/*` via nginx | U1 + U2 (CORS/proxy) |
| C2 | `u1-habit-tracker-springboot` (image build) | `u3-habit-tracker-compose` | Docker image `docker.io/crraay/habit-tracker-springboot:latest` | U1 CI publishes; U3 documents pull/deploy |
| C3 | `u2-habit-tracker-angular` (image build) | `u3-habit-tracker-compose` | Docker image `docker.io/crraay/habit-tracker-angular:latest` | U2 CI publishes; U3 documents pull/deploy |

PostgreSQL is **external** to all units (U1 runtime dependency only). No async/event contracts.

## C1 — REST + JWT (U2 → U1)

### Public routes (no Bearer token)

Per `WebSecurityConfig`, these paths are **permitAll** (JWT not required):

| Pattern | Purpose |
|---------|---------|
| `/api/auth/**` | Login (`POST /api/auth/login`) |
| `/actuator/health` | Backend health (compose wiring) |
| `/swagger-ui/**`, `/v3/api-docs/**` | Springdoc (dev/ops; not used by SPA in prod) |

All other `/api/*` routes require `Authorization: Bearer <JWT>`, including `GET /api/habit-icons`.

### Authentication behaviour

- **Login:** `POST /api/auth/login` with `LoginRequest` → `LoginResponse` (`token`, `tokenExpiresIn` seconds).
- **Protected calls:** SPA attaches Bearer JWT (generated client + interceptors).
- **401:** JSON via `RestAuthenticationEntryPoint`; SPA auth interceptors clear session and route to login.
- **No refresh token** in as-built product.

### Error, timeout, and retry

- **Errors:** `GlobalExceptionHandler` returns `ErrorResponse` JSON (`status`, `error`, `message`, `path`, `correlationId`, `timestamp`).
- **SPA:** User-visible mutation errors follow Settings timezone save pattern; no global automatic HTTP retry policy.
- **Timeouts:** Browser `HttpClient` defaults apply unless a feature overrides.

### Versioning

- **Paths:** Unversioned `/api/*` (no `/api/v1` prefix in as-built code).
- **Breaking changes:** Require coordinated U1 + U2 release (update snapshot + regenerate client + aligned image tags).
- **Additive changes:** New JSON fields allowed when clients ignore unknown properties.

### OpenAPI path groups (excerpted from snapshot)

Excerpts mirror `habit-tracker-angular/swagger/api-docs.json`.

### C1 — Authentication (public login + JWT scheme)

```yaml
openapi: 3.1.0
info:
  title: OpenAPI definition
  version: v0
  description: Excerpt from habit-tracker-angular/swagger/api-docs.json — C1 — Authentication (public login + JWT scheme)
servers:
  - url: http://localhost:8080
    description: Generated server url
paths:
  /api/auth/login:
    post:
      tags:
        - auth
      operationId: login
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/LoginRequest'
        required: true
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/LoginResponse'
        '400':
          description: Bad Request
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '401':
          description: Unauthorized
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '403':
          description: Forbidden
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '404':
          description: Not Found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '409':
          description: Conflict
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '500':
          description: Internal Server Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
components:
  securitySchemes:
    bearerAuth:
      type: http
      name: bearerAuth
      scheme: bearer
      bearerFormat: JWT
  schemas:
    ErrorResponse:
      type: object
      properties:
        status:
          type: integer
          format: int32
        error:
          type: string
        message:
          type: string
        path:
          type: string
        correlationId:
          type: string
        timestamp:
          type: string
          format: date-time
    LoginRequest:
      type: object
      properties:
        username:
          type: string
          maxLength: 100
          minLength: 0
        password:
          type: string
          maxLength: 100
          minLength: 0
      required:
        - password
        - username
    LoginResponse:
      type: object
      properties:
        token:
          type: string
        tokenExpiresIn:
          type: integer
          format: int32
```

### C1 — User clock (`/api/me`)

```yaml
openapi: 3.1.0
info:
  title: OpenAPI definition
  version: v0
  description: Excerpt from habit-tracker-angular/swagger/api-docs.json — C1 — User clock (`/api/me`)
servers:
  - url: http://localhost:8080
    description: Generated server url
paths:
  /api/me:
    get:
      tags:
        - user-clock
      operationId: getMe
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserClockResponse'
        '400':
          description: Bad Request
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '401':
          description: Unauthorized
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '403':
          description: Forbidden
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '404':
          description: Not Found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '409':
          description: Conflict
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '500':
          description: Internal Server Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
    patch:
      tags:
        - user-clock
      operationId: updateMe
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UpdateTimezoneRequest'
        required: true
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserClockResponse'
        '400':
          description: Bad Request
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '401':
          description: Unauthorized
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '403':
          description: Forbidden
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '404':
          description: Not Found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '409':
          description: Conflict
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '500':
          description: Internal Server Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
components:
  securitySchemes:
    bearerAuth:
      type: http
      name: bearerAuth
      scheme: bearer
      bearerFormat: JWT
  schemas:
    ErrorResponse:
      type: object
      properties:
        status:
          type: integer
          format: int32
        error:
          type: string
        message:
          type: string
        path:
          type: string
        correlationId:
          type: string
        timestamp:
          type: string
          format: date-time
    UpdateTimezoneRequest:
      type: object
      properties:
        timezone:
          type: string
          maxLength: 64
          minLength: 0
      required:
        - timezone
    UserClockResponse:
      type: object
      properties:
        timezone:
          type: string
        today:
          type: string
          format: date
security:
  - bearerAuth: []
```

### C1 — Habit management

```yaml
openapi: 3.1.0
info:
  title: OpenAPI definition
  version: v0
  description: Excerpt from habit-tracker-angular/swagger/api-docs.json — C1 — Habit management
servers:
  - url: http://localhost:8080
    description: Generated server url
paths:
  /api/habit:
    get:
      tags:
        - habit-mgmt
      operationId: getHabits
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/HabitDTO'
        '400':
          description: Bad Request
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '401':
          description: Unauthorized
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '403':
          description: Forbidden
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '404':
          description: Not Found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '409':
          description: Conflict
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '500':
          description: Internal Server Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
    post:
      tags:
        - habit-mgmt
      operationId: createHabit
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/HabitDTO'
        required: true
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/HabitDTO'
        '400':
          description: Bad Request
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '401':
          description: Unauthorized
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '403':
          description: Forbidden
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '404':
          description: Not Found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '409':
          description: Conflict
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '500':
          description: Internal Server Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
  /api/habit/{id}:
    get:
      tags:
        - habit-mgmt
      operationId: getHabit
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
            format: int32
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/HabitDTO'
        '400':
          description: Bad Request
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '401':
          description: Unauthorized
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '403':
          description: Forbidden
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '404':
          description: Not Found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '409':
          description: Conflict
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '500':
          description: Internal Server Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
    put:
      tags:
        - habit-mgmt
      operationId: updateHabit
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
            format: int32
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/HabitDTO'
        required: true
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/HabitDTO'
        '400':
          description: Bad Request
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '401':
          description: Unauthorized
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '403':
          description: Forbidden
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '404':
          description: Not Found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '409':
          description: Conflict
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '500':
          description: Internal Server Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
    delete:
      tags:
        - habit-mgmt
      operationId: deleteHabit
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
            format: int32
      responses:
        '200':
          description: OK
        '400':
          description: Bad Request
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '401':
          description: Unauthorized
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '403':
          description: Forbidden
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '404':
          description: Not Found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '409':
          description: Conflict
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '500':
          description: Internal Server Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
components:
  securitySchemes:
    bearerAuth:
      type: http
      name: bearerAuth
      scheme: bearer
      bearerFormat: JWT
  schemas:
    ErrorResponse:
      type: object
      properties:
        status:
          type: integer
          format: int32
        error:
          type: string
        message:
          type: string
        path:
          type: string
        correlationId:
          type: string
        timestamp:
          type: string
          format: date-time
    HabitAggregateResponse:
      type: object
      properties:
        totalCheckIns:
          type: integer
          format: int32
        currentStreak:
          type: integer
          format: int32
        bestStreak:
          type: integer
          format: int32
        streakStartDate:
          type: string
          format: date
        lastCheckInDate:
          type: string
          format: date
    HabitDTO:
      type: object
      properties:
        id:
          type: integer
          format: int32
        name:
          type: string
          maxLength: 100
          minLength: 0
        aggregate:
          $ref: '#/components/schemas/HabitAggregateResponse'
        iconId:
          type: integer
          format: int32
        iconUrl:
          type: string
      required:
        - name
security:
  - bearerAuth: []
```

### C1 — Check-in / track board

```yaml
openapi: 3.1.0
info:
  title: OpenAPI definition
  version: v0
  description: Excerpt from habit-tracker-angular/swagger/api-docs.json — C1 — Check-in / track board
servers:
  - url: http://localhost:8080
    description: Generated server url
paths:
  /api/habit-track:
    post:
      tags:
        - habit-track
      operationId: trackHabit
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/HabitTrackRequest'
        required: true
      responses:
        '200':
          description: OK
        '400':
          description: Bad Request
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '401':
          description: Unauthorized
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '403':
          description: Forbidden
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '404':
          description: Not Found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '409':
          description: Conflict
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '500':
          description: Internal Server Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
    delete:
      tags:
        - habit-track
      operationId: untrackHabit
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/HabitTrackRequest'
        required: true
      responses:
        '200':
          description: OK
        '400':
          description: Bad Request
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '401':
          description: Unauthorized
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '403':
          description: Forbidden
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '404':
          description: Not Found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '409':
          description: Conflict
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '500':
          description: Internal Server Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
  /api/habit-track/{date}:
    get:
      tags:
        - habit-track
      operationId: getTrackingList
      parameters:
        - name: date
          in: path
          required: true
          schema:
            type: string
            format: date
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/HabitTrackResponse'
        '400':
          description: Bad Request
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '401':
          description: Unauthorized
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '403':
          description: Forbidden
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '404':
          description: Not Found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '409':
          description: Conflict
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '500':
          description: Internal Server Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
components:
  securitySchemes:
    bearerAuth:
      type: http
      name: bearerAuth
      scheme: bearer
      bearerFormat: JWT
  schemas:
    ErrorResponse:
      type: object
      properties:
        status:
          type: integer
          format: int32
        error:
          type: string
        message:
          type: string
        path:
          type: string
        correlationId:
          type: string
        timestamp:
          type: string
          format: date-time
    HabitAggregateResponse:
      type: object
      properties:
        totalCheckIns:
          type: integer
          format: int32
        currentStreak:
          type: integer
          format: int32
        bestStreak:
          type: integer
          format: int32
        streakStartDate:
          type: string
          format: date
        lastCheckInDate:
          type: string
          format: date
    HabitTrackRequest:
      type: object
      properties:
        habitId:
          type: integer
          format: int32
        date:
          type: string
          format: date
      required:
        - date
        - habitId
    HabitTrackResponse:
      type: object
      properties:
        habitId:
          type: integer
          format: int32
        habitName:
          type: string
        aggregate:
          $ref: '#/components/schemas/HabitAggregateResponse'
        iconUrl:
          type: string
        status:
          type: boolean
security:
  - bearerAuth: []
```

### C1 — Statistics range

```yaml
openapi: 3.1.0
info:
  title: OpenAPI definition
  version: v0
  description: Excerpt from habit-tracker-angular/swagger/api-docs.json — C1 — Statistics range
servers:
  - url: http://localhost:8080
    description: Generated server url
paths:
  /api/statistics/{startDate}/{endDate}:
    get:
      tags:
        - habit-statistics
      operationId: getAggregatedData
      parameters:
        - name: startDate
          in: path
          required: true
          schema:
            type: string
            format: date
        - name: endDate
          in: path
          required: true
          schema:
            type: string
            format: date
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/HabitStatResponse'
        '400':
          description: Bad Request
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '401':
          description: Unauthorized
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '403':
          description: Forbidden
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '404':
          description: Not Found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '409':
          description: Conflict
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '500':
          description: Internal Server Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
components:
  securitySchemes:
    bearerAuth:
      type: http
      name: bearerAuth
      scheme: bearer
      bearerFormat: JWT
  schemas:
    ErrorResponse:
      type: object
      properties:
        status:
          type: integer
          format: int32
        error:
          type: string
        message:
          type: string
        path:
          type: string
        correlationId:
          type: string
        timestamp:
          type: string
          format: date-time
    HabitAggregateResponse:
      type: object
      properties:
        totalCheckIns:
          type: integer
          format: int32
        currentStreak:
          type: integer
          format: int32
        bestStreak:
          type: integer
          format: int32
        streakStartDate:
          type: string
          format: date
        lastCheckInDate:
          type: string
          format: date
    HabitStatResponse:
      type: object
      properties:
        habitId:
          type: integer
          format: int32
        habitName:
          type: string
        done:
          type: integer
          format: int32
        of:
          type: integer
          format: int32
        aggregate:
          $ref: '#/components/schemas/HabitAggregateResponse'
        iconUrl:
          type: string
security:
  - bearerAuth: []
```

### C1 — Habit icon catalog (JWT required)

```yaml
openapi: 3.1.0
info:
  title: OpenAPI definition
  version: v0
  description: Excerpt from habit-tracker-angular/swagger/api-docs.json — C1 — Habit icon catalog (JWT required)
servers:
  - url: http://localhost:8080
    description: Generated server url
paths:
  /api/habit-icons:
    get:
      tags:
        - habit-icons
      operationId: getAll
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/HabitIconDTO'
        '400':
          description: Bad Request
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '401':
          description: Unauthorized
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '403':
          description: Forbidden
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '404':
          description: Not Found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '409':
          description: Conflict
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '500':
          description: Internal Server Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
components:
  securitySchemes:
    bearerAuth:
      type: http
      name: bearerAuth
      scheme: bearer
      bearerFormat: JWT
  schemas:
    ErrorResponse:
      type: object
      properties:
        status:
          type: integer
          format: int32
        error:
          type: string
        message:
          type: string
        path:
          type: string
        correlationId:
          type: string
        timestamp:
          type: string
          format: date-time
    HabitIconDTO:
      type: object
      properties:
        id:
          type: integer
          format: int32
        name:
          type: string
        description:
          type: string
        s3Url:
          type: string
        isActive:
          type: boolean
security:
  - bearerAuth: []
```

## C2/C3 — U3 packaging contract (images + runtime env)

U3 does not call HTTP APIs; it consumes **built images** and host **environment** from `habit-tracker-compose`.

### Compose topology (as-built)

| Service | Image | Notes |
|---------|-------|-------|
| `postgres` | `postgres:16-alpine` | Named volume `habit-tracker-springboot_postgres_data` |
| `backend` | `docker.io/crraay/habit-tracker-springboot:latest` | Waits for Postgres healthy; port 8080 on Compose network |
| `frontend` | `docker.io/crraay/habit-tracker-angular:latest` | Host port **80**; proxies `/api/` → `http://backend:8080` |

Deploy: manual `workflow_dispatch` on compose GHA → SSH `git pull` → `scripts/deploy-service.sh`.

### Runtime environment (`shared-schema`)

Logical grouping of flat keys from `habit-tracker-compose/.env.example` (not nested YAML on disk).

```yaml
# habit-tracker-compose/.env.example — host .env contract (never commit real secrets)
postgres:
  POSTGRES_DB: habit_tracker
  POSTGRES_USER: required
  POSTGRES_PASSWORD: required
backend:
  JWT_SECRET: required
  CORS_ALLOWED_ORIGINS: required
  SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/habit_tracker
  SPRING_DATASOURCE_USERNAME: from POSTGRES_USER
  SPRING_DATASOURCE_PASSWORD: from POSTGRES_PASSWORD
frontend:
  # SPA in image; API base is same-origin /api via nginx
images:
  backend: docker.io/crraay/habit-tracker-springboot:latest
  frontend: docker.io/crraay/habit-tracker-angular:latest
```

## Contract ownership rules

| Contract | Spec owner | Change process |
|----------|------------|----------------|
| C1 REST semantics | **U1** | Controller/DTO change → export/sync OpenAPI snapshot → U2 `npm run generate-api` → tests green on `main` before `build-image` |
| C1 OpenAPI snapshot | **U2** | `habit-tracker-angular/swagger/api-docs.json`; never hand-edit `src/app/web-api/` |
| C1-ext browser access | **U1 + U2** | CORS on backend; nginx proxy in frontend image; compose `CORS_ALLOWED_ORIGINS` |
| C2/C3 images & env | **U3** docs; **U1/U2** publish | Docker Hub `:latest`; rollback manual |

**Breaking changes:** Require explicit agreement in a follow-up intent. **Additive JSON:** Consumers ignore unknown fields.

## Open questions

| Contract | Question | Blocks |
|----------|----------|--------|
| C1 REST | Domain-doc vs as-built gaps (lifecycle, check-in window, streak scheduler) — OpenAPI does not encode domain law | Follow-up intents (US2.x) |
| C1 REST | OpenAPI `info.version` is `v0` — no semver discipline in repo | Future governance intent |
| C1-ext | Third-party API consumers undefined | None today |
| C2/C3 | Rollout SLAs not codified in compose | Operation hardening |

## Assumptions & Open Questions

Planning scope is **as-built only** (Q1-A). Deferred contract topics are listed in **Open questions** above; no extra assumptions beyond the open questions table.

