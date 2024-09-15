import { NextResponse } from 'next/server';
import axios from 'axios';
const cheerio = require('cheerio');

// POST request handler for extracting metadata from a URL
export async function POST(req: Request) {
  try {
    // Extract URL from the request body
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Fetch the HTML content of the given URL
    const { data } = await axios.get(url);

    // Use Cheerio to load the HTML content
    const $ = cheerio.load(data);

    // Extract metadata from Open Graph tags or fall back to basic tags
    const title = $('meta[property="og:title"]').attr('content') || $('title').text() || '';
    const description = $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content') || '';
    const mediaType = $('meta[property="og:type"]').attr('content') || 'website'; // Default to 'website' if no media type is found

    // Respond with the extracted metadata
    return NextResponse.json({ title, description, mediaType }, { status: 200 });

  } catch (error) {
    console.error('Error fetching metadata:', error);
    return NextResponse.json({ error: 'Failed to fetch metadata' }, { status: 500 });
  }
}
