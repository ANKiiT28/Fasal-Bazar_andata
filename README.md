# Fasal Bazar: The Future of Farming is Here

**Fasal Bazar** is a modern, AI-enhanced digital marketplace designed to bridge the gap between Indian farmers and buyers. By cutting out intermediaries, we empower farmers to get fair prices for their produce while providing buyers with direct access to fresher, higher-quality goods. Our vision is to create a transparent, efficient, and profitable agricultural ecosystem for a thriving India.

Built with Next.js and powered by Google's Gemini AI, this platform is more than just a marketplace—it's a comprehensive toolkit for the modern agricultural community.

## The Problem We're Solving

The traditional agricultural supply chain in India is often complex and inefficient. Farmers, the backbone of our nation, frequently struggle with:
- **Lack of Price Transparency**: They have little control over the prices set by intermediaries, leading to lower profits.
- **Limited Market Access**: Their reach is often confined to local markets, limiting their customer base.
- **Crop Wastage**: Inadequate storage knowledge and disease management lead to significant post-harvest losses.
- **Information Gaps**: Access to market trends, demand forecasts, and best practices is often limited.

## Our Solution: Annadata Connect

Fasal Bazar directly tackles these challenges by connecting the *Annadata* (the food provider) to the buyer. We provide a suite of intelligent, easy-to-use tools that help at every step of the process—from planting to pricing to selling.

---

## Key Features: A Closer Look

Our platform is packed with features tailored to the specific needs of farmers, buyers, delivery partners, and administrators.

### 1. The Core Marketplace
- **Direct Farmer-to-Buyer Connection**: Farmers list their produce, set their own prices, and manage inventory. Buyers get fresher goods at competitive prices and know exactly where their food comes from.
- **Advanced Search & Filtering**: Buyers can effortlessly find crops by name, location, price, organic certification, and freshness, making sourcing simple and efficient.

### 2. AI-Powered Tools for Empowerment
Our biggest differentiator is the integration of cutting-edge AI to provide actionable insights.
- **🤖 AI Fair Price Engine**: When listing a crop, farmers can get an AI-generated price suggestion. The model analyzes the crop type, quality, and location to recommend a fair market price, helping farmers make confident decisions.
- **🩺 AI Crop Doctor**: A revolutionary tool for crop health. Farmers can upload a photo of a plant, and our AI will diagnose potential diseases or pests, provide a confidence score, and suggest actionable treatments.
- **📈 Market Insights & Price Prediction**: We provide historical price trend charts for various crops. Our AI also predicts future prices based on this data, allowing farmers and buyers to anticipate market shifts.
- **🌱 Demand Forecasting**: This tool gives farmers an AI-driven forecast of demand for specific crops in their region, helping them make strategic planting decisions to maximize profitability.

### 3. Tailored Dashboards for Every Role
The application provides four distinct dashboards, ensuring a personalized and relevant experience for every user.
- **👨‍🌾 Farmer Dashboard**: Tracks earnings, manages listings, views incoming orders, and accesses AI tools for demand forecasting and storage tips.
- **🛒 Buyer Dashboard**: Monitors spending, tracks order status, manages price alerts, and maintains a list of favorite farmers for quick reordering.
- **🚚 Delivery Dashboard**: Shows assigned orders, provides a map view for routing (under development), and tracks daily earnings and performance.
- **🛡️ Admin Dashboard**: Offers a platform-wide view of all users and listings, with tools for user management and a fraud detection center to flag suspicious activity.

### 4. Seamless Communication & Accessibility
- **💬 AI-Assisted Chat**: To overcome communication barriers, buyers can initiate an AI-mediated chat with a farmer's virtual assistant. This chatbot answers common questions about produce, quality, and availability.
- **🗣️ Voice-to-Text & Text-to-Speech**: The chat interface includes voice input and audio responses, making it highly accessible for users with varying levels of literacy or those who prefer voice commands.
- **🌐 Multilingual Support**: The entire user interface can be seamlessly switched between **English** and **Hindi**, making the platform accessible to a wider audience across India.

---

## Tech Stack

- **Framework**: Next.js (with App Router for server-centric performance)
- **UI Components**: React, ShadCN UI
- **Generative AI**: Google Gemini via Genkit
- **Styling**: Tailwind CSS
- **Language**: TypeScript

---

## Project Structure

The project is organized within the `src` directory. Here is a detailed roadmap of the files and their purposes:

