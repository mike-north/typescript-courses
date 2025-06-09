---
title: "Domain Events"
order: 6
date: "2025-06-10T09:00:00.000Z"
description: "TBFI"
course: domain-events
---
# Notes
**DDD Concepts**
* Introduction to Aggregates: cohesive clusters of domain objects treated as a unit for data changes.
* Modeling Transactions: aggregating data that must change together to preserve business rules.
* Immediate vs. Eventual Consistency: when updates across different parts of the system need to be kept in sync instantly vs. over time.
* SLA Design: focusing on business-driven expectations for consistency and availability rather than solely on system performance.

**TypeScript Concepts**
* Optional chaining (?.) and nullish coalescing (??) for handling potentially absent values gracefully.
* Discriminated unions and type guards for explicit handling of variant types, potentially useful for complex domain decisions.

**Domain Model Evolution**
* Aggregating domain objects into cohesive clusters representing complex domain interactions and states.

**Business Problems Addressed**
* Managing the lifecycle of plants and associated gardening tasks to streamline gardening workflows.
* Making clear decisions about which operations need to be immediate vs. which can be delayed without negatively impacting user experience or business correctness.


```diff cml

 // Existing context map for the gardening app
 ContextMap GardeningAppContextMap {
   type = SYSTEM_LANDSCAPE
   state = TO_BE

   contains PlantAttributesContext
   contains SeedManagementContext
+  // Add context to manage plant lifecycle
+  contains PlantLifecycleContext
+  // Add context to manage task scheduling
+  contains TaskSchedulingContext
 }

+// Define details of the PlantLifecycleContext
+BoundedContext PlantLifecycleContext {
+  // Group related plant lifecycle data
+  Aggregate Plant {
+    // Define a persistent plant entity
+    Entity Plant {
+      aggregateRoot
+      // Unique identifier for the plant
+      - PlantId id
+      // Common name of the plant
+      String name
+      // Required sunlight conditions
+      SunNeeded sunlight
+      // Optimal growth temperature
+      Temperature optimalTemperature
+    }
+  }
+}

+// Define details of the TaskSchedulingContext
+BoundedContext TaskSchedulingContext {
+  // Group related gardening tasks
+  Aggregate Task {
+    // Define a persistent task entity
+    Entity Task {
+      aggregateRoot
+      // Unique identifier for the task
+      - TaskId id
+      // Date when task becomes actionable
+      Date readyDate
+      // Status of task completion
+      Boolean completed
+      // Brief title of the task
+      String title
+      // Detailed description of the task
+      String description
+      // List of related plants associated with the task
+      List<PlantId> relatedPlants
+    }
+  }
+}
```