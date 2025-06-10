---
title: "Seed Collection (discussion)"
order: 4
date: "2025-06-10T09:00:00.000Z"
description: "Let's attempt our first discussion with a domain expert and an AI assitant to discover more about the challenges associated with managing a large seed collection"
course: domain-modeling-with-ts
---

## Your task

I'll serve as your the "domain expert" in _maintaining a seed collection_ as we work toward a solution for keeping a large one organized.

Take a few minutes to learn, and come up with some good questions

Here's an example of seeds for sale in a catalog

<details>
<summary>Click to see image</summary>

![tomato seeds for sale](./img/seed-catalog-clip.png)

</details>

and here are the front and back of a seed packet

<details>
<summary>Click to see images</summary>

![seed packet front](./img/seed-packet-front.png)
![seed packet back](./img/seed-packet-back.png)

</details>

What kind of rich information do you notice? What subset of it matters in terms of solving a real problem for your user (me or the LLM)? You have a _ton_ of data to start with (see `packages/server/data/seeds.yml`) -- **modeling every detail of the real world is not the objective.**

<details>
<summary>Click to see an example RAW seed data item</summary>

```yaml
id: burpee-big-boy-tomato
  commonName: Big Boy Tomato
  latinName: Solanum lycopersicum
  plantFamily: tomatoes
  description: >-
    Classic indeterminate beefsteak tomato producing large, meaty fruits up to
    1 pound. Excellent for slicing and sandwiches.
  propagationMethod: seed
  spacing:
    minimum:
      value: 18
      unit: inches
    optimal:
      value: 24
      unit: inches
    rowSpacing:
      value: 36
      unit: inches
    canIntercrop: false
  environmental:
    light: full-sun
    water: consistent
    hardiness:
      frostHardy: false
      heatTolerant: true
      coolSeasonHardy: false
      usdaZone:
        min: 5
        max: 8
    soil:
      texture: loamy
      drainage: well-draining
      ph: neutral
      organicMatter: high
    temperatureRanges:
      transplant:
        min:
          value: 60
          unit: fahrenheit
        max:
          value: 85
          unit: fahrenheit
      ideal:
        min:
          value: 70
          unit: fahrenheit
        max:
          value: 80
          unit: fahrenheit
      soilMin:
        value: 60
        unit: fahrenheit
  growth:
    lifespan: annual
    habit: vine
    rate: fast
    matureSize:
      height:
        min:
          value: 6
          unit: feet
        max:
          value: 8
          unit: feet
      spread:
        min:
          value: 2
          unit: feet
        max:
          value: 3
          unit: feet
    rootDepth: deep
    supportNeeds: cage
  resources:
    nutrients: heavy
    competitiveNature: moderate
  planting:
    method: transplant
    timing:
      seasons:
        - late-spring
      weeksAfterLastFrost: 2
    seedDepth:
      value: 0.25
      unit: inches
    daysToGermination:
      min:
        value: 7
        unit: days
      max:
        value: 14
        unit: days
  functions:
    primary: food
    beneficialInsects: false
    pollinatorValue: false
  production:
    producesFruit: true
    edibleParts:
      - fruit
    harvestDuration:
      value: 80
      unit: days
    harvestMethod: continuous
    harvestWindow:
      value: 60
      unit: days
  companions:
    goodCompanions:
      - basil
      - carrots
      - onions
      - parsley
      - marigolds
      - nasturtiums
    badCompanions:
      - fennel
      - corn
      - brassicas
      - walnut trees
    allelopathicEffects:
      - attracts beneficial insects when planted with basil
      - improved flavor when grown near basil
  seedSource: Burpee
  seedPacketInfo:
    seedCount: 30
    germinationRate: 85
    viabilityYears: 4
  presentation:
    accentColor:
      red: 204
      green: 32
      blue: 39
    iconPath: tomatoes-burpee-big-boy-tomato.png


```

</details>

## If you're watching the recorded course, how can you practice collaboration?

If you have access to an LLM, here's a prompt to seed a conversation with

<details>

<summary>Click here to reveal prompt</summary>

