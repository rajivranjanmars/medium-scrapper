import { serve } from "bun";
import { parse } from "node-html-parser";

interface MediumArticle {
  title: string;
  article_link: string;
  cover_image: string | null;
}

interface SubstackArticle {
  title: string;
  article_link: string;
  cover_image: string | null;
}

serve({
  async fetch(req) {
    try {
      const url = new URL(req.url);
      const website = url.searchParams.get("website");
      const username = url.searchParams.get("username");

      if (!website || !username) {
        return new Response(JSON.stringify({ error: "Missing parameters" }), {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        });
      }

      const allowedWebsites = ["medium", "substack"];
      if (!allowedWebsites.includes(website.toLowerCase())) {
        return new Response(JSON.stringify({ error: "Invalid website" }), {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        });
      }

      let targetUrl: string = "";
      if (website.toLowerCase() === "medium") {
        targetUrl = `https://medium.com/@${username}`;
      } else if (website.toLowerCase() === "substack") {
        targetUrl = `https://${username}.substack.com/api/v1/archive?sort=new&limit=8`;
      }

      const response = await fetch(targetUrl);
      const data = await response.text();

      if (website.toLowerCase() === "medium") {
        const root = parse(data);
        const scrapedData: MediumArticle[] = [];
        const h2Elements = root.querySelectorAll('a > h2');
        h2Elements.forEach(h2 => {
          const parentA = h2.parentNode as unknown as HTMLElement;
          const article_link = `https://medium.com${parentA.getAttribute('href')}`;
          const title = h2.textContent;

          const div = parentA.closest('div.ab.cn');
          let cover_image: string | null = null;
          if (div) {
            const imgs = div.querySelectorAll('img');
            if (imgs.length >= 2) {
              cover_image = imgs[1].getAttribute('src');
            }
          }

          scrapedData.push({ title, article_link, cover_image });
        });

        return new Response(JSON.stringify(scrapedData), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        });
      } else if (website.toLowerCase() === "substack") {
        const jsonData = JSON.parse(data);
        const scrapedData: SubstackArticle[] = jsonData.map((article: any) => ({
          title: article.title,
          article_link: article.canonical_url,
          cover_image: article.cover_image,
        }));

        return new Response(JSON.stringify(scrapedData), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
    } catch (error) {
      return new Response(JSON.stringify({ error: "Internal Server Error" }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  },
  port: 3000,
});
