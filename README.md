# BookVerse - Personal Book Library Manager

BookVerse is a modern, personal web application that lets you manage your book library with ease. Search for any book, add it to your collection under different statuses (Owned, Wishlist, etc.), add personal notes and ratings, and view your entire library on a polished, filterable dashboard.

![BookVerse Screenshot](https://picsum.photos/seed/bookverse-app/1200/800)
*<p align="center">A preview of the BookVerse dashboard.</p>*

---

## Features

*   **📚 Powerful Book Search**: Instantly find books using the comprehensive Open Library API.
*   **➕ Add Books Easily**: Add books to your library by searching and auto-filling details, or add them manually.
*   **🗂️ Organize Your Library**: Categorize books as `Owned`, `Wishlist`, `Loaned`, or `Completed`.
*   **✍️ Personalize**: Add your own 5-star ratings, private notes, and custom tags to each book.
*   **📊 Interactive Dashboard**: View your entire collection in a beautiful grid. Search, sort, and filter your library on the fly.
*   **🔐 Secure & Private**: Your library is your own. Authentication is handled securely with NextAuth.js.
*   **📱 Fully Responsive**: A seamless experience whether you're on a desktop, tablet, or phone.

## Tech Stack

*   **Framework**: Next.js 15+ (App Router)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS & shadcn/ui
*   **Database**: PostgreSQL
*   **ORM**: Prisma
*   **Authentication**: NextAuth.js (Google & Email)
*   **Client Fetching**: SWR for real-time data fetching and caching.
*   **Validation**: Zod for type-safe schema validation.

## Getting Started

Follow these instructions to get a local copy of BookVerse up and running.

### Prerequisites

*   Node.js 20+
*   `pnpm` (or `npm`/`yarn`)
*   A PostgreSQL database. You can use a free cloud provider like [Neon](https://neon.tech) or run it locally with Docker.

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/bookverse.git
    cd bookverse
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

3.  **Set up environment variables:**

    Create a `.env` file in the root of the project by copying the example file:
    ```bash
    cp .env.example .env
    ```

    Now, fill in the variables in your `.env` file:
    *   `DATABASE_URL`: Your PostgreSQL connection string.
    *   `AUTH_SECRET`: A secret key for NextAuth. Generate one with `openssl rand -base64 32`.
    *   `AUTH_URL`: Should be `http://localhost:9002` for local development.
    *   `AUTH_GOOGLE_ID` & `AUTH_GOOGLE_SECRET`: Your Google OAuth credentials (optional).
    *   `AUTH_RESEND_KEY`: API key from Resend for sending email links (if using Email provider).

4.  **Set up the database:**

    Run the Prisma migration to create the necessary tables in your database.
    ```bash
    pnpm prisma:migrate
    ```
    This will also generate the Prisma Client.

5.  **Run the development server:**
    ```bash
    pnpm run dev
    ```

    Open [http://localhost:9002](http://localhost:9002) in your browser to see the result.

### Seeding the database (optional)
You can seed the database with some sample data:
```bash
pnpm prisma:seed
```

## License

Distributed under the MIT License.
