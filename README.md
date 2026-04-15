# FlixPork - NetflixLight Project

## Overview

FlixPork is a lightweight web application inspired by Netflix, built with JavaScript, HTML and TailwindCSS. It allows users to browse movies, manage their profiles, and have personal watchlists and favorites.

## Installation Instructions

    Clone the repository:
    git clone https://github.com/hthibaud/NETFLIXLIGHT-PROJET-JS
    cd NETFLIXLIGHT-PROJET-JS

    Install dependencies:
    npm install express

    Set up environment variables:
    Create a .env file in the root directory.

    Launch the server:
    node server/server.js

    Access the app:
    Open http://localhost:3000/ in your browser.

## TMDB API Configuration

    Obtain an API Key/Token from TMDB Settings (https://www.themoviedb.org/settings/api).

    Create a .env file in the project root.

    Add your token:
    TMDB_TOKEN=your_api_token_here
    PORT=3000


## Project Architecture

    client/ : Static assets (CSS, Images) and HTML templates.

    server/server.js : Main Node.js Express server & API routes.

    server/users.db : user database in SQLite.

    api/carroussel.js : Logic for homepage sliders.

    api/everymovie.js : Movie details, trailers & global search logic.

    api/list.js : Favorites and Watchlist management.

    .env : Environment variables (ignored by git).

## Technical Choices

### Frontend: JavaScript, HTML, Tailwind CSS
    JS: DOM manipulation, asynchronous programming (async/await), and event propagation management without the overhead of heavy frameworks.

    Tailwind CSS: Used for rapid and responsive UI development.

    Lucide Icons: Integrated to replace standard emojis with professional looking icons.

### Backend: Node.js, Express

    Express.js: Provides a robust routing system for TMDB requests, keeping the API Token secure on the server.

### Database: SQLite3

	SQLite: It stores data in a single file, making the project highly portable and easy to test without a dedicated database server.
	
### Project Management: Notion 

	(link -> https://www.notion.so/31a6c25064e880a1ab7cec2771921d5e?v=31a6c25064e8801ca037000c8d99d70b)
	
## Features

### User Authentication
- **Account Creation**: Users can register new accounts with personal details.
- **Login**: Secure authentication to access the application.
- **Profile Management**: Users can view and update their profile information.

### Movie Browsing
- **Home Page**: Features a home banner and carrousels showcasing featured movies.
- **All Movies Page**: Browse the complete catalog of available movies.
- **Search Page**: Search for your favorite movie.
- **Movie Details**: View detailed information about each movie and their trailer.

### Personal Lists
- **Favorites**: Add movies to your favorites.
- **Watchlist**: Add movies to your watchlist.

Built by Thibaud & Yanaël.