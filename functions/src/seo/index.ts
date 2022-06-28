import axios from 'axios'
import * as functions from 'firebase-functions'
import * as fs from 'fs'
import { CONFIG } from '../config/config'
import { requestHandler } from './render/request-handler'
import { generateSitemap } from './sitemap/sitemapGenerate'

/**
 * Serve pre-rendered html with enhanced SEO metadata for requests from bots
 */
export const seoRender = functions.https.onRequest(
  requestHandler({
    prerenderApiKey: CONFIG.prerender?.api_key,
    deploymentUrl: CONFIG.deployment.site_url,
    httpClient: axios.get,
    syncFileReader: fs.readFileSync,
    logger: functions.logger,
  }),
)

/**
 * Generate a weekly sitemap of all content
 *
 * Local emulators test path:
 * http://localhost:4002/community-platform-emulated/us-central1/emulator/pubsub/schedule/seo-sitemapGenerate
 */
export const sitemapGenerate = functions.pubsub
  .schedule('0 2 * * MON')
  .onRun(() => generateSitemap())

/**
 * Read saved sitemap.xml from storage and return on request for sitemap
 *
 * Test in emulator:
 * http://localhost:4002/community-platform-emulated/us-central1/seo-sitemapProxy
 */
export const sitemapProxy = functions.https.onRequest(async (req, res) =>
  sitemapProxy(req, res),
)
