# Task Manager Frontend

A modern React application for task management with a beautiful and responsive user interface.

## Features

- **Modern UI/UX**: Clean, responsive design with Tailwind CSS
- **Authentication**: Secure login and registration with JWT
- **Task Management**: Full CRUD operations for tasks
- **Advanced Filtering**: Filter tasks by status, priority, and search
- **Real-time Updates**: Instant feedback with toast notifications
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Role-based Access**: Different features for users and admins
- **State Management**: Efficient state management with Zustand

## Tech Stack

- **Framework**: React 18
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Forms**: React Hook Form
- **Icons**: Heroicons
- **Notifications**: React Hot Toast
- **Animations**: Framer Motion
- **Charts**: Recharts

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend API running (see backend README)

## Installation

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## Project Structure

```
frontend/
├── public/
│   └── index.html              # Main HTML file
├── src/
│   ├── components/
│   │   └── Layout/
│   │       └── Layout.js       # Main layout component
│   │   ├── pages/
│   │   │   ├── Auth/
│   │   │   │   ├── Login.js        # Login page
│   │   │   │   └── Register.js     # Registration page
│   │   │   ├── Dashboard/
│   │   │   │   └── Dashboard.js    # Dashboard page
│   │   │   ├── Tasks/
│   │   │   │   ├── Tasks.js        # Tasks list page
│   │   │   │   ├── TaskDetail.js   # Task detail page
│   │   │   │   ├── CreateTask.js   # Create task page
│   │   │   │   └── EditTask.js     # Edit task page
│   │   │   ├── Profile/
│   │   │   │   └── Profile.js      # User profile page
│   │   │   └── Users/
│   │   │       ├── Users.js        # Users list page (admin)
│   │   │       └── UserDetail.js   # User detail page (admin)
│   │   ├── services/
│   │   │   └── api.js              # API service configuration
│   │   ├── stores/
│   │   │   └── authStore.js        # Authentication state management
│   │   ├── App.js                  # Main application component
│   │   ├── index.js                # Application entry point
│   │   └── index.css               # Global styles
│   ├── package.json                # Dependencies and scripts
│   ├── tailwind.config.js          # Tailwind CSS configuration
│   └── postcss.config.js           # PostCSS configuration
```

## Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

## Environment Variables

Create a `.env` file in the frontend directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Key Features

### Authentication
- Secure login and registration
- JWT token management
- Protected routes
- Automatic token refresh

### Dashboard
- Task statistics overview
- Recent tasks display
- Quick actions
- Visual progress indicators

### Task Management
- Create, read, update, delete tasks
- Advanced filtering and search
- Status and priority management
- Due date tracking
- Task assignments

### User Management (Admin)
- User list and details
- User statistics
- Role management
- Account status management

### Responsive Design
- Mobile-first approach
- Responsive navigation
- Touch-friendly interface
- Optimized for all screen sizes

## API Integration

The frontend communicates with the backend API through the `api.js` service:

- Automatic token handling
- Error interception
- Request/response logging
- Centralized error handling

## State Management

Uses Zustand for efficient state management:

- Authentication state
- User data persistence
- Form state management
- Real-time updates

## Styling

Built with Tailwind CSS for:

- Consistent design system
- Responsive utilities
- Custom component classes
- Dark mode support (ready)

## Performance

- Code splitting with React Router
- Optimized bundle size
- Lazy loading of components
- Efficient re-renders

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development

### Code Style
- ESLint configuration
- Prettier formatting
- Consistent naming conventions
- Component organization

### Testing
- Jest for unit tests
- React Testing Library
- Component testing
- Integration testing

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify
1. Connect your repository
2. Set build command: `npm run build`
3. Set publish directory: `build`

### Deploy to Vercel
1. Connect your repository
2. Vercel will auto-detect React settings
3. Deploy automatically

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License. 