# HVAC Web Interface

A responsive web frontend for the HVAC controller system, built with Next.js and React.

## Features

- **Dashboard View**: Overview of all zones and system status
- **Zone Control**: Individual zone temperature and mode control
- **System Control**: System-wide mode management
- **Real-time Updates**: Automatic data refresh every 30 seconds
- **Responsive Design**: Works on mobile and desktop devices

## Development

### Prerequisites

- Node.js 18+ 
- npm or yarn
- HVAC Controller API running on localhost:8080

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The web interface will be available at http://localhost:8081

### API Configuration

The frontend connects to the HVAC controller API. Update the API URL in `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## Architecture

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type safety
- **Tailwind CSS**: Utility-first styling
- **Responsive Design**: Mobile-first approach

### Components

- `Dashboard`: Main overview screen
- `ZoneCard`: Individual zone display
- `SystemCard`: System status display 
- `ZoneDetail`: Zone control interface
- `SystemModeControl`: System mode management

## Deployment

```bash
# Build production version
npm run build

# Start production server
npm run start
```

The application is configured to run on port 8081 to avoid conflicts with the HVAC controller API on port 8080.