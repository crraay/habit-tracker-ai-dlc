# Entities — unit `habit-tracker-springboot`

As-built persistence model for U1 (planning reference, intent `260914-full-repo-scan`). Logical types only; maps to JPA/Flyway in `habit-tracker-springboot`.

## Source of truth

```yaml
entities:
  - name: User
    description: Authenticated account; owns habits; supplies IANA timezone for user-relative today.
    attributes:
      - name: id
        type: integer
        required: true
        unique: true
      - name: username
        type: string
        required: true
        unique: true
      - name: password
        type: string
        required: true
        constraints: stored hashed; never exposed on API
      - name: email
        type: string
        required: true
        unique: true
      - name: status
        type: enum
        required: true
        allowed_values: [PENDING_VERIFICATION, ACTIVE, ...]
        defaults: PENDING_VERIFICATION
      - name: role
        type: enum
        required: true
        allowed_values: [USER, ...]
        defaults: USER
      - name: failedLoginAttempts
        type: integer
        required: true
        defaults: 0
      - name: timezone
        type: string
        required: true
        defaults: UTC
        constraints: IANA zone id
      - name: lastLoginAt
        type: datetime
        required: false
      - name: passwordChangedAt
        type: datetime
        required: false
      - name: createdAt
        type: datetime
        required: true
      - name: modifiedAt
        type: datetime
        required: true
      - name: createdBy
        type: string
        required: true
      - name: modifiedBy
        type: string
        required: true
    relationships:
      - target: Habit
        cardinality: one-to-many
        direction: User owns Habit

  - name: Habit
    description: User-scoped tracked behavior with display name and optional catalog icon.
    attributes:
      - name: id
        type: integer
        required: true
        unique: true
      - name: name
        type: string
        required: true
      - name: user
        type: User
        required: true
        references: User
      - name: icon
        type: HabitIcon
        required: false
        references: HabitIcon
      - name: createdAt
        type: datetime
        required: true
      - name: modifiedAt
        type: datetime
        required: true
      - name: createdBy
        type: string
        required: true
      - name: modifiedBy
        type: string
        required: true
    entity_constraints:
      - No lifecycle state, startDate, or schedule fields in as-built schema (gap vs docs/domain.md).
    relationships:
      - target: User
        cardinality: many-to-one
        direction: Habit belongs to User
      - target: HabitIcon
        cardinality: many-to-one
        direction: Habit references catalog icon
      - target: HabitLog
        cardinality: one-to-many
        direction: Habit has check-ins
      - target: HabitAggregate
        cardinality: one-to-one
        direction: Habit has streak aggregate

  - name: HabitLog
    description: Single check-in (done) for a habit on a calendar date.
    attributes:
      - name: id
        type: integer
        required: true
        unique: true
      - name: habit
        type: Habit
        required: true
        references: Habit
      - name: date
        type: date
        required: true
        constraints: unique per (habit, date)
      - name: createdAt
        type: datetime
        required: true
      - name: modifiedAt
        type: datetime
        required: true
      - name: createdBy
        type: string
        required: true
      - name: modifiedBy
        type: string
        required: true
    entity_constraints:
      - Unique (habit_id, date).

  - name: HabitAggregate
    description: Derived streak and completion counters for a habit (1:1 with Habit).
    attributes:
      - name: habitId
        type: integer
        required: true
        unique: true
        references: Habit
      - name: totalCheckIns
        type: integer
        required: true
        defaults: 0
      - name: currentStreak
        type: integer
        required: true
        defaults: 0
      - name: bestStreak
        type: integer
        required: true
        defaults: 0
      - name: lastCheckInDate
        type: date
        required: false
      - name: streakStartDate
        type: date
        required: false
      - name: createdAt
        type: datetime
        required: true
      - name: modifiedAt
        type: datetime
        required: true
      - name: createdBy
        type: string
        required: true
      - name: modifiedBy
        type: string
        required: true
    relationships:
      - target: Habit
        cardinality: one-to-one
        direction: Aggregate extends Habit identity (shared PK)

  - name: HabitIcon
    description: Read-only catalog entry for habit presentation icons.
    attributes:
      - name: id
        type: integer
        required: true
        unique: true
      - name: name
        type: string
        required: true
      - name: description
        type: string
        required: false
      - name: s3Url
        type: string
        required: true
        constraints: max length 500
      - name: isActive
        type: boolean
        required: true
        defaults: true
      - name: createdAt
        type: datetime
        required: true
      - name: modifiedAt
        type: datetime
        required: true
      - name: createdBy
        type: string
        required: true
      - name: modifiedBy
        type: string
        required: true
    relationships:
      - target: Habit
        cardinality: one-to-many
        direction: Icon referenced by habits
```

## Summary

Five core product entities model the as-built backend: **User** (auth + timezone), **Habit** (owned catalog row), **HabitLog** (dated check-in), **HabitAggregate** (streak counters), and **HabitIcon** (shared catalog). Audit columns come from a shared mapped superclass on all entities. Domain-doc lifecycle and scheduling attributes are intentionally absent from **Habit** and documented as backlog gaps, not as persisted fields.
