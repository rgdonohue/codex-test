# GIS Location Services Application

This is a modern full-stack application template using FastAPI for the backend and Next.js for the frontend.

## Project Structure

```
.
├── backend/           # FastAPI backend
│   ├── app/
│   │   ├── main.py
│   │   ├── models.py
│   │   └── routers/
│   ├── requirements.txt
│   └── README.md
├── frontend/         # Next.js frontend
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   └── styles/
│   ├── package.json
│   └── README.md
└── README.md
```

## Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the development server:
   ```bash
   uvicorn app.main:app --reload
   ```

The backend will be available at `http://localhost:8000`

## Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set the environment variable used by the frontend to reach the backend API:
   ```bash
   # Example for a local backend
   export NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:3000`

## Features

- FastAPI backend with automatic API documentation
- Next.js 14 frontend with App Router
- TypeScript support
- Modern UI with Tailwind CSS
- Hot reloading for both frontend and backend
- API integration between frontend and backend

## Development

- Backend API documentation is available at `http://localhost:8000/docs`
- Frontend development server includes hot reloading
- Both servers can run simultaneously for full-stack development

## Running Tests

Backend tests use **pytest** and FastAPI's TestClient. Install the backend
requirements and run:

```bash
pip install -r backend/requirements.txt
pytest
```

## Production Deployment

For production deployment:

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. The backend can be deployed using any ASGI server (e.g., Gunicorn with Uvicorn workers)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request 