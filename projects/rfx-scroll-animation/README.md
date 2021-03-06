# RfxScrollAnimation
Animate your page elements on scroll

## Features

- Animate your component on scroll
- Multiple animations
- Add your own custom animation

## Installation

Install the npm package:
```bash
npm install rfx-scroll-animation
```

### Import module:

```typescript
import { RfxScrollAnimationModule } from 'rfx-scroll-animation';

@NgModule({
  imports: [
    RfxScrollAnimationModule
  ]
})
```

### Initialize scroll animations

In your *app.component.ts* initialize animation listeners inside `ngOnInit`
```typescript
import { RfxScrollAnimationService } from 'rfx-scroll-animation';

constructor(private rfxScrollAnimationService: RfxScrollAnimationService) { }

public ngOnInit(): void {
  this.rfxScrollAnimationService.initListeners();
}
```

## Usage

just apply `libRfxScrollAnimation` to your container and pass animation type
```html
<div libRfxScrollAnimation animationType="bottom">
  [...]
</div>
```

## Configuration

### `distanceFromPageBottomPercentage: number`
*(default value: 20)*<br />
when element should appear - in percentage from the bottom of the page (e.g. 30 = 30% from the bottom of current viewport)

### `animationType: AnimationTypeEnum`
*(default value: 'none')*<br />
Available animation types:
  - `none` use this if you want to implement a custom animation
  - `top` - fade in from top
  - `bottom` - fade in from bottom
  - `right` - fade in from right
  - `left` - fade in from left
  - `zoom` - zoom in / out

### `animationDistancePx: number`
*(default value: 25)*<br />
from how far the animation should fade in - shift value

### `transitionDurationMs: number`
*(default value: 500)*<br />
animation duration in milliseconds

### `transitionTimingFunction: string`
*(default value: 'cubic-bezier(0.4, 0.0, 0.2, 1)')*<br />
transition timing function (for more info see https://www.w3schools.com/cssref/css3_pr_transition-timing-function.asp)

### `scaleRatio: number`
*(default value: 1.5)*<br />
**ONLY FOR 'zoom' ANIMATION TYPE!**<br />
scale value (eg. scale from `value` to 1)

### `elementVisibleChange: EventEmitter<boolean>`
listen to show / hide element events and create your own custom animation
```html
<div libRfxScrollAnimation animationType="bottom" (elementVisibleChange)="myCustomFunction($event)">
  [...]
</div>
```

### ~~`transitionDelayMs: number`~~ (coming soon)

### ~~`isOnlyFirstTime: boolean`~~ (coming soon)


## Demo

TODO

## License

This project is licensed under the [MIT](http://vjpr.mit-license.org) License
