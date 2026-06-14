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
    prompt: `Let's design Bitly.

You know how bit.ly works — you paste in a long URL and it gives you a short link that redirects to the original. I want you to design that system.

Feel free to ask me any clarifying questions before you dive in. I'll answer them the way a real interviewer would.`,
  },
  {
    id: 'iq-pastebin',
    title: 'Design Pastebin',
    category: 'Storage & Data',
    difficulty: 'Easy',
    prompt: `Let's design Pastebin.

You know the site — you paste a block of text, you get a link you can share with anyone. That's it. Think about what the core experience needs to support and what could go wrong at scale.

What do you want to know before you start?`,
  },
  {
    id: 'iq-kv-store',
    title: 'Design a Key-Value Store',
    category: 'Storage & Data',
    difficulty: 'Medium',
    prompt: `Let's design a distributed key-value store — something in the spirit of DynamoDB or Cassandra.

It needs to store data and retrieve it by key. Beyond that, think about what it takes to make that work reliably across many machines.

What questions do you have for me before you start?`,
  },
  {
    id: 'iq-distributed-cache',
    title: 'Design a Distributed Cache',
    category: 'Storage & Data',
    difficulty: 'Medium',
    prompt: `Let's design a distributed caching system — think Memcached or Redis Cluster.

The basic idea is that many application servers share a fast in-memory cache so they don't hammer the database for the same data. What are the important problems to solve here?

Ask me anything you need to know before you dive in.`,
  },
  {
    id: 'iq-dropbox',
    title: 'Design Dropbox / Google Drive',
    category: 'Storage & Data',
    difficulty: 'Hard',
    prompt: `Let's design Dropbox.

You know what Dropbox does — you save a file on your laptop and it shows up on your phone. I want you to design the core file sync system. Think about what happens from the moment a user drops a file into their Dropbox folder to when it appears on their other devices.

Ask me anything you need to know before you start.`,
  },
  {
    id: 'iq-message-queue',
    title: 'Design a Message Queue',
    category: 'Storage & Data',
    difficulty: 'Medium',
    prompt: `Let's design a distributed message queue — something like Kafka or SQS.

Services need a way to send messages to each other without being tightly coupled. Think about what that system needs to do and what can make it hard at scale.

What do you want to clarify before you start?`,
  },

  // ─── Social & Feeds ──────────────────────────────────────────────────────
  {
    id: 'iq-twitter-timeline',
    title: 'Design Twitter / X Timeline',
    category: 'Social & Feeds',
    difficulty: 'Hard',
    prompt: `Let's design Twitter's home timeline.

When you open Twitter, you see a feed of tweets from people you follow. I want you to design that — specifically the part that figures out what to show you and how to serve it fast.

What questions do you have before you start?`,
  },
  {
    id: 'iq-instagram',
    title: 'Design Instagram',
    category: 'Social & Feeds',
    difficulty: 'Hard',
    prompt: `Let's design Instagram.

People upload photos and videos, follow each other, and see a personalized feed when they open the app. I want you to design the core system behind that experience.

Feel free to ask me anything before you start.`,
  },
  {
    id: 'iq-news-feed',
    title: 'Design a News Feed System',
    category: 'Social & Feeds',
    difficulty: 'Medium',
    prompt: `Let's design Facebook's News Feed.

When you open Facebook, you see a personalized feed of posts from your friends and pages you follow. I want you to design that system — the part that figures out what to show you and serves it up when you open the app.

What do you want to know before you start?`,
  },
  {
    id: 'iq-tiktok',
    title: 'Design TikTok / Short Video Feed',
    category: 'Social & Feeds',
    difficulty: 'Hard',
    prompt: `Let's design TikTok.

You open the app and immediately start watching videos. You didn't follow anyone, you didn't search for anything — it just knows what you want. I want you to design the system behind that, from video upload to what shows up on your "For You" page.

Ask me whatever you need before you start.`,
  },

  // ─── Communication ────────────────────────────────────────────────────────
  {
    id: 'iq-whatsapp',
    title: 'Design WhatsApp / Chat',
    category: 'Communication',
    difficulty: 'Medium',
    prompt: `Let's design WhatsApp.

You use it — you send someone a message, it shows up on their phone almost immediately, even if they're halfway around the world. I want you to design the messaging system behind that. Focus on the core experience.

What questions do you have for me?`,
  },
  {
    id: 'iq-notification',
    title: 'Design a Notification System',
    category: 'Communication',
    difficulty: 'Medium',
    prompt: `Let's design a notification system — the kind that powers "Your order shipped" push notifications, emails, and texts across a large platform.

Something happens in the system and users need to hear about it, across multiple channels. Think about what makes that hard.

What do you want to clarify before diving in?`,
  },
  {
    id: 'iq-live-comments',
    title: 'Design a Live Comment / Chat System',
    category: 'Communication',
    difficulty: 'Medium',
    prompt: `Let's design live chat for a streaming platform — like Twitch chat or YouTube Live comments.

While a stream is happening, thousands of viewers are posting comments and everyone sees them in near real-time. Think about what that system looks like and what breaks under pressure.

What questions do you have before you start?`,
  },

  // ─── Infrastructure ────────────────────────────────────────────────────────
  {
    id: 'iq-rate-limiter',
    title: 'Design a Rate Limiter',
    category: 'Infrastructure',
    difficulty: 'Easy',
    prompt: `Let's design a rate limiter for an API gateway.

The goal is to prevent any single client from hammering the API too hard. Sounds simple, but doing it correctly across a fleet of servers has some interesting challenges.

Ask me what you need to know before you start.`,
  },
  {
    id: 'iq-web-crawler',
    title: 'Design a Web Crawler',
    category: 'Infrastructure',
    difficulty: 'Medium',
    prompt: `Let's design a web crawler — the kind Google uses to discover and index pages across the internet.

The basic idea is: you start with a set of URLs, fetch those pages, find the links in them, and keep going. At Google's scale, this gets complicated fast. How would you build it?

Feel free to ask me clarifying questions first.`,
  },
  {
    id: 'iq-api-gateway',
    title: 'Design an API Gateway',
    category: 'Infrastructure',
    difficulty: 'Easy',
    prompt: `Let's design an API gateway — the single entry point that sits between your clients and your backend microservices.

Every request from every client flows through it. Think about what responsibilities that creates and what can go wrong.

What do you want to know before you start?`,
  },
  {
    id: 'iq-cdn',
    title: 'Design a Content Delivery Network (CDN)',
    category: 'Infrastructure',
    difficulty: 'Hard',
    prompt: `Let's design a CDN.

The idea is to serve content — images, videos, JS files — fast to users all over the world, without every request having to go back to the origin server. Think about what that requires and what the hard parts are.

Ask me anything you need before you dive in.`,
  },
  {
    id: 'iq-monitoring',
    title: 'Design a Metrics & Monitoring System',
    category: 'Infrastructure',
    difficulty: 'Medium',
    prompt: `Let's design a metrics and monitoring system — something like Datadog or Prometheus.

Services emit metrics constantly, and engineers need to be able to query that data and get paged when something looks wrong. Think about what that system needs to handle.

What questions do you have before you start?`,
  },

  // ─── Search & Discovery ───────────────────────────────────────────────────
  {
    id: 'iq-typeahead',
    title: 'Design a Typeahead / Autocomplete System',
    category: 'Search & Discovery',
    difficulty: 'Medium',
    prompt: `Let's design a search autocomplete system — like the suggestions that appear when you start typing into Google Search.

As you type, it needs to show relevant suggestions instantly. That sounds easy until you think about the scale and the latency requirements.

What do you want to clarify before you start?`,
  },
  {
    id: 'iq-search-engine',
    title: 'Design a Search Engine',
    category: 'Search & Discovery',
    difficulty: 'Hard',
    prompt: `Let's design a web-scale search engine — think Google Search.

Someone types a query and in under a second they get back the most relevant pages from across the entire internet. I want you to design the system that makes that possible.

Feel free to ask me anything before you start.`,
  },
  {
    id: 'iq-recommendation',
    title: 'Design a Recommendation System',
    category: 'Search & Discovery',
    difficulty: 'Hard',
    prompt: `Let's design a recommendation system — like Amazon's "Customers also bought" or Netflix's personalized homepage.

The system needs to figure out what content or products a user is likely to want, without them asking for it explicitly. Think about what data you'd use and how you'd build it.

What do you want to know before you start?`,
  },

  // ─── Maps & Location ─────────────────────────────────────────────────────
  {
    id: 'iq-uber',
    title: 'Design Uber / Ride Sharing',
    category: 'Maps & Location',
    difficulty: 'Hard',
    prompt: `Let's design Uber.

The core thing Uber does: someone opens the app, requests a ride, and gets matched with a nearby driver. The driver's location is constantly updating, the match needs to feel instant, and this is happening across dozens of cities at once. How would you design this?

Ask me what you need to know before you start.`,
  },
  {
    id: 'iq-google-maps',
    title: 'Design Google Maps',
    category: 'Maps & Location',
    difficulty: 'Hard',
    prompt: `Let's design Google Maps.

You open it, you see a map of the world, you ask for directions, and it routes you around traffic in real time. Think about what it takes to build that at a global scale.

What do you want to clarify before you start?`,
  },
  {
    id: 'iq-nearby',
    title: 'Design a Proximity / Nearby Search Service',
    category: 'Maps & Location',
    difficulty: 'Medium',
    prompt: `Let's design a "find nearby" service — like Yelp's nearby restaurant search, or the part of Uber that finds drivers close to you.

Given a user's location, the system needs to return relevant nearby results fast. Think about what makes that technically interesting.

Ask me anything before you dive in.`,
  },

  // ─── E-Commerce & Finance ─────────────────────────────────────────────────
  {
    id: 'iq-payment',
    title: 'Design a Payment System',
    category: 'E-Commerce & Finance',
    difficulty: 'Hard',
    prompt: `Let's design a payment processing system — think Stripe or PayPal.

Money is moving between accounts. That's simple to say and hard to build — failures, retries, and partial states all have real consequences. How would you design this?

What questions do you have before you start?`,
  },
  {
    id: 'iq-ecommerce',
    title: 'Design an E-Commerce Platform',
    category: 'E-Commerce & Finance',
    difficulty: 'Medium',
    prompt: `Let's design an online marketplace — think Amazon.

Users browse products, add things to a cart, and check out. Sellers manage inventory. Think about what the core system looks like and where the hard problems are.

What do you want to know before you start?`,
  },
  {
    id: 'iq-hotel-booking',
    title: 'Design a Hotel Booking System',
    category: 'E-Commerce & Finance',
    difficulty: 'Medium',
    prompt: `Let's design a hotel booking system — like Booking.com or Airbnb.

You search for a place to stay, pick a room, and reserve it for your dates. Sounds straightforward until you think about what happens when two people try to book the same room at the same time.

Ask me whatever you need before you start.`,
  },
  {
    id: 'iq-ad-click',
    title: 'Design an Ad Click Aggregator',
    category: 'E-Commerce & Finance',
    difficulty: 'Hard',
    prompt: `Let's say you're on the ads infrastructure team at a company like Facebook or Google.

Advertisers are paying to show their ads, and they need to know how those ads are performing — how many times they were clicked, when, and by whom. Your job is to design the system that captures ad click events and makes that data available to advertisers. How would you approach it?

What do you want to clarify before diving in?`,
  },
  {
    id: 'iq-stock-trading',
    title: 'Design a Stock Trading Platform',
    category: 'E-Commerce & Finance',
    difficulty: 'Hard',
    prompt: `Let's design an online stock trading platform — like Robinhood.

Users can place orders to buy and sell stocks, see real-time prices, and track their portfolio. Think about what makes this system different from a typical CRUD app.

What questions do you have before you start?`,
  },
  {
    id: 'iq-ticketmaster',
    title: 'Design Ticketmaster',
    category: 'E-Commerce & Finance',
    difficulty: 'Medium',
    prompt: `Let's design Ticketmaster.

People use it to buy tickets to concerts, sports games, theatre — you pick your seats and check out. Think about what happens when a really popular show goes on sale and everyone tries to buy at the same time. How would you design the system?

Ask me whatever you need before you start.`,
  },
  {
    id: 'iq-leetcode',
    title: 'Design an Online Code Judge',
    category: 'Infrastructure',
    difficulty: 'Medium',
    prompt: `Let's design LeetCode.

You know the site — you pick a coding problem, write your solution in the editor, hit submit, and it tells you whether your code passes the test cases. I want you to design the backend system that makes that work, particularly the part that actually runs user-submitted code.

What questions do you have?`,
  },

  // ─── Search & Discovery (continued) ──────────────────────────────────────
  {
    id: 'iq-post-search',
    title: 'Design Facebook Post Search',
    category: 'Search & Discovery',
    difficulty: 'Hard',
    prompt: `Let's design Facebook's post search — the search bar at the top of Facebook where you can search for posts people have written.

You type a keyword, you get back posts that match. Sounds simple, but Facebook has billions of users and hundreds of millions of posts per day, so there are some interesting challenges here. How would you design it?

Feel free to ask me anything before you start.`,
  },
];
