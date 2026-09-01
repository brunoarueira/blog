// After a successful production deploy, purge the Cloudflare cache so new
// posts and updated pages show up at the edge right away instead of waiting
// for the existing cache entries to expire.
//
// Requires two environment variables on the Netlify site:
//   CLOUDFLARE_ZONE_ID          - the zone id for brunoarueira.com
//   CLOUDFLARE_PURGE_API_TOKEN  - API token with the "Zone.Cache Purge" permission
//
// If either is missing, or the context is not production, the plugin logs and
// skips. A failed purge is reported but does not fail the deploy, since the
// deploy is already live by the time this hook runs.

const purgeEndpoint = (zoneId) =>
  `https://api.cloudflare.com/client/v4/zones/${zoneId}/purge_cache`;

module.exports = {
  onSuccess: async ({ utils }) => {
    const context = process.env.CONTEXT;
    if (context !== 'production') {
      console.log(`[cloudflare-purge] context is "${context}", skipping purge.`);
      return;
    }

    const zoneId = process.env.CLOUDFLARE_ZONE_ID;
    const token = process.env.CLOUDFLARE_PURGE_API_TOKEN;
    if (!zoneId || !token) {
      console.log(
        '[cloudflare-purge] CLOUDFLARE_ZONE_ID or CLOUDFLARE_PURGE_API_TOKEN not set, skipping purge.',
      );
      return;
    }

    let response;
    let result;
    try {
      response = await fetch(purgeEndpoint(zoneId), {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ purge_everything: true }),
      });
      result = await response.json().catch(() => null);
    } catch (error) {
      console.error(`[cloudflare-purge] request to Cloudflare failed: ${error.message}`);
      utils.status.show({
        title: 'Cloudflare cache purge failed',
        summary: `Request error: ${error.message}. The deploy is live but the edge cache was not purged.`,
      });
      return;
    }

    if (!response.ok || !result || result.success !== true) {
      const detail = result ? JSON.stringify(result.errors ?? result) : `HTTP ${response.status}`;
      console.error(`[cloudflare-purge] Cloudflare rejected the purge: ${detail}`);
      utils.status.show({
        title: 'Cloudflare cache purge failed',
        summary: `Cloudflare rejected the purge: ${detail}. The deploy is live but the edge cache was not purged.`,
      });
      return;
    }

    console.log('[cloudflare-purge] purged the Cloudflare cache (purge_everything).');
    utils.status.show({
      title: 'Cloudflare cache purged',
      summary: 'Ran purge_everything so new posts show up at the edge immediately.',
    });
  },
};
