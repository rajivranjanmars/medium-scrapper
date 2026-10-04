# EC Scrapper

## Setup

1. Install Bun.js from [Bun.sh](https://bun.sh).
2. Clone this repository.
3. Navigate to the project directory.
4. Install dependencies:

```sh
bun install
```

## Running the API

### Using Bun

```sh
bun run index.ts
```

### Using PM2

```sh
bun run start:pm2
```

The API will be available at `http://localhost:3000`.

## API Usage

### Endpoint

`GET /`

### Query Parameters

- `website`: The website URL (must be either `medium` or `substack`).
- `username`: The username.

### Example Request

```sh
curl "http://localhost:3000/?website=medium&username=johndoe"
```

### Example Response

For Medium, the JSON data of the scraped content will be returned:

```json
[
  {
    "title": "Article Title 1",
    "article_link": "https://medium.com/@username/article-title-1",
    "cover_image": "https://example.com/image1.jpg"
  },
  {
    "title": "Article Title 2",
    "article_link": "https://medium.com/@username/article-title-2",
    "cover_image": "https://example.com/image2.jpg"
  }
]
```

For Substack, the JSON data of the scraped content will be returned:

```json
[
  {
    "title": "Article Title 1",
    "article_link": "https://substack.com/article-title-1",
    "cover_image": "https://example.com/image1.jpg"
  },
  {
    "title": "Article Title 2",
    "article_link": "https://substack.com/article-title-2",
    "cover_image": "https://example.com/image2.jpg"
  }
]
```


## Author

[rajivranjanmars](https://rajivranjana.in)
