---
title: "Value Objects"
order: 4
date: "2025-06-10T09:00:00.000Z"
description: "Implementing value objects, immutability, and equality in TypeScript."
course: domain-modeling-with-ts
---


# Value Objects in Domain-Driven Design (DDD)

## What are Value Objects?

A **Value Object** is a fundamental building block in Domain-Driven Design (DDD). Value objects represent descriptive aspects of the domain that do not possess a unique identity. Instead, they are defined entirely by their attributes. If two value objects have the same attribute values, they are considered equal.

**Core characteristics:**
- **Immutability:** Once created, a value object cannot be changed.
- **Equality by value:** Two value objects are equal if all their properties are equal.
- **No identity:** Value objects do not have a unique identifier.
- **Self-validation:** Value objects should always be in a valid state.

## Conceptual Example: Email Address as a Value Object

Consider an **Email Address** in your domain. You don't care about the identity of an email address object—only its value matters. If two users have the same email address, they are considered to have the same email, regardless of which object instance represents it.

- An email address should always be valid (e.g., must contain an `@` and a domain).
- Two email addresses with the same value are considered equal.
- Once created, the value should not change.

## Manifesting the Concept as Code

Let's implement a basic `EmailAddress` value object in TypeScript:

```ts twoslash
export class EmailAddress {
  private readonly value: string

  constructor(value: string) {
    if (!EmailAddress.isValid(value)) {
      throw new Error(`Invalid email address: ${value}`)
    }
    this.value = value
  }

  static isValid(value: string): boolean {
    // Simple regex for demonstration; use a better one in production
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)
  }

  equals(other: EmailAddress): boolean {
    return this.value === other.value
  }

  toString(): string {
    return this.value
  }
}
/// ---cut---
const email1 = new EmailAddress("alice@example.com")
const email2 = new EmailAddress("alice@example.com")
const email3 = new EmailAddress("bob@example.com")

email1.equals(email2) // true
email1.equals(email3) // false
```

## Standardizing Equality: The Comparable Interface

To ensure all value objects in your domain have a consistent way to check equality, introduce a `Comparable<T>` interface:

```ts twoslash
export interface Comparable<T> {
  equals(other: T): boolean
}
/// ---cut---
export class EmailAddress implements Comparable<EmailAddress> {
  private readonly value: string

  constructor(value: string) {
    if (!EmailAddress.isValid(value)) {
      throw new Error(`Invalid email address: ${value}`)
    }
    this.value = value
  }

  static isValid(value: string): boolean {
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)
  }

  equals(other: EmailAddress): boolean {
    return this.value === other.value
  }

  toString(): string {
    return this.value
  }
}
```

**Why?**
- This interface provides a standard contract for value-based equality.
- It makes your code more discoverable and type-safe.

## Advanced: Generic Value Object for Type-Safe Equality

For even stronger type safety, you can make your value object generic over the value provided in the constructor. This means TypeScript will surface a type error if you try to compare value objects with different literal types.

```ts twoslash
export interface Comparable<T> {
  equals(other: T): boolean
}
/// ---cut---
export class EmailAddress<S extends string> implements Comparable<EmailAddress<S>> {
  private readonly value: S

  constructor(value: S) {
    if (!EmailAddress.isValid(value)) {
      throw new Error(`Invalid email address: ${value}`)
    }
    this.value = value
  }

  static isValid(value: string): boolean {
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)
  }

  equals(other: EmailAddress<S>): boolean {
    return this.value === other.value
  }

  toString(): S {
    return this.value
  }
}
/// ---cut---
// @errors: 2345
const email1 = new EmailAddress("alice@example.com")
const email2 = new EmailAddress("alice@example.com")
const email3 = new EmailAddress("bob@example.com")

email1.equals(email2) // true
email1.equals(email3) // false
// Type error if you try to compare EmailAddress<"alice@example.com"> with EmailAddress<"bob@example.com">
```



**Benefits:**
- The class is now generic over `S extends string`, so each instance is tied to a specific string literal type.
- TypeScript enforces that only addresses of the same literal type can be compared for equality, surfacing a type error otherwise.

---

This progression shows how you can start with a conceptual value object, implement it in code, standardize equality, and then leverage TypeScript's type system for even greater safety in your domain model.

## Why Use Value Objects?

- **Expressiveness:** Encapsulate domain concepts and business rules.
- **Safety:** Prevent invalid states and reduce bugs from primitive obsession.
- **Reusability:** Can be reused across the domain.
- **Testability:** Easier to test than entities with identity.

## Implementing Value Objects in TypeScript

Let's look at how to model a value object in TypeScript. We'll use an `EmailAddress` as an example.

## Step-by-Step: Evolving a Value Object for Email Addresses

### 1. Basic EmailAddress Class

Let's start with a simple value object for email addresses:

