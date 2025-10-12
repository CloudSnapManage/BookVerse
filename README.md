# BookVerse - Personal Book Library Manager

[![View on GitHub](https://img.shields.io/badge/GitHub-View_Source-blue?logo=github)](https://github.com/CloudSnapManage/BookVerse)

BookVerse is a modern, personal web application that lets you manage your book library with ease. Search for any book, add it to your collection under different statuses (Owned, Wishlist, etc.), add personal notes and ratings, and view your entire library on a polished, filterable dashboard.

![BookVerse Screenshot](https://storage.googleapis.com/gemini-studio-user-assets/images/user-assets/e65b7193-41c3-42a9-9524-7f1c1f516801_2024-07-29T10_51_52.378Z.png)
*<p align="center">A preview of the BookVerse dashboard with the dark violet theme.</p>*

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

    Create a `.env` file in the root of the project. To enable movie and K-Drama search, you will need a TMDb API key.
    
    You can get a free API key by creating an account on [The Movie Database (TMDb)](https://www.themoviedb.org/signup).

    ```bash
    touch .env
    ```

    Now, add your API key to the `.env` file:
    ```
    # TMDb API Key (v3 Auth)
    TMDB_API_KEY="your_tmdb_api_key_goes_here"
    ```

4.  **Run the development server:**
    ```bash
    pnpm run dev
    ```

    Open [http://localhost:9002](http://localhost:9002) in your browser to see the result.

## License

Distributed under the MIT License.
