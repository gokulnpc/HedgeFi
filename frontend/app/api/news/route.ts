import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;
  //   console.log(apiKey);

  if (!apiKey) {
    return NextResponse.json({ error: "Invalid API KEY" }, { status: 401 });
  }

  try {
    const searchTerm = "meme+coin";
    const [everythingResponse, headlinesResponse] = await Promise.all([
      fetch(
        `https://newsapi.org/v2/everything?q=${searchTerm}&sortBy=relevancy&language=en&pageSize=50&apiKey=${apiKey}`
      ),
      fetch(
        `https://newsapi.org/v2/top-headlines?q=${searchTerm}}&country=es&language=en&pageSize=50&apiKey=${apiKey}`
      ),
    ]);

    const [everythingData, headlinesData] = await Promise.all([
      everythingResponse.json(),
      headlinesResponse.json(),
    ]);

    // Combine and filter articles
    const allArticles = [
      ...(headlinesData.articles || []),
      ...(everythingData.articles || []),
    ].filter(
      (article) =>
        article.title &&
        article.description &&
        (article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Remove duplicates and get up to 15 articles
    const uniqueArticles = Array.from(
      new Map(allArticles.map((article) => [article.title, article])).values()
    ).slice(0, 6);

    console.log("response", uniqueArticles)

    return NextResponse.json(uniqueArticles);
  } catch (error) {
    return NextResponse.json({ error: "Failed to load news" }, { status: 500 });
  }
}
