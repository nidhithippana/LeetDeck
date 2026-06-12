export type InterviewQuestion = {
  id: string;
  title: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  prompt: string;
};

export const INTERVIEW_CATEGORIES = [
  'Storage & Data',
  'Social & Feeds',
  'Communication',
  'Infrastructure',
  'Search & Discovery',
  'E-Commerce & Finance',
  'Maps & Location',
] as const;

export const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  // ─── Storage & Data ──────────────────────────────────────────────────────
  {
    id: 'iq-url-shortener',
    title: 'Design a URL Shortener',
    category: 'Storage & Data',
    difficulty: 'Easy',
    prompt: `Design a URL shortening service like bit.ly or TinyURL.

**Functional requirements:**
- Users can submit a long URL and receive a short alias (e.g., short.ly/abc123)
- Visiting the short URL redirects to the original URL
- Links can optionally expire after a set time

**Non-functional requirements:**
- Reads (redirects) are 100× more frequent than writes
- System should handle 100M new URLs per day
- Links should redirect with sub-100ms latency globally

**Discuss:** URL encoding scheme, storage, database choice, caching strategy for hot URLs, and how to handle expiration.`,
  },
  {
    id: 'iq-pastebin',
    title: 'Design Pastebin',
    category: 'Storage & Data',
    difficulty: 'Easy',
    prompt: `Design a text storage service like Pastebin or GitHub Gist.

**Functional requirements:**
- Users can upload a text blob and get a unique URL
- Anyone with the URL can read the content
- Content can optionally expire

**Non-functional requirements:**
- 1M new pastes per day; 10M reads per day
- Each paste is up to 10MB of text
- High availability; 99.9% uptime

**Discuss:** how to store large text blobs efficiently (object storage vs. database), URL key generation, caching hot pastes, and expiration cleanup.`,
  },
  {
    id: 'iq-kv-store',
    title: 'Design a Key-Value Store',
    category: 'Storage & Data',
    difficulty: 'Medium',
    prompt: `Design a distributed key-value store similar to DynamoDB or Cassandra.

**Functional requirements:**
- \`put(key, value)\` — stores or updates a key
- \`get(key)\` — retrieves the value for a key
- \`delete(key)\` — removes a key

**Non-functional requirements:**
- High availability (AP over CP for the default mode)
- Horizontal scalability to petabytes
- Sub-10ms p99 read and write latency

**Discuss:** partitioning (consistent hashing), replication strategy, conflict resolution (vector clocks, last-write-wins), gossip protocol for node membership, and tunable consistency (quorum reads/writes).`,
  },
  {
    id: 'iq-distributed-cache',
    title: 'Design a Distributed Cache',
    category: 'Storage & Data',
    difficulty: 'Medium',
    prompt: `Design a distributed caching system similar to Memcached or Redis Cluster.

**Functional requirements:**
- Get, set, and delete cache entries
- Support TTL-based expiration
- Cache can be shared across many application servers

**Non-functional requirements:**
- Sub-millisecond read/write latency
- Horizontal scalability
- Handles cache node failures gracefully (no massive cache miss storm)

**Discuss:** consistent hashing for key distribution, replication for fault tolerance, eviction policies (LRU/LFU), cache invalidation strategies, and how to handle a cache node going down.`,
  },
  {
    id: 'iq-dropbox',
    title: 'Design Dropbox / Google Drive',
    category: 'Storage & Data',
    difficulty: 'Hard',
    prompt: `Design a cloud file storage and sync service like Dropbox or Google Drive.

**Functional requirements:**
- Upload, download, and delete files up to 50GB
- Sync files across devices automatically
- Support shared folders
- Keep version history

**Non-functional requirements:**
- 500M users, 1B files total
- Prioritize consistency — users should see the same files everywhere
- Optimize bandwidth: don't re-upload unchanged file chunks

**Discuss:** chunking files for delta sync, deduplication using content hashing, metadata vs. blob storage separation, synchronization protocol, conflict resolution when offline edits merge.`,
  },
  {
    id: 'iq-message-queue',
    title: 'Design a Message Queue',
    category: 'Storage & Data',
    difficulty: 'Medium',
    prompt: `Design a distributed message queue like Apache Kafka or Amazon SQS.

**Functional requirements:**
- Producers publish messages to named topics
- Consumers subscribe and receive messages in order
- At-least-once delivery guarantee
- Messages are retained for 7 days

**Non-functional requirements:**
- 1 million messages per second ingestion rate
- Messages up to 1MB each
- Consumers can replay from any offset

**Discuss:** log-based storage (why sequential writes are fast), partitioning for parallelism, consumer groups and offset tracking, replication for durability, and how to handle slow consumers without blocking producers.`,
  },

  // ─── Social & Feeds ──────────────────────────────────────────────────────
  {
    id: 'iq-twitter-timeline',
    title: 'Design Twitter / X Timeline',
    category: 'Social & Feeds',
    difficulty: 'Hard',
    prompt: `Design the home timeline feature for Twitter/X — showing a user's personalized feed of tweets from people they follow.

**Functional requirements:**
- Post a tweet (text up to 280 chars, optional media)
- View a home timeline (ranked feed from followed accounts)
- Like and retweet

**Non-functional requirements:**
- 300M daily active users
- Timeline must load in under 1 second
- "Celebrity problem": some accounts have 100M followers

**Discuss:** fan-out on write (push to followers' feeds) vs. fan-out on read (pull at query time), hybrid approach for celebrities, caching timelines in Redis, ranking/ordering, and how media (images/video) is handled separately.`,
  },
  {
    id: 'iq-instagram',
    title: 'Design Instagram',
    category: 'Social & Feeds',
    difficulty: 'Hard',
    prompt: `Design a photo-sharing social network like Instagram.

**Functional requirements:**
- Upload photos and short videos with captions
- Follow/unfollow users
- View a personalized feed
- Like and comment on posts

**Non-functional requirements:**
- 1B users, 100M photos uploaded per day
- Media storage at massive scale
- Feed must load in under 2 seconds

**Discuss:** CDN + object storage for media, feed generation (push vs. pull), photo deduplication, sharding user/post/follow data, caching hot posts and profiles, and recommendations.`,
  },
  {
    id: 'iq-news-feed',
    title: 'Design a News Feed System',
    category: 'Social & Feeds',
    difficulty: 'Medium',
    prompt: `Design a generic social news feed system (like Facebook's feed or LinkedIn's homepage).

**Functional requirements:**
- Users publish posts (text, link, image)
- Users see a ranked feed from people/pages they follow
- Support likes, comments, shares

**Non-functional requirements:**
- 500M daily active users
- Feed ranking uses engagement signals (likes, recency, relationship strength)
- Handle bursts: viral posts can get millions of interactions within minutes

**Discuss:** fanout architecture, feed ranking pipeline (offline pre-computation vs. online scoring), write amplification for highly-connected users, caching strategies, and counters for likes at scale.`,
  },
  {
    id: 'iq-tiktok',
    title: 'Design TikTok / Short Video Feed',
    category: 'Social & Feeds',
    difficulty: 'Hard',
    prompt: `Design a short-form video platform like TikTok with a personalized "For You" feed.

**Functional requirements:**
- Upload short videos (up to 3 minutes)
- Infinite personalized feed with near-instant playback
- Like, comment, share, follow creators

**Non-functional requirements:**
- 1B daily active users
- Videos must start playing within 1 second of scroll
- The recommendation algorithm is a core differentiator

**Discuss:** video transcoding pipeline, CDN pre-positioning for predicted viral content, recommendation system architecture (two-tower model, candidate retrieval + ranking), real-time engagement signals feeding the ranker, and geographic content moderation.`,
  },

  // ─── Communication ────────────────────────────────────────────────────────
  {
    id: 'iq-whatsapp',
    title: 'Design WhatsApp / Chat',
    category: 'Communication',
    difficulty: 'Medium',
    prompt: `Design a real-time 1-on-1 and group messaging system like WhatsApp.

**Functional requirements:**
- Send and receive text messages in real-time
- Group chats (up to 1,000 members)
- Message delivery receipts (sent / delivered / read)
- Media sharing (images, videos)

**Non-functional requirements:**
- 2B users, 100B messages per day
- Messages should arrive within 500ms when both users are online
- End-to-end delivery guarantees — no message loss

**Discuss:** WebSocket connections for real-time delivery, message storage model, fan-out for group chats, offline message queuing, receipts, and how media is handled separately from message metadata.`,
  },
  {
    id: 'iq-notification',
    title: 'Design a Notification System',
    category: 'Communication',
    difficulty: 'Medium',
    prompt: `Design a large-scale notification delivery system supporting push, email, and SMS.

**Functional requirements:**
- Send notifications triggered by system events (new message, order shipped, etc.)
- Channels: push notification (iOS/Android), email, SMS
- User preference management (which channels to use, do-not-disturb)

**Non-functional requirements:**
- 10M notifications per day across all channels
- Soft real-time: push notifications within 5 seconds
- Reliable delivery — at-least-once semantics

**Discuss:** event-driven architecture (producers → message queue → workers per channel), retry/dead-letter queue strategy, rate limiting to avoid flagging as spam, third-party provider integration (APNs, FCM, SendGrid, Twilio), and user preference enforcement.`,
  },
  {
    id: 'iq-live-comments',
    title: 'Design a Live Comment / Chat System',
    category: 'Communication',
    difficulty: 'Medium',
    prompt: `Design a live comment system for a streaming platform (like YouTube Live or Twitch chat).

**Functional requirements:**
- Users post comments in real-time during a live stream
- All viewers see new comments within 1-2 seconds
- Moderation: flag and remove comments

**Non-functional requirements:**
- Popular streams: 1M concurrent viewers, 10,000 messages per second
- System must scale up instantly when a stream goes viral

**Discuss:** WebSocket vs. SSE for message delivery, pub/sub fan-out at scale, sharding by stream ID, comment storage, rate limiting per user, moderation pipeline, and how you handle sudden traffic spikes.`,
  },

  // ─── Infrastructure ────────────────────────────────────────────────────────
  {
    id: 'iq-rate-limiter',
    title: 'Design a Rate Limiter',
    category: 'Infrastructure',
    difficulty: 'Easy',
    prompt: `Design a distributed rate limiting system for an API gateway.

**Functional requirements:**
- Limit each client (by API key or IP) to N requests per time window
- Return HTTP 429 with a Retry-After header when the limit is exceeded
- Support multiple rate limit tiers (free: 100/min, pro: 10,000/min)

**Non-functional requirements:**
- Must work across multiple API gateway nodes (not just in-process)
- Low latency overhead: < 5ms per check
- Approximate accuracy is acceptable (1-5% error margin)

**Discuss:** token bucket vs. sliding window log vs. fixed window algorithms, using Redis for shared counters, the sliding window approximation trick, and how to handle Redis failures gracefully.`,
  },
  {
    id: 'iq-web-crawler',
    title: 'Design a Web Crawler',
    category: 'Infrastructure',
    difficulty: 'Medium',
    prompt: `Design a distributed web crawler that indexes the internet for a search engine.

**Functional requirements:**
- Start from seed URLs and recursively discover and download web pages
- Avoid crawling the same URL twice
- Respect robots.txt
- Re-crawl pages periodically to keep index fresh

**Non-functional requirements:**
- Must crawl 1 billion pages within a week
- Politeness: don't overwhelm any single server
- Storage: efficiently store and deduplicate downloaded pages

**Discuss:** URL frontier (priority queue), distributed deduplication (Bloom filter), DNS caching, politeness policy (per-domain rate limits), content deduplication (SimHash), parsing and link extraction pipeline, and re-crawl scheduling.`,
  },
  {
    id: 'iq-api-gateway',
    title: 'Design an API Gateway',
    category: 'Infrastructure',
    difficulty: 'Easy',
    prompt: `Design an API gateway that sits between clients and a fleet of microservices.

**Functional requirements:**
- Route requests to the correct backend service
- Authenticate and authorize requests (JWT validation)
- Rate limit per client
- Aggregate responses from multiple services for a single client request

**Non-functional requirements:**
- < 10ms added latency
- 99.99% availability
- Handles 500K requests per second

**Discuss:** how the gateway routes requests (path-based, header-based), SSL termination, authentication flow, fan-out aggregation (request fan-out + merge), circuit breaking for downstream services, and how to handle versioning (v1/v2 of services).`,
  },
  {
    id: 'iq-cdn',
    title: 'Design a Content Delivery Network (CDN)',
    category: 'Infrastructure',
    difficulty: 'Hard',
    prompt: `Design a global CDN that serves static and dynamic content with low latency worldwide.

**Functional requirements:**
- Cache static assets (images, JS, CSS, video) at edge nodes near users
- Route users to the nearest available edge node
- Support cache invalidation
- Handle both pull (on-demand caching) and push (pre-warmed) content

**Non-functional requirements:**
- 100Tbps peak global traffic
- Cache hit rate ≥ 95% for static content
- Serve content in < 50ms from edge to user

**Discuss:** anycast routing for edge selection, how pull vs. push CDNs populate edges, cache eviction and TTL, origin shield (a mid-tier cache), cache invalidation propagation, and how to handle uncacheable (personalized) requests.`,
  },
  {
    id: 'iq-monitoring',
    title: 'Design a Metrics & Monitoring System',
    category: 'Infrastructure',
    difficulty: 'Medium',
    prompt: `Design a metrics collection and alerting system like Datadog or Prometheus.

**Functional requirements:**
- Services report metrics (counters, gauges, histograms) every 10 seconds
- Query metrics with time-range filters and aggregations (sum, avg, p99)
- Define alert rules that trigger PagerDuty when a threshold is crossed

**Non-functional requirements:**
- 1M metrics per second ingestion
- Queries must return within 2 seconds
- Data retention: full resolution for 15 days, rolled-up for 1 year

**Discuss:** push vs. pull collection model, time-series database (TSDB) design (why columnar storage and compression matter), down-sampling for long-term storage, alerting evaluation loop, and dashboard query path.`,
  },

  // ─── Search & Discovery ───────────────────────────────────────────────────
  {
    id: 'iq-typeahead',
    title: 'Design a Typeahead / Autocomplete System',
    category: 'Search & Discovery',
    difficulty: 'Medium',
    prompt: `Design a search autocomplete feature that suggests queries as a user types (like Google Search suggestions).

**Functional requirements:**
- Return top 10 suggestions for any prefix within 100ms
- Suggestions are ranked by search frequency
- Update suggestions with new search trends in near real-time

**Non-functional requirements:**
- 10M QPS at peak
- Latency: p99 < 100ms including network
- 5 billion unique search queries in the index

**Discuss:** trie vs. inverted index for prefix lookup, how to pre-compute and cache top-K suggestions per prefix, distributed trie sharded by prefix, aggregating search frequency in a streaming pipeline, and how the client reduces API calls (debounce, only fire after N chars).`,
  },
  {
    id: 'iq-search-engine',
    title: 'Design a Search Engine',
    category: 'Search & Discovery',
    difficulty: 'Hard',
    prompt: `Design a web-scale search engine (like Google Search).

**Functional requirements:**
- Index web pages and return the most relevant results for a query
- Results must include title, snippet, and URL
- Support advanced operators (site:, filetype:, etc.)

**Non-functional requirements:**
- Index of 10 billion pages
- Query latency < 500ms globally
- Freshness: breaking news should appear in results within minutes

**Discuss:** the crawling pipeline, inverted index construction (how you map terms → document list with positions), ranking (TF-IDF, PageRank, ML ranking), query processing (tokenization, query expansion, spell correction), the serving stack (query → multiple retrieval shards → merge → rank → serve), and index freshness via real-time indexing for important content.`,
  },
  {
    id: 'iq-recommendation',
    title: 'Design a Recommendation System',
    category: 'Search & Discovery',
    difficulty: 'Hard',
    prompt: `Design a product recommendation system (like Amazon's "Customers also bought" or Netflix's "Top Picks").

**Functional requirements:**
- Show personalized recommendations on the homepage and product/content pages
- Recommendations based on: past behavior, similar users, similar items
- Near-real-time: recent interactions (last click) should influence results

**Non-functional requirements:**
- 300M users, 10M items
- Recommendations must load in < 200ms
- System should improve as more interaction data is collected

**Discuss:** collaborative filtering vs. content-based filtering vs. hybrid, offline training pipeline (batch embeddings), candidate retrieval via ANN search (FAISS, ScaNN), re-ranking with a lightweight online model, real-time feature updates, and A/B testing framework for experimenting on the ranking model.`,
  },

  // ─── Maps & Location ─────────────────────────────────────────────────────
  {
    id: 'iq-uber',
    title: 'Design Uber / Ride Sharing',
    category: 'Maps & Location',
    difficulty: 'Hard',
    prompt: `Design a ride-sharing platform like Uber or Lyft.

**Functional requirements:**
- Rider requests a ride; system matches them with a nearby driver
- Driver's location is tracked in real-time during the trip
- Surge pricing based on supply/demand ratio

**Non-functional requirements:**
- 5M trips per day across many cities
- Match must happen within 5 seconds
- Driver location updates every 5 seconds

**Discuss:** geohashing for efficient nearby driver lookup, real-time location update ingestion (WebSocket or HTTP polling), the matching algorithm (radius expansion if no driver found), the trip state machine, surge pricing calculation, and how to handle the system in city-specific geographic regions.`,
  },
  {
    id: 'iq-google-maps',
    title: 'Design Google Maps',
    category: 'Maps & Location',
    difficulty: 'Hard',
    prompt: `Design a mapping and navigation service like Google Maps.

**Functional requirements:**
- Display a map with roads, buildings, and points of interest
- Compute fastest driving route from A to B
- Real-time traffic updates affecting route ETA

**Non-functional requirements:**
- 1B users
- Map tiles must render in < 200ms
- Route computation in < 2 seconds

**Discuss:** how map tiles are pre-rendered at different zoom levels and served via CDN, graph representation of road network, shortest path algorithms (Dijkstra, A*, contraction hierarchies for large graphs), incorporating real-time traffic data into edge weights, and how to handle map updates (new roads, closures).`,
  },
  {
    id: 'iq-nearby',
    title: 'Design a Proximity / Nearby Search Service',
    category: 'Maps & Location',
    difficulty: 'Medium',
    prompt: `Design a "find nearby" service — like Yelp's nearby restaurant search or finding nearby drivers.

**Functional requirements:**
- Given a user's location, return K closest points of interest (restaurants, drivers, ATMs) within radius R
- Filter by category
- Results sorted by distance

**Non-functional requirements:**
- 100M places in the database
- 1M QPS at peak
- < 100ms latency

**Discuss:** geohashing (how encoding lat/lng to a string enables prefix-based range queries), alternatives like quadtrees and S2 cells, database indexing strategies for geospatial queries (PostGIS, geohash index), handling the edge case where a geohash cell boundary splits nearby places, and caching strategies for static data (places don't move).`,
  },

  // ─── E-Commerce & Finance ─────────────────────────────────────────────────
  {
    id: 'iq-payment',
    title: 'Design a Payment System',
    category: 'E-Commerce & Finance',
    difficulty: 'Hard',
    prompt: `Design a payment processing system like Stripe or PayPal.

**Functional requirements:**
- Users can initiate a payment from wallet A to wallet B
- Support idempotent retries — no double charges
- Payment confirmation within 3 seconds
- Transaction history

**Non-functional requirements:**
- 1M transactions per day
- Exactly-once semantics — money must never be created or destroyed
- Strict compliance requirements (PCI DSS)

**Discuss:** idempotency key implementation to prevent duplicate charges, the ledger data model (double-entry bookkeeping), two-phase commit or Saga for distributed transactions across multiple banks/services, reconciliation jobs to detect discrepancies, fraud detection hooks, and how to handle partial failures (payment sent but confirmation lost).`,
  },
  {
    id: 'iq-ecommerce',
    title: 'Design an E-Commerce Platform',
    category: 'E-Commerce & Finance',
    difficulty: 'Medium',
    prompt: `Design an online marketplace like Amazon.

**Functional requirements:**
- Browse and search for products
- Add to cart and checkout
- Order tracking
- Inventory management to prevent overselling

**Non-functional requirements:**
- 50M products, 100M users
- Flash sales: 10× normal traffic for 5 minutes
- Inventory must be accurate — no overselling allowed

**Discuss:** product catalog service, the checkout flow and inventory reservation (optimistic locking vs. pessimistic locking), flash sale handling (queue-based checkout, pre-warming cache), order state machine, payment integration, and how search is separated from the product catalog for performance.`,
  },
  {
    id: 'iq-hotel-booking',
    title: 'Design a Hotel Booking System',
    category: 'E-Commerce & Finance',
    difficulty: 'Medium',
    prompt: `Design a hotel room reservation system like Booking.com or Airbnb.

**Functional requirements:**
- Search available rooms by location, dates, and price range
- Reserve a room for specific dates (no double booking)
- Cancel a reservation

**Non-functional requirements:**
- 5M hotels, 100M bookings per year
- No double booking — two users can't book the same room for overlapping dates
- Searches must return results in < 1 second

**Discuss:** the availability data model (how to efficiently query "is room X available from date A to B"), locking strategy to prevent double booking (optimistic locking with version fields vs. SELECT FOR UPDATE), caching availability for read-heavy search, and the booking state machine (pending → confirmed → cancelled).`,
  },
  {
    id: 'iq-ad-click',
    title: 'Design an Ad Click Aggregator',
    category: 'E-Commerce & Finance',
    difficulty: 'Hard',
    prompt: `Design a real-time ad click aggregation system for a digital advertising platform.

**Functional requirements:**
- Record every ad impression and click event
- Provide real-time (< 1 min delay) aggregated metrics: clicks per ad per minute
- Support querying click counts for any (ad_id, time_window)
- Detect click fraud

**Non-functional requirements:**
- 10 billion click events per day
- Aggregate queries return in < 1 second
- Data must be accurate enough for billing (< 0.01% error)

**Discuss:** event ingestion via Kafka, streaming aggregation (Apache Flink / Spark Streaming) computing rolling windows, a time-series store for pre-aggregated results (Druid, ClickHouse), lambda architecture vs. kappa architecture, late-event handling (out-of-order events and watermarks), and fraud detection signals.`,
  },
  {
    id: 'iq-stock-trading',
    title: 'Design a Stock Trading Platform',
    category: 'E-Commerce & Finance',
    difficulty: 'Hard',
    prompt: `Design an online stock trading platform like Robinhood.

**Functional requirements:**
- Users can place market and limit orders to buy/sell stocks
- View real-time stock prices and portfolio value
- Order matching engine: match buy and sell orders at the same price

**Non-functional requirements:**
- Real-time price updates (< 100ms latency)
- Order matching must guarantee FIFO and be atomic
- 10M users, peak 1M orders per second during market open

**Discuss:** the order book data structure (price-time priority queue), the matching engine as a single-threaded sequential processor (why this is intentional), market data distribution via pub/sub, portfolio valuation as a separate read path, risk checks before order submission, and regulatory audit logging.`,
  },
];
