# Smart Home Energy Optimizer - Vue 3 Frontend

A modern Vue 3 + TypeScript + Vite frontend for the Smart Home Energy Optimizer application.

## Tech Stack

- **Vue 3** with Composition API
- **TypeScript** for type safety
- **Vite** for fast development and building
- **TailwindCSS** for styling
- **Vue Query (@tanstack/vue-query)** for data fetching
- **Vue Router** for routing
- **Lucide Vue Next** for icons
- **Chart.js** for data visualization

## Project Structure

```
ui/
├── src/
│   ├── components/        # Vue components
│   │   ├── ui/           # Reusable UI components (Card, Button, etc.)
│   │   ├── DeviceCard.vue
│   │   ├── OptimizationCard.vue
│   │   └── StatCard.vue
│   ├── composables/      # Vue composables (like React hooks)
│   │   ├── useDevices.ts
│   │   ├── useOwners.ts
│   │   └── useConsumption.ts
│   ├── pages/            # Page components
│   │   ├── Dashboard.vue
│   │   ├── Devices.vue
│   │   └── NotFound.vue
│   ├── router/           # Vue Router configuration
│   │   └── index.ts
│   ├── services/         # API service layer
│   │   └── api.ts
│   ├── types/            # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/            # Utility functions
│   │   ├── index.ts
│   │   ├── deviceIcons.ts
│   │   └── optimization.ts
│   ├── App.vue           # Root component
│   ├── main.ts           # Application entry point
│   └── index.css         # Global styles with TailwindCSS
├── index.html
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
└── postcss.config.js
```

## Setup Instructions

### 1. Install Dependencies

```bash
cd ui
npm install
```

### 2. Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 3. Build for Production

```bash
npm run build
```

### 4. Preview Production Build

```bash
npm run preview
```

## Environment Variables

Create a `.env` file in the `ui` directory (optional):

```env
VITE_API_BASE_URL=http://localhost:8085
```

If not set, it defaults to `http://localhost:8085`.

## Features

- **Dashboard**: Overview of devices, consumption stats, and optimization suggestions
- **Device Management**: View and manage all devices
- **Real-time Toggles**: Toggle device status directly from the UI
- **Optimization Suggestions**: AI-powered energy saving recommendations
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Mode Support**: Built-in dark mode support via TailwindCSS

## API Integration

The frontend connects to the Spring Boot backend API:

- `GET /api/devices` - List all devices
- `GET /api/devices/{id}` - Get device by ID
- `PATCH /api/devices/{id}/toggle` - Toggle device status
- `GET /api/owners` - List all owners
- `GET /api/devices/{deviceId}/consumption` - Get consumption logs

## Design System

The UI uses a design system with semantic color tokens:

- Primary colors (green theme for energy/eco)
- HSL-based color variables
- Consistent border radius and spacing
- Dark mode support

All colors are defined in `src/index.css` using CSS custom properties.
