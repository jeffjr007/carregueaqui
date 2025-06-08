# E-Car Loading

A modern web application for managing electric vehicle charging stations.

## Technologies Used

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase
- Capacitor (for mobile support)

## Getting Started

### Prerequisites

- Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Installation

```sh
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd carregueaqui

# Step 3: Install dependencies
npm install

# Step 4: Start the development server
npm run dev
```

## Development

The development server will start at `http://localhost:5173` with hot-reload enabled.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Mobile Development

This project uses Capacitor for mobile development. To build for Android:

```sh
# Build the web app
npm run build

# Add Android platform (if not already added)
npx cap add android

# Copy web assets
npx cap copy android

# Open in Android Studio
npx cap open android
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
