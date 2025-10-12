# BookVerse - Personal Book Library Manager

[![View on GitHub](https://img.shields.io/badge/GitHub-View_Source-blue?logo=github)](https://github.com/CloudSnapManage/BookVerse)

BookVerse is a modern, personal web application that lets you manage your book library with ease. Search for any book, add it to your collection under different statuses (Owned, Wishlist, etc.), add personal notes and ratings, and view your entire library on a polished, filterable dashboard.

![BookVerse Screenshot](https://picsum.photos/seed/bookverse-app/1200/800)
*<p align="center">A preview of the BookVerse dashboard.</p>*

---

## Features

*   **📚 Powerful Book Search**: Instantly find books, movies, anime, and K-dramas from various APIs.
*   **➕ Add Media Easily**: Add items to your library by searching and auto-filling details, or add them manually.
*   **🗂️ Organize Your Library**: Categorize media with statuses like `Completed`, `Watching`, or `Wishlist`.
*   **✍️ Personalize**: Add your own 5-star ratings and private notes to each item.
*   **📊 Interactive Dashboard**: View your entire collection in a beautiful grid. Search, sort, and filter your library on the fly.
*   **🎨 Customizable Themes**: Switch between multiple color themes and light/dark modes to personalize your experience.
*   **📱 Fully Responsive**: A seamless experience whether you're on a desktop, tablet, or phone.
*   **🔐 100% Private**: All data is stored securely in your browser's local storage. No accounts, no tracking.

## Tech Stack

*   **Framework**: Next.js 15+ (App Router)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS & shadcn/ui
*   **State Management**: React Hooks & Local Storage
*   **Client Fetching**: SWR for real-time search result fetching.
*   **Validation**: Zod for type-safe schema validation.

## Getting Started

Follow these instructions to get a local copy of BookVerse up and running.

### Prerequisites

*   Node.js 20+
*   `pnpm` (or `npm`/`yarn`)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/CloudSnapManage/BookVerse.git
    cd BookVerse
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

3.  **Set up environment variables:**

    Create a `.env` file in the root of the project. While no keys are strictly required for the app to run (since it's fully client-side), you can add a TMDb API key to enable movie and K-Drama search.
    ```bash
    cp .env.example .env
    ```

    Now, fill in the optional variables in your `.env` file:
    *   `TMDB_READ_ACCESS_TOKEN`: Your read access token from The Movie Database (TMDb) to enable movie/drama search.

4.  **Run the development server:**
    ```bash
    pnpm run dev
    ```

    Open [http://localhost:9002](http://localhost:9002) in your browser to see the result.

## License

Distributed under the MIT License.