```
/src
│
├── /app: The core of the Next.js application, using the App Router.
│   ├── /add-listing/page.tsx: Page for farmers to list a new crop. Includes a form with validation and an AI-powered price suggestion feature.
│   ├── /checkout/page.tsx: The checkout page where a buyer finalizes their purchase, selects a payment method, and chooses a delivery slot.
│   ├── /community-forum/page.tsx: A social forum page where users can post questions and share tips.
│   ├── /crop-doctor/page.tsx: The AI Crop Doctor feature page, allowing users to upload an image of a plant for disease analysis.
│   ├── /dashboard: Contains the specific dashboard pages for each user role.
│   │   ├── /admin/page.tsx: The main dashboard for administrators.
│   │   ├── /buyer/page.tsx: The main dashboard for buyers.
│   │   ├── /delivery/page.tsx: The main dashboard for delivery partners.
│   │   └── /farmer/page.tsx: The main dashboard for farmers.
│   ├── /products/[cropName]/page.tsx: A dynamic route that displays detailed information about a specific crop, including listings from multiple farmers.
│   ├── /profile/page.tsx: A dynamic user profile page that displays different information based on the user's role (Farmer, Buyer, etc.).
│   ├── /globals.css: Global stylesheet, primarily used for defining the application's theme and color variables with Tailwind CSS.
│   ├── /layout.tsx: The root layout of the application. It wraps all pages and includes providers for authentication and language.
│   ├── /login/page.tsx: The main login and registration page, with separate tabs for each user role.
│   ├── /market-insights/page.tsx: A page for displaying market trends, price history charts, and AI-powered price predictions for crops.
│   └── /page.tsx: The homepage of the application, serving as the main marketplace view.
│
├── /components: Contains all the reusable React components.
│   ├── /auth: Components related to user authentication.
│   │   ├── /auth-form.tsx: The main form used for both sign-in and sign-up.
│   │   └── /login-dialog.tsx: A dialog/modal version of the login form.
│   ├── /chat: Components for the AI chat functionality.
│   │   └── /general-chat-dialog.tsx: A reusable chat dialog for general user-to-user communication.
│   ├── /dashboard: Components used across the various user dashboards.
│   │   ├── /admin: Components exclusive to the Admin dashboard.
│   │   ├── /buyer: Components for the Buyer dashboard.
│   │   ├── /delivery: Components for the Delivery Partner dashboard.
│   │   ├── /farmer: Components for the Farmer dashboard.
│   │   ├── /crop-marketplace.tsx: The main component that renders the filterable and searchable grid of crop listings.
│   │   ├── /market-trends.tsx: A component that displays a line chart for crop price trends.
│   │   └── /weather-alert.tsx: A small card component that shows the current weather.
│   ├── /layout: Layout-related components.
│   │   └── /header.tsx: The main application header, including navigation, logo, and user menu.
│   └── /ui: Core, unstyled UI primitives from ShadCN (e.g., Button, Card, Input).
│
├── /ai: All AI-related logic, powered by Genkit.
│   ├── /flows: Contains all the defined Genkit flows.
│   │   ├── /crop-disease-detection.ts: The flow that analyzes a crop image and returns a diagnosis.
│   │   ├── /demand-forecasting.ts: The flow for predicting crop demand.
│   │   ├── /farmer-chat-flow.ts: The AI logic for the conversational assistant for farmers.
│   │   ├── /price-prediction.ts: The flow that predicts future crop prices based on historical data.
│   │   ├── /storage-tips-and-govt-schemes.ts: The flow for providing AI-based recommendations.
│   │   └── /text-to-speech.ts: The flow for converting text responses into audio.
│   ├── /ai-fair-price-engine.ts: A specific Genkit flow for suggesting a fair market price for a crop.
│   ├── /dev.ts: The entry point for running the Genkit development server, which imports all other flows.
│   └── /genkit.ts: The central Genkit configuration file, where plugins and the primary AI model are defined.
│
├── /context: React Context providers for managing global application state.
│   ├── /auth-context.tsx: Manages the currently logged-in user's state.
│   └── /language-context.tsx: Manages the current language (English/Hindi) and provides the translation function.
│
├── /hooks: Custom React hooks for shared logic.
│   ├── /use-mobile.tsx: A hook to detect if the user is on a mobile device.
│   └── /use-toast.ts: A hook for displaying toast notifications.
│
├── /lib: Utility functions, libraries, and static data.
│   ├── /locales: Contains the JSON files for internationalization (i18n).
│   │   ├── /en.json: English translation strings.
│   │   └── /hi.json: Hindi translation strings.
│   ├── /image-helper.ts: A utility function (`getImageUrl`) that retrieves the correct image URL for a given crop name, handling synonyms and plurals.
│   ├── /market-data.ts: Generates mock historical price data for the market trends charts.
│   ├── /placeholder-images.json: A JSON file that maps crop names to specific placeholder image URLs. This is the central source for all crop images.
│   ├── /user-store.ts: A mock user database that uses browser `localStorage` to simulate user creation and authentication.
│   └── /utils.ts: General utility functions, including `cn` for merging Tailwind CSS classes.
│
└── /types: Contains shared TypeScript type definitions for the project.
    └── /index.ts: Defines core types like `Crop` that are used throughout the application.
```

---

## Running Locally

To run this project in a local development environment like VS Code, follow these steps.

### Prerequisites

- [Node.js](https://nodejs.org/) (version 20 or later recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

### 1. Install Dependencies

First, open a terminal in the root directory of the project and run the following command to install all the required packages listed in `package.json`:

```bash
npm install
```

### 2. Set Up Environment Variables

The project uses a `.env` file for environment variables. Create a file named `.env` in the root of the project.

For the AI features (like price suggestions, crop doctor, and AI chat) to work, you need a Google AI API key.

1.  Obtain an API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
2.  Add the key to your `.env` file:

```
GEMINI_API_KEY=YOUR_API_KEY_HERE
```

### 3. Run the Development Servers

This project requires two separate development servers to be running at the same time: one for the Next.js frontend and one for the Genkit AI flows.

**Terminal 1: Start the Next.js App**

This command starts the main web application.

```bash
npm run dev
```

The application will be available at `http://localhost:3000` (or another port if 3000 is in use).

**Terminal 2: Start the Genkit AI Server**

This command starts the local server that runs all the AI-powered flows. For Windows users, this command is recommended as it uses a more compatible file-watching method.

```bash
npm run genkit:watch
```
If you are on macOS or Linux, you can use:
```bash
npm run genkit:dev
```
This will start the Genkit developer UI, typically at `http://localhost:4000`, where you can inspect and test your AI flows. The Next.js app will automatically communicate with this server.

You are now all set up! Open `http://localhost:3000` in your browser to see the application running.
