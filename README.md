# ADmyBRAND Insights - AI-Powered Analytics Dashboard

This project is a modern, visually stunning, and fully responsive analytics dashboard built for the ADmyBRAND hiring challenge. It features interactive charts, a sortable data table, and is enhanced with two powerful features leveraging the Google Gemini API: an AI Assistant for natural language queries and an automated insight generation tool.

**Live Demo:** [**Vercel hosted Dashboard Link**](https://admybrand-dashboard-challenge.vercel.app/)


---

## 📊 Features

* **Interactive Dashboard:** Displays key performance indicators (KPIs), a performance-over-time line chart, a campaign cost distribution donut chart, and a clicks-by-campaign bar chart.
* **Advanced Data Table:** A detailed table of campaign data with features for sorting by column and pagination.
* **AI-Powered Assistant:** A chat interface that connects to the Gemini API to answer natural language questions about the displayed data.
* **Automated Insights:** A "Generate Insights" button that uses the Gemini API to analyze the current data and provide a summary of highlights and recommendations.
* **Fully Responsive Design:** The layout seamlessly adapts to desktop, tablet, and mobile screens.
* **Modern UI/UX:** Features a clean design, smooth animations, loading skeletons, and a dark/light mode toggle.
* **CSV Export:** Allows users to download the currently filtered data.

---

## ⚡ Technical Stack

* **Framework:** React (via Create React App)
* **Styling:** Tailwind CSS
* **Charts:** Recharts
* **Icons:** Lucide React
* **AI:** Google Gemini API

---

## 🚀 Setup and Running Locally

1.  **Prerequisites:**
    * Node.js and npm installed.

2.  **Clone the repository:**
    ```bash
    git clone [https://github.com/miki42v/admybrand-dashboard-challenge.git](https://github.com/miki42v/admybrand-dashboard-challenge.git)
    ```

3.  **Navigate into the project directory:**
    ```bash
    cd admybrand-dashboard-challenge
    ```

4.  **Install dependencies:**
    ```bash
    npm install
    ```

5.  **Set up your environment variables:**
    * Create a file named `.env` in the root of the project.
    * Add your Google Gemini API key to it:
        ```
        REACT_APP_GEMINI_API_KEY=YOUR_API_KEY_HERE
        ```

6.  **Run the application:**
    ```bash
    npm start
    ```
    The application will be available at `http://localhost:3000`.

---

## 🤖 AI Usage Report

This project was built with the extensive use of an AI assistant (Google's Gemini) to accelerate development and achieve a production-ready result efficiently. The AI was instrumental across the entire workflow, from initial setup to final deployment.

Initially, the AI was prompted to generate the foundational boilerplate for the React application. This included scaffolding the project with all necessary dependencies, such as Tailwind CSS for styling and Recharts for data visualization, and correctly configuring the complex setup files (`tailwind.config.js`, `postcss.config.js`).

For the user interface, the AI was tasked with generating the code for all core UI components. Based on high-level design requirements for a "modern, visually stunning dashboard," it created reusable React components for the KPI cards, charts, and the interactive data table. This process was iterative, with prompts to refine animations, implement a dark mode, and add polished loading skeletons for a superior user experience.

The most significant use of AI was in the integration of the Gemini API. I prompted the assistant to implement the `fetch` calls, handle asynchronous loading and error states, and, most importantly, craft the detailed, context-rich prompts that are sent to the Gemini model. This was crucial for both the "AI Assistant" chat feature and the "Generate Insights" tool, turning a static dashboard into an intelligent one. The AI also wrote the client-side JavaScript logic for data manipulation, including the functions for filtering, sorting, and pagination, demonstrating its capability in handling complex application logic.