```ts twoslash
export class EmailAddress {
  private readonly value: string

  constructor(value: string) {
    if (!EmailAddress.isValid(value)) {
      throw new Error(`Invalid email address: ${value}`)
    }
    this.value = value
  }

  static isValid(value: string): boolean {
    // Simple regex for demonstration; use a better one in production
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)
  }

  equals(other: EmailAddress): boolean {
    return this.value === other.value
  }

  toString(): string {
    return this.value
  }
}
/// ---cut---
const email1 = new EmailAddress("alice@example.com")
const email2 = new EmailAddress("alice@example.com")
const email3 = new EmailAddress("bob@example.com")

email1.equals(email2) // true
email1.equals(email3) // false
```

**Explanation:**
- This class encapsulates an email string, validates it, and provides value-based equality.

---

### 2. Standardizing Equality with Comparable<T>

To formalize equality checks, let's introduce a `Comparable<T>` interface and implement it in `EmailAddress`:

```ts twoslash
export interface Comparable<T> {
  equals(other: T): boolean
}
/// ---cut---
export class EmailAddress implements Comparable<EmailAddress> {
  private readonly value: string

  constructor(value: string) {
    if (!EmailAddress.isValid(value)) {
      throw new Error(`Invalid email address: ${value}`)
    }
    this.value = value
  }

  static isValid(value: string): boolean {
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)
  }

  equals(other: EmailAddress): boolean {
    return this.value === other.value
  }

  toString(): string {
    return this.value
  }
}
/// ---cut---
const email1 = new EmailAddress("alice@example.com")
const email2 = new EmailAddress("alice@example.com")
const email3 = new EmailAddress("bob@example.com")

email1.equals(email2) // true
email1.equals(email3) // false
```

**Explanation:**
- The `Comparable<T>` interface provides a standard contract for value-based equality.
- `EmailAddress` now explicitly implements this contract.

---

### 3. Making EmailAddress Generic Over S extends string

For even stronger type safety, we can make `EmailAddress` generic over a string literal type. This means that equality checks will only work for addresses of the same literal type, and TypeScript will surface a type error if you try to compare different literal types.

```ts twoslash
export interface Comparable<T> {
  equals(other: T): boolean
}
/// ---cut---
export class EmailAddress<S extends string> implements Comparable<EmailAddress<S>> {
  private readonly value: S

  constructor(value: S) {
    if (!EmailAddress.isValid(value)) {
      throw new Error(`Invalid email address: ${value}`)
    }
    this.value = value
  }

  static isValid(value: string): boolean {
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)
  }

  equals(other: EmailAddress<S>): boolean {
    return this.value === other.value
  }

  toString(): S {
    return this.value
  }
}
/// ---cut---
// @errors: 2345
const email1 = new EmailAddress("alice@example.com")
const email2 = new EmailAddress("alice@example.com")
const email3 = new EmailAddress("bob@example.com")

email1.equals(email2) // true
email1.equals(email3) // false

// Type error if you try to compare EmailAddress<"alice@example.com"> with EmailAddress<"bob@example.com">
```

**Explanation:**
- The class is now generic over `S extends string`, so each instance is tied to a specific string literal type.
- TypeScript will enforce that only addresses of the same literal type can be compared for equality, surfacing a type error otherwise.

---

This progression shows how you can start with a simple value object and evolve it for greater type safety and standardization in your domain model.

## Immutability and Equality

Immutability is crucial for value objects. In TypeScript, you can enforce this by:

- Using `readonly` properties
- Avoiding setters or mutating methods
- Returning new instances for any transformation

Equality should always be based on the value, not reference.

### Introducing a `Comparable<T>` Interface

To formalize equality checks for value objects, you can define a `Comparable<T>` interface. This ensures a consistent contract for value-based equality across your value objects.

```ts twoslash
// Comparable.ts
export interface Comparable<T> {
  equals(other: T): boolean
}
```

Now, let's update our `EmailAddress` value object to implement this interface:

```ts twoslash
export interface Comparable<T> {
  equals(other: T): boolean
}
/// ---cut---

export class EmailAddress<S extends string>
  implements Comparable<EmailAddress<S>>
{
  private readonly value: S

  static isValid(value: string): boolean {
    // Simple regex for demonstration; use a better one in production
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)
  }

  constructor(value: S) {
    if (!EmailAddress.isValid(value)) {
      throw new Error(`Invalid email address: ${value}`)
    }
    this.value = value
  }

  equals(other: EmailAddress<S>): boolean {
    return this.value === other.value
  }

  toString(): S {
    return this.value
  }
}
```

**Benefits:**

- **Consistency:** All value objects share a common equality contract.
- **Type Safety:** The interface enforces correct method signatures.
- **Discoverability:** It's clear which objects support value-based equality.

### Using the Value Object

