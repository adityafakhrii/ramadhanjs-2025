# Hadith of the Day

This command-line tool fetches and displays a random hadith from the [hadithapi.com](https://hadithapi.com) API.

## Prerequisites

1.  **API Key:** Create a free account on [hadithapi.com](https://hadithapi.com) to obtain your API key.

## Installation

1.  **Clone the Repository:**

    ```bash
    git clone https://github.com/adityafakhrii/ramadhanjs-2025
    cd path/to/ramadhanjs-2025/Hari 4 - Tasbih Counter/caesar003/
    ```

2.  **Environment Configuration:**

    -   Copy `.env.sample` to `.env`.
    -   Replace `<your-api-key>` with your actual API key in the `.env` file:
        ```
        API_KEY=<your-api-key>
        ```

3.  **Install Dependencies:**
    ```bash
    npm install
    ```

## Usage

-   **Run the Script:**
    ```bash
    node index.js
    ```

## Script Details

The `index.js` script includes a shebang (`#!/usr/bin/env node`) at the top, allowing Unix-based systems (macOS, Linux) to directly execute the script without explicitly using `node`. Windows users can still run the script using `node index.js`.

```javascript
#!/usr/bin/env node

// ... rest of the script ...
```

Given that above, you can simply add executable permission and make a link to your path so it is accessible anywhere within your system

```bash
chmod +x <path-to-index.js>

# then create symbolic link
ln -s <path-to-index.js> ~/.local/bin/daily-hadith # or somewhere else as long as it's defined in your path

# then you can just run it
daily-hadith
```
