# Wainscot Layout Designer

A Vue.js application for visualizing and designing wainscoting layouts with real-time adjustments and measurements.

## Features

- Interactive visualization of wainscoting components
- Real-time adjustments with sliders and input fields
- Conversion between imperial (inches, feet) and metric (mm, cm, m) units
- Customizable panel configuration
- Detailed measurements summary
- Responsive design

## Wainscoting Components Visualized

The application visualizes the following wainscoting components:

- **Chair Rail**: The horizontal molding that caps the wainscoting (typically at 1/5 of wall height, not exceeding 32 inches)
- **Wainscot Cap**: The decorative molding just below the chair rail
- **Rails**: Horizontal boards that frame the panels
- **Stiles**: Vertical boards that frame the panels
- **Panel Moldings**: Decorative moldings inside the panels
- **Baseboard**: The board at the bottom of the wall
- **Shoe Molding**: The small molding at the floor level

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

```sh
npm run test:e2e:dev
```

This runs the end-to-end tests against the Vite development server.
It is much faster than the production build.

But it's still recommended to test the production build with `test:e2e` before deploying (e.g. in CI environments):

```sh
npm run build
npm run test:e2e
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## Technologies Used

- Vue.js 3 with Composition API
- TypeScript
- Vue Router
- CSS3 with Flexbox and Grid

## License

MIT
