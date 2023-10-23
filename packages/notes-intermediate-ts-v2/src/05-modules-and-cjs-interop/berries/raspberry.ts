import { BerryBase } from './berry-base'

export class Raspberry extends BerryBase {
  constructor(public readonly color: 'red' | 'black') {
    super()
  }
}

export function pickRaspberries(time: number): Raspberry[] {
  const berries: Raspberry[] = []
  console.log('picking raspberries')
  const numPicked = Math.round(Math.random() * 15)
  while (berries.length < numPicked) {
    berries.push(new Raspberry(Math.random() > 0.5 ? 'red' : 'black'))
  }
  return berries
}