```ts twoslash
export interface Comparable<T> {
  equals(other: T): boolean
}

export class EmailAddress<S extends string>
  implements Comparable<EmailAddress<S>>
{
  private readonly value: S

  static isValid(value: string): boolean {
    // Simple regex for demonstration; use a better one in production
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)
  }

  constructor(value: S) {
    if (!EmailAddress.isValid(value)) {
      throw new Error(`Invalid email address: ${value}`)
    }
    this.value = value
  }

  equals(other: EmailAddress<S>): boolean {
    return this.value === other.value
  }

  toString(): S {
    return this.value
  }
}
/// ---cut---
// @errors: 2345
const email1 = new EmailAddress("alice@example.com")
const email2 = new EmailAddress("alice@example.com")
const email3 = new EmailAddress("bob@example.com")

email1.equals(email2) // true
email1.equals(email3) // false
```

### Improving with Parameterized String Literal Types

For even greater type safety, you can make your value object generic over a string literal type. This allows you to distinguish between different kinds of email addresses at the type level (e.g., `UserEmail`, `AdminEmail`).

#### Example: Generic EmailAddress Value Object

```typescript
// Comparable.ts
export interface Comparable<T> {
  equals(other: T): boolean
}

// EmailAddress.ts
type UserEmail = "user"
type AdminEmail = "admin"

export class EmailAddress<T extends string>
  implements Comparable<EmailAddress<T>>
{
  private readonly value: string
  private readonly kind: T

  constructor(value: string, kind: T) {
    if (!EmailAddress.isValid(value)) {
      throw new Error(`Invalid email address: ${value}`)
    }
    this.value = value
    this.kind = kind
  }

  static isValid(value: string): boolean {
    // Simple regex for demonstration; use a better one in production
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)
  }

  equals(other: EmailAddress<T>): boolean {
    return (
      this.value === other.value && this.kind === other.kind
    )
  }

  toString(): string {
    return this.value
  }

  getKind(): T {
    return this.kind
  }
}
```

#### Usage

```typescript
const userEmail = new EmailAddress<UserEmail>(
  "alice@example.com",
  "user",
)
const adminEmail = new EmailAddress<AdminEmail>(
  "admin@example.com",
  "admin",
)

console.log(userEmail.equals(adminEmail)) // false (different kind)

const anotherUserEmail = new EmailAddress<UserEmail>(
  "alice@example.com",
  "user",
)
console.log(userEmail.equals(anotherUserEmail)) // true
```

**Explanation:**

- The `EmailAddress` class is now generic over a string literal type `T`.
- You can use this to distinguish between different roles or purposes for email addresses at the type level.
- The `equals` method checks both the value and the kind.

This pattern can be extended to other value objects for even more precise domain modeling.

## Practical Exercise: Refactor Primitives to Value Objects

Suppose you have the following code using primitives:

```typescript
class User {
  constructor(
    public name: string,
    public email: string,
  ) {}
}

const user = new User("Alice", "alice@example.com")
```

**Task:**

1. Create a `Name` value object that validates and encapsulates a user's name.
2. Replace the `email` string with the `EmailAddress` value object from above.
3. Update the `User` class to use these value objects.

**Bonus:**

- Add validation to the `Name` value object (e.g., non-empty, reasonable length).
- Write tests to check equality and validation.

## Summary

Value objects are a powerful DDD pattern for modeling domain concepts that don't require identity. They help enforce business rules, improve code clarity, and reduce bugs. In TypeScript, you can model them using classes with readonly properties, validation, and value-based equality.

## Further Reading

- [Domain-Driven Design Reference by Eric Evans](https://www.domainlanguage.com/ddd/reference/)
- [Value Objects in DDD (Martin Fowler)](https://martinfowler.com/bliki/ValueObject.html)
- [TypeScript Deep Dive: Value Objects](https://basarat.gitbook.io/typescript/main-1/valueobjects)



```diff cml
 // Existing context map for the gardening appoverview of gardening app areas
 ContextMap GardeningAppContextMap {
   type = SYSTEM_LANDSCAPE
   state = TO_BE

   contains PlantAttributesContext
+  // Add a new context for managing seed packetsAdding a new area to manage seed packets and their details
+  contains SeedManagementContext
 }

+// Define details of the SeedManagementContextDetails for managing seed packets
+BoundedContext SeedManagementContext {
+  // Group related seed packet dataGrouping seed packet details together
+  Aggregate SeedPacket {
+    // Define a persistent seed packet entitySeed packet as something stored and tracked over time
+    Entity SeedPacket {
+      aggregateRoot
+      // Unique identifier for the seedeach packet
+      - SeedPacketId id
+      // Timestamp whenWhen the packet was createdfirst recorded
+      Timestamp created
+      // How long the seed remains viableseeds remain good
+      Duration shelfLife
+      // Likelihood of successful germinationChances seeds will successfully sprout
+      Float germinationRate
+      // Time required for seeds to germinatesprout
+      Duration germinationTime
+      // Time seeds shouldneed to grow indoors before transplantingmoving outdoors
+      Duration timeToGrowIndoors
+      // Duration required for seeds to adapt before transplantingTime needed to prepare seeds for outdoor planting
+      Duration hardeningDuration
+      // Minimum soil temperature for successful transplantationLowest temperature at which seeds can safely be planted outside
+      Temperature minimumTransplantSoilTemperature
+    }
+  }
+}
```