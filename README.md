
# FeedMe Dashboard Explorer

## Project info

**URL**: https://lovable.dev/projects/0cf8cc0c-9613-497b-9538-abbbf7d60ea2

## Frontend

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

### How to run the frontend

```sh
# Install dependencies
npm i

# Start the development server
npm run dev
```

## Backend

The backend is built with Spring Boot. To run it locally, you'll need:

- Java 17 or higher
- Maven

### How to run the backend

1. Clone the backend repository
2. Navigate to the project directory
3. Run the following commands:

```sh
# Build the project
./mvnw clean package

# Run the application
./mvnw spring-boot:run
```

The API will be available at `http://localhost:8080/api/`

## API Documentation

Once the backend is running, you can access the API documentation at:
`http://localhost:8080/swagger-ui.html`

## Backend Repository

The backend code is available in a separate repository. Contact the administrator for access.

## How can I edit this code?

There are several ways of editing the frontend application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/0cf8cc0c-9613-497b-9538-abbbf7d60ea2) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/0cf8cc0c-9613-497b-9538-abbbf7d60ea2) and click on Share -> Publish.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)
