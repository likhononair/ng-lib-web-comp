# Angular Web Component Library

An Angular library that can be exported and published as a Web Component (Custom Element). Built with modern Angular 21 syntax, signals, OnPush change detection, and comprehensive logging.

## Features

- ✨ Modern Angular 21 with signals and OnPush change detection
- 🎯 Input signals for external configuration
- 📤 Output events for host communication
- 📝 Built-in logging service
- 🔧 Exported as both Angular library and standalone Web Component
- 🚀 CI/CD with GitHub Actions
- 📦 Semantic versioning with conventional commits

## Installation

### As Angular Library

```bash
npm install hello-world-web-component
```

### As Web Component (CDN/Script)

```html
<script src="https://unpkg.com/hello-world-web-component@latest/hello-world-element.js"></script>
```

## Usage

### In Angular Application

```typescript
import { HelloWorldWebComponent } from 'hello-world-web-component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HelloWorldWebComponent],
  template: `
    <lib-hello-world-web-component
      [title]="'My Counter'"
      [message]="'Custom message'"
      [initialValue]="10"
      [minValue]="0"
      [maxValue]="100"
      [step]="5"
      (actionTriggered)="onAction($event)"
      (counterChanged)="onCounterChange($event)">
    </lib-hello-world-web-component>
  `
})
export class AppComponent {
  onAction(event: ActionEvent) {
    console.log('Action:', event);
  }

  onCounterChange(value: number) {
    console.log('Counter changed to:', value);
  }
}
```

### As Web Component (Plain HTML/JavaScript)

```html
<!DOCTYPE html>
<html>
<head>
  <script src="hello-world-element.js"></script>
</head>
<body>
  <hello-world-element
    id="myComponent"
    title="My Counter"
    message="This is a web component"
    initial-value="10"
    min-value="0"
    max-value="100"
    step="5">
  </hello-world-element>

  <script>
    const component = document.getElementById('myComponent');
    
    // Listen to events
    component.addEventListener('actionTriggered', (e) => {
      console.log('Action:', e.detail);
    });
    
    component.addEventListener('counterChanged', (e) => {
      console.log('Counter:', e.detail);
    });
    
    // Call methods
    component.setCounter(50);
    console.log('Current value:', component.getCounter());
  </script>
</body>
</html>
```

### In React Application

> **Important:** For React (or any non-Angular framework), use the **bundled web component file** (`hello-world-element.js`), not the Angular library directly. The Angular library requires the Angular Linker which is not available in non-Angular applications.

```tsx
// React component wrapper
import { useEffect, useRef } from 'react';

// Import the bundled web component (copy to your public folder or use CDN)
// Option 1: Add to index.html
// <script src="/hello-world-element.js"></script>

// Option 2: Dynamic import in useEffect
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'hello-world-element': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          title?: string;
          message?: string;
          'initial-value'?: number;
          'min-value'?: number;
          'max-value'?: number;
          step?: number;
        },
        HTMLElement
      >;
    }
  }
}

function HelloWorldWrapper() {
  const componentRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const component = componentRef.current;
    if (!component) return;

    const handleAction = (e: CustomEvent) => {
      console.log('Action:', e.detail);
    };

    const handleCounterChange = (e: CustomEvent) => {
      console.log('Counter:', e.detail);
    };

    component.addEventListener('actionTriggered', handleAction as EventListener);
    component.addEventListener('counterChanged', handleCounterChange as EventListener);

    return () => {
      component.removeEventListener('actionTriggered', handleAction as EventListener);
      component.removeEventListener('counterChanged', handleCounterChange as EventListener);
    };
  }, []);

  return (
    <hello-world-element
      ref={componentRef}
      title="My Counter"
      message="Hello from React!"
      initial-value={10}
      min-value={0}
      max-value={100}
      step={5}
    />
  );
}

export default HelloWorldWrapper;
```

**Setup steps for React:**

1. Copy `dist/web-component/hello-world-element.js` to your React app's `public` folder
2. Add `<script src="/hello-world-element.js"></script>` to your `public/index.html`
3. Use the component as shown above

## API

### Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `title` | `string` | `'Hello World Component'` | Component title |
| `message` | `string` | `'This is an Angular web component!'` | Display message |
| `initialValue` | `number` | `0` | Initial counter value |
| `minValue` | `number` | `0` | Minimum counter value |
| `maxValue` | `number` | `100` | Maximum counter value |
| `step` | `number` | `1` | Increment/decrement step |

### Outputs

| Output | Payload | Description |
|--------|---------|-------------|
| `actionTriggered` | `ActionEvent` | Emitted when any button is clicked |
| `counterChanged` | `number` | Emitted when counter value changes |

### ActionEvent Interface

```typescript
interface ActionEvent {
  type: 'increment' | 'decrement' | 'reset' | 'custom';
  value: number;
  timestamp: Date;
  message?: string;
}
```

### Public Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `setCounter` | `value: number` | `void` | Set counter to specific value |
| `getCounter` | - | `number` | Get current counter value |
| `increment` | - | `void` | Increment counter by step |
| `decrement` | - | `void` | Decrement counter by step |
| `reset` | - | `void` | Reset counter to initial value |

## Development

### Prerequisites

- Node.js 20+
- npm 10+

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build library
npm run build

# Build web component
npm run build:element

# Build everything
npm run build:all

# Run tests
npm test
```

### Project Structure

```
ng-lib-web-comp/
├── projects/
│   ├── hello-world-web-component/  # Angular library
│   │   └── src/
│   │       ├── lib/
│   │       │   ├── hello-world-web-component.ts
│   │       │   ├── hello-world-web-component.spec.ts
│   │       │   └── logger.service.ts
│   │       └── public-api.ts
│   └── hello-world-element/        # Web component wrapper
│       └── src/
│           ├── main.ts
│           └── index.html
├── scripts/
│   └── concat-bundle.js           # Bundle concatenation script
├── .github/
│   └── workflows/
│       ├── ci.yml                 # CI workflow
│       └── release.yml            # Release workflow
└── dist/
    ├── hello-world-web-component/ # Built library
    └── web-component/             # Concatenated web component
```

## Conventional Commits

This project uses [Conventional Commits](https://www.conventionalcommits.org/) for semantic versioning.

### Commit Types

| Type | Description | Version Bump |
|------|-------------|--------------|
| `feat` | New feature | Minor |
| `fix` | Bug fix | Patch |
| `perf` | Performance improvement | Patch |
| `refactor` | Code refactoring | Patch |
| `docs` | Documentation | Patch (README only) |
| `style` | Code style changes | None |
| `test` | Test changes | None |
| `chore` | Maintenance | None |
| `ci` | CI/CD changes | None |

### Breaking Changes

Add `BREAKING CHANGE:` in the commit footer or `!` after the type for major version bumps:

```
feat!: remove deprecated API

BREAKING CHANGE: The old API has been removed.
```

## CI/CD

### Workflows

1. **CI** (`ci.yml`) - Runs on PRs and pushes
   - Build library and web component
   - Run tests
   - Lint commit messages

2. **Release** (`release.yml`) - Runs on main branch
   - Semantic release
   - Publish to npm
   - Publish to GitHub Packages
   - Create GitHub release with assets

### Required Secrets

- `NPM_TOKEN` - npm access token for publishing

## License

MIT
