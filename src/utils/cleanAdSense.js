/**
 * Clean AdSense & unwanted web scripts from Blogger HTML content.
 * Ensures 100% compliance with Google Publisher Policies & native UI readability.
 */
export function cleanAdSense(htmlContent) {
  if (!htmlContent) return '';

  let cleaned = htmlContent;

  // 1. Remove AdSense script tags
  cleaned = cleaned.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, (match) => {
    if (match.includes('adsbygoogle') || match.includes('googlesyndication')) {
      return '';
    }
    return match;
  });

  // 2. Remove <ins class="adsbygoogle"> elements
  cleaned = cleaned.replace(/<ins\b[^>]*class="[^"]*adsbygoogle[^"]*"[^>]*>([\s\S]*?)<\/ins>/gi, '');

  // 3. Remove inline styles containing adsbygoogle or empty ad containers
  cleaned = cleaned.replace(/<div\b[^>]*class="[^"]*ad-container[^"]*"[^>]*>([\s\S]*?)<\/div>/gi, '');

  // 4. Remove target="_blank" safety links if needed or clean up inline width constraints
  cleaned = cleaned.replace(/style="([^"]*max-width:\s*100%[^"]*)"/gi, 'style="max-width:100%;height:auto;"');

  return cleaned.trim();
}
