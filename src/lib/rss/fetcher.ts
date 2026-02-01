/**
 * Fetches and extracts main content from article URLs
 * Used when RSS feed doesn't provide sufficient content
 */

const MIN_CONTENT_LENGTH = 200; // Minimum characters needed for good summary

/**
 * Extract main text content from HTML
 */
function extractTextFromHtml(html: string): string {
  // Remove script and style tags with their content
  let text = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

  // Remove HTML tags
  text = text.replace(/<[^>]+>/g, ' ');

  // Decode HTML entities
  text = text.replace(/&nbsp;/g, ' ');
  text = text.replace(/&amp;/g, '&');
  text = text.replace(/&lt;/g, '<');
  text = text.replace(/&gt;/g, '>');
  text = text.replace(/&quot;/g, '"');
  text = text.replace(/&#39;/g, "'");

  // Clean up whitespace
  text = text.replace(/\s+/g, ' ').trim();

  return text;
}

/**
 * Fetch article content from URL
 */
export async function fetchArticleContent(url: string): Promise<string> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AITechBrief/1.0)',
        'Accept': 'text/html,application/xhtml+xml',
      },
    });

    clearTimeout(timeout);

    if (!response.ok) {
      console.error(`Failed to fetch ${url}: ${response.status}`);
      return '';
    }

    const html = await response.text();
    const text = extractTextFromHtml(html);

    // Limit content length for AI processing (avoid token limits)
    const maxLength = 5000;
    return text.length > maxLength ? text.substring(0, maxLength) : text;
  } catch (error) {
    console.error(`Error fetching article from ${url}:`, error);
    return '';
  }
}

/**
 * Get content for summarization, fetching from URL if RSS content is insufficient
 */
export async function getContentForSummary(
  rssContent: string,
  articleUrl: string
): Promise<string> {
  // If RSS content is sufficient, use it
  if (rssContent && rssContent.length >= MIN_CONTENT_LENGTH) {
    return rssContent;
  }

  // Otherwise, fetch from the article URL
  console.log(`RSS content insufficient (${rssContent?.length || 0} chars), fetching from URL: ${articleUrl}`);
  const fetchedContent = await fetchArticleContent(articleUrl);

  // Return fetched content, or fallback to RSS content if fetch failed
  if (fetchedContent && fetchedContent.length >= MIN_CONTENT_LENGTH) {
    return fetchedContent;
  }

  // Last resort: combine both
  return `${rssContent || ''} ${fetchedContent || ''}`.trim();
}
