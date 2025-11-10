# Aeris

An intuitive Progressive Web App (PWA) for personal finance, designed for simple and effective expense tracking and budget management.

## About The Project

Aeris is a mobile-first financial tracker that helps users understand their spending habits. It provides a clean dashboard to visualize financial health, easy-to-use tools for tracking income and expenses, and a simple way to set and monitor monthly budgets.

Being a PWA, Aeris offers an installable, native-app-like experience directly from the browser.

## Key Features

* **Dynamic Dashboard:** At-a-glance view of your current balance, total expenses, and an interactive donut chart for spending by category.
* **Transaction Tracking:** Easily add new income or expenses using the global Floating Action Button (FAB).
* **Budgeting & Goals:** A dedicated section to create, manage, and track monthly budgets and financial goals.
* **Category Management:** Full flexibility to create, edit, and delete custom income and expense categories.
* **User Authentication:** Secure profile page with options to change passwords, log out, and delete accounts.
* **Customization:** Includes a display currency selector and a light/dark mode theme toggle for user comfort.
* **PWA Ready:** Fully responsive and installable on mobile devices for a seamless, native-app feel.

## Tech Stack

This project is built with a modern, component-based architecture:

* **[Next.js](https://nextjs.org/)** (using App Router)
* **[React](https://react.dev/)**
* **[CSS Modules](https://github.com/css-modules/css-modules)** (for component-scoped styling)
* **[React Context API](https://react.dev/learn/passing-data-deeply-with-context)** (for state management, e.g., theme)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Node.js (v18.x or later)
* npm, yarn, or pnpm

### Installation

1.  **Clone the repo**
    ```sh
    git clone https://github.com/your-username/aeris.git
    ```
2.  **Navigate to the project directory**
    ```sh
    cd aeris
    ```
3.  **Install dependencies**
    ```sh
    npm install
    ```
    *(or `yarn install`)*

4.  **Run the development server**
    ```sh
    npm run dev
    ```
    *(or `yarn dev`)*

5.  Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
