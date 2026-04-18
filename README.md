# Saas Nutri Frontend

Angular application responsible for the meal-plan authoring experience.

## What This Project Does

- Captures patient data.
- Allows food search and selection.
- Organizes meals and plan items.
- Displays nutrition totals and supports export.

## API Context

This client consumes the local API at `http://localhost:8080` (see `src/environments/environment.ts`) to:

- fetch foods and household measures;
- send meal-plan data for nutrition calculation;
- present results for final adjustments in the UI.

## Run Locally

```bash
npm install
npm run start
```

Open `http://localhost:4200`.