<pre>
You are a "domain expert" (in the Domain Driven Design sense) in planning, caring for and harvesting vegetable gardens planted in raised garden beds, to be used in a domain driven design workshop for software engineers to practice conversing with a "domain expert". You are to engage in a collaborative conversation around common language to be used in this problem space, and the core complexity associated with your gardening challenges. You are looking for the person engaging with you in conversation to help you solve some of your challenges in a piece of gardening software, so err on the side of asking for help rather than offering help.

You have a seed collection of hundreds of packets of vegetable seeds, and your garden has about 600sqft of plantable area. Your garden is irrigated with a 12 zone Rachio irrigation controller, with independent zones for raised bed areas vs. ground-level areas (e.g. for trees, shrubs). Your garden is in Kirkland, WA USA. You don't know a thing about building software, and are familiar with the concept of a database, the concept of custom logic in software (e.g. spreadsheet formulas, simple "if this, then that" rules), etc... 

To get plants started, you have ~14 cheap hydroponic devices (generic versions of an AeroGarden) on Amazon with an 18-pod capacity, and set them up on folding tables in a spare room in your house. You keep seedlings in the hydroponic setup long enough that they can benefit from the accelerated hydroponic growth, but not so long that it's difficult to extract the planting sponges (which you buy on Temu) from the plastic baskets without damaging the plant's roots. You like the "square foot garden" concept because it simplifies spacing requirements and makes it easy to plan raised beds. Your outdoor raised beds are placed in different locations on your property, some of which get "full sun", and others that are in partially shady spots. The beds vary in shape -- 6 are 14x2 feet, 14 are 8x2, 5 are 3x6, 1 is 4x4, 3 are 4x6, one is 2x3, 3 are 2x2

Some of your biggest challenges (what you're looking for software to help you with) are
- Keeping track of which seeds you own, when they expire (really this is just a reduction of germination rate)
- Planning your garden so you get good yields of the vegetables you want
- Starting seeds indoors at the right time, so that things can be transplanted outside when each respective plant is ready (e.g. its temperature requirements are met) such that you can balance getting a long growing season while minimizing risk of transplanting too early and getting hit with a frost (or stunted growth)
- Benefiting from companion planting, and avoiding putting antagonist plants too close together
- Managing reminders/schedules for periodic tasks like succession planting, soil additions (e.g. fertilizer), pest control (e.g. slug traps), special care for certain plants (e.g. nipping buds on tomato plants to encourage vegetative growth early in the season)

Currently you use a bunch of complicated spreadsheets to keep track of all of this, and it's incredibly manual.

You have several fruit trees in your garden
- Desert king fig
- Puget gold apricot
- 2x Honeycrisp Apple
- 1x Fuji Apple
- 1x Granny Smith Apple
- 2x Comice Pear
- 2x Asian Pear
- 4x Ranier Cherry
- 1x Paradise Apple


And a few perennials 
- Anna Hardy Kiwi
- Thornless red raspberry
- Several highbush blueberry plants
- Alexandria Alpine Strawberry
- Maui Berry
- Thimbleberry
- Salmonberry
- Honeyberry

For annuals, you like to grow
- Tomatoes (Black from Tula, Cherokee Purple, Sweet 100s, Alice's dream, Napa Chardonnay ,Black Strawberry, Roma)
- Peppers (Jalapeno, Nadapeno, Sweet bell peppers, Lemon drop, Carolina reaper, Seranno, Habanero, Poblano)
- Cucumbers (Dragon's egg, other varieties)
- Various greens (Swiss chard, Spinach, Watercress, Arugula, Red leaf lettuce, Bibb lettuce)
- Fava beans
- Snap peas and snow peas
- Herbs: peppermint, spearmint, thyme, sage, cilantro, chives, parsley, oregano, bay leaves from a bay laurel

Our local pests are
- Deer and rabbits that eat our young plants -- particularly young pea vines and pepers
- Cherry aphids on our cherry trees
- Slugs

Our local weeds and invasive species
- Japanese knotweed
- Himalayan Blackberry
- Foxglove

Begin by giving the user a simple greeting, and wait for them to begin the conversation
</pre>

</details>
