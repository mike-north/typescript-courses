---
title: "Values and Models"
order: 3
date: "2025-06-10T09:00:00.000Z"
description: "TBFI"
course: values-and-models
---

**DDD Concepts**
* Introduction to Domain Models: Differentiating between TypeScript classes that represent entities or value objects and the broader conceptual models that capture useful abstractions and relationships in solving business problems.

**TypeScript Concepts**
* A generic `Comparable<T>` interface, defining an `isEqual(other: T): boolean` method.
* Immutable patterns using `readonly` properties, getters, and `Object.freeze()`

**Domain Model Evolution**
* Initially capturing fundamental plant-related attributes essential for gardening.

**Business Problems Addressed**
* Clearly defining the essential properties of plants that affect gardening decisions.

```cml
// Define the overall landscape of the gardening appOverview of the gardening application, showing different areas we care about
ContextMap GardeningAppContextMap {
  // Specify that this map represents the planned future stateWe're describing how we want the app to look in the future
  type = SYSTEM_LANDSCAPE
  state = TO_BE

  // Include a bounded context specifically for plant attributesArea focused specifically on plant characteristics
  contains PlantAttributesContext
}

// Define details of the PlantAttributesContextDetails of plant characteristics we're tracking
BoundedContext PlantAttributesContext {
  // Group related plant attributes togetherGrouping related details about plant traits
  Aggregate PlantAttributes {
    // Define the sunlight requirement attributeHow much sunlight the plant needs
    ValueObject SunNeeded
    // Define a duration attribute - How long something takes (e.g., days, hours)
    ValueObject Duration
    // Define a temperature attributeThe ideal temperature for a plant
    ValueObject Temperature
  }
}
```