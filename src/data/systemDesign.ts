export type SDCard = {
  id: string;
  topic: string;
  front: string;
  back: string;
};

export const SD_TOPICS = [
  'Scalability',
  'Databases',
  'Caching',
  'Load Balancing',
  'Message Queues',
  'Consistency & CAP',
  'Availability Patterns',
  'Asynchronism',
  'API Design',
  'Networking',
  'DNS & CDN',
  'Distributed Patterns',
  'Monitoring',
  'Cloud Patterns',
] as const;

export type SDTopic = (typeof SD_TOPICS)[number];

export const SD_CARDS: SDCard[] = [
  // ─── Scalability ────────────────────────────────────────────────────────
  {
    id: 'sd-scale-01',
    topic: 'Scalability',
    front: 'What is vertical scaling (scale up)?',
    back: `Adding more resources (CPU, RAM, faster disk) to a single existing machine.

- Simple to implement — no code changes required
- Hard upper limit: you can only buy so much hardware
- Single point of failure — one machine going down takes everything with it
- Best for: databases or services that are hard to distribute`,
  },
  {
    id: 'sd-scale-02',
    topic: 'Scalability',
    front: 'What is horizontal scaling (scale out)?',
    back: `Adding more machines to a pool and distributing load across them.

- No physical ceiling — add as many servers as needed
- Requires stateless services and a load balancer in front
- Enables fault tolerance — losing one node doesn't lose everything
- The default choice for modern cloud systems`,
  },
  {
    id: 'sd-scale-03',
    topic: 'Scalability',
    front: 'What is database sharding?',
    back: `Splitting a database horizontally across multiple servers using a **shard key**.

- Each shard holds a different subset of the data
- Solves write bottlenecks that replication alone cannot fix
- Cross-shard joins and transactions are expensive — avoid them
- Try vertical scaling + read replicas first; shard only when necessary`,
  },
  {
    id: 'sd-scale-04',
    topic: 'Scalability',
    front: 'How do you choose a good shard key?',
    back: `The shard key determines how data is distributed. A bad key causes hot spots.

- **High cardinality**: many distinct values so data spreads evenly
- **Even access pattern**: avoid keys where one value gets 80% of traffic
- **Avoid cross-shard queries**: shard by the entity that drives most queries (e.g., user_id)
- Common choices: user ID, geographic region, hash of primary key`,
  },
  {
    id: 'sd-scale-05',
    topic: 'Scalability',
    front: 'What does "stateless" mean in a service?',
    back: `A stateless service stores no session data between requests — each request is self-contained.

- Any server in the pool can handle any request
- Enables effortless horizontal scaling and any load-balancing strategy
- Session state lives externally in Redis or a database
- Contrast: **stateful** services require sticky sessions (client always hits the same server)`,
  },
  {
    id: 'sd-scale-06',
    topic: 'Scalability',
    front: 'Why separate the web layer from the application layer?',
    back: `Separating the **web layer** (frontend/API gateway) from the **platform layer** (business logic) lets each scale independently.

- The platform layer can serve multiple clients: web, mobile, third-party APIs
- You can scale the write-heavy API tier without scaling the read-heavy web tier
- Cleaner separation of concerns — easier to deploy independently
- Foundation for a microservices architecture`,
  },
  {
    id: 'sd-scale-07',
    topic: 'Scalability',
    front: 'What is a microservices architecture?',
    back: `Each service owns one business domain, has its own database, and is deployed independently.

- Services communicate over APIs (REST, gRPC, or message queues)
- Independent scaling: scale the checkout service without scaling the catalog service
- Independent deployments: teams ship without coordinating releases
- Trade-offs: network latency between services, distributed tracing complexity, data consistency challenges`,
  },
  {
    id: 'sd-scale-08',
    topic: 'Scalability',
    front: 'What are the trade-offs of microservices vs. a monolith?',
    back: `**Monolith**: simple to develop, test, deploy, and debug — until it gets too big.

**Microservices**: independent scaling and deployments, fault isolation — but at a cost.

- Microservices add latency (network calls replace in-process calls)
- Distributed systems are harder to debug: requires distributed tracing, correlation IDs
- Data consistency across services requires Sagas or eventual consistency
- Start with a monolith; extract services when a specific bottleneck demands it`,
  },

  // ─── Databases ──────────────────────────────────────────────────────────
  {
    id: 'sd-db-01',
    topic: 'Databases',
    front: 'When should you use SQL vs. NoSQL?',
    back: `**SQL** (relational): structured schema, ACID transactions, powerful joins.
**NoSQL**: flexible schema, horizontal write scaling, various data models.

- SQL: complex queries, strong consistency, related data with foreign keys
- NoSQL types: document (MongoDB), key-value (Redis), wide-column (Cassandra), graph (Neo4j)
- Choose based on your **access pattern**, not data size
- Default to SQL unless you have a specific reason to use NoSQL`,
  },
  {
    id: 'sd-db-02',
    topic: 'Databases',
    front: 'What is a database index and what are its trade-offs?',
    back: `An index (usually a B-tree) lets the DB find rows without scanning the whole table.

- Drastically speeds up \`SELECT\` on indexed columns
- Slows down \`INSERT\`, \`UPDATE\`, \`DELETE\` — every write must also update the index
- Add indexes on columns used in \`WHERE\`, \`ORDER BY\`, \`JOIN\` conditions
- Too many indexes = slow writes; profile before adding`,
  },
  {
    id: 'sd-db-03',
    topic: 'Databases',
    front: 'What is a composite index and the leftmost prefix rule?',
    back: `A **composite index** is built on two or more columns: e.g., \`(last_name, first_name)\`.

- Queries can use the index if they filter on the **leftmost** column(s) in order
- \`WHERE last_name = 'Smith'\` → uses the index ✓
- \`WHERE first_name = 'Alice'\` → cannot use the index ✗
- Column order matters: put the most selective (or most queried) column first`,
  },
  {
    id: 'sd-db-04',
    topic: 'Databases',
    front: 'What is database replication?',
    back: `Replication copies data from a **primary** node to one or more **replica** nodes.

- Improves **read throughput** — queries can be served from replicas
- Improves **availability** — a replica can be promoted if the primary fails
- Does NOT help with write throughput — all writes still go to the primary
- There is always a risk of **replication lag** — replicas may serve slightly stale data`,
  },
  {
    id: 'sd-db-05',
    topic: 'Databases',
    front: 'What is primary-replica (master-slave) replication?',
    back: `All **writes** go to the primary. **Reads** can be served from one or more replicas.

- Simple model — no write conflicts to resolve
- Read scaling: add more replicas to handle more reads
- Write bottleneck: the primary still handles all writes
- Failover: manually (or automatically) promote a replica if the primary dies`,
  },
  {
    id: 'sd-db-06',
    topic: 'Databases',
    front: 'What is primary-primary (multi-master) replication?',
    back: `Multiple nodes accept **writes** and replicate changes to each other.

- Higher write availability — any node can accept writes even if one goes down
- Useful for multi-region setups where each region needs a local write node
- **Write conflicts**: two nodes may accept conflicting changes simultaneously
- Conflict resolution strategies: last-write-wins (clock-based), application-level merge
- More complex to operate than primary-replica`,
  },
  {
    id: 'sd-db-07',
    topic: 'Databases',
    front: 'What is the difference between synchronous and asynchronous replication?',
    back: `**Synchronous**: the primary waits for the replica to confirm before committing.
**Asynchronous**: the primary commits immediately and replicates in the background.

- Synchronous: **zero data loss** on failover, but **higher write latency**
- Asynchronous: **lower latency**, but replica can fall behind — data loss possible if primary crashes
- Most systems use async replication with one synchronous standby for the failover node`,
  },
  {
    id: 'sd-db-08',
    topic: 'Databases',
    front: 'What is connection pooling and why does it matter?',
    back: `Connection pooling keeps a set of pre-opened database connections ready to reuse.

- Opening a DB connection is expensive: TCP handshake, authentication, resource allocation
- Without pooling: high traffic exhausts DB connection limits and causes failures
- Pool limits cap concurrent connections, protecting the database from overload
- Tools: pgBouncer (Postgres), HikariCP (Java), SQLAlchemy pool (Python)`,
  },
  {
    id: 'sd-db-09',
    topic: 'Databases',
    front: 'What is database federation (functional partitioning)?',
    back: `Federation splits a single large database into multiple smaller databases by **function** — e.g., separate DBs for users, products, and orders.

- Reduces read/write traffic per database
- Smaller databases fit more easily in memory → better cache hit rates
- No cross-database joins; the application must route to the right DB
- Useful when different domains have very different scale requirements`,
  },
  {
    id: 'sd-db-10',
    topic: 'Databases',
    front: 'What is denormalization and when should you use it?',
    back: `Denormalization adds **redundant data** to a schema to speed up reads at the cost of write complexity.

- Stores precomputed join results or duplicated fields alongside the source data
- Use when read/write ratio is very high and join overhead is measurable
- Every write must update all redundant copies — data can go out of sync
- Common in NoSQL (no joins), data warehouses, and high-read APIs`,
  },
  {
    id: 'sd-db-11',
    topic: 'Databases',
    front: 'What are the most important SQL query tuning techniques?',
    back: `- **\`EXPLAIN\`**: examine the query plan; find full table scans and missing indexes
- **Index the right columns**: \`WHERE\`, \`ORDER BY\`, \`GROUP BY\`, \`JOIN\` predicates
- **Avoid \`SELECT *\`**: fetch only the columns you need
- **Avoid N+1 queries**: use \`JOIN\` or batch loading instead of looping queries
- **Partition large tables**: limit scans to a smaller date/range partition`,
  },
  {
    id: 'sd-db-12',
    topic: 'Databases',
    front: 'What is the difference between OLTP and OLAP?',
    back: `**OLTP** (Online Transaction Processing): many short reads/writes, normalized schema, row-oriented.
**OLAP** (Online Analytical Processing): complex aggregations over millions of rows, denormalized, column-oriented.

- Mixing both on one database causes OLAP queries to block OLTP transactions
- Solution: use CDC or ETL to sync data from OLTP → a separate OLAP warehouse
- Examples: PostgreSQL (OLTP) vs. Snowflake / BigQuery / Redshift (OLAP)`,
  },
  {
    id: 'sd-db-13',
    topic: 'Databases',
    front: 'What is the N+1 query problem?',
    back: `Fetching a list of N items and then running **one extra query per item** to load a related field.

Example: load 100 posts, then run 100 queries to load each post's author.

- Fix with a SQL \`JOIN\`: fetch posts + authors in one query
- Fix with batch loading: load all 100 author IDs in a single \`WHERE id IN (...)\` query
- Common in ORMs if not careful (Hibernate, ActiveRecord, Sequelize)
- Causes a 100× increase in database round-trips for a seemingly simple page load`,
  },

  // ─── Caching ────────────────────────────────────────────────────────────
  {
    id: 'sd-cache-01',
    topic: 'Caching',
    front: 'What is cache-aside (lazy loading)?',
    back: `The application checks the cache first; on a miss, it reads from the DB and writes to the cache.

- **Read**: cache hit → return; miss → read DB → write to cache → return
- **Write**: update DB → invalidate or update the cache entry
- Only caches data that is actually requested — no wasted memory on cold data
- The most common caching pattern; gives full control to the application`,
  },
  {
    id: 'sd-cache-02',
    topic: 'Caching',
    front: 'What is write-through caching?',
    back: `Every write goes to **both the cache and the database simultaneously**.

- Data in the cache is always consistent with the database
- No write performance benefit — latency is the same as writing to the DB directly
- Avoids cache misses after a write (the cache is immediately populated)
- Best for: data that is written and then read very soon after`,
  },
  {
    id: 'sd-cache-03',
    topic: 'Caching',
    front: 'What is write-back (write-behind) caching?',
    back: `Writes go to the **cache first**; syncing to the database happens asynchronously later.

- Lower write latency — the response doesn't wait for the DB
- Higher write throughput — multiple writes can be batched into one DB write
- **Risk**: if the cache node fails before syncing, that data is lost
- Best for: high-frequency writes where small data loss is acceptable (counters, metrics)`,
  },
  {
    id: 'sd-cache-04',
    topic: 'Caching',
    front: 'What is LRU cache eviction?',
    back: `**Least Recently Used** evicts the item that was accessed least recently when the cache is full.

- Works on the assumption that recently accessed items will be accessed again soon
- The most common eviction policy; a good default for most use cases
- Implemented as a hash map + doubly-linked list (O(1) access and eviction)
- Redis supports LRU as its default eviction policy`,
  },
  {
    id: 'sd-cache-05',
    topic: 'Caching',
    front: 'What is LFU cache eviction and how does it differ from LRU?',
    back: `**Least Frequently Used** evicts the item accessed the fewest total times.

- LRU: evicts based on **recency** of last access
- LFU: evicts based on **frequency** of access over time
- LFU is better when popular items are accessed repeatedly over a long period
- LFU is more complex to implement and can keep stale "old hits" alive
- TTL (time-to-live) expiry is often combined with LRU/LFU to prevent stale data`,
  },
  {
    id: 'sd-cache-06',
    topic: 'Caching',
    front: 'What is refresh-ahead caching?',
    back: `The cache **proactively re-fetches** popular items before they expire, so users never hit a cold miss.

- Prevents latency spikes when a hot cache entry expires and many requests pile up
- Works best when future access patterns are predictable (trending content, daily summaries)
- Trade-off: wastes resources fetching data that may never be accessed again
- Pairs well with write-through to keep hot data perpetually warm`,
  },
  {
    id: 'sd-cache-07',
    topic: 'Caching',
    front: 'What is Redis and what makes it more than just a cache?',
    back: `Redis is an in-memory data store that supports rich data structures and optional persistence.

- Data types: strings, lists, sets, sorted sets, hashes, streams
- **Persistence**: RDB snapshots and AOF write-ahead log — survives restarts
- **Pub/sub**: broadcast messages to subscribers
- **Lua scripting**: atomic multi-step operations
- Use Memcached only if you need pure key-value with maximum raw throughput on many CPU cores`,
  },
  {
    id: 'sd-cache-08',
    topic: 'Caching',
    front: 'What are the main levels where caching can be applied?',
    back: `Caching can reduce load at every layer of the stack.

- **Client**: browser caches via \`Cache-Control\` and \`ETag\` headers
- **CDN**: edge nodes cache static and semi-static responses geographically
- **Web server / reverse proxy**: Nginx, Varnish cache responses before hitting the app
- **Application**: in-process LRU map or shared cache (Redis)
- **Database**: query result cache and buffer pool built into the DB engine`,
  },

  // ─── Load Balancing ─────────────────────────────────────────────────────
  {
    id: 'sd-lb-01',
    topic: 'Load Balancing',
    front: 'What is round-robin load balancing?',
    back: `Requests are distributed to each backend server in turn, cycling through the list equally.

- Simplest algorithm — no state needed
- Assumes all servers have equal capacity and similar request cost
- **Weighted round-robin**: servers with more capacity get proportionally more requests
- Works well for homogeneous fleets with similar request durations`,
  },
  {
    id: 'sd-lb-02',
    topic: 'Load Balancing',
    front: 'What is least-connections load balancing?',
    back: `Routes each new request to the server currently handling the **fewest active connections**.

- Adapts to servers that are slower or handling longer-lived requests
- Better than round-robin when request processing time varies significantly
- Requires the load balancer to track active connection count per server
- The best default choice for most variable-length workloads (API servers, WebSocket)`,
  },
  {
    id: 'sd-lb-03',
    topic: 'Load Balancing',
    front: 'What is L4 (transport layer) load balancing?',
    back: `Routes traffic based on **TCP/UDP IP and port only** — never looks at the request content.

- Very fast — minimal processing overhead
- Cannot make content-aware routing decisions
- Cannot do SSL termination, URL routing, or header-based rules
- Use when maximum throughput and minimum latency matter more than smart routing`,
  },
  {
    id: 'sd-lb-04',
    topic: 'Load Balancing',
    front: 'What is L7 (application layer) load balancing?',
    back: `Inspects the **HTTP content** — URL, headers, cookies — to route requests intelligently.

- Route \`/api\` to API servers and \`/static\` to CDN or storage servers
- SSL termination: decrypt once at the LB, use plain HTTP internally
- Supports: A/B testing, canary deploys, header-based auth, response caching
- Tools: Nginx, HAProxy, AWS ALB — the default choice for most web applications`,
  },
  {
    id: 'sd-lb-05',
    topic: 'Load Balancing',
    front: 'What is consistent hashing?',
    back: `Maps both **keys and servers** onto a virtual ring; each key is served by the nearest server clockwise.

- Adding or removing a server only remaps ~1/N of keys
- Standard modulo hashing remaps almost all keys when server count changes — causing a cache stampede
- **Virtual nodes**: each server occupies multiple ring positions for better load distribution
- Used in distributed caches (Redis Cluster), CDNs, and database routing`,
  },
  {
    id: 'sd-lb-06',
    topic: 'Load Balancing',
    front: 'What is a reverse proxy and what does it provide beyond load balancing?',
    back: `A reverse proxy sits between clients and backends, forwarding requests on their behalf.

- **SSL termination**: decrypt HTTPS once at the edge
- **Caching**: serve static content without hitting the backend
- **Compression**: gzip/brotli at the edge reduces bandwidth
- **Rate limiting** and **WAF**: centralized security enforcement
- **Security**: hides backend IP addresses and server identity from clients`,
  },

  // ─── Message Queues ─────────────────────────────────────────────────────
  {
    id: 'sd-mq-01',
    topic: 'Message Queues',
    front: 'Why use a message queue in a system design?',
    back: `Message queues **decouple producers from consumers** for async, reliable communication.

- **Load leveling**: queue absorbs traffic spikes; consumers process at a sustainable rate
- **Decoupling**: producer doesn't need to know about consumers; services evolve independently
- **Reliability**: messages persist if a consumer crashes; retried automatically
- Trade-off: adds latency; requires eventual consistency between services`,
  },
  {
    id: 'sd-mq-02',
    topic: 'Message Queues',
    front: 'What is the difference between a message queue and pub/sub?',
    back: `**Queue (point-to-point)**: each message is consumed by **exactly one** consumer.
**Pub/sub (topic)**: each message is delivered to **all** subscribers.

- Queue: task distribution — only one worker processes each job (e.g., SQS)
- Pub/sub: event broadcasting — user.created triggers email, analytics, and notification in parallel (e.g., SNS, Kafka)
- They are often combined: SNS fans out to multiple SQS queues`,
  },
  {
    id: 'sd-mq-03',
    topic: 'Message Queues',
    front: 'What is Apache Kafka?',
    back: `Kafka is a distributed, persistent, high-throughput **event streaming** platform.

- Stores messages in ordered, immutable logs (**topics** split into **partitions**)
- Consumers track their own **offset** — can replay events from any point
- Designed for millions of events per second with days/weeks of retention
- Key use cases: event sourcing, log aggregation, stream processing pipelines`,
  },
  {
    id: 'sd-mq-04',
    topic: 'Message Queues',
    front: 'What is at-least-once vs. exactly-once delivery?',
    back: `**At-most-once**: fire and forget — possible message loss, no duplicates. OK for metrics.
**At-least-once**: retry until acknowledged — no loss, but **duplicates possible**. Requires idempotent consumers.
**Exactly-once**: no loss, no duplicates — most complex; needs transactions or idempotency keys.

- Most production systems use **at-least-once** + idempotent processing
- Kafka supports exactly-once via transactions since v0.11`,
  },
  {
    id: 'sd-mq-05',
    topic: 'Message Queues',
    front: 'What is a dead-letter queue (DLQ)?',
    back: `A DLQ receives messages that **failed to be processed** after a maximum number of retries.

- Prevents poison-pill messages from blocking the main queue indefinitely
- Failed messages are inspected, debugged, and optionally re-queued after a fix
- Alerts can be set on DLQ depth to detect processing failures early
- Essential for any at-least-once queue in production`,
  },

  // ─── Consistency & CAP ──────────────────────────────────────────────────
  {
    id: 'sd-cap-01',
    topic: 'Consistency & CAP',
    front: 'What is the CAP theorem?',
    back: `A distributed system can guarantee at most **two** of these three properties during a network partition:

- **Consistency (C)**: every read sees the most recent write, or returns an error
- **Availability (A)**: every request receives a response — possibly stale, never an error
- **Partition tolerance (P)**: the system continues operating despite network partitions

Since partitions are **inevitable** in distributed networks, the real trade-off is CP vs. AP.`,
  },
  {
    id: 'sd-cap-02',
    topic: 'Consistency & CAP',
    front: 'When should you choose CP vs. AP?',
    back: `**CP** (sacrifice availability): return an error rather than stale data.
**AP** (sacrifice consistency): return stale data rather than an error.

- **CP examples**: ZooKeeper, HBase — used for leader election, config management, financial data
- **AP examples**: Cassandra, DynamoDB default, DNS — used for social feeds, shopping carts, user profiles
- Rule of thumb: if incorrect data is worse than no response → CP. If availability matters more → AP.`,
  },
  {
    id: 'sd-cap-03',
    topic: 'Consistency & CAP',
    front: 'What is strong consistency?',
    back: `After a write completes, **all subsequent reads immediately return that write** — no exceptions.

- Simplest programming model: no stale data to handle
- Higher latency — requires coordination across all replicas before confirming a write
- Lower availability — if a replica is unreachable, the write cannot be confirmed
- Use for: bank balances, inventory counts, authentication tokens`,
  },
  {
    id: 'sd-cap-04',
    topic: 'Consistency & CAP',
    front: 'What is eventual consistency?',
    back: `Replicas will converge to the same value **given enough time with no new writes** — reads may temporarily return stale data.

- Higher availability and lower write latency than strong consistency
- The application must handle seeing outdated values
- Examples: DNS propagation, social media like counts, shopping cart totals
- Most NoSQL databases default to eventual consistency with tunable options`,
  },
  {
    id: 'sd-cap-05',
    topic: 'Consistency & CAP',
    front: 'What does ACID stand for?',
    back: `**A — Atomicity**: all operations in a transaction succeed or all are rolled back.
**C — Consistency**: a transaction takes the DB from one valid state to another.
**I — Isolation**: concurrent transactions execute as if they ran sequentially.
**D — Durability**: committed transactions survive crashes (written to disk via WAL).

- PostgreSQL and MySQL fully support ACID
- Many NoSQL databases trade some ACID properties for scale`,
  },
  {
    id: 'sd-cap-06',
    topic: 'Consistency & CAP',
    front: 'What is isolation in database transactions?',
    back: `Isolation ensures concurrent transactions don't see each other's intermediate state.

Common isolation levels (weakest → strongest):
- **Read Uncommitted**: can read uncommitted changes from other transactions
- **Read Committed**: only see committed data (prevents dirty reads)
- **Repeatable Read**: same row always returns same value in a transaction
- **Serializable**: transactions execute as if completely sequential — strictest, slowest

Most databases default to Read Committed or Repeatable Read.`,
  },
  {
    id: 'sd-cap-07',
    topic: 'Consistency & CAP',
    front: 'What is BASE and how does it differ from ACID?',
    back: `**BASE** is the consistency model for highly available NoSQL systems.

- **Basically Available**: responses always returned, possibly stale
- **Soft state**: state may change over time even without input (background replication)
- **Eventually consistent**: all replicas converge given enough time

- ACID resolves conflicts synchronously; BASE resolves them lazily
- BASE systems are optimistic; ACID systems are pessimistic
- Cassandra, DynamoDB, CouchDB follow BASE; PostgreSQL, MySQL follow ACID`,
  },

  // ─── Availability Patterns ──────────────────────────────────────────────
  {
    id: 'sd-avail-01',
    topic: 'Availability Patterns',
    front: 'What is active-passive failover?',
    back: `One **active** server handles all traffic; a **passive** standby waits and monitors.

- If the active server fails, the passive promotes itself (takes the VIP/DNS)
- **Hot standby**: passive is running and ready — failover in seconds
- **Warm standby**: passive needs time to warm up before taking full load
- Downside: passive capacity is wasted during normal operation`,
  },
  {
    id: 'sd-avail-02',
    topic: 'Availability Patterns',
    front: 'What is active-active failover?',
    back: `**All nodes** handle traffic simultaneously; if one fails, the others absorb its load.

- No wasted capacity — all servers are actively used
- Requires a load balancer to distribute traffic and detect failures
- More complex: data must stay in sync across all active nodes in real time
- Common for stateless services; harder for stateful ones (needs multi-master replication)`,
  },
  {
    id: 'sd-avail-03',
    topic: 'Availability Patterns',
    front: 'What are the key trade-offs of master-slave database replication?',
    back: `All writes go to the master; reads can be served from read replicas.

- **Pros**: simple, no write conflicts, scales reads cheaply by adding replicas
- **Cons**: master is a single write bottleneck; replicas may lag behind
- If the master fails, a replica must be promoted — brief downtime or data loss
- Use for: read-heavy workloads, reporting queries, geographic read distribution`,
  },
  {
    id: 'sd-avail-04',
    topic: 'Availability Patterns',
    front: 'What are the key trade-offs of master-master (multi-master) replication?',
    back: `Multiple nodes accept writes and replicate changes to each other.

- **Pros**: any node accepts writes — survives a node failure without losing write capability
- **Cons**: write conflicts when two nodes accept conflicting changes simultaneously
- Conflict resolution: last-write-wins (risky), application merge logic, or CRDTs
- Used for: multi-region active-active databases (CockroachDB, Cassandra, Aurora Global)`,
  },
  {
    id: 'sd-avail-05',
    topic: 'Availability Patterns',
    front: 'How do you calculate availability "nines" and what do they mean?',
    back: `Availability = uptime / (uptime + downtime), expressed as a percentage.

- **99% (2 nines)**: ~3.65 days downtime/year
- **99.9% (3 nines)**: ~8.7 hours downtime/year
- **99.99% (4 nines)**: ~52 minutes downtime/year
- **99.999% (5 nines)**: ~5 minutes downtime/year

Services in series multiply: two 99.9% services → 99.8% total availability.`,
  },

  // ─── Asynchronism ────────────────────────────────────────────────────────
  {
    id: 'sd-async-01',
    topic: 'Asynchronism',
    front: 'What is asynchronism in system design?',
    back: `Asynchronism decouples **accepting a request** from **processing the result**.

- Client gets an immediate acknowledgment ("your request is queued")
- A background worker processes the job and stores the result
- Client polls or is notified (webhook/push) when done
- Use for: video encoding, report generation, emails, payments — anything slow`,
  },
  {
    id: 'sd-async-02',
    topic: 'Asynchronism',
    front: 'What is back pressure?',
    back: `Back pressure is a flow control mechanism where a **consumer signals the producer to slow down** when it cannot keep up.

- Without it: queue grows unbounded → memory exhaustion → system crash
- With it: producer slows, blocks, or drops requests — maintaining stability
- Implementations: bounded queue (block/reject when full), rate limiting upstream, TCP flow control
- In HTTP: \`503 Service Unavailable\` or \`429 Too Many Requests\` are back pressure signals`,
  },
  {
    id: 'sd-async-03',
    topic: 'Asynchronism',
    front: 'What is the difference between a task queue and a message queue?',
    back: `**Message queue**: low-level data transport between services (SQS, RabbitMQ).
**Task queue**: higher-level abstraction for executing application code in the background (Celery, Sidekiq).

- Task queues add: retries with backoff, scheduling (cron), priority queues, result storage, progress tracking
- Task queues are usually backed by a message queue under the hood (Redis or RabbitMQ)
- Use a task queue when you want to run application functions asynchronously`,
  },
  {
    id: 'sd-async-04',
    topic: 'Asynchronism',
    front: 'What is the difference between a cron job and an event-driven background job?',
    back: `**Cron job**: runs on a fixed schedule regardless of what happened (e.g., midnight report every day).
**Event-driven job**: triggered by a specific event (e.g., user uploaded a video → transcode it).

- Cron: simple, predictable, but can pile up if the previous run isn't finished
- Event-driven: responds to real need; scales naturally with traffic
- Use cron for: scheduled maintenance, daily digests, batch aggregations
- Use event-driven for: user-initiated workflows, real-time processing`,
  },

  // ─── API Design ─────────────────────────────────────────────────────────
  {
    id: 'sd-api-01',
    topic: 'API Design',
    front: 'What is REST and when should you use it?',
    back: `REST is a resource-based HTTP API style where each endpoint represents a resource (\`GET /users/123\`).

- Stateless, cacheable, and universally supported by all HTTP clients and browsers
- Human-readable and well-tooled (Swagger, Postman)
- Can **over-fetch** (get fields you don't need) or **under-fetch** (need multiple requests)
- Best default choice for public-facing APIs and any service where discoverability matters`,
  },
  {
    id: 'sd-api-02',
    topic: 'API Design',
    front: 'What is GraphQL and when should you use it?',
    back: `GraphQL lets the **client specify exactly which fields it needs** in a single query.

- Single endpoint; one request can fetch nested, related data without over-fetching
- Client-driven: frontend can evolve independently without new backend endpoints
- More complex to implement, cache, and secure than REST
- Best for: mobile apps (bandwidth matters), complex/nested data, rapidly changing frontends`,
  },
  {
    id: 'sd-api-03',
    topic: 'API Design',
    front: 'What is gRPC and when should you use it?',
    back: `gRPC uses **Protocol Buffers** (binary) over HTTP/2 for high-performance remote procedure calls.

- Much faster than REST/JSON: smaller payload, binary encoding, multiplexed HTTP/2 streams
- Strong typing: schemas defined in \`.proto\` files; client stubs are auto-generated
- Supports bidirectional streaming
- Poor browser support (requires a proxy like Envoy)
- Best for: internal microservice-to-microservice communication`,
  },
  {
    id: 'sd-api-04',
    topic: 'API Design',
    front: 'What are the main rate limiting algorithms?',
    back: `Rate limiting restricts how many requests a client can make in a time window.

- **Token bucket**: tokens refill at a fixed rate; short bursts allowed up to bucket capacity — **most common**
- **Fixed window**: count requests per fixed interval; resets abruptly → edge spikes at window boundary
- **Sliding window**: smooth version — no edge spikes; tracks timestamps in a rolling window
- Implementation: store counters in Redis; key by IP, user ID, or API key; return \`429\` with \`Retry-After\` header`,
  },
  {
    id: 'sd-api-05',
    topic: 'API Design',
    front: 'What is API idempotency and why does it matter?',
    back: `An operation is **idempotent** if performing it multiple times has the same effect as doing it once.

- Critical for safe retries: if a network failure occurs, clients can retry without causing side effects
- GET, PUT, DELETE are idempotent by REST convention; POST is not
- **Idempotency keys**: client sends a unique UUID per request; server deduplicates using that key
- Implementation: store (key → result) in Redis with TTL; return cached result on duplicate`,
  },
  {
    id: 'sd-api-06',
    topic: 'API Design',
    front: 'What is cursor-based pagination and why is it better than offset?',
    back: `Cursor-based pagination uses the last seen item's ID (or timestamp) as a bookmark.

\`GET /posts?cursor=<last_post_id>&limit=20\`

- **Offset pagination** (\`?page=2&limit=20\`) is slow at large offsets — DB must scan and skip all prior rows
- **Cursor** is fast at any position — just start from the last known item
- No duplicate or skipped items when concurrent writes happen mid-scroll
- Industry standard for feeds (Twitter, Instagram, GitHub); return \`next_cursor\` in every response`,
  },

  // ─── Networking ──────────────────────────────────────────────────────────
  {
    id: 'sd-net-01',
    topic: 'Networking',
    front: 'What is the difference between TCP and UDP?',
    back: `**TCP**: reliable, ordered, connection-oriented (handshake + ACKs).
**UDP**: fast, unreliable, connectionless — no retransmission.

- TCP: guarantees delivery and ordering; higher overhead
- UDP: lower latency; packets can be lost or arrive out of order
- TCP use cases: HTTP, databases, file transfer — correctness required
- UDP use cases: video streaming, VoIP, online games, DNS — latency matters more than perfection`,
  },
  {
    id: 'sd-net-02',
    topic: 'Networking',
    front: 'What is HTTP/2 and how does it improve on HTTP/1.1?',
    back: `HTTP/2 is binary and multiplexed — multiple requests fly over a single TCP connection simultaneously.

- **Multiplexing**: no head-of-line blocking from HTTP/1.1's sequential request model
- **Header compression** (HPACK): repeated headers are not re-sent on every request
- **Server push**: server proactively sends assets the client will need
- HTTP/3 goes further: uses QUIC (UDP) to eliminate TCP-level head-of-line blocking`,
  },
  {
    id: 'sd-net-03',
    topic: 'Networking',
    front: 'What is a WebSocket and when should you use it?',
    back: `A WebSocket is a **persistent, full-duplex TCP connection** — both sides can send at any time.

- Established via an HTTP upgrade handshake, then held open
- Lowest latency real-time delivery; no per-message HTTP overhead
- Use for: live chat, collaborative editing, trading platforms, multiplayer games
- Stateful connections are harder to scale — requires sticky sessions or a pub/sub backend (Redis)`,
  },
  {
    id: 'sd-net-04',
    topic: 'Networking',
    front: 'What is Server-Sent Events (SSE) and when should you use it?',
    back: `SSE streams **server-to-client** updates over a persistent HTTP connection via the browser's \`EventSource\` API.

- One-directional: server pushes, client only reads
- Automatic reconnection built into the browser
- Works over standard HTTP/2 (no upgrade needed); easy to scale behind a load balancer
- Use for: live dashboards, notification feeds, progress updates — when the client never needs to send data`,
  },
  {
    id: 'sd-net-05',
    topic: 'Networking',
    front: 'What is RPC and how does gRPC implement it?',
    back: `RPC (Remote Procedure Call) lets code call a function on a remote server as if it were local.

- Action-oriented vs. REST's resource-oriented style
- gRPC: schemas defined in \`.proto\` files → auto-generates typed client/server stubs
- Uses Protocol Buffers (binary, 3–10× smaller than JSON) over HTTP/2
- Supports unary, server-streaming, client-streaming, and bidirectional streaming calls
- Used heavily for internal microservice communication at Google, Netflix, Uber`,
  },

  // ─── DNS & CDN ──────────────────────────────────────────────────────────
  {
    id: 'sd-dns-01',
    topic: 'DNS & CDN',
    front: 'What are the 4 types of DNS servers?',
    back: `- **Recursive Resolver**: the client's first call; queries on its behalf; caches results
- **Root Name Server**: directs the resolver to the correct TLD server
- **TLD Name Server**: handles a top-level domain (e.g., all \`.com\`); directs to the authoritative server
- **Authoritative Name Server**: the final authority; returns the actual IP address for the domain

Resolution: Client → Resolver → Root → TLD → Authoritative → IP`,
  },
  {
    id: 'sd-dns-02',
    topic: 'DNS & CDN',
    front: 'What is DNS caching and TTL?',
    back: `Every DNS record has a **TTL (Time-To-Live)** — the number of seconds a resolver may cache the answer.

- Cached answers skip the full resolution chain on subsequent lookups
- Low TTL (30–300s): enables fast DNS changes during deployments or failovers — but more DNS traffic
- High TTL (3600s+): fewer lookups, better performance — but changes propagate slowly
- DNS propagation delay is just the old TTL draining from all caches worldwide`,
  },
  {
    id: 'sd-dns-03',
    topic: 'DNS & CDN',
    front: 'What is a CDN and why use one?',
    back: `A **Content Delivery Network** is a global network of edge servers that cache content close to users.

- Reduces latency: users fetch from a nearby edge node, not a distant origin server
- Reduces origin load: edge absorbs static asset traffic
- Improves availability: edge nodes can serve cached content even if origin is down
- Best for: static files (JS, CSS, images), video, APIs with global users`,
  },
  {
    id: 'sd-dns-04',
    topic: 'DNS & CDN',
    front: 'What is CDN pull vs. CDN push?',
    back: `**Pull CDN**: content is fetched from origin on the first request to an edge node; subsequent requests hit cache.
**Push CDN**: content is explicitly uploaded to all edge nodes in advance.

- Pull: simple to set up; origin only serves cold requests; may have slow first-user experience
- Push: all edges pre-warmed; no origin traffic after upload; requires managing invalidation
- Use **pull** for large content catalogs and frequently changing assets
- Use **push** for high-traffic launches, video releases, content that must be globally instant`,
  },
  {
    id: 'sd-dns-05',
    topic: 'DNS & CDN',
    front: 'What is cache invalidation in a CDN?',
    back: `When cached content changes, the CDN must serve the new version instead of the stale cache.

- **TTL-based expiry**: content automatically expires after its TTL — simplest, slight staleness acceptable
- **Explicit purge/invalidation**: trigger a purge API call when content changes — instant but costs extra API calls
- **Cache-busting**: embed a version hash in the URL (\`app.abc123.js\`) — old URLs never need invalidation
- Cache-busting is the most reliable approach for versioned assets (JS, CSS, images)`,
  },

  // ─── Distributed Patterns ────────────────────────────────────────────────
  {
    id: 'sd-dp-01',
    topic: 'Distributed Patterns',
    front: 'What is the circuit breaker pattern?',
    back: `The circuit breaker prevents cascading failures by stopping calls to a **failing dependency**.

Three states:
- **Closed**: normal operation; failures are counted
- **Open**: after threshold failures, all calls fail fast without hitting the dependency
- **Half-open**: a few probe requests are allowed; if they succeed, circuit closes

Libraries: Resilience4j (Java), Polly (.NET), opossum (Node.js)`,
  },
  {
    id: 'sd-dp-02',
    topic: 'Distributed Patterns',
    front: 'What is service discovery?',
    back: `Service discovery lets services find each other's network addresses **dynamically**.

- In cloud environments, instances start, stop, and move constantly — hardcoded IPs don't work
- **Client-side**: service queries a registry (Consul, Eureka) and load balances itself
- **Server-side**: load balancer queries the registry on the client's behalf (Kubernetes Service, AWS ELB)
- Kubernetes provides server-side discovery transparently via its DNS-based service system`,
  },
  {
    id: 'sd-dp-03',
    topic: 'Distributed Patterns',
    front: 'What is the Saga pattern?',
    back: `Saga manages long-running transactions across microservices using a sequence of local transactions with **compensating transactions** for rollback.

- **Choreography**: each service publishes events; others react — no central coordinator
- **Orchestration**: a central saga orchestrator sends commands to each service
- Example: Order → Reserve inventory → Charge payment; if payment fails → release inventory
- Avoids distributed locks; embraces eventual consistency across services`,
  },
  {
    id: 'sd-dp-04',
    topic: 'Distributed Patterns',
    front: 'What is two-phase commit (2PC) and why is it risky?',
    back: `2PC ensures all participants in a distributed transaction either **all commit or all abort**.

**Phase 1 — Prepare**: coordinator asks each participant "can you commit?"; each locks resources.
**Phase 2 — Commit/Abort**: if all said Yes → Commit; otherwise → Abort and rollback.

- Blocking: if the coordinator fails mid-protocol, all participants are stuck holding locks
- High latency: two round-trips while holding database locks
- Modern systems prefer the **Saga pattern** to avoid blocking`,
  },
  {
    id: 'sd-dp-05',
    topic: 'Distributed Patterns',
    front: 'What is the Bulkhead pattern?',
    back: `Bulkhead isolates components into separate resource pools so that **one failure doesn't exhaust shared resources**.

- Named after watertight compartments in a ship
- Without it: a slow downstream service exhausts the shared thread pool, taking down the entire app
- With it: each service gets its own thread pool; failures in one don't starve the others
- Pairs with circuit breaker: bulkhead limits blast radius, circuit breaker stops the bleeding`,
  },
  {
    id: 'sd-dp-06',
    topic: 'Distributed Patterns',
    front: 'What is the Strangler Fig pattern?',
    back: `Incrementally replace a legacy system by routing new functionality to new services via a **proxy/facade**.

- New code lives in separate services; proxy routes requests to old or new based on path/feature
- The monolith gradually "shrinks" as routes are strangled out over time
- Low risk: system stays operational throughout; rollback is easy at any step
- Avoids the high-risk "big bang" rewrite where nothing ships until the whole thing is done`,
  },
  {
    id: 'sd-dp-07',
    topic: 'Distributed Patterns',
    front: 'What is the Sidecar pattern?',
    back: `A helper container deployed alongside each service pod (in Kubernetes) to handle cross-cutting concerns.

- Sidecar handles: logging, metrics collection, service mesh proxy (Envoy), TLS termination
- Main app and sidecar share the same network namespace — communicate via localhost
- Decouples infrastructure plumbing from application code
- **Service mesh** (Istio, Linkerd) uses sidecars to intercept all network traffic for observability and traffic management`,
  },

  // ─── Monitoring ──────────────────────────────────────────────────────────
  {
    id: 'sd-mon-01',
    topic: 'Monitoring',
    front: 'What are the three pillars of observability?',
    back: `- **Metrics**: numerical time-series data (CPU %, request rate, error rate, p99 latency). Tools: Prometheus, Datadog
- **Logs**: structured or unstructured event records from each service. Tools: ELK stack, Splunk, Loki
- **Distributed Traces**: follow a single request end-to-end across services with span IDs. Tools: Jaeger, Zipkin, AWS X-Ray

Together they give you: "what happened" (logs), "how often" (metrics), "where it happened" (traces).`,
  },
  {
    id: 'sd-mon-02',
    topic: 'Monitoring',
    front: 'What are the Four Golden Signals?',
    back: `Google's minimum set of metrics every service should monitor:

- **Latency**: how long requests take. Track p95/p99, not just average. Distinguish success vs. error latency.
- **Traffic**: demand on the system (requests/sec, active connections, messages/sec)
- **Errors**: rate of failed requests (5xx errors, exceptions, timeouts)
- **Saturation**: how "full" the service is (CPU %, memory %, queue depth) — predicts failure before it happens`,
  },
  {
    id: 'sd-mon-03',
    topic: 'Monitoring',
    front: 'What is an SLO, SLA, and error budget?',
    back: `- **SLI** (Service Level Indicator): the actual measured metric, e.g., p99 latency = 250ms
- **SLO** (Service Level Objective): the target you aim for, e.g., p99 latency < 300ms for 99.9% of requests
- **SLA** (Service Level Agreement): a contractual commitment to customers — violating it has penalties
- **Error budget**: 100% − SLO target = the allowed failure budget. If you ship too often and burn the budget, releases are frozen.`,
  },
  {
    id: 'sd-mon-04',
    topic: 'Monitoring',
    front: 'What is distributed tracing?',
    back: `Distributed tracing tracks a **single request as it flows across multiple services**, producing a timeline of spans.

- Each service adds a span (start time, duration, metadata) and forwards a trace/span ID in headers
- The trace visualizes where time is spent across service boundaries
- Immediately reveals: which service is slow, where errors originate, unexpected call chains
- Tools: Jaeger, Zipkin, AWS X-Ray, Datadog APM
- Essential in microservices — logs from individual services can't show the full picture`,
  },

  // ─── Cloud Patterns ──────────────────────────────────────────────────────
  {
    id: 'sd-cloud-01',
    topic: 'Cloud Patterns',
    front: 'What is CQRS?',
    back: `**Command Query Responsibility Segregation** uses separate models for reads and writes.

- **Command side**: accepts writes, applies business logic, emits events
- **Query side**: listens to events, maintains one or more read-optimized projections
- Reads and writes scale independently; read models can use the best store for their query pattern
- Trade-off: eventual consistency between write and read sides; more moving parts
- Often paired with Event Sourcing`,
  },
  {
    id: 'sd-cloud-02',
    topic: 'Cloud Patterns',
    front: 'What is Event Sourcing?',
    back: `Event Sourcing stores state as an **ordered sequence of immutable events** rather than current-state snapshots.

- Every change is recorded: \`OrderPlaced\`, \`ItemShipped\`, \`OrderCancelled\`
- Current state = replay all events from the beginning
- Built-in audit log and time travel (replay to any point in history)
- Use **snapshots** to avoid replaying thousands of events on startup
- Often paired with CQRS: events feed read-model projections`,
  },
  {
    id: 'sd-cloud-03',
    topic: 'Cloud Patterns',
    front: 'What is the Ambassador pattern?',
    back: `A proxy sidecar handles all **outbound** communication from a service — acting as its ambassador to external services.

- The ambassador handles: retries, circuit breaking, timeouts, authentication, protocol translation
- The app calls \`localhost:8080\`; the ambassador forwards to the real upstream with all policies applied
- Decouples resilience logic from application code
- Useful for: legacy services that can't be modified, polyglot services needing the same resilience behavior`,
  },
  {
    id: 'sd-cloud-04',
    topic: 'Cloud Patterns',
    front: 'What is throttling and how does it differ from rate limiting?',
    back: `**Rate limiting**: controls how fast **clients** can send requests (enforced at the gateway).
**Throttling**: controls how fast the **system itself** processes work (internal flow control).

- Throttling is internal: limit how fast you call a downstream service you don't want to overload
- Rate limiting is external: reject excess inbound requests from clients
- Throttling techniques: token bucket (allow bursts), leaky bucket (smooth constant output)
- Example: throttle image processing to 100/min to stay within GPU capacity; queue the rest`,
  },
  {
    id: 'sd-cloud-05',
    topic: 'Cloud Patterns',
    front: 'What is the Valet Key pattern?',
    back: `Issue clients a **time-limited, scoped token** granting direct access to a specific resource — bypassing the application server for data transfer.

- Instead of proxying large file uploads through the app, the client uploads directly to storage using the token
- Greatly reduces app server load and bandwidth costs for large assets
- Token is scoped: read-only, specific path, specific expiry — like a valet parking ticket
- Classic example: generate a pre-signed S3 URL; client uploads directly to S3`,
  },
  {
    id: 'sd-cloud-06',
    topic: 'Cloud Patterns',
    front: 'What is the difference between horizontal and vertical partitioning in cloud storage?',
    back: `**Horizontal partitioning (sharding)**: splits rows across multiple storage nodes by a partition key.
**Vertical partitioning (column splitting)**: separates columns into different tables or stores.

- Horizontal: each node holds a subset of records — solves write throughput limits
- Vertical: hot, frequently accessed columns (e.g., user name) live separately from cold ones (e.g., bio blob)
- Reduces I/O per query: reads only fetch the columns they actually need
- Common in columnar stores (Parquet, BigQuery) and wide-column NoSQL (Cassandra, HBase)`,
  },
];
