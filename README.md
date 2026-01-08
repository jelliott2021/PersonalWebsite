# Personal Website - Portfolio & Resume

Visit https://www.johnedwardelliott.com for live website

A modern, full-stack personal website showcasing my resume, projects, and professional experience. Built with React, TypeScript, and Node.js.

(Project backend out of date due being unneeded and costly on Azure. Kept for code example)

## Features

- **Interactive Resume**: Dynamic presentation of professional experience and skills
- **Project Portfolio**: Showcase of personal and professional projects
- **Responsive Design**: Mobile-friendly interface using Ant Design components
- **User Authentication**: Secure login system with session management
- **Real-time Updates**: Socket.io integration for live interactions
- **Modern UI**: Clean, professional design with custom components

## Tech Stack

### Frontend
- **React 18** - Modern UI library
- **TypeScript** - Type-safe development
- **React Router** - Client-side routing
- **Ant Design** - UI component library
- **React Icons** - Icon library
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **TypeScript** - Type-safe server code

### Testing
- **Cypress** - End-to-end testing
- **Jest** - Unit testing
- **Stryker** - Mutation testing

## Project Structure

```
PersonalWebsite/
├── client/                # React frontend application
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── header/    # Header component
│   │   │   ├── layout/    # Layout wrapper
│   │   │   └── main/      # Main content pages
│   │   │       ├── aboutPage/
│   │   │       ├── projectPage/
│   │   │       ├── sideBarBio/
│   │   │       └── baseComponents/
│   │   ├── contexts/      # React contexts
│   │   └── tool/          # Utility functions
│   ├── build/             # Production build
│   └── staticwebapp.config.json  # Azure SWA config
├── server/                # Node.js backend
│   ├── controller/        # Route controllers
│   ├── models/            # Database models
│   ├── services/          # Business logic
│   ├── data/              # Data utilities
│   └── tests/             # Backend tests
└── testing/               # E2E tests with Cypress
    └── cypress/
        └── e2e/           # Test specs
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB instance (local or cloud)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd PersonalWebsite
   ```

2. **Install client dependencies**
   ```bash
   cd client
   npm install
   ```

3. **Install server dependencies**
   ```bash
   cd ../server
   npm install
   ```

4. **Install testing dependencies** (optional)
   ```bash
   cd ../testing
   npm install
   ```

## Development

### Running the Client

```bash
cd client
npm start
```

The client will run on `http://localhost:3000`

### Running the Server

```bash
cd server
npm start
```

The server will run on `http://localhost:3001` (or your configured PORT)

## Building for Production

### Build Client

```bash
cd client
npm run build
```

This creates an optimized production build in the `client/build/` directory.

## Deployment

This project is configured for deployment on **Azure Static Web Apps**. The `staticwebapp.config.json` file contains the deployment configuration.

### Deploy to Azure Static Web Apps

1. Push your code to GitHub
2. Create a new Static Web App in Azure Portal
3. Connect your GitHub repository
4. Configure build settings:
   - App location: `/client`
   - API location: `/server`
   - Output location: `/build`

## Available Scripts

### Client
- `npm start` - Start development server
- `npm run build` - Create production build
- `npm test` - Run tests
- `npm run lint` - Check code quality
- `npm run lint:fix` - Fix linting issues

### Server
- `npm start` - Start server
- `npm test` - Run Jest tests
- `npm run lint` - Check code quality

## Contributing

This is a personal portfolio project, but suggestions and feedback are welcome!

## License

See the [LICENSE](LICENSE) file for details.

## Contact

Feel free to reach out for any questions or opportunities!
