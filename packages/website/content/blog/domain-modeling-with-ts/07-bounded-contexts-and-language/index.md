---
title: "Bounded Contexts & Ubiquitous Language"
order: 7
date: "2025-06-10T09:00:00.000Z"
description: "TBFI"
course: bounded-contexts-and-language
---
# Notes
**DDD Concepts**
* Formalizing the concept of a Bounded Context: clearly delineating areas of responsibility within the system.
* Establishing a Ubiquitous Language: ensuring consistent communication and clear definitions across all stakeholders and within each bounded context.

**TypeScript Concepts**
* Refactoring codebases into clear, modular bounded contexts.
* Organizing code and types in a manner that reflects domain boundaries.

**Domain Model Evolution**
* Refactoring and clearly separating concepts like seed packets, tasks, durations, and germination schedules into distinct, logically organized bounded contexts.

**Business Problems Addressed**
* Reducing complexity and confusion by clearly delineating domain responsibilities and language.
* Enhancing maintainability and clarity within the codebase.

**Context Map Formalization**
At this stage, students will convert previously introduced conceptual domain descriptions into formal Context Mapper DSL (CML) syntax. Students will experience firsthand the clarity gained from visually and formally defining their application's structure.

```cml
ContextMap GardeningAppContextMap {
  type = SYSTEM_LANDSCAPE
  state = TO_BE

  contains PlantAttributesContext
  contains SeedManagementContext
  contains PlantLifecycleContext
  contains TaskSchedulingContext
}

BoundedContext PlantAttributesContext {
  Aggregate PlantAttributes {
    ValueObject SunNeeded
    ValueObject Duration
    ValueObject Temperature
  }
}

BoundedContext SeedManagementContext {
  Aggregate SeedPacket {
    Entity SeedPacket {
      aggregateRoot
      - SeedPacketId id
      Timestamp created
      Duration shelfLife
      Float germinationRate
      Duration germinationTime
      Duration timeToGrowIndoors
      Duration hardeningDuration
      Temperature minimumTransplantSoilTemperature
    }
  }
}

BoundedContext PlantLifecycleContext {
  Aggregate Plant {
    Entity Plant {
      aggregateRoot
      - PlantId id
      String name
      SunNeeded sunlight
      Temperature optimalTemperature
    }
  }
}

BoundedContext TaskSchedulingContext {
  Aggregate Task {
    Entity Task {
      aggregateRoot
      - TaskId id
      Date readyDate
      Boolean completed
      String title
      String description
      List<PlantId> relatedPlants
    }
  }
}
```

Each chapter clearly demonstrates the progressive enhancement of the domain model and its corresponding visual context map.



