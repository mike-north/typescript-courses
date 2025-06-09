---
title: "Entities"
order: 5
date: "2025-06-10T09:00:00.000Z"
description: "Defining entities, identity, and lifecycle in TypeScript, with TypeORM integration."
course: domain-modeling-with-ts
---
# Notes
**DDD Concepts**
* Entities as persisted, mutable objects.

**TypeScript Concepts**
* Branded types for entity identifiers to enforce strong typing and ensure correct usage.
* Composing entities using previously defined value objects.

**Domain Model Evolution**
* Introducing persistent entities to manage gardening resources effectively over time.

**Business Problems Addressed**
* Tracking and managing the lifecycle and viability of gardening supplies such as seeds.


# Entities in Domain-Driven Design

## Introduction to Entities

In Domain-Driven Design (DDD), an **entity** is a core concept that represents a distinct object with a unique identity. Unlike simple data structures, entities are defined by their identity rather than just their attributes. This makes them ideal for modeling real-world objects that have a lifecycle and can change over time.

### Key Characteristics of Entities

- **Identity**: Each entity has a unique identifier that distinguishes it from all others, even if all other properties are identical.
- **Lifecycle**: Entities are created, may change state, and eventually may be deleted or archived. Their identity persists throughout these changes.

> **Mental Model**: Think of an entity like a passport. Even if you change your name or address, your passport number (identity) stays the same.

## Entity vs. Value Object

Understanding the distinction between entities and value objects is crucial in DDD:

|                | Entity                | Value Object         |
|----------------|----------------------|---------------------|
| Identity       | Yes (unique)         | No                  |
| Equality       | By ID                | By value            |
| Lifecycle      | Has lifecycle        | Immutable           |
| Example        | User, Order, Product | Money, Address      |

- **Entity**: Defined by identity. Two entities with the same properties but different IDs are not the same.
- **Value Object**: Defined by value. Two value objects with the same properties are considered equal.

## Implementing Entities in TypeScript

Let's see how to model an entity in TypeScript. We'll use an **Order** as our example, with a unique `OrderId` to represent its identity.

```ts twoslash
// OrderId as a value object for strong typing
type OrderId = string & { readonly brand: unique symbol };

function createOrderId(id: string): OrderId {
  return id as OrderId;
}

// Entity: Order
class Order {
  constructor(
    public readonly orderId: OrderId,
    public customerName: string,
    public items: string[],
    public status: 'pending' | 'shipped' | 'delivered'
  ) {}

  // Entities often have behavior
  ship() {
    if (this.status !== 'pending') {
      throw new Error('Order cannot be shipped');
    }
    this.status = 'shipped';
  }
}

// Usage
const orderId = createOrderId('order-123');
const order = new Order(orderId, 'Alice', ['Book', 'Pen'], 'pending');

order.ship();
console.log(order.status); // 'shipped'
```

### Key Points

- The `Order` class is an entity because it has a unique `orderId` that defines its identity.
- Even if two orders have the same customer and items, they are different entities if their `orderId` is different.
- The `Order` entity has behavior (`ship`) and mutable state (`status`).

## Using TypeORM to Model Entities

In real-world TypeScript applications, libraries like **TypeORM** provide tools to map your domain entities to database tables, making it easier to persist and retrieve them. TypeORM is a popular Object-Relational Mapper (ORM) for TypeScript and JavaScript that allows you to define entities using classes and decorators.

> **Why use an ORM?**
> ORMs like TypeORM help bridge the gap between your domain model and your database, letting you work with rich TypeScript objects while handling the details of storage and retrieval behind the scenes.

Here's how you might define an `Order` entity using TypeORM, while preserving the branded `OrderId` type:

```ts twoslash
// @experimentalDecorators: true
import { Entity, PrimaryColumn, Column, ValueTransformer } from "typeorm";
// @errors: 2552 2304 1240
// Branded type for OrderId
export type OrderId = string & { readonly brand: unique symbol };

export function createOrderId(id: string): OrderId {
  return id as OrderId;
}

// TypeORM transformer for OrderId
const orderIdTransformer: ValueTransformer = {
  to: (orderId: OrderId) => orderId as string, // Store as string in DB
  from: (dbValue: string) => createOrderId(dbValue), // Convert DB string to branded type
};

// Order status as an enum
export enum OrderStatus {
  Pending = 'pending',
  Shipped = 'shipped',
  Delivered = 'delivered',
}

@Entity()
export class Order {
  @PrimaryColumn({ transformer: orderIdTransformer })
  orderId!: OrderId;

  @Column()
  customerName!: string;

  @Column("simple-array")
  items!: string[];

  @Column({ type: 'enum', enum: OrderStatus })
  status!: OrderStatus;
}
```

- The `orderId` field now uses the branded `OrderId` type for extra type safety.
- The `orderIdTransformer` ensures that when reading from or writing to the database, the branded type is correctly handled as a string.

> **Why use a transformer?**
> TypeORM needs to know how to store and retrieve custom types. The transformer lets you keep strong domain types in your code, while still storing plain strings in the database.

In the next section, we'll explore how entities interact with value objects and how to enforce identity in more complex scenarios. 


```diff cml
 // Existing context map for the gardening app
 ContextMap GardeningAppContextMap {
   type = SYSTEM_LANDSCAPE
   state = TO_BE

   contains PlantAttributesContext
+  // Add a new context for managing seed packets
+  contains SeedManagementContext
 }

+// Define details of the SeedManagementContext
+BoundedContext SeedManagementContext {
+  // Group related seed packet data
+  Aggregate SeedPacket {
+    // Define a persistent seed packet entity
+    Entity SeedPacket {
+      aggregateRoot
+      // Unique identifier for the seed packet
+      - SeedPacketId id
+      // Timestamp when the packet was created
+      Timestamp created
+      // How long the seed remains viable
+      Duration shelfLife
+      // Likelihood of successful germination
+      Float germinationRate
+      // Time required for seeds to germinate
+      Duration germinationTime
+      // Time seeds should grow indoors before transplanting
+      Duration timeToGrowIndoors
+      // Duration required for seeds to adapt before transplanting
+      Duration hardeningDuration
+      // Minimum soil temperature for successful transplantation
+      Temperature minimumTransplantSoilTemperature
+    }
+  }
+}
```

