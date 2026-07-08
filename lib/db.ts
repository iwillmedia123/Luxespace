/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@/lib/supabase";
import { Property, Community, Developer, Agent, BlogPost, Testimonial, Lead, Appointment, FAQItem, AwardItem, PartnerItem, DownloadItem, LifestyleArticle, NewsletterSubscriber, BlogCategory } from "@/types";

// Determine if we have live Supabase credentials configured
const isSupabaseConfigured = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  return url.length > 0 && key.length > 0;
};

// Seeding Mock Data
const MOCK_DEVELOPERS: Developer[] = [
  {
    "id": "dev1",
    "name": "Emaar Properties",
    "slug": "emaar",
    "isFeatured": true,
    "foundedYear": 1997,
    "website": "https://emaar.com",
    "createdAt": "2026-07-01T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "dev2",
    "name": "Sobha Realty",
    "slug": "sobha",
    "isFeatured": true,
    "foundedYear": 1976,
    "website": "https://sobharealty.com",
    "createdAt": "2026-07-01T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "dev3",
    "name": "DAMAC Properties",
    "slug": "damac",
    "isFeatured": true,
    "foundedYear": 2002,
    "website": "https://damacproperties.com",
    "createdAt": "2026-07-01T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "dev4",
    "name": "Ellington Properties",
    "slug": "ellington",
    "isFeatured": true,
    "foundedYear": 2014,
    "website": "https://ellingtonproperties.ae",
    "createdAt": "2026-07-01T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "dev5",
    "name": "Nakheel",
    "slug": "nakheel",
    "isFeatured": true,
    "foundedYear": 2000,
    "website": "https://nakheel.com",
    "createdAt": "2026-07-01T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "dev6",
    "name": "Meraas",
    "slug": "meraas",
    "isFeatured": false,
    "foundedYear": 2007,
    "website": "https://meraas.com",
    "createdAt": "2026-07-01T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "dev7",
    "name": "Aldar Properties",
    "slug": "aldar",
    "isFeatured": false,
    "foundedYear": 2004,
    "website": "https://aldar.com",
    "createdAt": "2026-07-01T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "dev8",
    "name": "Azizi Developments",
    "slug": "azizi",
    "isFeatured": false,
    "foundedYear": 2007,
    "website": "https://azizidevelopments.com",
    "createdAt": "2026-07-01T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "dev9",
    "name": "Omniyat",
    "slug": "omniyat",
    "isFeatured": false,
    "foundedYear": 2005,
    "website": "https://omniyat.com",
    "createdAt": "2026-07-01T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "dev10",
    "name": "Select Group",
    "slug": "select-group",
    "isFeatured": false,
    "foundedYear": 2002,
    "website": "https://select-group.ae",
    "createdAt": "2026-07-01T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  }
];

const MOCK_COMMUNITIES: Community[] = [
  {
    "id": "c1",
    "name": "Palm Jumeirah",
    "slug": "palm-jumeirah",
    "description": "Iconic man-made island offering beachfront villas and high-end suites.",
    "bannerUrl": "/assets/palm_jumeirah_render.png",
    "isFeatured": true,
    "coordinates": {
      "lat": 25.1124,
      "lng": 55.139
    },
    "createdAt": "2026-07-01T08:14:38.595Z",
    "updatedAt": "2026-07-01T08:14:38.595Z"
  },
  {
    "id": "c2",
    "name": "Downtown Dubai",
    "slug": "downtown-dubai",
    "description": "The vibrant heart of the city centered around Burj Khalifa and Dubai Mall.",
    "bannerUrl": "/assets/penthouse_render.png",
    "isFeatured": true,
    "coordinates": {
      "lat": 25.2048,
      "lng": 55.2708
    },
    "createdAt": "2026-07-01T08:14:38.595Z",
    "updatedAt": "2026-07-01T08:14:38.595Z"
  },
  {
    "id": "c3",
    "name": "Dubai Hills Estate",
    "slug": "dubai-hills-estate",
    "description": "Golf green oasis with premium residential enclaves and modern townhouses.",
    "bannerUrl": "/assets/villa_render.png",
    "isFeatured": true,
    "coordinates": {
      "lat": 25.1014,
      "lng": 55.2588
    },
    "createdAt": "2026-07-01T08:14:38.595Z",
    "updatedAt": "2026-07-01T08:14:38.595Z"
  },
  {
    "id": "c4",
    "name": "Dubai Marina",
    "slug": "dubai-marina",
    "description": "High-rise coastal towers looking over luxury yachts and waterfront walkways.",
    "bannerUrl": "/assets/apartment_render.png",
    "isFeatured": true,
    "coordinates": {
      "lat": 25.0805,
      "lng": 55.1403
    },
    "createdAt": "2026-07-01T08:14:38.595Z",
    "updatedAt": "2026-07-01T08:14:38.595Z"
  },
  {
    "id": "c5",
    "name": "Business Bay",
    "slug": "business-bay",
    "description": "High-flying corporate and residential hub next to the Dubai Water Canal.",
    "bannerUrl": "/assets/apartment_render.png",
    "isFeatured": true,
    "coordinates": {
      "lat": 25.1824,
      "lng": 55.2728
    },
    "createdAt": "2026-07-01T08:14:38.595Z",
    "updatedAt": "2026-07-01T08:14:38.595Z"
  },
  {
    "id": "c6",
    "name": "Jumeirah Beach Residence",
    "slug": "jbr",
    "description": "Beachfront towers, dining promenades, and casual coastal living.",
    "bannerUrl": "/assets/palm_jumeirah_render.png",
    "isFeatured": true,
    "coordinates": {
      "lat": 25.0782,
      "lng": 55.1328
    },
    "createdAt": "2026-07-01T08:14:38.595Z",
    "updatedAt": "2026-07-01T08:14:38.595Z"
  },
  {
    "id": "c7",
    "name": "Dubai Creek Harbour",
    "slug": "dubai-creek-harbour",
    "description": "Ultra-modern waterfront living with views of the historic creek and skyline.",
    "bannerUrl": "/assets/penthouse_render.png",
    "isFeatured": true,
    "coordinates": {
      "lat": 25.2014,
      "lng": 55.3528
    },
    "createdAt": "2026-07-01T08:14:38.595Z",
    "updatedAt": "2026-07-01T08:14:38.595Z"
  },
  {
    "id": "c8",
    "name": "MBR City",
    "slug": "mbr-city",
    "description": "Mohammed Bin Rashid City, home to District One and massive crystal lagoons.",
    "bannerUrl": "/assets/villa_render.png",
    "isFeatured": true,
    "coordinates": {
      "lat": 25.1504,
      "lng": 55.3088
    },
    "createdAt": "2026-07-01T08:14:38.595Z",
    "updatedAt": "2026-07-01T08:14:38.595Z"
  },
  {
    "id": "c9",
    "name": "Arabian Ranches",
    "slug": "arabian-ranches",
    "description": "Established desert-themed luxury villa community for families.",
    "bannerUrl": "/assets/villa_render.png",
    "isFeatured": false,
    "coordinates": {
      "lat": 25.0344,
      "lng": 55.2808
    },
    "createdAt": "2026-07-01T08:14:38.595Z",
    "updatedAt": "2026-07-01T08:14:38.595Z"
  },
  {
    "id": "c10",
    "name": "DIFC",
    "slug": "difc",
    "description": "Dubai International Financial Centre, upscale financial district and dining.",
    "bannerUrl": "/assets/penthouse_render.png",
    "isFeatured": false,
    "coordinates": {
      "lat": 25.2154,
      "lng": 55.2818
    },
    "createdAt": "2026-07-01T08:14:38.595Z",
    "updatedAt": "2026-07-01T08:14:38.595Z"
  },
  {
    "id": "c11",
    "name": "Jumeirah Village Circle",
    "slug": "jvc",
    "description": "Family-oriented community with a mix of townhouses and low-rise apartments.",
    "bannerUrl": "/assets/apartment_render.png",
    "isFeatured": false,
    "coordinates": {
      "lat": 25.0584,
      "lng": 55.2028
    },
    "createdAt": "2026-07-01T08:14:38.595Z",
    "updatedAt": "2026-07-01T08:14:38.595Z"
  },
  {
    "id": "c12",
    "name": "Al Barsha",
    "slug": "al-barsha",
    "description": "Residential district featuring Mall of the Emirates and quiet villas.",
    "bannerUrl": "/assets/villa_render.png",
    "isFeatured": false,
    "coordinates": {
      "lat": 25.1184,
      "lng": 55.2288
    },
    "createdAt": "2026-07-01T08:14:38.595Z",
    "updatedAt": "2026-07-01T08:14:38.595Z"
  },
  {
    "id": "c13",
    "name": "Jumeirah",
    "slug": "jumeirah",
    "description": "Coastal area with low-rise luxury villas, beach clubs, and cafes.",
    "bannerUrl": "/assets/villa_render.png",
    "isFeatured": false,
    "coordinates": {
      "lat": 25.2014,
      "lng": 55.2388
    },
    "createdAt": "2026-07-01T08:14:38.595Z",
    "updatedAt": "2026-07-01T08:14:38.595Z"
  },
  {
    "id": "c14",
    "name": "Bluewaters Island",
    "slug": "bluewaters-island",
    "description": "Offshore lifestyle island home to Ain Dubai and upscale waterfront residences.",
    "bannerUrl": "/assets/apartment_render.png",
    "isFeatured": false,
    "coordinates": {
      "lat": 25.0799,
      "lng": 55.1228
    },
    "createdAt": "2026-07-01T08:14:38.595Z",
    "updatedAt": "2026-07-01T08:14:38.595Z"
  },
  {
    "id": "c15",
    "name": "City Walk",
    "slug": "city-walk",
    "description": "Design-inspired open-air retail, dining, and premium low-rise apartments.",
    "bannerUrl": "/assets/apartment_render.png",
    "isFeatured": false,
    "coordinates": {
      "lat": 25.2074,
      "lng": 55.2618
    },
    "createdAt": "2026-07-01T08:14:38.595Z",
    "updatedAt": "2026-07-01T08:14:38.595Z"
  }
];

const MOCK_AGENTS: Agent[] = [
  {
    "id": "agent1",
    "name": "Farah Al-Sayed",
    "slug": "farah-al-sayed",
    "title": "Senior Investment Partner",
    "email": "farah@luxespace.com",
    "phone": "+971 50 123 4567",
    "whatsapp": "+971501234567",
    "languages": [
      "English",
      "Arabic",
      "French"
    ],
    "specialization": [
      "Palm Jumeirah",
      "Penthouses"
    ],
    "isFeatured": true,
    "createdAt": "2026-07-01T08:14:38.593Z",
    "updatedAt": "2026-07-01T08:14:38.593Z"
  },
  {
    "id": "agent2",
    "name": "Alexander Volkov",
    "slug": "alexander-volkov",
    "title": "Residential Specialist",
    "email": "alexander@luxespace.com",
    "phone": "+971 50 987 6543",
    "whatsapp": "+971509876543",
    "languages": [
      "English",
      "Russian"
    ],
    "specialization": [
      "Downtown Dubai",
      "Villas"
    ],
    "isFeatured": true,
    "createdAt": "2026-07-01T08:14:38.593Z",
    "updatedAt": "2026-07-01T08:14:38.593Z"
  },
  {
    "id": "agent3",
    "name": "Sarah Jenkins",
    "slug": "sarah-jenkins",
    "title": "Advisory Director",
    "email": "sarah@luxespace.com",
    "phone": "+971 55 456 7890",
    "whatsapp": "+971554567890",
    "languages": [
      "English",
      "German"
    ],
    "specialization": [
      "Dubai Hills",
      "Off-plan"
    ],
    "isFeatured": true,
    "createdAt": "2026-07-01T08:14:38.593Z",
    "updatedAt": "2026-07-01T08:14:38.593Z"
  },
  {
    "id": "agent4",
    "name": "Elena Rostova",
    "slug": "elena-rostova",
    "title": "Private Client Advisor",
    "email": "elena@luxespace.com",
    "phone": "+971 52 321 0987",
    "whatsapp": "+971523210987",
    "languages": [
      "English",
      "Russian",
      "Ukrainian"
    ],
    "specialization": [
      "Bluewaters",
      "Waterfront Penthouse"
    ],
    "isFeatured": false,
    "createdAt": "2026-07-01T08:14:38.593Z",
    "updatedAt": "2026-07-01T08:14:38.593Z"
  },
  {
    "id": "agent5",
    "name": "Marcus Vance",
    "slug": "marcus-vance",
    "title": "Commercial Broker",
    "email": "marcus@luxespace.com",
    "phone": "+971 56 654 3210",
    "whatsapp": "+971566543210",
    "languages": [
      "English",
      "Mandarin"
    ],
    "specialization": [
      "Business Bay",
      "Offices"
    ],
    "isFeatured": false,
    "createdAt": "2026-07-01T08:14:38.593Z",
    "updatedAt": "2026-07-01T08:14:38.593Z"
  },
  {
    "id": "agent6",
    "name": "Sophia Chen",
    "slug": "sophia-chen",
    "title": "Luxury Portfolio Consultant",
    "email": "sophia@luxespace.com",
    "phone": "+971 58 789 0123",
    "whatsapp": "+971587890123",
    "languages": [
      "English",
      "Cantonese",
      "Mandarin"
    ],
    "specialization": [
      "DIFC",
      "Downtown Apartments"
    ],
    "isFeatured": false,
    "createdAt": "2026-07-01T08:14:38.593Z",
    "updatedAt": "2026-07-01T08:14:38.593Z"
  }
];

const MOCK_PROPERTIES: Property[] = [
  {
    "id": "p1",
    "title": "Signature Apartment at Palm Jumeirah",
    "slug": "signature-apartment-at-palm-jumeirah-1",
    "description": "Immerse yourself in unmatched elegance with this premium Apartment crafted by Emaar Properties. Nestled prime in Palm Jumeirah, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 880000,
    "type": "apartment",
    "status": "off-plan",
    "completionStatus": "under-construction",
    "handoverDate": "Q2 2027",
    "bedrooms": 2,
    "bathrooms": 3,
    "areaSqft": 2120,
    "parking": 2,
    "location": "Palm Jumeirah, Dubai",
    "communityId": "c1",
    "developerId": "dev1",
    "agentId": "agent1",
    "latitude": 25.1084,
    "longitude": 55.135000000000005,
    "images": [
      "/assets/villa_render.png",
      "/assets/penthouse_render.png",
      "/assets/apartment_render.png",
      "/assets/palm_jumeirah_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "propertyPlanUrl": "/assets/downloads/golden_visa_guide_2026.pdf",
    "amenities": [
      "Infinity Pool",
      "Gymnasium",
      "Spa & Wellness",
      "24/7 Concierge",
      "Valet Parking"
    ],
    "isFeatured": true,
    "createdAt": "2026-03-24T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p2",
    "title": "The Ritz Apartment at Palm Jumeirah",
    "slug": "the-ritz-apartment-at-palm-jumeirah-2",
    "description": "Immerse yourself in unmatched elegance with this premium Apartment crafted by Sobha Realty. Nestled prime in Palm Jumeirah, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 960000,
    "type": "apartment",
    "status": "buy",
    "completionStatus": "ready",
    "bedrooms": 3,
    "bathrooms": 3,
    "areaSqft": 3240,
    "parking": 2,
    "location": "Palm Jumeirah, Dubai",
    "communityId": "c1",
    "developerId": "dev2",
    "agentId": "agent2",
    "latitude": 25.1094,
    "longitude": 55.136,
    "images": [
      "/assets/penthouse_render.png",
      "/assets/apartment_render.png",
      "/assets/palm_jumeirah_render.png",
      "/assets/villa_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Sky Pool",
      "Spa & Wellness",
      "24/7 Concierge",
      "Valet Parking",
      "High-speed Elevators"
    ],
    "isFeatured": true,
    "createdAt": "2026-03-25T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p3",
    "title": "Residences at Apartment at Palm Jumeirah",
    "slug": "residences-at-apartment-at-palm-jumeirah-3",
    "description": "Immerse yourself in unmatched elegance with this premium Apartment crafted by DAMAC Properties. Nestled prime in Palm Jumeirah, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 1040000,
    "type": "apartment",
    "status": "buy",
    "completionStatus": "ready",
    "bedrooms": 4,
    "bathrooms": 5,
    "areaSqft": 4360,
    "parking": 3,
    "location": "Palm Jumeirah, Dubai",
    "communityId": "c1",
    "developerId": "dev3",
    "agentId": "agent3",
    "latitude": 25.110400000000002,
    "longitude": 55.137,
    "images": [
      "/assets/apartment_render.png",
      "/assets/palm_jumeirah_render.png",
      "/assets/villa_render.png",
      "/assets/penthouse_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Olympic Pool",
      "24/7 Concierge",
      "Valet Parking",
      "High-speed Elevators",
      "Landscaped Gardens"
    ],
    "isFeatured": true,
    "createdAt": "2026-03-26T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p4",
    "title": "Elite Apartment at Palm Jumeirah",
    "slug": "elite-apartment-at-palm-jumeirah-4",
    "description": "Immerse yourself in unmatched elegance with this premium Apartment crafted by Ellington Properties. Nestled prime in Palm Jumeirah, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 50400,
    "type": "apartment",
    "status": "rent",
    "completionStatus": "ready",
    "bedrooms": 5,
    "bathrooms": 5,
    "areaSqft": 5480,
    "parking": 3,
    "location": "Palm Jumeirah, Dubai",
    "communityId": "c1",
    "developerId": "dev4",
    "agentId": "agent4",
    "latitude": 25.1114,
    "longitude": 55.138000000000005,
    "images": [
      "/assets/palm_jumeirah_render.png",
      "/assets/villa_render.png",
      "/assets/penthouse_render.png",
      "/assets/apartment_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Heated Pool",
      "Valet Parking",
      "High-speed Elevators",
      "Landscaped Gardens",
      "Kids Play Area"
    ],
    "isFeatured": true,
    "createdAt": "2026-03-27T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p5",
    "title": "Skyline Apartment at Palm Jumeirah",
    "slug": "skyline-apartment-at-palm-jumeirah-5",
    "description": "Immerse yourself in unmatched elegance with this premium Apartment crafted by Nakheel. Nestled prime in Palm Jumeirah, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 1200000,
    "type": "apartment",
    "status": "off-plan",
    "completionStatus": "under-construction",
    "handoverDate": "Q2 2028",
    "bedrooms": 1,
    "bathrooms": 2,
    "areaSqft": 1600,
    "parking": 2,
    "location": "Palm Jumeirah, Dubai",
    "communityId": "c1",
    "developerId": "dev5",
    "agentId": "agent5",
    "latitude": 25.1124,
    "longitude": 55.139,
    "images": [
      "/assets/villa_render.png",
      "/assets/penthouse_render.png",
      "/assets/apartment_render.png",
      "/assets/palm_jumeirah_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Private Pool",
      "High-speed Elevators",
      "Landscaped Gardens",
      "Kids Play Area",
      "Barbecue Area"
    ],
    "isFeatured": true,
    "createdAt": "2026-03-28T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p6",
    "title": "Oceanfront Apartment at Palm Jumeirah",
    "slug": "oceanfront-apartment-at-palm-jumeirah-6",
    "description": "Immerse yourself in unmatched elegance with this premium Apartment crafted by Meraas. Nestled prime in Palm Jumeirah, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 1280000,
    "type": "apartment",
    "status": "buy",
    "completionStatus": "ready",
    "bedrooms": 2,
    "bathrooms": 2,
    "areaSqft": 2720,
    "parking": 2,
    "location": "Palm Jumeirah, Dubai",
    "communityId": "c1",
    "developerId": "dev6",
    "agentId": "agent6",
    "latitude": 25.113400000000002,
    "longitude": 55.14,
    "images": [
      "/assets/penthouse_render.png",
      "/assets/apartment_render.png",
      "/assets/palm_jumeirah_render.png",
      "/assets/villa_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Infinity Pool",
      "Landscaped Gardens",
      "Kids Play Area",
      "Barbecue Area",
      "Steam & Sauna Rooms"
    ],
    "isFeatured": true,
    "createdAt": "2026-03-29T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p7",
    "title": "Serene Apartment at Palm Jumeirah",
    "slug": "serene-apartment-at-palm-jumeirah-7",
    "description": "Immerse yourself in unmatched elegance with this premium Apartment crafted by Aldar Properties. Nestled prime in Palm Jumeirah, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 1360000,
    "type": "apartment",
    "status": "buy",
    "completionStatus": "ready",
    "bedrooms": 3,
    "bathrooms": 4,
    "areaSqft": 3840,
    "parking": 2,
    "location": "Palm Jumeirah, Dubai",
    "communityId": "c1",
    "developerId": "dev7",
    "agentId": "agent1",
    "latitude": 25.1144,
    "longitude": 55.141000000000005,
    "images": [
      "/assets/apartment_render.png",
      "/assets/palm_jumeirah_render.png",
      "/assets/villa_render.png",
      "/assets/penthouse_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Sky Pool",
      "Kids Play Area",
      "Barbecue Area",
      "Steam & Sauna Rooms",
      "Residents Lounge"
    ],
    "isFeatured": true,
    "createdAt": "2026-03-30T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p8",
    "title": "Emerald Apartment at Downtown Dubai",
    "slug": "emerald-apartment-at-downtown-dubai-8",
    "description": "Immerse yourself in unmatched elegance with this premium Apartment crafted by Azizi Developments. Nestled prime in Downtown Dubai, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 64800,
    "type": "apartment",
    "status": "rent",
    "completionStatus": "ready",
    "bedrooms": 4,
    "bathrooms": 4,
    "areaSqft": 4960,
    "parking": 3,
    "location": "Downtown Dubai, Dubai",
    "communityId": "c2",
    "developerId": "dev8",
    "agentId": "agent2",
    "latitude": 25.2078,
    "longitude": 55.2738,
    "images": [
      "/assets/palm_jumeirah_render.png",
      "/assets/villa_render.png",
      "/assets/penthouse_render.png",
      "/assets/apartment_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Olympic Pool",
      "Barbecue Area",
      "Steam & Sauna Rooms",
      "Residents Lounge",
      "Cinema Room"
    ],
    "isFeatured": true,
    "createdAt": "2026-03-31T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p9",
    "title": "Marquis Apartment at Downtown Dubai",
    "slug": "marquis-apartment-at-downtown-dubai-9",
    "description": "Immerse yourself in unmatched elegance with this premium Apartment crafted by Omniyat. Nestled prime in Downtown Dubai, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 1520000,
    "type": "apartment",
    "status": "off-plan",
    "completionStatus": "under-construction",
    "handoverDate": "Q2 2026",
    "bedrooms": 5,
    "bathrooms": 6,
    "areaSqft": 6080,
    "parking": 3,
    "location": "Downtown Dubai, Dubai",
    "communityId": "c2",
    "developerId": "dev9",
    "agentId": "agent3",
    "latitude": 25.2088,
    "longitude": 55.2748,
    "images": [
      "/assets/villa_render.png",
      "/assets/penthouse_render.png",
      "/assets/apartment_render.png",
      "/assets/palm_jumeirah_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Heated Pool",
      "Steam & Sauna Rooms",
      "Residents Lounge",
      "Cinema Room",
      "Wine Cellar"
    ],
    "isFeatured": true,
    "createdAt": "2026-04-01T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p10",
    "title": "One Apartment at Downtown Dubai",
    "slug": "one-apartment-at-downtown-dubai-10",
    "description": "Immerse yourself in unmatched elegance with this premium Apartment crafted by Select Group. Nestled prime in Downtown Dubai, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 1600000,
    "type": "apartment",
    "status": "buy",
    "completionStatus": "ready",
    "bedrooms": 1,
    "bathrooms": 1,
    "areaSqft": 2200,
    "parking": 2,
    "location": "Downtown Dubai, Dubai",
    "communityId": "c2",
    "developerId": "dev10",
    "agentId": "agent4",
    "latitude": 25.1998,
    "longitude": 55.2658,
    "images": [
      "/assets/penthouse_render.png",
      "/assets/apartment_render.png",
      "/assets/palm_jumeirah_render.png",
      "/assets/villa_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Private Pool",
      "Residents Lounge",
      "Cinema Room",
      "Wine Cellar",
      "Tennis Court"
    ],
    "isFeatured": true,
    "createdAt": "2026-04-02T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p11",
    "title": "Aria Apartment at Downtown Dubai",
    "slug": "aria-apartment-at-downtown-dubai-11",
    "description": "Immerse yourself in unmatched elegance with this premium Apartment crafted by Emaar Properties. Nestled prime in Downtown Dubai, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 1680000,
    "type": "apartment",
    "status": "buy",
    "completionStatus": "ready",
    "bedrooms": 2,
    "bathrooms": 3,
    "areaSqft": 3320,
    "parking": 2,
    "location": "Downtown Dubai, Dubai",
    "communityId": "c2",
    "developerId": "dev1",
    "agentId": "agent5",
    "latitude": 25.200799999999997,
    "longitude": 55.2668,
    "images": [
      "/assets/apartment_render.png",
      "/assets/palm_jumeirah_render.png",
      "/assets/villa_render.png",
      "/assets/penthouse_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Infinity Pool",
      "Cinema Room",
      "Wine Cellar",
      "Tennis Court",
      "Golf Simulator"
    ],
    "isFeatured": true,
    "createdAt": "2026-04-03T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p12",
    "title": "Grand Apartment at Downtown Dubai",
    "slug": "grand-apartment-at-downtown-dubai-12",
    "description": "Immerse yourself in unmatched elegance with this premium Apartment crafted by Sobha Realty. Nestled prime in Downtown Dubai, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 79200,
    "type": "apartment",
    "status": "rent",
    "completionStatus": "ready",
    "bedrooms": 3,
    "bathrooms": 3,
    "areaSqft": 4440,
    "parking": 2,
    "location": "Downtown Dubai, Dubai",
    "communityId": "c2",
    "developerId": "dev2",
    "agentId": "agent6",
    "latitude": 25.2018,
    "longitude": 55.2678,
    "images": [
      "/assets/palm_jumeirah_render.png",
      "/assets/villa_render.png",
      "/assets/penthouse_render.png",
      "/assets/apartment_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Sky Pool",
      "Wine Cellar",
      "Tennis Court",
      "Golf Simulator",
      "Smart Home System"
    ],
    "isFeatured": true,
    "createdAt": "2026-04-04T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p13",
    "title": "Vogue Apartment at Downtown Dubai",
    "slug": "vogue-apartment-at-downtown-dubai-13",
    "description": "Immerse yourself in unmatched elegance with this premium Apartment crafted by DAMAC Properties. Nestled prime in Downtown Dubai, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 1840000,
    "type": "apartment",
    "status": "off-plan",
    "completionStatus": "under-construction",
    "handoverDate": "Q2 2027",
    "bedrooms": 4,
    "bathrooms": 5,
    "areaSqft": 5560,
    "parking": 3,
    "location": "Downtown Dubai, Dubai",
    "communityId": "c2",
    "developerId": "dev3",
    "agentId": "agent1",
    "latitude": 25.2028,
    "longitude": 55.2688,
    "images": [
      "/assets/villa_render.png",
      "/assets/penthouse_render.png",
      "/assets/apartment_render.png",
      "/assets/palm_jumeirah_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Olympic Pool",
      "Tennis Court",
      "Golf Simulator",
      "Smart Home System",
      "Gymnasium"
    ],
    "isFeatured": false,
    "createdAt": "2026-04-05T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p14",
    "title": "Waterfront Apartment at Downtown Dubai",
    "slug": "waterfront-apartment-at-downtown-dubai-14",
    "description": "Immerse yourself in unmatched elegance with this premium Apartment crafted by Ellington Properties. Nestled prime in Downtown Dubai, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 1920000,
    "type": "apartment",
    "status": "buy",
    "completionStatus": "ready",
    "bedrooms": 5,
    "bathrooms": 5,
    "areaSqft": 6680,
    "parking": 3,
    "location": "Downtown Dubai, Dubai",
    "communityId": "c2",
    "developerId": "dev4",
    "agentId": "agent2",
    "latitude": 25.203799999999998,
    "longitude": 55.269800000000004,
    "images": [
      "/assets/penthouse_render.png",
      "/assets/apartment_render.png",
      "/assets/palm_jumeirah_render.png",
      "/assets/villa_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Heated Pool",
      "Golf Simulator",
      "Smart Home System",
      "Gymnasium",
      "Spa & Wellness"
    ],
    "isFeatured": false,
    "createdAt": "2026-04-06T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p15",
    "title": "Crest Apartment at Dubai Hills Estate",
    "slug": "crest-apartment-at-dubai-hills-estate-15",
    "description": "Immerse yourself in unmatched elegance with this premium Apartment crafted by Nakheel. Nestled prime in Dubai Hills Estate, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 2000000,
    "type": "apartment",
    "status": "buy",
    "completionStatus": "ready",
    "bedrooms": 1,
    "bathrooms": 2,
    "areaSqft": 2800,
    "parking": 2,
    "location": "Dubai Hills Estate, Dubai",
    "communityId": "c3",
    "developerId": "dev5",
    "agentId": "agent3",
    "latitude": 25.1014,
    "longitude": 55.2588,
    "images": [
      "/assets/apartment_render.png",
      "/assets/palm_jumeirah_render.png",
      "/assets/villa_render.png",
      "/assets/penthouse_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Private Pool",
      "Smart Home System",
      "Gymnasium",
      "Spa & Wellness",
      "24/7 Concierge"
    ],
    "isFeatured": false,
    "createdAt": "2026-04-07T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p16",
    "title": "Crown Apartment at Dubai Hills Estate",
    "slug": "crown-apartment-at-dubai-hills-estate-16",
    "description": "Immerse yourself in unmatched elegance with this premium Apartment crafted by Meraas. Nestled prime in Dubai Hills Estate, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 93600,
    "type": "apartment",
    "status": "rent",
    "completionStatus": "ready",
    "bedrooms": 2,
    "bathrooms": 2,
    "areaSqft": 3920,
    "parking": 2,
    "location": "Dubai Hills Estate, Dubai",
    "communityId": "c3",
    "developerId": "dev6",
    "agentId": "agent4",
    "latitude": 25.102400000000003,
    "longitude": 55.2598,
    "images": [
      "/assets/palm_jumeirah_render.png",
      "/assets/villa_render.png",
      "/assets/penthouse_render.png",
      "/assets/apartment_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Infinity Pool",
      "Gymnasium",
      "Spa & Wellness",
      "24/7 Concierge",
      "Valet Parking"
    ],
    "isFeatured": false,
    "createdAt": "2026-04-08T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p17",
    "title": "Azure Apartment at Dubai Hills Estate",
    "slug": "azure-apartment-at-dubai-hills-estate-17",
    "description": "Immerse yourself in unmatched elegance with this premium Apartment crafted by Aldar Properties. Nestled prime in Dubai Hills Estate, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 2160000,
    "type": "apartment",
    "status": "off-plan",
    "completionStatus": "under-construction",
    "handoverDate": "Q2 2028",
    "bedrooms": 3,
    "bathrooms": 4,
    "areaSqft": 5040,
    "parking": 2,
    "location": "Dubai Hills Estate, Dubai",
    "communityId": "c3",
    "developerId": "dev7",
    "agentId": "agent5",
    "latitude": 25.1034,
    "longitude": 55.2608,
    "images": [
      "/assets/villa_render.png",
      "/assets/penthouse_render.png",
      "/assets/apartment_render.png",
      "/assets/palm_jumeirah_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Sky Pool",
      "Spa & Wellness",
      "24/7 Concierge",
      "Valet Parking",
      "High-speed Elevators"
    ],
    "isFeatured": false,
    "createdAt": "2026-04-09T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p18",
    "title": "Majestic Apartment at Dubai Hills Estate",
    "slug": "majestic-apartment-at-dubai-hills-estate-18",
    "description": "Immerse yourself in unmatched elegance with this premium Apartment crafted by Azizi Developments. Nestled prime in Dubai Hills Estate, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 2240000,
    "type": "apartment",
    "status": "buy",
    "completionStatus": "ready",
    "bedrooms": 4,
    "bathrooms": 4,
    "areaSqft": 6160,
    "parking": 3,
    "location": "Dubai Hills Estate, Dubai",
    "communityId": "c3",
    "developerId": "dev8",
    "agentId": "agent6",
    "latitude": 25.104400000000002,
    "longitude": 55.2618,
    "images": [
      "/assets/penthouse_render.png",
      "/assets/apartment_render.png",
      "/assets/palm_jumeirah_render.png",
      "/assets/villa_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Olympic Pool",
      "24/7 Concierge",
      "Valet Parking",
      "High-speed Elevators",
      "Landscaped Gardens"
    ],
    "isFeatured": false,
    "createdAt": "2026-04-10T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p19",
    "title": "Infinity Apartment at Dubai Hills Estate",
    "slug": "infinity-apartment-at-dubai-hills-estate-19",
    "description": "Immerse yourself in unmatched elegance with this premium Apartment crafted by Omniyat. Nestled prime in Dubai Hills Estate, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 2320000,
    "type": "apartment",
    "status": "buy",
    "completionStatus": "ready",
    "bedrooms": 5,
    "bathrooms": 6,
    "areaSqft": 7280,
    "parking": 3,
    "location": "Dubai Hills Estate, Dubai",
    "communityId": "c3",
    "developerId": "dev9",
    "agentId": "agent1",
    "latitude": 25.105400000000003,
    "longitude": 55.2628,
    "images": [
      "/assets/apartment_render.png",
      "/assets/palm_jumeirah_render.png",
      "/assets/villa_render.png",
      "/assets/penthouse_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Heated Pool",
      "Valet Parking",
      "High-speed Elevators",
      "Landscaped Gardens",
      "Kids Play Area"
    ],
    "isFeatured": false,
    "createdAt": "2026-04-11T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p20",
    "title": "Royal Apartment at Dubai Hills Estate",
    "slug": "royal-apartment-at-dubai-hills-estate-20",
    "description": "Immerse yourself in unmatched elegance with this premium Apartment crafted by Select Group. Nestled prime in Dubai Hills Estate, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 108000,
    "type": "apartment",
    "status": "rent",
    "completionStatus": "ready",
    "bedrooms": 1,
    "bathrooms": 1,
    "areaSqft": 3400,
    "parking": 2,
    "location": "Dubai Hills Estate, Dubai",
    "communityId": "c3",
    "developerId": "dev10",
    "agentId": "agent2",
    "latitude": 25.096400000000003,
    "longitude": 55.2538,
    "images": [
      "/assets/palm_jumeirah_render.png",
      "/assets/villa_render.png",
      "/assets/penthouse_render.png",
      "/assets/apartment_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Private Pool",
      "High-speed Elevators",
      "Landscaped Gardens",
      "Kids Play Area",
      "Barbecue Area"
    ],
    "isFeatured": false,
    "createdAt": "2026-04-12T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p21",
    "title": "Signature Apartment at Dubai Hills Estate",
    "slug": "signature-apartment-at-dubai-hills-estate-21",
    "description": "Immerse yourself in unmatched elegance with this premium Apartment crafted by Emaar Properties. Nestled prime in Dubai Hills Estate, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 2480000,
    "type": "apartment",
    "status": "off-plan",
    "completionStatus": "under-construction",
    "handoverDate": "Q2 2026",
    "bedrooms": 2,
    "bathrooms": 3,
    "areaSqft": 4520,
    "parking": 2,
    "location": "Dubai Hills Estate, Dubai",
    "communityId": "c3",
    "developerId": "dev1",
    "agentId": "agent3",
    "latitude": 25.0974,
    "longitude": 55.2548,
    "images": [
      "/assets/villa_render.png",
      "/assets/penthouse_render.png",
      "/assets/apartment_render.png",
      "/assets/palm_jumeirah_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Infinity Pool",
      "Landscaped Gardens",
      "Kids Play Area",
      "Barbecue Area",
      "Steam & Sauna Rooms"
    ],
    "isFeatured": false,
    "createdAt": "2026-04-13T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p22",
    "title": "The Ritz Apartment at Dubai Marina",
    "slug": "the-ritz-apartment-at-dubai-marina-22",
    "description": "Immerse yourself in unmatched elegance with this premium Apartment crafted by Sobha Realty. Nestled prime in Dubai Marina, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 2560000,
    "type": "apartment",
    "status": "buy",
    "completionStatus": "ready",
    "bedrooms": 3,
    "bathrooms": 3,
    "areaSqft": 5640,
    "parking": 2,
    "location": "Dubai Marina, Dubai",
    "communityId": "c4",
    "developerId": "dev2",
    "agentId": "agent4",
    "latitude": 25.0775,
    "longitude": 55.1373,
    "images": [
      "/assets/penthouse_render.png",
      "/assets/apartment_render.png",
      "/assets/palm_jumeirah_render.png",
      "/assets/villa_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Sky Pool",
      "Kids Play Area",
      "Barbecue Area",
      "Steam & Sauna Rooms",
      "Residents Lounge"
    ],
    "isFeatured": false,
    "createdAt": "2026-04-14T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p23",
    "title": "Residences at Apartment at Dubai Marina",
    "slug": "residences-at-apartment-at-dubai-marina-23",
    "description": "Immerse yourself in unmatched elegance with this premium Apartment crafted by DAMAC Properties. Nestled prime in Dubai Marina, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 2640000,
    "type": "apartment",
    "status": "buy",
    "completionStatus": "ready",
    "bedrooms": 4,
    "bathrooms": 5,
    "areaSqft": 6760,
    "parking": 3,
    "location": "Dubai Marina, Dubai",
    "communityId": "c4",
    "developerId": "dev3",
    "agentId": "agent5",
    "latitude": 25.078500000000002,
    "longitude": 55.1383,
    "images": [
      "/assets/apartment_render.png",
      "/assets/palm_jumeirah_render.png",
      "/assets/villa_render.png",
      "/assets/penthouse_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Olympic Pool",
      "Barbecue Area",
      "Steam & Sauna Rooms",
      "Residents Lounge",
      "Cinema Room"
    ],
    "isFeatured": false,
    "createdAt": "2026-04-15T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p24",
    "title": "Elite Apartment at Dubai Marina",
    "slug": "elite-apartment-at-dubai-marina-24",
    "description": "Immerse yourself in unmatched elegance with this premium Apartment crafted by Ellington Properties. Nestled prime in Dubai Marina, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 122400,
    "type": "apartment",
    "status": "rent",
    "completionStatus": "ready",
    "bedrooms": 5,
    "bathrooms": 5,
    "areaSqft": 7880,
    "parking": 3,
    "location": "Dubai Marina, Dubai",
    "communityId": "c4",
    "developerId": "dev4",
    "agentId": "agent6",
    "latitude": 25.0795,
    "longitude": 55.139300000000006,
    "images": [
      "/assets/palm_jumeirah_render.png",
      "/assets/villa_render.png",
      "/assets/penthouse_render.png",
      "/assets/apartment_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Heated Pool",
      "Steam & Sauna Rooms",
      "Residents Lounge",
      "Cinema Room",
      "Wine Cellar"
    ],
    "isFeatured": false,
    "createdAt": "2026-04-16T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p25",
    "title": "Skyline Apartment at Dubai Marina",
    "slug": "skyline-apartment-at-dubai-marina-25",
    "description": "Immerse yourself in unmatched elegance with this premium Apartment crafted by Nakheel. Nestled prime in Dubai Marina, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 2800000,
    "type": "apartment",
    "status": "off-plan",
    "completionStatus": "under-construction",
    "handoverDate": "Q2 2027",
    "bedrooms": 1,
    "bathrooms": 2,
    "areaSqft": 4000,
    "parking": 2,
    "location": "Dubai Marina, Dubai",
    "communityId": "c4",
    "developerId": "dev5",
    "agentId": "agent1",
    "latitude": 25.0805,
    "longitude": 55.1403,
    "images": [
      "/assets/villa_render.png",
      "/assets/penthouse_render.png",
      "/assets/apartment_render.png",
      "/assets/palm_jumeirah_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Private Pool",
      "Residents Lounge",
      "Cinema Room",
      "Wine Cellar",
      "Tennis Court"
    ],
    "isFeatured": false,
    "createdAt": "2026-04-17T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p26",
    "title": "Oceanfront Apartment at Dubai Marina",
    "slug": "oceanfront-apartment-at-dubai-marina-26",
    "description": "Immerse yourself in unmatched elegance with this premium Apartment crafted by Meraas. Nestled prime in Dubai Marina, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 2880000,
    "type": "apartment",
    "status": "buy",
    "completionStatus": "ready",
    "bedrooms": 2,
    "bathrooms": 2,
    "areaSqft": 5120,
    "parking": 2,
    "location": "Dubai Marina, Dubai",
    "communityId": "c4",
    "developerId": "dev6",
    "agentId": "agent2",
    "latitude": 25.081500000000002,
    "longitude": 55.1413,
    "images": [
      "/assets/penthouse_render.png",
      "/assets/apartment_render.png",
      "/assets/palm_jumeirah_render.png",
      "/assets/villa_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Infinity Pool",
      "Cinema Room",
      "Wine Cellar",
      "Tennis Court",
      "Golf Simulator"
    ],
    "isFeatured": false,
    "createdAt": "2026-04-18T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p27",
    "title": "Serene Apartment at Dubai Marina",
    "slug": "serene-apartment-at-dubai-marina-27",
    "description": "Immerse yourself in unmatched elegance with this premium Apartment crafted by Aldar Properties. Nestled prime in Dubai Marina, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 2960000,
    "type": "apartment",
    "status": "buy",
    "completionStatus": "ready",
    "bedrooms": 3,
    "bathrooms": 4,
    "areaSqft": 6240,
    "parking": 2,
    "location": "Dubai Marina, Dubai",
    "communityId": "c4",
    "developerId": "dev7",
    "agentId": "agent3",
    "latitude": 25.0825,
    "longitude": 55.142300000000006,
    "images": [
      "/assets/apartment_render.png",
      "/assets/palm_jumeirah_render.png",
      "/assets/villa_render.png",
      "/assets/penthouse_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Sky Pool",
      "Wine Cellar",
      "Tennis Court",
      "Golf Simulator",
      "Smart Home System"
    ],
    "isFeatured": false,
    "createdAt": "2026-04-19T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p28",
    "title": "Emerald Apartment at Dubai Marina",
    "slug": "emerald-apartment-at-dubai-marina-28",
    "description": "Immerse yourself in unmatched elegance with this premium Apartment crafted by Azizi Developments. Nestled prime in Dubai Marina, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 136800,
    "type": "apartment",
    "status": "rent",
    "completionStatus": "ready",
    "bedrooms": 4,
    "bathrooms": 4,
    "areaSqft": 7360,
    "parking": 3,
    "location": "Dubai Marina, Dubai",
    "communityId": "c4",
    "developerId": "dev8",
    "agentId": "agent4",
    "latitude": 25.0835,
    "longitude": 55.1433,
    "images": [
      "/assets/palm_jumeirah_render.png",
      "/assets/villa_render.png",
      "/assets/penthouse_render.png",
      "/assets/apartment_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Olympic Pool",
      "Tennis Court",
      "Golf Simulator",
      "Smart Home System",
      "Gymnasium"
    ],
    "isFeatured": false,
    "createdAt": "2026-04-20T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p29",
    "title": "Marquis Apartment at Business Bay",
    "slug": "marquis-apartment-at-business-bay-29",
    "description": "Immerse yourself in unmatched elegance with this premium Apartment crafted by Omniyat. Nestled prime in Business Bay, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 3120000,
    "type": "apartment",
    "status": "off-plan",
    "completionStatus": "under-construction",
    "handoverDate": "Q2 2028",
    "bedrooms": 5,
    "bathrooms": 6,
    "areaSqft": 8480,
    "parking": 3,
    "location": "Business Bay, Dubai",
    "communityId": "c5",
    "developerId": "dev9",
    "agentId": "agent5",
    "latitude": 25.186400000000003,
    "longitude": 55.276799999999994,
    "images": [
      "/assets/villa_render.png",
      "/assets/penthouse_render.png",
      "/assets/apartment_render.png",
      "/assets/palm_jumeirah_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Heated Pool",
      "Golf Simulator",
      "Smart Home System",
      "Gymnasium",
      "Spa & Wellness"
    ],
    "isFeatured": false,
    "createdAt": "2026-04-21T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p30",
    "title": "One Apartment at Business Bay",
    "slug": "one-apartment-at-business-bay-30",
    "description": "Immerse yourself in unmatched elegance with this premium Apartment crafted by Select Group. Nestled prime in Business Bay, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 3200000,
    "type": "apartment",
    "status": "buy",
    "completionStatus": "ready",
    "bedrooms": 1,
    "bathrooms": 1,
    "areaSqft": 4600,
    "parking": 2,
    "location": "Business Bay, Dubai",
    "communityId": "c5",
    "developerId": "dev10",
    "agentId": "agent6",
    "latitude": 25.177400000000002,
    "longitude": 55.267799999999994,
    "images": [
      "/assets/penthouse_render.png",
      "/assets/apartment_render.png",
      "/assets/palm_jumeirah_render.png",
      "/assets/villa_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Private Pool",
      "Smart Home System",
      "Gymnasium",
      "Spa & Wellness",
      "24/7 Concierge"
    ],
    "isFeatured": false,
    "createdAt": "2026-04-22T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p31",
    "title": "Aria Apartment at Business Bay",
    "slug": "aria-apartment-at-business-bay-31",
    "description": "Immerse yourself in unmatched elegance with this premium Apartment crafted by Emaar Properties. Nestled prime in Business Bay, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 3280000,
    "type": "apartment",
    "status": "buy",
    "completionStatus": "ready",
    "bedrooms": 2,
    "bathrooms": 3,
    "areaSqft": 5720,
    "parking": 2,
    "location": "Business Bay, Dubai",
    "communityId": "c5",
    "developerId": "dev1",
    "agentId": "agent1",
    "latitude": 25.1784,
    "longitude": 55.2688,
    "images": [
      "/assets/apartment_render.png",
      "/assets/palm_jumeirah_render.png",
      "/assets/villa_render.png",
      "/assets/penthouse_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Infinity Pool",
      "Gymnasium",
      "Spa & Wellness",
      "24/7 Concierge",
      "Valet Parking"
    ],
    "isFeatured": false,
    "createdAt": "2026-04-23T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p32",
    "title": "Grand Apartment at Business Bay",
    "slug": "grand-apartment-at-business-bay-32",
    "description": "Immerse yourself in unmatched elegance with this premium Apartment crafted by Sobha Realty. Nestled prime in Business Bay, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 151200,
    "type": "apartment",
    "status": "rent",
    "completionStatus": "ready",
    "bedrooms": 3,
    "bathrooms": 3,
    "areaSqft": 6840,
    "parking": 2,
    "location": "Business Bay, Dubai",
    "communityId": "c5",
    "developerId": "dev2",
    "agentId": "agent2",
    "latitude": 25.1794,
    "longitude": 55.2698,
    "images": [
      "/assets/palm_jumeirah_render.png",
      "/assets/villa_render.png",
      "/assets/penthouse_render.png",
      "/assets/apartment_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Sky Pool",
      "Spa & Wellness",
      "24/7 Concierge",
      "Valet Parking",
      "High-speed Elevators"
    ],
    "isFeatured": false,
    "createdAt": "2026-04-24T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p33",
    "title": "Vogue Apartment at Business Bay",
    "slug": "vogue-apartment-at-business-bay-33",
    "description": "Immerse yourself in unmatched elegance with this premium Apartment crafted by DAMAC Properties. Nestled prime in Business Bay, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 3440000,
    "type": "apartment",
    "status": "off-plan",
    "completionStatus": "under-construction",
    "handoverDate": "Q2 2026",
    "bedrooms": 4,
    "bathrooms": 5,
    "areaSqft": 7960,
    "parking": 3,
    "location": "Business Bay, Dubai",
    "communityId": "c5",
    "developerId": "dev3",
    "agentId": "agent3",
    "latitude": 25.180400000000002,
    "longitude": 55.270799999999994,
    "images": [
      "/assets/villa_render.png",
      "/assets/penthouse_render.png",
      "/assets/apartment_render.png",
      "/assets/palm_jumeirah_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Olympic Pool",
      "24/7 Concierge",
      "Valet Parking",
      "High-speed Elevators",
      "Landscaped Gardens"
    ],
    "isFeatured": false,
    "createdAt": "2026-04-25T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p34",
    "title": "Waterfront Apartment at Business Bay",
    "slug": "waterfront-apartment-at-business-bay-34",
    "description": "Immerse yourself in unmatched elegance with this premium Apartment crafted by Ellington Properties. Nestled prime in Business Bay, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 3520000,
    "type": "apartment",
    "status": "buy",
    "completionStatus": "ready",
    "bedrooms": 5,
    "bathrooms": 5,
    "areaSqft": 9080,
    "parking": 3,
    "location": "Business Bay, Dubai",
    "communityId": "c5",
    "developerId": "dev4",
    "agentId": "agent4",
    "latitude": 25.1814,
    "longitude": 55.2718,
    "images": [
      "/assets/penthouse_render.png",
      "/assets/apartment_render.png",
      "/assets/palm_jumeirah_render.png",
      "/assets/villa_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Heated Pool",
      "Valet Parking",
      "High-speed Elevators",
      "Landscaped Gardens",
      "Kids Play Area"
    ],
    "isFeatured": false,
    "createdAt": "2026-04-26T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p35",
    "title": "Crest Apartment at Business Bay",
    "slug": "crest-apartment-at-business-bay-35",
    "description": "Immerse yourself in unmatched elegance with this premium Apartment crafted by Nakheel. Nestled prime in Business Bay, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 3600000,
    "type": "apartment",
    "status": "buy",
    "completionStatus": "ready",
    "bedrooms": 1,
    "bathrooms": 2,
    "areaSqft": 5200,
    "parking": 2,
    "location": "Business Bay, Dubai",
    "communityId": "c5",
    "developerId": "dev5",
    "agentId": "agent5",
    "latitude": 25.1824,
    "longitude": 55.2728,
    "images": [
      "/assets/apartment_render.png",
      "/assets/palm_jumeirah_render.png",
      "/assets/villa_render.png",
      "/assets/penthouse_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Private Pool",
      "High-speed Elevators",
      "Landscaped Gardens",
      "Kids Play Area",
      "Barbecue Area"
    ],
    "isFeatured": false,
    "createdAt": "2026-04-27T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p36",
    "title": "Crown Apartment at Jumeirah Beach Residence",
    "slug": "crown-apartment-at-jumeirah-beach-residence-36",
    "description": "Immerse yourself in unmatched elegance with this premium Apartment crafted by Meraas. Nestled prime in Jumeirah Beach Residence, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 165600,
    "type": "apartment",
    "status": "rent",
    "completionStatus": "ready",
    "bedrooms": 2,
    "bathrooms": 2,
    "areaSqft": 6320,
    "parking": 2,
    "location": "Jumeirah Beach Residence, Dubai",
    "communityId": "c6",
    "developerId": "dev6",
    "agentId": "agent6",
    "latitude": 25.0792,
    "longitude": 55.1338,
    "images": [
      "/assets/palm_jumeirah_render.png",
      "/assets/villa_render.png",
      "/assets/penthouse_render.png",
      "/assets/apartment_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Infinity Pool",
      "Landscaped Gardens",
      "Kids Play Area",
      "Barbecue Area",
      "Steam & Sauna Rooms"
    ],
    "isFeatured": false,
    "createdAt": "2026-04-28T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p37",
    "title": "Azure Apartment at Jumeirah Beach Residence",
    "slug": "azure-apartment-at-jumeirah-beach-residence-37",
    "description": "Immerse yourself in unmatched elegance with this premium Apartment crafted by Aldar Properties. Nestled prime in Jumeirah Beach Residence, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 3760000,
    "type": "apartment",
    "status": "off-plan",
    "completionStatus": "under-construction",
    "handoverDate": "Q2 2027",
    "bedrooms": 3,
    "bathrooms": 4,
    "areaSqft": 7440,
    "parking": 2,
    "location": "Jumeirah Beach Residence, Dubai",
    "communityId": "c6",
    "developerId": "dev7",
    "agentId": "agent1",
    "latitude": 25.080199999999998,
    "longitude": 55.134800000000006,
    "images": [
      "/assets/villa_render.png",
      "/assets/penthouse_render.png",
      "/assets/apartment_render.png",
      "/assets/palm_jumeirah_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Sky Pool",
      "Kids Play Area",
      "Barbecue Area",
      "Steam & Sauna Rooms",
      "Residents Lounge"
    ],
    "isFeatured": false,
    "createdAt": "2026-04-29T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p38",
    "title": "Majestic Apartment at Jumeirah Beach Residence",
    "slug": "majestic-apartment-at-jumeirah-beach-residence-38",
    "description": "Immerse yourself in unmatched elegance with this premium Apartment crafted by Azizi Developments. Nestled prime in Jumeirah Beach Residence, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 3840000,
    "type": "apartment",
    "status": "buy",
    "completionStatus": "ready",
    "bedrooms": 4,
    "bathrooms": 4,
    "areaSqft": 8560,
    "parking": 3,
    "location": "Jumeirah Beach Residence, Dubai",
    "communityId": "c6",
    "developerId": "dev8",
    "agentId": "agent2",
    "latitude": 25.0812,
    "longitude": 55.1358,
    "images": [
      "/assets/penthouse_render.png",
      "/assets/apartment_render.png",
      "/assets/palm_jumeirah_render.png",
      "/assets/villa_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Olympic Pool",
      "Barbecue Area",
      "Steam & Sauna Rooms",
      "Residents Lounge",
      "Cinema Room"
    ],
    "isFeatured": false,
    "createdAt": "2026-04-30T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p39",
    "title": "Infinity Apartment at Jumeirah Beach Residence",
    "slug": "infinity-apartment-at-jumeirah-beach-residence-39",
    "description": "Immerse yourself in unmatched elegance with this premium Apartment crafted by Omniyat. Nestled prime in Jumeirah Beach Residence, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 3920000,
    "type": "apartment",
    "status": "buy",
    "completionStatus": "ready",
    "bedrooms": 5,
    "bathrooms": 6,
    "areaSqft": 9680,
    "parking": 3,
    "location": "Jumeirah Beach Residence, Dubai",
    "communityId": "c6",
    "developerId": "dev9",
    "agentId": "agent3",
    "latitude": 25.0822,
    "longitude": 55.1368,
    "images": [
      "/assets/apartment_render.png",
      "/assets/palm_jumeirah_render.png",
      "/assets/villa_render.png",
      "/assets/penthouse_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Heated Pool",
      "Steam & Sauna Rooms",
      "Residents Lounge",
      "Cinema Room",
      "Wine Cellar"
    ],
    "isFeatured": false,
    "createdAt": "2026-05-01T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p40",
    "title": "Royal Apartment at Jumeirah Beach Residence",
    "slug": "royal-apartment-at-jumeirah-beach-residence-40",
    "description": "Immerse yourself in unmatched elegance with this premium Apartment crafted by Select Group. Nestled prime in Jumeirah Beach Residence, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 180000,
    "type": "apartment",
    "status": "rent",
    "completionStatus": "ready",
    "bedrooms": 1,
    "bathrooms": 1,
    "areaSqft": 5800,
    "parking": 2,
    "location": "Jumeirah Beach Residence, Dubai",
    "communityId": "c6",
    "developerId": "dev10",
    "agentId": "agent4",
    "latitude": 25.0732,
    "longitude": 55.1278,
    "images": [
      "/assets/palm_jumeirah_render.png",
      "/assets/villa_render.png",
      "/assets/penthouse_render.png",
      "/assets/apartment_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Private Pool",
      "Residents Lounge",
      "Cinema Room",
      "Wine Cellar",
      "Tennis Court"
    ],
    "isFeatured": false,
    "createdAt": "2026-05-02T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p41",
    "title": "Signature Villa at Jumeirah Beach Residence",
    "slug": "signature-villa-at-jumeirah-beach-residence-41",
    "description": "Immerse yourself in unmatched elegance with this premium Villa crafted by Emaar Properties. Nestled prime in Jumeirah Beach Residence, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 18300000,
    "type": "villa",
    "status": "off-plan",
    "completionStatus": "under-construction",
    "handoverDate": "Q2 2028",
    "bedrooms": 4,
    "bathrooms": 5,
    "areaSqft": 8920,
    "parking": 3,
    "location": "Jumeirah Beach Residence, Dubai",
    "communityId": "c6",
    "developerId": "dev1",
    "agentId": "agent5",
    "latitude": 25.074199999999998,
    "longitude": 55.128800000000005,
    "images": [
      "/assets/villa_render.png",
      "/assets/penthouse_render.png",
      "/assets/apartment_render.png",
      "/assets/palm_jumeirah_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Infinity Pool",
      "Cinema Room",
      "Wine Cellar",
      "Tennis Court",
      "Golf Simulator"
    ],
    "isFeatured": false,
    "createdAt": "2026-05-03T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p42",
    "title": "The Ritz Villa at Jumeirah Beach Residence",
    "slug": "the-ritz-villa-at-jumeirah-beach-residence-42",
    "description": "Immerse yourself in unmatched elegance with this premium Villa crafted by Sobha Realty. Nestled prime in Jumeirah Beach Residence, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 18600000,
    "type": "villa",
    "status": "buy",
    "completionStatus": "ready",
    "bedrooms": 5,
    "bathrooms": 5,
    "areaSqft": 10040,
    "parking": 3,
    "location": "Jumeirah Beach Residence, Dubai",
    "communityId": "c6",
    "developerId": "dev2",
    "agentId": "agent6",
    "latitude": 25.0752,
    "longitude": 55.1298,
    "images": [
      "/assets/penthouse_render.png",
      "/assets/apartment_render.png",
      "/assets/palm_jumeirah_render.png",
      "/assets/villa_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Sky Pool",
      "Wine Cellar",
      "Tennis Court",
      "Golf Simulator",
      "Smart Home System"
    ],
    "isFeatured": false,
    "createdAt": "2026-05-04T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p43",
    "title": "Residences at Villa at Dubai Creek Harbour",
    "slug": "residences-at-villa-at-dubai-creek-harbour-43",
    "description": "Immerse yourself in unmatched elegance with this premium Villa crafted by DAMAC Properties. Nestled prime in Dubai Creek Harbour, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 18900000,
    "type": "villa",
    "status": "buy",
    "completionStatus": "ready",
    "bedrooms": 6,
    "bathrooms": 7,
    "areaSqft": 11160,
    "parking": 3,
    "location": "Dubai Creek Harbour, Dubai",
    "communityId": "c7",
    "developerId": "dev3",
    "agentId": "agent1",
    "latitude": 25.1994,
    "longitude": 55.3508,
    "images": [
      "/assets/apartment_render.png",
      "/assets/palm_jumeirah_render.png",
      "/assets/villa_render.png",
      "/assets/penthouse_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Olympic Pool",
      "Tennis Court",
      "Golf Simulator",
      "Smart Home System",
      "Gymnasium"
    ],
    "isFeatured": false,
    "createdAt": "2026-05-05T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p44",
    "title": "Elite Villa at Dubai Creek Harbour",
    "slug": "elite-villa-at-dubai-creek-harbour-44",
    "description": "Immerse yourself in unmatched elegance with this premium Villa crafted by Ellington Properties. Nestled prime in Dubai Creek Harbour, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 864000,
    "type": "villa",
    "status": "rent",
    "completionStatus": "ready",
    "bedrooms": 7,
    "bathrooms": 7,
    "areaSqft": 12280,
    "parking": 3,
    "location": "Dubai Creek Harbour, Dubai",
    "communityId": "c7",
    "developerId": "dev4",
    "agentId": "agent2",
    "latitude": 25.2004,
    "longitude": 55.351800000000004,
    "images": [
      "/assets/palm_jumeirah_render.png",
      "/assets/villa_render.png",
      "/assets/penthouse_render.png",
      "/assets/apartment_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Heated Pool",
      "Golf Simulator",
      "Smart Home System",
      "Gymnasium",
      "Spa & Wellness"
    ],
    "isFeatured": false,
    "createdAt": "2026-05-06T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p45",
    "title": "Skyline Villa at Dubai Creek Harbour",
    "slug": "skyline-villa-at-dubai-creek-harbour-45",
    "description": "Immerse yourself in unmatched elegance with this premium Villa crafted by Nakheel. Nestled prime in Dubai Creek Harbour, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 19500000,
    "type": "villa",
    "status": "off-plan",
    "completionStatus": "under-construction",
    "handoverDate": "Q2 2026",
    "bedrooms": 3,
    "bathrooms": 4,
    "areaSqft": 8400,
    "parking": 2,
    "location": "Dubai Creek Harbour, Dubai",
    "communityId": "c7",
    "developerId": "dev5",
    "agentId": "agent3",
    "latitude": 25.2014,
    "longitude": 55.3528,
    "images": [
      "/assets/villa_render.png",
      "/assets/penthouse_render.png",
      "/assets/apartment_render.png",
      "/assets/palm_jumeirah_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Private Pool",
      "Smart Home System",
      "Gymnasium",
      "Spa & Wellness",
      "24/7 Concierge"
    ],
    "isFeatured": false,
    "createdAt": "2026-05-07T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p46",
    "title": "Oceanfront Villa at Dubai Creek Harbour",
    "slug": "oceanfront-villa-at-dubai-creek-harbour-46",
    "description": "Immerse yourself in unmatched elegance with this premium Villa crafted by Meraas. Nestled prime in Dubai Creek Harbour, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 19800000,
    "type": "villa",
    "status": "buy",
    "completionStatus": "ready",
    "bedrooms": 4,
    "bathrooms": 4,
    "areaSqft": 9520,
    "parking": 3,
    "location": "Dubai Creek Harbour, Dubai",
    "communityId": "c7",
    "developerId": "dev6",
    "agentId": "agent4",
    "latitude": 25.2024,
    "longitude": 55.3538,
    "images": [
      "/assets/penthouse_render.png",
      "/assets/apartment_render.png",
      "/assets/palm_jumeirah_render.png",
      "/assets/villa_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Infinity Pool",
      "Gymnasium",
      "Spa & Wellness",
      "24/7 Concierge",
      "Valet Parking"
    ],
    "isFeatured": false,
    "createdAt": "2026-05-08T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p47",
    "title": "Serene Villa at Dubai Creek Harbour",
    "slug": "serene-villa-at-dubai-creek-harbour-47",
    "description": "Immerse yourself in unmatched elegance with this premium Villa crafted by Aldar Properties. Nestled prime in Dubai Creek Harbour, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 20100000,
    "type": "villa",
    "status": "buy",
    "completionStatus": "ready",
    "bedrooms": 5,
    "bathrooms": 6,
    "areaSqft": 10640,
    "parking": 3,
    "location": "Dubai Creek Harbour, Dubai",
    "communityId": "c7",
    "developerId": "dev7",
    "agentId": "agent5",
    "latitude": 25.2034,
    "longitude": 55.354800000000004,
    "images": [
      "/assets/apartment_render.png",
      "/assets/palm_jumeirah_render.png",
      "/assets/villa_render.png",
      "/assets/penthouse_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Sky Pool",
      "Spa & Wellness",
      "24/7 Concierge",
      "Valet Parking",
      "High-speed Elevators"
    ],
    "isFeatured": false,
    "createdAt": "2026-05-09T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p48",
    "title": "Emerald Villa at Dubai Creek Harbour",
    "slug": "emerald-villa-at-dubai-creek-harbour-48",
    "description": "Immerse yourself in unmatched elegance with this premium Villa crafted by Azizi Developments. Nestled prime in Dubai Creek Harbour, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 918000,
    "type": "villa",
    "status": "rent",
    "completionStatus": "ready",
    "bedrooms": 6,
    "bathrooms": 6,
    "areaSqft": 11760,
    "parking": 3,
    "location": "Dubai Creek Harbour, Dubai",
    "communityId": "c7",
    "developerId": "dev8",
    "agentId": "agent6",
    "latitude": 25.2044,
    "longitude": 55.3558,
    "images": [
      "/assets/palm_jumeirah_render.png",
      "/assets/villa_render.png",
      "/assets/penthouse_render.png",
      "/assets/apartment_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Olympic Pool",
      "24/7 Concierge",
      "Valet Parking",
      "High-speed Elevators",
      "Landscaped Gardens"
    ],
    "isFeatured": false,
    "createdAt": "2026-05-10T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p49",
    "title": "Marquis Villa at Dubai Creek Harbour",
    "slug": "marquis-villa-at-dubai-creek-harbour-49",
    "description": "Immerse yourself in unmatched elegance with this premium Villa crafted by Omniyat. Nestled prime in Dubai Creek Harbour, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 20700000,
    "type": "villa",
    "status": "off-plan",
    "completionStatus": "under-construction",
    "handoverDate": "Q2 2027",
    "bedrooms": 7,
    "bathrooms": 8,
    "areaSqft": 12880,
    "parking": 3,
    "location": "Dubai Creek Harbour, Dubai",
    "communityId": "c7",
    "developerId": "dev9",
    "agentId": "agent1",
    "latitude": 25.2054,
    "longitude": 55.3568,
    "images": [
      "/assets/villa_render.png",
      "/assets/penthouse_render.png",
      "/assets/apartment_render.png",
      "/assets/palm_jumeirah_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Heated Pool",
      "Valet Parking",
      "High-speed Elevators",
      "Landscaped Gardens",
      "Kids Play Area"
    ],
    "isFeatured": false,
    "createdAt": "2026-05-11T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p50",
    "title": "One Villa at MBR City",
    "slug": "one-villa-at-mbr-city-50",
    "description": "Immerse yourself in unmatched elegance with this premium Villa crafted by Select Group. Nestled prime in MBR City, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 21000000,
    "type": "villa",
    "status": "buy",
    "completionStatus": "ready",
    "bedrooms": 3,
    "bathrooms": 3,
    "areaSqft": 9000,
    "parking": 2,
    "location": "MBR City, Dubai",
    "communityId": "c8",
    "developerId": "dev10",
    "agentId": "agent2",
    "latitude": 25.145400000000002,
    "longitude": 55.303799999999995,
    "images": [
      "/assets/penthouse_render.png",
      "/assets/apartment_render.png",
      "/assets/palm_jumeirah_render.png",
      "/assets/villa_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Private Pool",
      "High-speed Elevators",
      "Landscaped Gardens",
      "Kids Play Area",
      "Barbecue Area"
    ],
    "isFeatured": false,
    "createdAt": "2026-05-12T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p51",
    "title": "Aria Villa at MBR City",
    "slug": "aria-villa-at-mbr-city-51",
    "description": "Immerse yourself in unmatched elegance with this premium Villa crafted by Emaar Properties. Nestled prime in MBR City, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 21300000,
    "type": "villa",
    "status": "buy",
    "completionStatus": "ready",
    "bedrooms": 4,
    "bathrooms": 5,
    "areaSqft": 10120,
    "parking": 3,
    "location": "MBR City, Dubai",
    "communityId": "c8",
    "developerId": "dev1",
    "agentId": "agent3",
    "latitude": 25.1464,
    "longitude": 55.3048,
    "images": [
      "/assets/apartment_render.png",
      "/assets/palm_jumeirah_render.png",
      "/assets/villa_render.png",
      "/assets/penthouse_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Infinity Pool",
      "Landscaped Gardens",
      "Kids Play Area",
      "Barbecue Area",
      "Steam & Sauna Rooms"
    ],
    "isFeatured": false,
    "createdAt": "2026-05-13T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p52",
    "title": "Grand Villa at MBR City",
    "slug": "grand-villa-at-mbr-city-52",
    "description": "Immerse yourself in unmatched elegance with this premium Villa crafted by Sobha Realty. Nestled prime in MBR City, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 972000,
    "type": "villa",
    "status": "rent",
    "completionStatus": "ready",
    "bedrooms": 5,
    "bathrooms": 5,
    "areaSqft": 11240,
    "parking": 3,
    "location": "MBR City, Dubai",
    "communityId": "c8",
    "developerId": "dev2",
    "agentId": "agent4",
    "latitude": 25.1474,
    "longitude": 55.3058,
    "images": [
      "/assets/palm_jumeirah_render.png",
      "/assets/villa_render.png",
      "/assets/penthouse_render.png",
      "/assets/apartment_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Sky Pool",
      "Kids Play Area",
      "Barbecue Area",
      "Steam & Sauna Rooms",
      "Residents Lounge"
    ],
    "isFeatured": false,
    "createdAt": "2026-05-14T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p53",
    "title": "Vogue Villa at MBR City",
    "slug": "vogue-villa-at-mbr-city-53",
    "description": "Immerse yourself in unmatched elegance with this premium Villa crafted by DAMAC Properties. Nestled prime in MBR City, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 21900000,
    "type": "villa",
    "status": "off-plan",
    "completionStatus": "under-construction",
    "handoverDate": "Q2 2028",
    "bedrooms": 6,
    "bathrooms": 7,
    "areaSqft": 12360,
    "parking": 3,
    "location": "MBR City, Dubai",
    "communityId": "c8",
    "developerId": "dev3",
    "agentId": "agent5",
    "latitude": 25.148400000000002,
    "longitude": 55.306799999999996,
    "images": [
      "/assets/villa_render.png",
      "/assets/penthouse_render.png",
      "/assets/apartment_render.png",
      "/assets/palm_jumeirah_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Olympic Pool",
      "Barbecue Area",
      "Steam & Sauna Rooms",
      "Residents Lounge",
      "Cinema Room"
    ],
    "isFeatured": false,
    "createdAt": "2026-05-15T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p54",
    "title": "Waterfront Villa at MBR City",
    "slug": "waterfront-villa-at-mbr-city-54",
    "description": "Immerse yourself in unmatched elegance with this premium Villa crafted by Ellington Properties. Nestled prime in MBR City, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 22200000,
    "type": "villa",
    "status": "buy",
    "completionStatus": "ready",
    "bedrooms": 7,
    "bathrooms": 7,
    "areaSqft": 13480,
    "parking": 3,
    "location": "MBR City, Dubai",
    "communityId": "c8",
    "developerId": "dev4",
    "agentId": "agent6",
    "latitude": 25.1494,
    "longitude": 55.3078,
    "images": [
      "/assets/penthouse_render.png",
      "/assets/apartment_render.png",
      "/assets/palm_jumeirah_render.png",
      "/assets/villa_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Heated Pool",
      "Steam & Sauna Rooms",
      "Residents Lounge",
      "Cinema Room",
      "Wine Cellar"
    ],
    "isFeatured": false,
    "createdAt": "2026-05-16T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p55",
    "title": "Crest Villa at MBR City",
    "slug": "crest-villa-at-mbr-city-55",
    "description": "Immerse yourself in unmatched elegance with this premium Villa crafted by Nakheel. Nestled prime in MBR City, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 22500000,
    "type": "villa",
    "status": "buy",
    "completionStatus": "ready",
    "bedrooms": 3,
    "bathrooms": 4,
    "areaSqft": 9600,
    "parking": 2,
    "location": "MBR City, Dubai",
    "communityId": "c8",
    "developerId": "dev5",
    "agentId": "agent1",
    "latitude": 25.1504,
    "longitude": 55.3088,
    "images": [
      "/assets/apartment_render.png",
      "/assets/palm_jumeirah_render.png",
      "/assets/villa_render.png",
      "/assets/penthouse_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Private Pool",
      "Residents Lounge",
      "Cinema Room",
      "Wine Cellar",
      "Tennis Court"
    ],
    "isFeatured": false,
    "createdAt": "2026-05-17T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p56",
    "title": "Crown Villa at MBR City",
    "slug": "crown-villa-at-mbr-city-56",
    "description": "Immerse yourself in unmatched elegance with this premium Villa crafted by Meraas. Nestled prime in MBR City, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 1026000,
    "type": "villa",
    "status": "rent",
    "completionStatus": "ready",
    "bedrooms": 4,
    "bathrooms": 4,
    "areaSqft": 10720,
    "parking": 3,
    "location": "MBR City, Dubai",
    "communityId": "c8",
    "developerId": "dev6",
    "agentId": "agent2",
    "latitude": 25.151400000000002,
    "longitude": 55.309799999999996,
    "images": [
      "/assets/palm_jumeirah_render.png",
      "/assets/villa_render.png",
      "/assets/penthouse_render.png",
      "/assets/apartment_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Infinity Pool",
      "Cinema Room",
      "Wine Cellar",
      "Tennis Court",
      "Golf Simulator"
    ],
    "isFeatured": false,
    "createdAt": "2026-05-18T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p57",
    "title": "Azure Villa at Arabian Ranches",
    "slug": "azure-villa-at-arabian-ranches-57",
    "description": "Immerse yourself in unmatched elegance with this premium Villa crafted by Aldar Properties. Nestled prime in Arabian Ranches, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 23100000,
    "type": "villa",
    "status": "off-plan",
    "completionStatus": "under-construction",
    "handoverDate": "Q2 2026",
    "bedrooms": 5,
    "bathrooms": 6,
    "areaSqft": 11840,
    "parking": 3,
    "location": "Arabian Ranches, Dubai",
    "communityId": "c9",
    "developerId": "dev7",
    "agentId": "agent3",
    "latitude": 25.0364,
    "longitude": 55.2828,
    "images": [
      "/assets/villa_render.png",
      "/assets/penthouse_render.png",
      "/assets/apartment_render.png",
      "/assets/palm_jumeirah_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Sky Pool",
      "Wine Cellar",
      "Tennis Court",
      "Golf Simulator",
      "Smart Home System"
    ],
    "isFeatured": false,
    "createdAt": "2026-05-19T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p58",
    "title": "Majestic Villa at Arabian Ranches",
    "slug": "majestic-villa-at-arabian-ranches-58",
    "description": "Immerse yourself in unmatched elegance with this premium Villa crafted by Azizi Developments. Nestled prime in Arabian Ranches, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 23400000,
    "type": "villa",
    "status": "buy",
    "completionStatus": "ready",
    "bedrooms": 6,
    "bathrooms": 6,
    "areaSqft": 12960,
    "parking": 3,
    "location": "Arabian Ranches, Dubai",
    "communityId": "c9",
    "developerId": "dev8",
    "agentId": "agent4",
    "latitude": 25.0374,
    "longitude": 55.2838,
    "images": [
      "/assets/penthouse_render.png",
      "/assets/apartment_render.png",
      "/assets/palm_jumeirah_render.png",
      "/assets/villa_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Olympic Pool",
      "Tennis Court",
      "Golf Simulator",
      "Smart Home System",
      "Gymnasium"
    ],
    "isFeatured": false,
    "createdAt": "2026-05-20T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p59",
    "title": "Infinity Villa at Arabian Ranches",
    "slug": "infinity-villa-at-arabian-ranches-59",
    "description": "Immerse yourself in unmatched elegance with this premium Villa crafted by Omniyat. Nestled prime in Arabian Ranches, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 23700000,
    "type": "villa",
    "status": "buy",
    "completionStatus": "ready",
    "bedrooms": 7,
    "bathrooms": 8,
    "areaSqft": 14080,
    "parking": 3,
    "location": "Arabian Ranches, Dubai",
    "communityId": "c9",
    "developerId": "dev9",
    "agentId": "agent5",
    "latitude": 25.038400000000003,
    "longitude": 55.2848,
    "images": [
      "/assets/apartment_render.png",
      "/assets/palm_jumeirah_render.png",
      "/assets/villa_render.png",
      "/assets/penthouse_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Heated Pool",
      "Golf Simulator",
      "Smart Home System",
      "Gymnasium",
      "Spa & Wellness"
    ],
    "isFeatured": false,
    "createdAt": "2026-05-21T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p60",
    "title": "Royal Villa at Arabian Ranches",
    "slug": "royal-villa-at-arabian-ranches-60",
    "description": "Immerse yourself in unmatched elegance with this premium Villa crafted by Select Group. Nestled prime in Arabian Ranches, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 1080000,
    "type": "villa",
    "status": "rent",
    "completionStatus": "ready",
    "bedrooms": 3,
    "bathrooms": 3,
    "areaSqft": 10200,
    "parking": 2,
    "location": "Arabian Ranches, Dubai",
    "communityId": "c9",
    "developerId": "dev10",
    "agentId": "agent6",
    "latitude": 25.029400000000003,
    "longitude": 55.2758,
    "images": [
      "/assets/palm_jumeirah_render.png",
      "/assets/villa_render.png",
      "/assets/penthouse_render.png",
      "/assets/apartment_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Private Pool",
      "Smart Home System",
      "Gymnasium",
      "Spa & Wellness",
      "24/7 Concierge"
    ],
    "isFeatured": false,
    "createdAt": "2026-05-22T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p61",
    "title": "Signature Penthouse at Arabian Ranches",
    "slug": "signature-penthouse-at-arabian-ranches-61",
    "description": "Immerse yourself in unmatched elegance with this premium Penthouse crafted by Emaar Properties. Nestled prime in Arabian Ranches, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 42500000,
    "type": "penthouse",
    "status": "off-plan",
    "completionStatus": "under-construction",
    "handoverDate": "Q2 2027",
    "bedrooms": 4,
    "bathrooms": 5,
    "areaSqft": 11320,
    "parking": 3,
    "location": "Arabian Ranches, Dubai",
    "communityId": "c9",
    "developerId": "dev1",
    "agentId": "agent1",
    "latitude": 25.0304,
    "longitude": 55.2768,
    "images": [
      "/assets/villa_render.png",
      "/assets/penthouse_render.png",
      "/assets/apartment_render.png",
      "/assets/palm_jumeirah_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Infinity Pool",
      "Gymnasium",
      "Spa & Wellness",
      "24/7 Concierge",
      "Valet Parking"
    ],
    "isFeatured": false,
    "createdAt": "2026-05-23T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p62",
    "title": "The Ritz Penthouse at Arabian Ranches",
    "slug": "the-ritz-penthouse-at-arabian-ranches-62",
    "description": "Immerse yourself in unmatched elegance with this premium Penthouse crafted by Sobha Realty. Nestled prime in Arabian Ranches, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 43000000,
    "type": "penthouse",
    "status": "buy",
    "completionStatus": "ready",
    "bedrooms": 5,
    "bathrooms": 5,
    "areaSqft": 12440,
    "parking": 3,
    "location": "Arabian Ranches, Dubai",
    "communityId": "c9",
    "developerId": "dev2",
    "agentId": "agent2",
    "latitude": 25.0314,
    "longitude": 55.2778,
    "images": [
      "/assets/penthouse_render.png",
      "/assets/apartment_render.png",
      "/assets/palm_jumeirah_render.png",
      "/assets/villa_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Sky Pool",
      "Spa & Wellness",
      "24/7 Concierge",
      "Valet Parking",
      "High-speed Elevators"
    ],
    "isFeatured": false,
    "createdAt": "2026-05-24T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p63",
    "title": "Residences at Penthouse at Arabian Ranches",
    "slug": "residences-at-penthouse-at-arabian-ranches-63",
    "description": "Immerse yourself in unmatched elegance with this premium Penthouse crafted by DAMAC Properties. Nestled prime in Arabian Ranches, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 43500000,
    "type": "penthouse",
    "status": "buy",
    "completionStatus": "ready",
    "bedrooms": 6,
    "bathrooms": 7,
    "areaSqft": 13560,
    "parking": 3,
    "location": "Arabian Ranches, Dubai",
    "communityId": "c9",
    "developerId": "dev3",
    "agentId": "agent3",
    "latitude": 25.032400000000003,
    "longitude": 55.2788,
    "images": [
      "/assets/apartment_render.png",
      "/assets/palm_jumeirah_render.png",
      "/assets/villa_render.png",
      "/assets/penthouse_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Olympic Pool",
      "24/7 Concierge",
      "Valet Parking",
      "High-speed Elevators",
      "Landscaped Gardens"
    ],
    "isFeatured": false,
    "createdAt": "2026-05-25T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p64",
    "title": "Elite Penthouse at DIFC",
    "slug": "elite-penthouse-at-difc-64",
    "description": "Immerse yourself in unmatched elegance with this premium Penthouse crafted by Ellington Properties. Nestled prime in DIFC, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 1980000,
    "type": "penthouse",
    "status": "rent",
    "completionStatus": "ready",
    "bedrooms": 7,
    "bathrooms": 7,
    "areaSqft": 14680,
    "parking": 3,
    "location": "DIFC, Dubai",
    "communityId": "c10",
    "developerId": "dev4",
    "agentId": "agent4",
    "latitude": 25.214399999999998,
    "longitude": 55.2808,
    "images": [
      "/assets/palm_jumeirah_render.png",
      "/assets/villa_render.png",
      "/assets/penthouse_render.png",
      "/assets/apartment_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Heated Pool",
      "Valet Parking",
      "High-speed Elevators",
      "Landscaped Gardens",
      "Kids Play Area"
    ],
    "isFeatured": false,
    "createdAt": "2026-05-26T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p65",
    "title": "Skyline Penthouse at DIFC",
    "slug": "skyline-penthouse-at-difc-65",
    "description": "Immerse yourself in unmatched elegance with this premium Penthouse crafted by Nakheel. Nestled prime in DIFC, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 44500000,
    "type": "penthouse",
    "status": "off-plan",
    "completionStatus": "under-construction",
    "handoverDate": "Q2 2028",
    "bedrooms": 3,
    "bathrooms": 4,
    "areaSqft": 10800,
    "parking": 2,
    "location": "DIFC, Dubai",
    "communityId": "c10",
    "developerId": "dev5",
    "agentId": "agent5",
    "latitude": 25.2154,
    "longitude": 55.2818,
    "images": [
      "/assets/villa_render.png",
      "/assets/penthouse_render.png",
      "/assets/apartment_render.png",
      "/assets/palm_jumeirah_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Private Pool",
      "High-speed Elevators",
      "Landscaped Gardens",
      "Kids Play Area",
      "Barbecue Area"
    ],
    "isFeatured": false,
    "createdAt": "2026-05-27T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p66",
    "title": "Oceanfront Penthouse at DIFC",
    "slug": "oceanfront-penthouse-at-difc-66",
    "description": "Immerse yourself in unmatched elegance with this premium Penthouse crafted by Meraas. Nestled prime in DIFC, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 45000000,
    "type": "penthouse",
    "status": "buy",
    "completionStatus": "ready",
    "bedrooms": 4,
    "bathrooms": 4,
    "areaSqft": 11920,
    "parking": 3,
    "location": "DIFC, Dubai",
    "communityId": "c10",
    "developerId": "dev6",
    "agentId": "agent6",
    "latitude": 25.2164,
    "longitude": 55.282799999999995,
    "images": [
      "/assets/penthouse_render.png",
      "/assets/apartment_render.png",
      "/assets/palm_jumeirah_render.png",
      "/assets/villa_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Infinity Pool",
      "Landscaped Gardens",
      "Kids Play Area",
      "Barbecue Area",
      "Steam & Sauna Rooms"
    ],
    "isFeatured": false,
    "createdAt": "2026-05-28T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p67",
    "title": "Serene Penthouse at DIFC",
    "slug": "serene-penthouse-at-difc-67",
    "description": "Immerse yourself in unmatched elegance with this premium Penthouse crafted by Aldar Properties. Nestled prime in DIFC, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 45500000,
    "type": "penthouse",
    "status": "buy",
    "completionStatus": "ready",
    "bedrooms": 5,
    "bathrooms": 6,
    "areaSqft": 13040,
    "parking": 3,
    "location": "DIFC, Dubai",
    "communityId": "c10",
    "developerId": "dev7",
    "agentId": "agent1",
    "latitude": 25.217399999999998,
    "longitude": 55.2838,
    "images": [
      "/assets/apartment_render.png",
      "/assets/palm_jumeirah_render.png",
      "/assets/villa_render.png",
      "/assets/penthouse_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Sky Pool",
      "Kids Play Area",
      "Barbecue Area",
      "Steam & Sauna Rooms",
      "Residents Lounge"
    ],
    "isFeatured": false,
    "createdAt": "2026-05-29T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p68",
    "title": "Emerald Penthouse at DIFC",
    "slug": "emerald-penthouse-at-difc-68",
    "description": "Immerse yourself in unmatched elegance with this premium Penthouse crafted by Azizi Developments. Nestled prime in DIFC, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 2070000,
    "type": "penthouse",
    "status": "rent",
    "completionStatus": "ready",
    "bedrooms": 6,
    "bathrooms": 6,
    "areaSqft": 14160,
    "parking": 3,
    "location": "DIFC, Dubai",
    "communityId": "c10",
    "developerId": "dev8",
    "agentId": "agent2",
    "latitude": 25.2184,
    "longitude": 55.2848,
    "images": [
      "/assets/palm_jumeirah_render.png",
      "/assets/villa_render.png",
      "/assets/penthouse_render.png",
      "/assets/apartment_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Olympic Pool",
      "Barbecue Area",
      "Steam & Sauna Rooms",
      "Residents Lounge",
      "Cinema Room"
    ],
    "isFeatured": false,
    "createdAt": "2026-05-30T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p69",
    "title": "Marquis Penthouse at DIFC",
    "slug": "marquis-penthouse-at-difc-69",
    "description": "Immerse yourself in unmatched elegance with this premium Penthouse crafted by Omniyat. Nestled prime in DIFC, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 46500000,
    "type": "penthouse",
    "status": "off-plan",
    "completionStatus": "under-construction",
    "handoverDate": "Q2 2026",
    "bedrooms": 7,
    "bathrooms": 8,
    "areaSqft": 15280,
    "parking": 3,
    "location": "DIFC, Dubai",
    "communityId": "c10",
    "developerId": "dev9",
    "agentId": "agent3",
    "latitude": 25.2194,
    "longitude": 55.285799999999995,
    "images": [
      "/assets/villa_render.png",
      "/assets/penthouse_render.png",
      "/assets/apartment_render.png",
      "/assets/palm_jumeirah_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Heated Pool",
      "Steam & Sauna Rooms",
      "Residents Lounge",
      "Cinema Room",
      "Wine Cellar"
    ],
    "isFeatured": false,
    "createdAt": "2026-05-31T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p70",
    "title": "One Penthouse at DIFC",
    "slug": "one-penthouse-at-difc-70",
    "description": "Immerse yourself in unmatched elegance with this premium Penthouse crafted by Select Group. Nestled prime in DIFC, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 47000000,
    "type": "penthouse",
    "status": "buy",
    "completionStatus": "ready",
    "bedrooms": 3,
    "bathrooms": 3,
    "areaSqft": 11400,
    "parking": 2,
    "location": "DIFC, Dubai",
    "communityId": "c10",
    "developerId": "dev10",
    "agentId": "agent4",
    "latitude": 25.2104,
    "longitude": 55.276799999999994,
    "images": [
      "/assets/penthouse_render.png",
      "/assets/apartment_render.png",
      "/assets/palm_jumeirah_render.png",
      "/assets/villa_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Private Pool",
      "Residents Lounge",
      "Cinema Room",
      "Wine Cellar",
      "Tennis Court"
    ],
    "isFeatured": false,
    "createdAt": "2026-06-01T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p71",
    "title": "Aria Penthouse at Jumeirah Village Circle",
    "slug": "aria-penthouse-at-jumeirah-village-circle-71",
    "description": "Immerse yourself in unmatched elegance with this premium Penthouse crafted by Emaar Properties. Nestled prime in Jumeirah Village Circle, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 47500000,
    "type": "penthouse",
    "status": "buy",
    "completionStatus": "ready",
    "bedrooms": 4,
    "bathrooms": 5,
    "areaSqft": 12520,
    "parking": 3,
    "location": "Jumeirah Village Circle, Dubai",
    "communityId": "c11",
    "developerId": "dev1",
    "agentId": "agent5",
    "latitude": 25.054399999999998,
    "longitude": 55.198800000000006,
    "images": [
      "/assets/apartment_render.png",
      "/assets/palm_jumeirah_render.png",
      "/assets/villa_render.png",
      "/assets/penthouse_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Infinity Pool",
      "Cinema Room",
      "Wine Cellar",
      "Tennis Court",
      "Golf Simulator"
    ],
    "isFeatured": false,
    "createdAt": "2026-06-02T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p72",
    "title": "Grand Penthouse at Jumeirah Village Circle",
    "slug": "grand-penthouse-at-jumeirah-village-circle-72",
    "description": "Immerse yourself in unmatched elegance with this premium Penthouse crafted by Sobha Realty. Nestled prime in Jumeirah Village Circle, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 2160000,
    "type": "penthouse",
    "status": "rent",
    "completionStatus": "ready",
    "bedrooms": 5,
    "bathrooms": 5,
    "areaSqft": 13640,
    "parking": 3,
    "location": "Jumeirah Village Circle, Dubai",
    "communityId": "c11",
    "developerId": "dev2",
    "agentId": "agent6",
    "latitude": 25.0554,
    "longitude": 55.1998,
    "images": [
      "/assets/palm_jumeirah_render.png",
      "/assets/villa_render.png",
      "/assets/penthouse_render.png",
      "/assets/apartment_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Sky Pool",
      "Wine Cellar",
      "Tennis Court",
      "Golf Simulator",
      "Smart Home System"
    ],
    "isFeatured": false,
    "createdAt": "2026-06-03T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p73",
    "title": "Vogue Penthouse at Jumeirah Village Circle",
    "slug": "vogue-penthouse-at-jumeirah-village-circle-73",
    "description": "Immerse yourself in unmatched elegance with this premium Penthouse crafted by DAMAC Properties. Nestled prime in Jumeirah Village Circle, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 48500000,
    "type": "penthouse",
    "status": "off-plan",
    "completionStatus": "under-construction",
    "handoverDate": "Q2 2027",
    "bedrooms": 6,
    "bathrooms": 7,
    "areaSqft": 14760,
    "parking": 3,
    "location": "Jumeirah Village Circle, Dubai",
    "communityId": "c11",
    "developerId": "dev3",
    "agentId": "agent1",
    "latitude": 25.0564,
    "longitude": 55.2008,
    "images": [
      "/assets/villa_render.png",
      "/assets/penthouse_render.png",
      "/assets/apartment_render.png",
      "/assets/palm_jumeirah_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Olympic Pool",
      "Tennis Court",
      "Golf Simulator",
      "Smart Home System",
      "Gymnasium"
    ],
    "isFeatured": false,
    "createdAt": "2026-06-04T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p74",
    "title": "Waterfront Penthouse at Jumeirah Village Circle",
    "slug": "waterfront-penthouse-at-jumeirah-village-circle-74",
    "description": "Immerse yourself in unmatched elegance with this premium Penthouse crafted by Ellington Properties. Nestled prime in Jumeirah Village Circle, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 49000000,
    "type": "penthouse",
    "status": "buy",
    "completionStatus": "ready",
    "bedrooms": 7,
    "bathrooms": 7,
    "areaSqft": 15880,
    "parking": 3,
    "location": "Jumeirah Village Circle, Dubai",
    "communityId": "c11",
    "developerId": "dev4",
    "agentId": "agent2",
    "latitude": 25.057399999999998,
    "longitude": 55.201800000000006,
    "images": [
      "/assets/penthouse_render.png",
      "/assets/apartment_render.png",
      "/assets/palm_jumeirah_render.png",
      "/assets/villa_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Heated Pool",
      "Golf Simulator",
      "Smart Home System",
      "Gymnasium",
      "Spa & Wellness"
    ],
    "isFeatured": false,
    "createdAt": "2026-06-05T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p75",
    "title": "Crest Penthouse at Jumeirah Village Circle",
    "slug": "crest-penthouse-at-jumeirah-village-circle-75",
    "description": "Immerse yourself in unmatched elegance with this premium Penthouse crafted by Nakheel. Nestled prime in Jumeirah Village Circle, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 49500000,
    "type": "penthouse",
    "status": "buy",
    "completionStatus": "ready",
    "bedrooms": 3,
    "bathrooms": 4,
    "areaSqft": 12000,
    "parking": 2,
    "location": "Jumeirah Village Circle, Dubai",
    "communityId": "c11",
    "developerId": "dev5",
    "agentId": "agent3",
    "latitude": 25.0584,
    "longitude": 55.2028,
    "images": [
      "/assets/apartment_render.png",
      "/assets/palm_jumeirah_render.png",
      "/assets/villa_render.png",
      "/assets/penthouse_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Private Pool",
      "Smart Home System",
      "Gymnasium",
      "Spa & Wellness",
      "24/7 Concierge"
    ],
    "isFeatured": false,
    "createdAt": "2026-06-06T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p76",
    "title": "Crown Townhouse at Jumeirah Village Circle",
    "slug": "crown-townhouse-at-jumeirah-village-circle-76",
    "description": "Immerse yourself in unmatched elegance with this premium Townhouse crafted by Meraas. Nestled prime in Jumeirah Village Circle, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 648000,
    "type": "townhouse",
    "status": "rent",
    "completionStatus": "ready",
    "bedrooms": 2,
    "bathrooms": 2,
    "areaSqft": 11120,
    "parking": 2,
    "location": "Jumeirah Village Circle, Dubai",
    "communityId": "c11",
    "developerId": "dev6",
    "agentId": "agent4",
    "latitude": 25.0594,
    "longitude": 55.2038,
    "images": [
      "/assets/palm_jumeirah_render.png",
      "/assets/villa_render.png",
      "/assets/penthouse_render.png",
      "/assets/apartment_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Infinity Pool",
      "Gymnasium",
      "Spa & Wellness",
      "24/7 Concierge",
      "Valet Parking"
    ],
    "isFeatured": false,
    "createdAt": "2026-06-07T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p77",
    "title": "Azure Townhouse at Al Barsha",
    "slug": "azure-townhouse-at-al-barsha-77",
    "description": "Immerse yourself in unmatched elegance with this premium Townhouse crafted by Aldar Properties. Nestled prime in Al Barsha, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 14550000,
    "type": "townhouse",
    "status": "off-plan",
    "completionStatus": "under-construction",
    "handoverDate": "Q2 2028",
    "bedrooms": 3,
    "bathrooms": 4,
    "areaSqft": 12240,
    "parking": 2,
    "location": "Al Barsha, Dubai",
    "communityId": "c12",
    "developerId": "dev7",
    "agentId": "agent5",
    "latitude": 25.1204,
    "longitude": 55.2308,
    "images": [
      "/assets/villa_render.png",
      "/assets/penthouse_render.png",
      "/assets/apartment_render.png",
      "/assets/palm_jumeirah_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Sky Pool",
      "Spa & Wellness",
      "24/7 Concierge",
      "Valet Parking",
      "High-speed Elevators"
    ],
    "isFeatured": false,
    "createdAt": "2026-06-08T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p78",
    "title": "Majestic Townhouse at Al Barsha",
    "slug": "majestic-townhouse-at-al-barsha-78",
    "description": "Immerse yourself in unmatched elegance with this premium Townhouse crafted by Azizi Developments. Nestled prime in Al Barsha, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 14700000,
    "type": "townhouse",
    "status": "buy",
    "completionStatus": "ready",
    "bedrooms": 4,
    "bathrooms": 4,
    "areaSqft": 13360,
    "parking": 3,
    "location": "Al Barsha, Dubai",
    "communityId": "c12",
    "developerId": "dev8",
    "agentId": "agent6",
    "latitude": 25.1214,
    "longitude": 55.2318,
    "images": [
      "/assets/penthouse_render.png",
      "/assets/apartment_render.png",
      "/assets/palm_jumeirah_render.png",
      "/assets/villa_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Olympic Pool",
      "24/7 Concierge",
      "Valet Parking",
      "High-speed Elevators",
      "Landscaped Gardens"
    ],
    "isFeatured": false,
    "createdAt": "2026-06-09T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p79",
    "title": "Infinity Townhouse at Al Barsha",
    "slug": "infinity-townhouse-at-al-barsha-79",
    "description": "Immerse yourself in unmatched elegance with this premium Townhouse crafted by Omniyat. Nestled prime in Al Barsha, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 14850000,
    "type": "townhouse",
    "status": "buy",
    "completionStatus": "ready",
    "bedrooms": 5,
    "bathrooms": 6,
    "areaSqft": 14480,
    "parking": 3,
    "location": "Al Barsha, Dubai",
    "communityId": "c12",
    "developerId": "dev9",
    "agentId": "agent1",
    "latitude": 25.122400000000003,
    "longitude": 55.2328,
    "images": [
      "/assets/apartment_render.png",
      "/assets/palm_jumeirah_render.png",
      "/assets/villa_render.png",
      "/assets/penthouse_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Heated Pool",
      "Valet Parking",
      "High-speed Elevators",
      "Landscaped Gardens",
      "Kids Play Area"
    ],
    "isFeatured": false,
    "createdAt": "2026-06-10T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p80",
    "title": "Royal Townhouse at Al Barsha",
    "slug": "royal-townhouse-at-al-barsha-80",
    "description": "Immerse yourself in unmatched elegance with this premium Townhouse crafted by Select Group. Nestled prime in Al Barsha, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 675000,
    "type": "townhouse",
    "status": "rent",
    "completionStatus": "ready",
    "bedrooms": 1,
    "bathrooms": 1,
    "areaSqft": 10600,
    "parking": 2,
    "location": "Al Barsha, Dubai",
    "communityId": "c12",
    "developerId": "dev10",
    "agentId": "agent2",
    "latitude": 25.113400000000002,
    "longitude": 55.2238,
    "images": [
      "/assets/palm_jumeirah_render.png",
      "/assets/villa_render.png",
      "/assets/penthouse_render.png",
      "/assets/apartment_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Private Pool",
      "High-speed Elevators",
      "Landscaped Gardens",
      "Kids Play Area",
      "Barbecue Area"
    ],
    "isFeatured": false,
    "createdAt": "2026-06-11T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p81",
    "title": "Signature Townhouse at Al Barsha",
    "slug": "signature-townhouse-at-al-barsha-81",
    "description": "Immerse yourself in unmatched elegance with this premium Townhouse crafted by Emaar Properties. Nestled prime in Al Barsha, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 15150000,
    "type": "townhouse",
    "status": "off-plan",
    "completionStatus": "under-construction",
    "handoverDate": "Q2 2026",
    "bedrooms": 2,
    "bathrooms": 3,
    "areaSqft": 11720,
    "parking": 2,
    "location": "Al Barsha, Dubai",
    "communityId": "c12",
    "developerId": "dev1",
    "agentId": "agent3",
    "latitude": 25.1144,
    "longitude": 55.2248,
    "images": [
      "/assets/villa_render.png",
      "/assets/penthouse_render.png",
      "/assets/apartment_render.png",
      "/assets/palm_jumeirah_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Infinity Pool",
      "Landscaped Gardens",
      "Kids Play Area",
      "Barbecue Area",
      "Steam & Sauna Rooms"
    ],
    "isFeatured": false,
    "createdAt": "2026-06-12T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p82",
    "title": "The Ritz Townhouse at Al Barsha",
    "slug": "the-ritz-townhouse-at-al-barsha-82",
    "description": "Immerse yourself in unmatched elegance with this premium Townhouse crafted by Sobha Realty. Nestled prime in Al Barsha, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 15300000,
    "type": "townhouse",
    "status": "buy",
    "completionStatus": "ready",
    "bedrooms": 3,
    "bathrooms": 3,
    "areaSqft": 12840,
    "parking": 2,
    "location": "Al Barsha, Dubai",
    "communityId": "c12",
    "developerId": "dev2",
    "agentId": "agent4",
    "latitude": 25.1154,
    "longitude": 55.2258,
    "images": [
      "/assets/penthouse_render.png",
      "/assets/apartment_render.png",
      "/assets/palm_jumeirah_render.png",
      "/assets/villa_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Sky Pool",
      "Kids Play Area",
      "Barbecue Area",
      "Steam & Sauna Rooms",
      "Residents Lounge"
    ],
    "isFeatured": false,
    "createdAt": "2026-06-13T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p83",
    "title": "Residences at Townhouse at Jumeirah",
    "slug": "residences-at-townhouse-at-jumeirah-83",
    "description": "Immerse yourself in unmatched elegance with this premium Townhouse crafted by DAMAC Properties. Nestled prime in Jumeirah, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 15450000,
    "type": "townhouse",
    "status": "buy",
    "completionStatus": "ready",
    "bedrooms": 4,
    "bathrooms": 5,
    "areaSqft": 13960,
    "parking": 3,
    "location": "Jumeirah, Dubai",
    "communityId": "c13",
    "developerId": "dev3",
    "agentId": "agent5",
    "latitude": 25.1994,
    "longitude": 55.236799999999995,
    "images": [
      "/assets/apartment_render.png",
      "/assets/palm_jumeirah_render.png",
      "/assets/villa_render.png",
      "/assets/penthouse_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Olympic Pool",
      "Barbecue Area",
      "Steam & Sauna Rooms",
      "Residents Lounge",
      "Cinema Room"
    ],
    "isFeatured": false,
    "createdAt": "2026-06-14T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p84",
    "title": "Elite Townhouse at Jumeirah",
    "slug": "elite-townhouse-at-jumeirah-84",
    "description": "Immerse yourself in unmatched elegance with this premium Townhouse crafted by Ellington Properties. Nestled prime in Jumeirah, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 702000,
    "type": "townhouse",
    "status": "rent",
    "completionStatus": "ready",
    "bedrooms": 5,
    "bathrooms": 5,
    "areaSqft": 15080,
    "parking": 3,
    "location": "Jumeirah, Dubai",
    "communityId": "c13",
    "developerId": "dev4",
    "agentId": "agent6",
    "latitude": 25.2004,
    "longitude": 55.2378,
    "images": [
      "/assets/palm_jumeirah_render.png",
      "/assets/villa_render.png",
      "/assets/penthouse_render.png",
      "/assets/apartment_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Heated Pool",
      "Steam & Sauna Rooms",
      "Residents Lounge",
      "Cinema Room",
      "Wine Cellar"
    ],
    "isFeatured": false,
    "createdAt": "2026-06-15T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p85",
    "title": "Skyline Townhouse at Jumeirah",
    "slug": "skyline-townhouse-at-jumeirah-85",
    "description": "Immerse yourself in unmatched elegance with this premium Townhouse crafted by Nakheel. Nestled prime in Jumeirah, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 15750000,
    "type": "townhouse",
    "status": "off-plan",
    "completionStatus": "under-construction",
    "handoverDate": "Q2 2027",
    "bedrooms": 1,
    "bathrooms": 2,
    "areaSqft": 11200,
    "parking": 2,
    "location": "Jumeirah, Dubai",
    "communityId": "c13",
    "developerId": "dev5",
    "agentId": "agent1",
    "latitude": 25.2014,
    "longitude": 55.2388,
    "images": [
      "/assets/villa_render.png",
      "/assets/penthouse_render.png",
      "/assets/apartment_render.png",
      "/assets/palm_jumeirah_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Private Pool",
      "Residents Lounge",
      "Cinema Room",
      "Wine Cellar",
      "Tennis Court"
    ],
    "isFeatured": false,
    "createdAt": "2026-06-16T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p86",
    "title": "Oceanfront Duplex at Jumeirah",
    "slug": "oceanfront-duplex-at-jumeirah-86",
    "description": "Immerse yourself in unmatched elegance with this premium Duplex crafted by Meraas. Nestled prime in Jumeirah, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 22200000,
    "type": "duplex",
    "status": "buy",
    "completionStatus": "ready",
    "bedrooms": 2,
    "bathrooms": 2,
    "areaSqft": 12320,
    "parking": 2,
    "location": "Jumeirah, Dubai",
    "communityId": "c13",
    "developerId": "dev6",
    "agentId": "agent2",
    "latitude": 25.2024,
    "longitude": 55.239799999999995,
    "images": [
      "/assets/penthouse_render.png",
      "/assets/apartment_render.png",
      "/assets/palm_jumeirah_render.png",
      "/assets/villa_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Infinity Pool",
      "Cinema Room",
      "Wine Cellar",
      "Tennis Court",
      "Golf Simulator"
    ],
    "isFeatured": false,
    "createdAt": "2026-06-17T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p87",
    "title": "Serene Duplex at Jumeirah",
    "slug": "serene-duplex-at-jumeirah-87",
    "description": "Immerse yourself in unmatched elegance with this premium Duplex crafted by Aldar Properties. Nestled prime in Jumeirah, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 22400000,
    "type": "duplex",
    "status": "buy",
    "completionStatus": "ready",
    "bedrooms": 3,
    "bathrooms": 4,
    "areaSqft": 13440,
    "parking": 2,
    "location": "Jumeirah, Dubai",
    "communityId": "c13",
    "developerId": "dev7",
    "agentId": "agent3",
    "latitude": 25.2034,
    "longitude": 55.2408,
    "images": [
      "/assets/apartment_render.png",
      "/assets/palm_jumeirah_render.png",
      "/assets/villa_render.png",
      "/assets/penthouse_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Sky Pool",
      "Wine Cellar",
      "Tennis Court",
      "Golf Simulator",
      "Smart Home System"
    ],
    "isFeatured": false,
    "createdAt": "2026-06-18T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p88",
    "title": "Emerald Duplex at Jumeirah",
    "slug": "emerald-duplex-at-jumeirah-88",
    "description": "Immerse yourself in unmatched elegance with this premium Duplex crafted by Azizi Developments. Nestled prime in Jumeirah, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 1017000,
    "type": "duplex",
    "status": "rent",
    "completionStatus": "ready",
    "bedrooms": 4,
    "bathrooms": 4,
    "areaSqft": 14560,
    "parking": 3,
    "location": "Jumeirah, Dubai",
    "communityId": "c13",
    "developerId": "dev8",
    "agentId": "agent4",
    "latitude": 25.2044,
    "longitude": 55.2418,
    "images": [
      "/assets/palm_jumeirah_render.png",
      "/assets/villa_render.png",
      "/assets/penthouse_render.png",
      "/assets/apartment_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Olympic Pool",
      "Tennis Court",
      "Golf Simulator",
      "Smart Home System",
      "Gymnasium"
    ],
    "isFeatured": false,
    "createdAt": "2026-06-19T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p89",
    "title": "Marquis Duplex at Bluewaters Island",
    "slug": "marquis-duplex-at-bluewaters-island-89",
    "description": "Immerse yourself in unmatched elegance with this premium Duplex crafted by Omniyat. Nestled prime in Bluewaters Island, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 22800000,
    "type": "duplex",
    "status": "off-plan",
    "completionStatus": "under-construction",
    "handoverDate": "Q2 2028",
    "bedrooms": 5,
    "bathrooms": 6,
    "areaSqft": 15680,
    "parking": 3,
    "location": "Bluewaters Island, Dubai",
    "communityId": "c14",
    "developerId": "dev9",
    "agentId": "agent5",
    "latitude": 25.0839,
    "longitude": 55.126799999999996,
    "images": [
      "/assets/villa_render.png",
      "/assets/penthouse_render.png",
      "/assets/apartment_render.png",
      "/assets/palm_jumeirah_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Heated Pool",
      "Golf Simulator",
      "Smart Home System",
      "Gymnasium",
      "Spa & Wellness"
    ],
    "isFeatured": false,
    "createdAt": "2026-06-20T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p90",
    "title": "One Duplex at Bluewaters Island",
    "slug": "one-duplex-at-bluewaters-island-90",
    "description": "Immerse yourself in unmatched elegance with this premium Duplex crafted by Select Group. Nestled prime in Bluewaters Island, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 23000000,
    "type": "duplex",
    "status": "buy",
    "completionStatus": "ready",
    "bedrooms": 1,
    "bathrooms": 1,
    "areaSqft": 11800,
    "parking": 2,
    "location": "Bluewaters Island, Dubai",
    "communityId": "c14",
    "developerId": "dev10",
    "agentId": "agent6",
    "latitude": 25.0749,
    "longitude": 55.117799999999995,
    "images": [
      "/assets/penthouse_render.png",
      "/assets/apartment_render.png",
      "/assets/palm_jumeirah_render.png",
      "/assets/villa_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Private Pool",
      "Smart Home System",
      "Gymnasium",
      "Spa & Wellness",
      "24/7 Concierge"
    ],
    "isFeatured": false,
    "createdAt": "2026-06-21T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p91",
    "title": "Aria Mansion at Bluewaters Island",
    "slug": "aria-mansion-at-bluewaters-island-91",
    "description": "Immerse yourself in unmatched elegance with this premium Mansion crafted by Emaar Properties. Nestled prime in Bluewaters Island, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 136000000,
    "type": "mansion",
    "status": "buy",
    "completionStatus": "ready",
    "bedrooms": 4,
    "bathrooms": 5,
    "areaSqft": 14920,
    "parking": 3,
    "location": "Bluewaters Island, Dubai",
    "communityId": "c14",
    "developerId": "dev1",
    "agentId": "agent1",
    "latitude": 25.075899999999997,
    "longitude": 55.1188,
    "images": [
      "/assets/apartment_render.png",
      "/assets/palm_jumeirah_render.png",
      "/assets/villa_render.png",
      "/assets/penthouse_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Infinity Pool",
      "Gymnasium",
      "Spa & Wellness",
      "24/7 Concierge",
      "Valet Parking"
    ],
    "isFeatured": false,
    "createdAt": "2026-06-22T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p92",
    "title": "Grand Mansion at Bluewaters Island",
    "slug": "grand-mansion-at-bluewaters-island-92",
    "description": "Immerse yourself in unmatched elegance with this premium Mansion crafted by Sobha Realty. Nestled prime in Bluewaters Island, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 6165000,
    "type": "mansion",
    "status": "rent",
    "completionStatus": "ready",
    "bedrooms": 5,
    "bathrooms": 5,
    "areaSqft": 16040,
    "parking": 3,
    "location": "Bluewaters Island, Dubai",
    "communityId": "c14",
    "developerId": "dev2",
    "agentId": "agent2",
    "latitude": 25.0769,
    "longitude": 55.1198,
    "images": [
      "/assets/palm_jumeirah_render.png",
      "/assets/villa_render.png",
      "/assets/penthouse_render.png",
      "/assets/apartment_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Sky Pool",
      "Spa & Wellness",
      "24/7 Concierge",
      "Valet Parking",
      "High-speed Elevators"
    ],
    "isFeatured": false,
    "createdAt": "2026-06-23T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p93",
    "title": "Vogue Mansion at Bluewaters Island",
    "slug": "vogue-mansion-at-bluewaters-island-93",
    "description": "Immerse yourself in unmatched elegance with this premium Mansion crafted by DAMAC Properties. Nestled prime in Bluewaters Island, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 138000000,
    "type": "mansion",
    "status": "off-plan",
    "completionStatus": "under-construction",
    "handoverDate": "Q2 2026",
    "bedrooms": 6,
    "bathrooms": 7,
    "areaSqft": 17160,
    "parking": 3,
    "location": "Bluewaters Island, Dubai",
    "communityId": "c14",
    "developerId": "dev3",
    "agentId": "agent3",
    "latitude": 25.0779,
    "longitude": 55.120799999999996,
    "images": [
      "/assets/villa_render.png",
      "/assets/penthouse_render.png",
      "/assets/apartment_render.png",
      "/assets/palm_jumeirah_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Olympic Pool",
      "24/7 Concierge",
      "Valet Parking",
      "High-speed Elevators",
      "Landscaped Gardens"
    ],
    "isFeatured": false,
    "createdAt": "2026-06-24T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p94",
    "title": "Waterfront Mansion at Bluewaters Island",
    "slug": "waterfront-mansion-at-bluewaters-island-94",
    "description": "Immerse yourself in unmatched elegance with this premium Mansion crafted by Ellington Properties. Nestled prime in Bluewaters Island, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 139000000,
    "type": "mansion",
    "status": "buy",
    "completionStatus": "ready",
    "bedrooms": 7,
    "bathrooms": 7,
    "areaSqft": 18280,
    "parking": 3,
    "location": "Bluewaters Island, Dubai",
    "communityId": "c14",
    "developerId": "dev4",
    "agentId": "agent4",
    "latitude": 25.078899999999997,
    "longitude": 55.1218,
    "images": [
      "/assets/penthouse_render.png",
      "/assets/apartment_render.png",
      "/assets/palm_jumeirah_render.png",
      "/assets/villa_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Heated Pool",
      "Valet Parking",
      "High-speed Elevators",
      "Landscaped Gardens",
      "Kids Play Area"
    ],
    "isFeatured": false,
    "createdAt": "2026-06-25T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p95",
    "title": "Crest Mansion at City Walk",
    "slug": "crest-mansion-at-city-walk-95",
    "description": "Immerse yourself in unmatched elegance with this premium Mansion crafted by Nakheel. Nestled prime in City Walk, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 140000000,
    "type": "mansion",
    "status": "buy",
    "completionStatus": "ready",
    "bedrooms": 3,
    "bathrooms": 4,
    "areaSqft": 14400,
    "parking": 2,
    "location": "City Walk, Dubai",
    "communityId": "c15",
    "developerId": "dev5",
    "agentId": "agent5",
    "latitude": 25.2074,
    "longitude": 55.2618,
    "images": [
      "/assets/apartment_render.png",
      "/assets/palm_jumeirah_render.png",
      "/assets/villa_render.png",
      "/assets/penthouse_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Private Pool",
      "High-speed Elevators",
      "Landscaped Gardens",
      "Kids Play Area",
      "Barbecue Area"
    ],
    "isFeatured": false,
    "createdAt": "2026-06-26T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p96",
    "title": "Crown Commercial at City Walk",
    "slug": "crown-commercial-at-city-walk-96",
    "description": "Immerse yourself in unmatched elegance with this premium Commercial crafted by Meraas. Nestled prime in City Walk, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 522000,
    "type": "commercial",
    "status": "rent",
    "completionStatus": "ready",
    "bedrooms": 0,
    "bathrooms": 1,
    "areaSqft": 15200,
    "parking": 15,
    "location": "City Walk, Dubai",
    "communityId": "c15",
    "developerId": "dev6",
    "agentId": "agent6",
    "latitude": 25.2084,
    "longitude": 55.2628,
    "images": [
      "/assets/palm_jumeirah_render.png",
      "/assets/villa_render.png",
      "/assets/penthouse_render.png",
      "/assets/apartment_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Infinity Pool",
      "Landscaped Gardens",
      "Kids Play Area",
      "Barbecue Area",
      "Steam & Sauna Rooms"
    ],
    "isFeatured": false,
    "createdAt": "2026-06-27T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p97",
    "title": "Azure Commercial at City Walk",
    "slug": "azure-commercial-at-city-walk-97",
    "description": "Immerse yourself in unmatched elegance with this premium Commercial crafted by Aldar Properties. Nestled prime in City Walk, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 11700000,
    "type": "commercial",
    "status": "off-plan",
    "completionStatus": "under-construction",
    "handoverDate": "Q2 2027",
    "bedrooms": 0,
    "bathrooms": 2,
    "areaSqft": 15350,
    "parking": 15,
    "location": "City Walk, Dubai",
    "communityId": "c15",
    "developerId": "dev7",
    "agentId": "agent1",
    "latitude": 25.2094,
    "longitude": 55.2638,
    "images": [
      "/assets/villa_render.png",
      "/assets/penthouse_render.png",
      "/assets/apartment_render.png",
      "/assets/palm_jumeirah_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Sky Pool",
      "Kids Play Area",
      "Barbecue Area",
      "Steam & Sauna Rooms",
      "Residents Lounge"
    ],
    "isFeatured": false,
    "createdAt": "2026-06-28T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p98",
    "title": "Majestic Office at City Walk",
    "slug": "majestic-office-at-city-walk-98",
    "description": "Immerse yourself in unmatched elegance with this premium Office crafted by Azizi Developments. Nestled prime in City Walk, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 11800000,
    "type": "office",
    "status": "buy",
    "completionStatus": "ready",
    "bedrooms": 0,
    "bathrooms": 1,
    "areaSqft": 15500,
    "parking": 16,
    "location": "City Walk, Dubai",
    "communityId": "c15",
    "developerId": "dev8",
    "agentId": "agent2",
    "latitude": 25.2104,
    "longitude": 55.2648,
    "images": [
      "/assets/penthouse_render.png",
      "/assets/apartment_render.png",
      "/assets/palm_jumeirah_render.png",
      "/assets/villa_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Olympic Pool",
      "Barbecue Area",
      "Steam & Sauna Rooms",
      "Residents Lounge",
      "Cinema Room"
    ],
    "isFeatured": false,
    "createdAt": "2026-06-29T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p99",
    "title": "Infinity Office at City Walk",
    "slug": "infinity-office-at-city-walk-99",
    "description": "Immerse yourself in unmatched elegance with this premium Office crafted by Omniyat. Nestled prime in City Walk, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 11900000,
    "type": "office",
    "status": "buy",
    "completionStatus": "ready",
    "bedrooms": 0,
    "bathrooms": 2,
    "areaSqft": 15650,
    "parking": 16,
    "location": "City Walk, Dubai",
    "communityId": "c15",
    "developerId": "dev9",
    "agentId": "agent3",
    "latitude": 25.2114,
    "longitude": 55.2658,
    "images": [
      "/assets/apartment_render.png",
      "/assets/palm_jumeirah_render.png",
      "/assets/villa_render.png",
      "/assets/penthouse_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Heated Pool",
      "Steam & Sauna Rooms",
      "Residents Lounge",
      "Cinema Room",
      "Wine Cellar"
    ],
    "isFeatured": false,
    "createdAt": "2026-06-30T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  },
  {
    "id": "p100",
    "title": "Royal Retail at City Walk",
    "slug": "royal-retail-at-city-walk-100",
    "description": "Immerse yourself in unmatched elegance with this premium Retail crafted by Select Group. Nestled prime in City Walk, this residence provides unparalleled finishes, custom architecture, and breath-taking neighborhood coordinates. Ready to elevate your portfolio.",
    "price": 540000,
    "type": "retail",
    "status": "rent",
    "completionStatus": "ready",
    "bedrooms": 0,
    "bathrooms": 1,
    "areaSqft": 15800,
    "parking": 16,
    "location": "City Walk, Dubai",
    "communityId": "c15",
    "developerId": "dev10",
    "agentId": "agent4",
    "latitude": 25.2024,
    "longitude": 55.2568,
    "images": [
      "/assets/palm_jumeirah_render.png",
      "/assets/villa_render.png",
      "/assets/penthouse_render.png",
      "/assets/apartment_render.png"
    ],
    "videos": [
      "/assets/hero-video.mp4"
    ],
    "amenities": [
      "Private Pool",
      "Residents Lounge",
      "Cinema Room",
      "Wine Cellar",
      "Tennis Court"
    ],
    "isFeatured": false,
    "createdAt": "2026-07-01T08:14:38.594Z",
    "updatedAt": "2026-07-01T08:14:38.594Z"
  }
];

const MOCK_LEADS: Lead[] = [
  { id: "lead1", firstName: "Elizabeth", lastName: "Taylor", email: "elizabeth.t@example.com", phone: "+44 7911 123456", source: "Property Page", status: "new", propertyInterestId: "p1", notes: "Interested in private viewing of Atlantis Penthouse.", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "lead2", firstName: "Hamdan", lastName: "Al-Maktoum", email: "hamdan@example.ae", phone: "+971 50 222 3333", source: "WhatsApp Chat", status: "contacted", propertyInterestId: "p2", notes: "Requesting details on plot ownership borders.", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const MOCK_APPOINTMENTS: Appointment[] = [
  { id: "app1", leadId: "lead1", propertyId: "p1", agentId: "agent1", appointmentDate: new Date(Date.now() + 86400000 * 2).toISOString(), type: "in-person", status: "scheduled", notes: "Private yacht pickup coordinated.", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const MOCK_TESTIMONIALS: Testimonial[] = [
  { id: "t1", clientName: "Sir Alistair Cunningham", clientTitle: "MD, Sovereign Holdings", rating: 5, content: "Luxespace curated an off-market penthouse for us in Palm Jumeirah. Discretion throughout was exemplary.", isFeatured: true, createdAt: new Date().toISOString() },
  { id: "t2", clientName: "Elena Rostova", clientTitle: "Private Family Investor", rating: 5, content: "Secured high-yield assets before public releases. A true private wealth advisory.", isFeatured: true, createdAt: new Date().toISOString() },
];

const MOCK_BLOGS: BlogPost[] = [
  { id: "b1", title: "Dubai Q3 Luxury Real Estate Insights", slug: "dubai-q3-luxury-insights", summary: "In-depth HNW capital flows and yield analysis.", content: "Full editorial content...", coverImage: "/assets/apartment_render.png", authorId: "agent1", isPublished: true, status: "published", tags: ["Market News", "Advisory"], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const MOCK_FAQS: FAQItem[] = [
  {
    "id": "faq1",
    "question": "Can foreigners buy property in Dubai?",
    "answer": "Yes. Foreigners and expats can buy property in designated freehold areas in Dubai. Freehold ownership gives you absolute ownership of the property and land, registered with the Dubai Land Department (DLD).",
    "category": "Buying Property",
    "orderIndex": 1
  },
  {
    "id": "faq2",
    "question": "What is the difference between freehold and leasehold properties?",
    "answer": "Freehold properties give the buyer complete ownership of both the property unit and the land it sits on indefinitely. Leasehold properties, on the other hand, grant ownership rights for a fixed period (typically 30 to 99 years) while the land ownership remains with the freeholder.",
    "category": "Buying Property",
    "orderIndex": 2
  },
  {
    "id": "faq3",
    "question": "What are the transaction fees when purchasing a property in Dubai?",
    "answer": "The typical fees include: DLD fee (4% of property price + 580 AED admin fee), Registration trustee fee (2,000 to 4,000 AED + VAT), Agency commission (typically 2% + VAT), and Mortgage registration fee (0.25% of loan value if applicable).",
    "category": "Buying Property",
    "orderIndex": 3
  },
  {
    "id": "faq4",
    "question": "Do I need a local bank account to buy real estate in Dubai?",
    "answer": "No, a local bank account is not required. You can pay via international wire transfer, foreign currency drafts, or cryptocurrency (via licensed escrow agencies). However, having a local account makes ongoing payments and rent collections easier.",
    "category": "Buying Property",
    "orderIndex": 4
  },
  {
    "id": "faq5",
    "question": "What is the Ejari system in Dubai?",
    "answer": "Ejari is the government-mandated registration system for rental agreements in Dubai. It secures the contract between landlord and tenant, makes it legally binding, and is required to connect water, electricity (DEWA), and internet services.",
    "category": "Renting",
    "orderIndex": 1
  },
  {
    "id": "faq6",
    "question": "Can a landlord evict a tenant in Dubai?",
    "answer": "A landlord can evict a tenant only under specific conditions defined by Law No. 26 of 2007, such as non-payment of rent, sub-letting without consent, or if the landlord wishes to use the property for personal use. Eviction notices require 12 months' notification sent via notary public.",
    "category": "Renting",
    "orderIndex": 2
  },
  {
    "id": "faq7",
    "question": "What is the Rent Calculator by RERA?",
    "answer": "The Real Estate Regulatory Agency (RERA) Rent Calculator is an online index tool that governs maximum rental increase percentages allowed in Dubai based on average market rents in specific areas. Landlords must use it to calculate valid rent increases.",
    "category": "Renting",
    "orderIndex": 3
  },
  {
    "id": "faq8",
    "question": "How are rental payments typically structured in Dubai?",
    "answer": "Rents are traditionally paid using post-dated cheques. The annual rent is split into 1, 2, 4, or sometimes 6 cheques. However, many developers and private landlords are starting to accept monthly direct debit or credit card payments.",
    "category": "Renting",
    "orderIndex": 4
  },
  {
    "id": "faq9",
    "question": "What is an Escrow Account in off-plan real estate?",
    "answer": "Under Dubai Law, developers selling off-plan units must deposit all buyer payments into a project-specific Escrow Account approved by the DLD. Funds are released to the developer only as construction milestones are verified by independent engineers.",
    "category": "Off Plan",
    "orderIndex": 1
  },
  {
    "id": "faq10",
    "question": "What happens if an off-plan project is delayed or cancelled?",
    "answer": "The DLD and Real Estate Court protect buyers in case of developer default. If a project is cancelled, DLD liquidates the escrow account to refund investors. If delayed beyond contract thresholds, buyers can seek cancellation or compensation.",
    "category": "Off Plan",
    "orderIndex": 2
  },
  {
    "id": "faq11",
    "question": "Can I sell my off-plan property before construction completion?",
    "answer": "Yes, you can sell off-plan properties. Most developers require the buyer to have paid a minimum threshold (usually 30% to 40% of the total purchase price) before issuing a No Objection Certificate (NOC) for resale.",
    "category": "Off Plan",
    "orderIndex": 3
  },
  {
    "id": "faq12",
    "question": "What does Oqood mean?",
    "answer": "Oqood is a centralized online registration portal for off-plan properties in Dubai. It is issued by the DLD as an interim registration certificate to secure buyer rights during the construction phase until the final Title Deed is issued.",
    "category": "Off Plan",
    "orderIndex": 4
  },
  {
    "id": "faq13",
    "question": "Can non-residents apply for a home loan in Dubai?",
    "answer": "Yes, non-residents can obtain home mortgages from international and local banks operating in the UAE. The maximum Loan-to-Value (LTV) ratio for non-residents is usually 50% to 60%, whereas residents can get up to 80% LTV.",
    "category": "Mortgage",
    "orderIndex": 1
  },
  {
    "id": "faq14",
    "question": "What is the maximum loan tenure in the UAE?",
    "answer": "The maximum tenure for home mortgages in the UAE is 25 years. The borrower's age at the time of final repayment must not exceed 65 years for salaried individuals, or 70 years for self-employed individuals.",
    "category": "Mortgage",
    "orderIndex": 2
  },
  {
    "id": "faq15",
    "question": "What interest rate types are available?",
    "answer": "Banks offer both fixed-rate mortgages (typically fixed for 1 to 5 years, converting to EIBOR + margin) and variable-rate mortgages linked directly to the 3-month or 6-month Emirates Interbank Offered Rate (EIBOR).",
    "category": "Mortgage",
    "orderIndex": 3
  },
  {
    "id": "faq16",
    "question": "Do banks require life insurance for UAE mortgages?",
    "answer": "Yes. Almost all UAE banks require home buyers to take out a matching life insurance policy (which names the bank as beneficiary) and a home property insurance policy to protect the asset.",
    "category": "Mortgage",
    "orderIndex": 4
  },
  {
    "id": "faq17",
    "question": "How do I qualify for the 10-year UAE Golden Visa through real estate?",
    "answer": "You qualify by purchasing one or more properties in freehold areas with a combined value of at least 2 million AED ($544,500 USD). The property can be ready or off-plan, mortgaged or paid in full.",
    "category": "Golden Visa",
    "orderIndex": 1
  },
  {
    "id": "faq18",
    "question": "Can off-plan properties qualify for the Golden Visa?",
    "answer": "Yes. DLD allows buyers of off-plan properties to apply for the Golden Visa if they have paid at least 2 million AED to the developer, supported by Oqood interim certificates and payment receipts.",
    "category": "Golden Visa",
    "orderIndex": 2
  },
  {
    "id": "faq19",
    "question": "Can I sponsor my family with a Golden Visa?",
    "answer": "Yes. Golden Visa holders can sponsor their spouses, children (including self-sponsored unmarried daughters and sons of any age), and domestic helper staff under their visa scheme.",
    "category": "Golden Visa",
    "orderIndex": 3
  },
  {
    "id": "faq20",
    "question": "Does the Golden Visa allow me to live outside the UAE?",
    "answer": "Yes. Unlike normal residency visas which expire if you stay outside the UAE for more than 6 months, Golden Visa holders can stay outside the country for any duration without losing their residency status.",
    "category": "Golden Visa",
    "orderIndex": 4
  },
  {
    "id": "faq21",
    "question": "Why is Dubai considered a tax haven for property investors?",
    "answer": "Dubai charges 0% personal income tax, 0% capital gains tax, and 0% property tax. The only taxes are a flat 5% corporate tax on businesses if applicable, and a 4% one-time registration fee on purchase.",
    "category": "Foreign Investment",
    "orderIndex": 1
  },
  {
    "id": "faq22",
    "question": "What is the average ROI on rental properties in Dubai?",
    "answer": "Net rental yields in Dubai are among the highest globally, averaging between 5% and 8% per annum. Micro-apartments and holiday homes in prime areas (Downtown, Marina) can reach up to 10% gross yields.",
    "category": "Foreign Investment",
    "orderIndex": 2
  },
  {
    "id": "faq23",
    "question": "Can I invest in property using cryptocurrency?",
    "answer": "Yes, many developers and real estate brokerages accept payments in Bitcoin (BTC), Ethereum (ETH), and USDT. Transactions are processed securely via regulated payment gateways that exchange crypto to AED cash.",
    "category": "Foreign Investment",
    "orderIndex": 3
  },
  {
    "id": "faq24",
    "question": "Are foreign currency funds repatriable?",
    "answer": "Yes. The UAE has no currency control regulations. 100% of capital, dividends, rental income, and profits can be fully repatriated back to your home country in any currency.",
    "category": "Foreign Investment",
    "orderIndex": 4
  },
  {
    "id": "faq25",
    "question": "What is a Title Deed in Dubai?",
    "answer": "A Title Deed is the final legal document issued by the DLD that registers you as the absolute owner of the property. It contains unique parcel IDs, floor size, ownership details, and property borders.",
    "category": "Property Registration",
    "orderIndex": 1
  },
  {
    "id": "faq26",
    "question": "What is a Power of Attorney (POA)?",
    "answer": "A Power of Attorney allows you to appoint a trusted representative or broker to manage purchase transactions, sign contracts, and handle key transfers on your behalf without you needing to be physically present in the UAE.",
    "category": "Property Registration",
    "orderIndex": 2
  },
  {
    "id": "faq27",
    "question": "How long does the property transfer process take?",
    "answer": "A standard resale property transaction takes between 2 to 4 weeks from signing the Memorandum of Understanding (MOU/Form F) to the final transfer meeting at the DLD Trustee office.",
    "category": "Property Registration",
    "orderIndex": 3
  },
  {
    "id": "faq28",
    "question": "What is a No Objection Certificate (NOC)?",
    "answer": "An NOC is a certificate issued by the master developer (e.g. Emaar, DAMAC) confirming that the seller has settled all service charges and utility bills, clearing the property for resale and transfer.",
    "category": "Property Registration",
    "orderIndex": 4
  },
  {
    "id": "faq29",
    "question": "Who are the top developers in Dubai?",
    "answer": "The largest state-backed and private developers include Emaar Properties, DAMAC Properties, Nakheel, Sobha Realty, Meraas, Omniyat, and Ellington. They manage the master developments of most areas.",
    "category": "Developer Questions",
    "orderIndex": 1
  },
  {
    "id": "faq30",
    "question": "What is a master community?",
    "answer": "A master community is a master-planned neighborhood (like Downtown Dubai or Dubai Hills Estate) built, managed, and serviced by a single master developer, ensuring uniform architecture, roads, parks, and security.",
    "category": "Developer Questions",
    "orderIndex": 2
  },
  {
    "id": "faq31",
    "question": "Do developers provide post-handover payment plans?",
    "answer": "Yes, many developers offer post-handover payment plans (PHPP) ranging from 2 to 5 years after completion. This allows you to pay for the property using rental income after moving in.",
    "category": "Developer Questions",
    "orderIndex": 3
  },
  {
    "id": "faq32",
    "question": "What are service charges?",
    "answer": "Service charges are monthly or annual maintenance fees paid to the owners' association or master developer. They cover building upkeep, common areas, security, swimming pool, and gym maintenance.",
    "category": "Developer Questions",
    "orderIndex": 4
  },
  {
    "id": "faq33",
    "question": "What services do property management companies offer?",
    "answer": "Property managers handle tenant sourcing, Ejari setup, rent collections, maintenance repairs, and disputes with the rental committee, allowing overseas owners to run a completely hands-off investment.",
    "category": "Property Management",
    "orderIndex": 1
  },
  {
    "id": "faq34",
    "question": "Can I convert my property into a short-term holiday home?",
    "answer": "Yes. You can register your apartment as a holiday home with the Department of Economy and Tourism (DET). Short-term holiday lets typically yield 20% to 35% higher income than long-term rents.",
    "category": "Property Management",
    "orderIndex": 2
  },
  {
    "id": "faq35",
    "question": "Who pays for property repairs in a rental?",
    "answer": "Generally, minor maintenance (under 500 AED) is paid by the tenant, while major structural maintenance (AC compressors, plumbing leaks, electrical faults) is paid by the landlord, unless agreed otherwise.",
    "category": "Property Management",
    "orderIndex": 3
  },
  {
    "id": "faq36",
    "question": "What is the tenant security deposit rate in Dubai?",
    "answer": "The standard security deposit is 5% of the annual rent for unfurnished properties, and 10% for fully furnished properties. It is held by the landlord and returned to the tenant upon lease completion.",
    "category": "Property Management",
    "orderIndex": 4
  },
  {
    "id": "faq37",
    "question": "Is there VAT on residential properties in the UAE?",
    "answer": "No. First-time buyers of residential properties within the first 3 years of completion are zero-rated. Commercial real estate transactions, however, attract a 5% Value Added Tax (VAT).",
    "category": "Tax & Payments",
    "orderIndex": 1
  },
  {
    "id": "faq38",
    "question": "What is corporate tax on rental income?",
    "answer": "Rental income earned by private individuals directly from real estate investments in their personal capacity is exempted from the UAE's 9% corporate tax that took effect in 2023.",
    "category": "Tax & Payments",
    "orderIndex": 2
  },
  {
    "id": "faq39",
    "question": "How do currency exchange fluctuations affect UAE investments?",
    "answer": "The UAE Dirham (AED) is pegged to the US Dollar (USD) at a fixed rate of 3.6725. This removes exchange risk for international investors holding assets in USD or pegged currencies.",
    "category": "Tax & Payments",
    "orderIndex": 3
  },
  {
    "id": "faq40",
    "question": "What is service charge indexation?",
    "answer": "The DLD runs a Service Charge Index that caps and regulates the amount developers can charge per square foot for maintenance, ensuring transparency and preventing arbitrary rate hikes.",
    "category": "Tax & Payments",
    "orderIndex": 4
  }
];

const MOCK_AWARDS: AwardItem[] = [
  {
    "id": "award1",
    "title": "Best Luxury Boutique Brokerage",
    "year": 2025,
    "issuer": "Dubai Land Department Excellence Awards",
    "description": "Awarded to Luxespace for outstanding high-value transaction management, client discretion, and market advisory.",
    "icon": "Award",
    "certificateUrl": "/assets/certificates/dld_award_2025.pdf",
    "createdAt": "2026-07-01T08:14:38.592Z"
  },
  {
    "id": "award2",
    "title": "Highest Luxury Volume Broker",
    "year": 2024,
    "issuer": "Emaar Properties Annual Gala",
    "description": "Recognized as a Platinum Partner of Emaar for generating over 800M AED in luxury off-plan and ready transactions.",
    "icon": "Trophy",
    "certificateUrl": "/assets/certificates/emaar_platinum_2024.pdf",
    "createdAt": "2026-07-01T08:14:38.593Z"
  },
  {
    "id": "award3",
    "title": "Elite Brokerage of the Year",
    "year": 2024,
    "issuer": "DAMAC Properties Partner Awards",
    "description": "Distinguished honors for private portfolio advisory, exclusive townhouse deals, and VIP customer service.",
    "icon": "Medal",
    "certificateUrl": "/assets/certificates/damac_elite_2024.pdf",
    "createdAt": "2026-07-01T08:14:38.593Z"
  },
  {
    "id": "award4",
    "title": "Timeless Architecture Advisory",
    "year": 2023,
    "issuer": "Arabian Property Awards",
    "description": "Honored for the finest curated real estate catalog selection and architectural portfolio advisory.",
    "icon": "Crown",
    "certificateUrl": "/assets/certificates/apa_architecture_2023.pdf",
    "createdAt": "2026-07-01T08:14:38.593Z"
  },
  {
    "id": "award5",
    "title": "Best Real Estate Portal Design",
    "year": 2023,
    "issuer": "MEA Markets Real Estate Awards",
    "description": "Commended for delivering an elite, responsive, and editorial digital portal for high-net-worth real estate buyers.",
    "icon": "Globe",
    "certificateUrl": "/assets/certificates/mea_portal_2023.pdf",
    "createdAt": "2026-07-01T08:14:38.593Z"
  },
  {
    "id": "award6",
    "title": "Customer Centricity Excellence",
    "year": 2022,
    "issuer": "Property Finder Broker Awards",
    "description": "Honoring outstanding customer review scores, high client retention, and concierge-level advisory services.",
    "icon": "Heart",
    "certificateUrl": "/assets/certificates/pf_customer_2022.pdf",
    "createdAt": "2026-07-01T08:14:38.593Z"
  }
];

const MOCK_PARTNERS: PartnerItem[] = [
  {
    "id": "part1",
    "name": "Emaar Properties",
    "type": "developer",
    "logoUrl": "https://i.postimg.cc/kX4DdQhV/emaar-logo.png",
    "websiteUrl": "https://emaar.com",
    "createdAt": "2026-07-01T08:14:38.593Z"
  },
  {
    "id": "part2",
    "name": "Sobha Realty",
    "type": "developer",
    "logoUrl": "https://i.postimg.cc/85z1zQ8m/sobha-logo.png",
    "websiteUrl": "https://sobharealty.com",
    "createdAt": "2026-07-01T08:14:38.593Z"
  },
  {
    "id": "part3",
    "name": "DAMAC Properties",
    "type": "developer",
    "logoUrl": "https://i.postimg.cc/5yyw9H1K/damac-logo.png",
    "websiteUrl": "https://damacproperties.com",
    "createdAt": "2026-07-01T08:14:38.593Z"
  },
  {
    "id": "part4",
    "name": "Ellington Properties",
    "type": "developer",
    "logoUrl": "https://i.postimg.cc/9fyLgV1M/ellington-logo.png",
    "websiteUrl": "https://ellingtonproperties.ae",
    "createdAt": "2026-07-01T08:14:38.593Z"
  },
  {
    "id": "part5",
    "name": "Emirates NBD",
    "type": "bank",
    "logoUrl": "https://i.postimg.cc/XvYgLqgP/emiratesnbd-logo.png",
    "websiteUrl": "https://emiratesnbd.com",
    "createdAt": "2026-07-01T08:14:38.593Z"
  },
  {
    "id": "part6",
    "name": "HSBC Middle East",
    "type": "bank",
    "logoUrl": "https://i.postimg.cc/K8s3YxM1/hsbc-logo.png",
    "websiteUrl": "https://hsbc.ae",
    "createdAt": "2026-07-01T08:14:38.593Z"
  },
  {
    "id": "part7",
    "name": "Mashreq Bank",
    "type": "bank",
    "logoUrl": "https://i.postimg.cc/J0vJ8H2N/mashreq-logo.png",
    "websiteUrl": "https://mashreqbank.com",
    "createdAt": "2026-07-01T08:14:38.593Z"
  },
  {
    "id": "part8",
    "name": "ADCB Bank",
    "type": "bank",
    "logoUrl": "https://i.postimg.cc/fyvJgP2M/adcb-logo.png",
    "websiteUrl": "https://adcb.com",
    "createdAt": "2026-07-01T08:14:38.593Z"
  },
  {
    "id": "part9",
    "name": "Al Tamimi & Co",
    "type": "legal",
    "logoUrl": "https://i.postimg.cc/9MCvK3vD/altamimi-logo.png",
    "websiteUrl": "https://tamimi.com",
    "createdAt": "2026-07-01T08:14:38.593Z"
  },
  {
    "id": "part10",
    "name": "BSA Ahmad Bin Hezeem",
    "type": "legal",
    "logoUrl": "https://i.postimg.cc/YSpwJg1G/bsa-logo.png",
    "websiteUrl": "https://bsabh.com",
    "createdAt": "2026-07-01T08:14:38.593Z"
  },
  {
    "id": "part11",
    "name": "Hadef & Partners",
    "type": "legal",
    "logoUrl": "https://i.postimg.cc/Qd1xJg2N/hadef-logo.png",
    "websiteUrl": "https://hadefpartners.com",
    "createdAt": "2026-07-01T08:14:38.593Z"
  },
  {
    "id": "part12",
    "name": "Mortgage Finder UAE",
    "type": "mortgage",
    "logoUrl": "https://i.postimg.cc/FHBxJg3N/mf-logo.png",
    "websiteUrl": "https://mortgagefinder.ae",
    "createdAt": "2026-07-01T08:14:38.593Z"
  }
];

const MOCK_DOWNLOADS: DownloadItem[] = [
  {
    "id": "dl1",
    "title": "Dubai Q1 Luxury Market Report",
    "type": "report",
    "fileUrl": "/assets/downloads/market_report_q1_2026.pdf",
    "fileSize": "4.8 MB",
    "isFeatured": true,
    "createdAt": "2026-07-01T08:14:38.593Z"
  },
  {
    "id": "dl2",
    "title": "Dubai Golden Visa Complete Guide",
    "type": "guide",
    "fileUrl": "/assets/downloads/golden_visa_guide_2026.pdf",
    "fileSize": "3.2 MB",
    "isFeatured": true,
    "createdAt": "2026-07-01T08:14:38.593Z"
  },
  {
    "id": "dl3",
    "title": "Foreign Property Purchase Handbook",
    "type": "guide",
    "fileUrl": "/assets/downloads/buyer_guide_foreigner.pdf",
    "fileSize": "2.9 MB",
    "isFeatured": false,
    "createdAt": "2026-07-01T08:14:38.593Z"
  },
  {
    "id": "dl4",
    "title": "Atlantis Residences Floor Plans Booklet",
    "type": "floorplan",
    "fileUrl": "/assets/downloads/atlantis_floorplans.pdf",
    "fileSize": "12.4 MB",
    "isFeatured": true,
    "createdAt": "2026-07-01T08:14:38.593Z"
  },
  {
    "id": "dl5",
    "title": "Emaar Beachfront Villa Brochure",
    "type": "brochure",
    "fileUrl": "/assets/downloads/emaar_beachfront.pdf",
    "fileSize": "8.1 MB",
    "isFeatured": false,
    "createdAt": "2026-07-01T08:14:38.593Z"
  },
  {
    "id": "dl6",
    "title": "Sobha Hartland Penthouses Brochure",
    "type": "brochure",
    "fileUrl": "/assets/downloads/sobha_hartland_brochure.pdf",
    "fileSize": "9.5 MB",
    "isFeatured": false,
    "createdAt": "2026-07-01T08:14:38.593Z"
  },
  {
    "id": "dl7",
    "title": "Tax & Wealth Structuring for UAE Property",
    "type": "report",
    "fileUrl": "/assets/downloads/tax_wealth_report_2026.pdf",
    "fileSize": "5.1 MB",
    "isFeatured": true,
    "createdAt": "2026-07-01T08:14:38.593Z"
  },
  {
    "id": "dl8",
    "title": "DLD Standard Sale Agreement Template",
    "type": "floorplan",
    "fileUrl": "/assets/downloads/dld_form_f_template.pdf",
    "fileSize": "1.2 MB",
    "isFeatured": false,
    "createdAt": "2026-07-01T08:14:38.593Z"
  }
];

const MOCK_LIFESTYLE: LifestyleArticle[] = [
  {
    "id": "la1",
    "title": "The Art of Coastal Splendor: Beachfront Living at Palm Jumeirah",
    "slug": "coastal-splendor-beachfront-palm-jumeirah",
    "category": "Beach Living",
    "summary": "Discover why Palm Jumeirah remains the ultimate address for private ocean terraces and bespoke luxury living in Dubai.",
    "content": "Dubai's waterfront real estate is world-famous, but nothing captures the imagination quite like the private fronds of Palm Jumeirah. Offering double-height glass structures, custom private beach entries, and unparalleled views of the Arabian Gulf, living on the Palm is less about having a house and more about owning a private slice of the ocean. In this editorial guide, we explore the interior aesthetics of the Frond Mansions, custom wellness pools, yacht docks, and why the global elite choose the Palm as their primary residence.",
    "coverImage": "/assets/palm_jumeirah_render.png",
    "isPublished": true,
    "createdAt": "2026-06-26T08:14:38.593Z",
    "updatedAt": "2026-07-01T08:14:38.593Z"
  },
  {
    "id": "la2",
    "title": "Designing the Horizon: Interior Design Aesthetics in Sky Penthouses",
    "slug": "designing-horizon-interior-design-sky-penthouses",
    "category": "Interior Design",
    "summary": "Unveiling the glassmorphism, travertine claddings, and Italian bespoke marbles defined by top-tier decorators.",
    "content": "Penthouses in Downtown Dubai and Business Bay are pushing the boundaries of architectural interior design. Travertine stone cladding, custom brass accents, and solid Italian Carrara marble are standard. Floor-to-ceiling glass allows decorators to integrate the skyline itself as a living canvas. We speak with luxury designers who discuss spatial planning, acoustic damping, custom ambient lighting, and how bespoke furnishings elevate double-height sky mansions into editorial sanctuaries.",
    "coverImage": "/assets/penthouse_render.png",
    "isPublished": true,
    "createdAt": "2026-06-21T08:14:38.593Z",
    "updatedAt": "2026-07-01T08:14:38.593Z"
  },
  {
    "id": "la3",
    "title": "Dubai Hills Estate: The Modern Family Paradise Green Haven",
    "slug": "dubai-hills-estate-modern-family-paradise-green-haven",
    "category": "Family Communities",
    "summary": "Exploring championship golf parks, world-class schools, and leafy villa enclaves in Dubai Hills.",
    "content": "For families seeking an active, green lifestyle without losing connection to the city center, Dubai Hills Estate represents the absolute peak of modern urban planning. Spread around an 18-hole championship golf course, the community is anchored by leafy parks, multi-mile cycling paths, top-rated hospitals (King's College), and premium international academies. This article outlines the architectural styles of Sidra and Maple townhouses, and the exclusive Parkway Vistas custom builds.",
    "coverImage": "/assets/villa_render.png",
    "isPublished": true,
    "createdAt": "2026-06-16T08:14:38.593Z",
    "updatedAt": "2026-07-01T08:14:38.593Z"
  },
  {
    "id": "la4",
    "title": "Golden Visa Investment Playbook: Maximizing Yield & Capital Preservation",
    "slug": "golden-visa-investment-playbook-yield-capital-preservation",
    "category": "Investment Guides",
    "summary": "How global wealth managers structure 2M+ real estate portfolios to secure long-term UAE residency.",
    "content": "The UAE's 10-year Golden Visa has transformed Dubai from a temporary expat market into a permanent home for high-net-worth individuals. By allocating a minimum of 2 million AED into local real estate, investors gain stability, zero property tax, and full sponsor rights. We write an investment playbook outlining tax structures, off-plan vs ready assets yield comparisons, and the best mortgage options available to non-resident investors.",
    "coverImage": "/assets/apartment_render.png",
    "isPublished": true,
    "createdAt": "2026-06-11T08:14:38.593Z",
    "updatedAt": "2026-07-01T08:14:38.593Z"
  },
  {
    "id": "la5",
    "title": "The Ultimate Guide to Michelin Star Dining in Business Bay & DIFC",
    "slug": "michelin-star-dining-business-bay-difc",
    "category": "Dubai Lifestyle",
    "summary": "From Zuma to bespoke rooftop chef tables, exploring the high culinary landscape of central Dubai.",
    "content": "Dubai's culinary scene is thriving. With Business Bay and DIFC housing some of the world's most acclaimed dining spots, living in these corporate hubs offers immediate proximity to culinary masterworks. We review the top rooftop dining terraces, private chef tables, custom menus, and tell you which luxury developments give residents private elevator access straight to world-class dining lounges.",
    "coverImage": "/assets/apartment_render.png",
    "isPublished": true,
    "createdAt": "2026-06-06T08:14:38.593Z",
    "updatedAt": "2026-07-01T08:14:38.593Z"
  },
  {
    "id": "la6",
    "title": "Downtown Penthouse living: Luxury Above the Clouds",
    "slug": "downtown-penthouse-living-luxury-above-clouds",
    "category": "Business Lifestyle",
    "summary": "Why global tech executives and hedge fund managers choose high-rise sky residences over beach villas.",
    "content": "The luxury market is split: beach versus city. While beach villas offer coastal proximity, high-rise penthouses in Downtown Dubai offer lock-and-leave convenience, absolute privacy, and panoramic views of the city. We highlight top towers, private helicopter access pads, automated home theaters, and explore why global entrepreneurs choose high-rise penthouses as their secondary offices.",
    "coverImage": "/assets/penthouse_render.png",
    "isPublished": true,
    "createdAt": "2026-06-01T08:14:38.593Z",
    "updatedAt": "2026-07-01T08:14:38.593Z"
  }
];

// Local Storage Helper Database Engine
class LocalStorageDB {
  private initKey(key: string, initialData: unknown) {
    if (typeof window !== "undefined" && !localStorage.getItem(key)) {
      localStorage.setItem(key, JSON.stringify(initialData));
    }
  }

  constructor() {
    this.initKey("luxespace_developers", MOCK_DEVELOPERS);
    this.initKey("luxespace_communities", MOCK_COMMUNITIES);
    this.initKey("luxespace_agents", MOCK_AGENTS);
    this.initKey("luxespace_properties", MOCK_PROPERTIES);
    this.initKey("luxespace_leads", MOCK_LEADS);
    this.initKey("luxespace_appointments", MOCK_APPOINTMENTS);
    this.initKey("luxespace_testimonials", MOCK_TESTIMONIALS);
    this.initKey("luxespace_blogs", MOCK_BLOGS);
    this.initKey("luxespace_faqs", MOCK_FAQS);
    this.initKey("luxespace_awards", MOCK_AWARDS);
    this.initKey("luxespace_partners", MOCK_PARTNERS);
    this.initKey("luxespace_downloads", MOCK_DOWNLOADS);
    this.initKey("luxespace_lifestyle", MOCK_LIFESTYLE);
    this.initKey("luxespace_subscribers", ["luxespace.subscriber@gmail.com"]);
    this.initKey("luxespace_settings", { companyName: "Luxespace Properties", email: "luxespace@gmail.com", phone: "9745334644" });
  }

  get<T>(key: string): T[] {
    if (typeof window === "undefined") return [];
    return JSON.parse(localStorage.getItem("luxespace_" + key) || "[]");
  }

  save(key: string, data: unknown) {
    if (typeof window === "undefined") return;
    localStorage.setItem("luxespace_" + key, JSON.stringify(data));
  }
}

const mockDB = new LocalStorageDB();

// Deterministic UUID mappers for local storage / front-end compatibility
function toUUID(id: string): string {
  if (!id) return id;
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    return id;
  }
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{11}$/i.test(id)) {
    const parts = id.split("-");
    parts[4] = parts[4].padStart(12, "0");
    return parts.join("-");
  }
  const numPart = id.replace(/^\D+/, "");
  const num = parseInt(numPart, 10);
  if (isNaN(num)) {
    return "00000000-0000-0000-0000-000000000000";
  }
  const hex = num.toString(16).padStart(12, "0");
  if (id.startsWith("dev")) return `00000000-0000-0000-0000-${hex}`;
  if (id.startsWith("c")) return `00000000-0000-0000-0001-${hex}`;
  if (id.startsWith("agent")) return `00000000-0000-0000-0002-${hex}`;
  if (id.startsWith("p")) return `00000000-0000-0000-0003-${hex}`;
  if (id.startsWith("blog") || id.startsWith("b")) return `00000000-0000-0000-0004-${hex}`;
  return `00000000-0000-0000-0009-${hex}`;
}

function fromUUID(uuid: string): string {
  if (!uuid) return uuid;
  if (!uuid.startsWith("00000000-0000-0000-")) return uuid;
  const parts = uuid.split("-");
  const typePart = parts[3];
  const hexPart = parts[4];
  const num = parseInt(hexPart, 16);
  if (typePart === "0000") return `dev${num}`;
  if (typePart === "0001") return `c${num}`;
  if (typePart === "0002") return `agent${num}`;
  if (typePart === "0003") return `p${num}`;
  if (typePart === "0004") return `b${num}`;
  return uuid;
}

function mapPngToWebp(url: string | undefined): string | undefined {
  if (typeof url !== "string") return url;
  if (url.includes("_render.png")) {
    return url.replace(".png", ".webp");
  }
  return url;
}

function mapPngToWebpString(url: string): string {
  if (typeof url !== "string") return url;
  if (url.includes("_render.png")) {
    return url.replace(".png", ".webp");
  }
  return url;
}

function mapCommunityFromDB(c: any): Community {
  return {
    id: fromUUID(c.id),
    name: c.name,
    slug: c.slug,
    description: c.description || undefined,
    bannerUrl: mapPngToWebp(c.banner_url || undefined),
    coordinates: c.coordinates || undefined,
    isFeatured: c.is_featured,
    createdAt: c.created_at,
    updatedAt: c.updated_at
  };
}

function mapDeveloperFromDB(d: any): Developer {
  return {
    id: fromUUID(d.id),
    name: d.name,
    slug: d.slug,
    logoUrl: d.logo_url || undefined,
    description: d.description || undefined,
    foundedYear: d.founded_year || undefined,
    website: d.website || undefined,
    isFeatured: d.is_featured,
    createdAt: d.created_at,
    updatedAt: d.updated_at
  };
}

function mapAgentFromDB(a: any): Agent {
  return {
    id: fromUUID(a.id),
    profileId: a.profile_id || undefined,
    name: a.name,
    slug: a.slug,
    title: a.title,
    email: a.email,
    phone: a.phone,
    whatsapp: a.whatsapp || undefined,
    avatarUrl: a.avatar_url || undefined,
    languages: a.languages || [],
    specialization: a.specialization || [],
    experienceYears: a.experience_years || undefined,
    bio: a.bio || undefined,
    isFeatured: a.is_featured,
    createdAt: a.created_at,
    updatedAt: a.updated_at
  };
}

function mapPropertyFromDB(p: any): Property {
  return {
    id: fromUUID(p.id),
    title: p.title,
    slug: p.slug,
    description: p.description || "",
    price: Number(p.price),
    priceUsd: p.price_usd ? Number(p.price_usd) : undefined,
    type: p.type as any,
    status: p.status as any,
    completionStatus: p.completion_status as any,
    handoverDate: p.handover_date || undefined,
    bedrooms: Number(p.bedrooms),
    bathrooms: Number(p.bathrooms),
    areaSqft: Number(p.area_sqft),
    location: p.location,
    communityId: fromUUID(p.community_id),
    developerId: p.developer_id ? fromUUID(p.developer_id) : undefined,
    agentId: fromUUID(p.agent_id),
    latitude: p.latitude || undefined,
    longitude: p.longitude || undefined,
    images: p.images ? p.images.map(mapPngToWebpString) : [],
    videos: p.videos || [],
    amenities: p.amenities || [],
    isFeatured: p.is_featured,
    propertyPlanUrl: p.property_plan_url || undefined,
    metadata: p.metadata || {},
    createdAt: p.created_at,
    updatedAt: p.updated_at,
    community: p.community ? mapCommunityFromDB(p.community) : undefined,
    developer: p.developer ? mapDeveloperFromDB(p.developer) : undefined,
    agent: p.agent ? mapAgentFromDB(p.agent) : undefined
  };
}

function mapBlogFromDB(b: any): BlogPost {
  return {
    id: fromUUID(b.id),
    title: b.title,
    slug: b.slug,
    summary: b.summary,
    content: b.content || "",
    coverImage: mapPngToWebp(b.cover_image || undefined),
    gallery: b.gallery ? b.gallery.map(mapPngToWebpString) : [],
    authorId: fromUUID(b.author_id),
    category: b.category || undefined,
    status: (b.status as any) || (b.is_published ? "published" : "draft"),
    readingTime: b.reading_time || 5,
    isFeaturedArticle: b.is_featured_article || false,
    relatedProperties: b.related_properties ? b.related_properties.map(fromUUID) : [],
    relatedCommunities: b.related_communities ? b.related_communities.map(fromUUID) : [],
    relatedDevelopers: b.related_developers ? b.related_developers.map(fromUUID) : [],
    relatedBlogs: b.related_blogs ? b.related_blogs.map(fromUUID) : [],
    publishedAt: b.published_at || undefined,
    isPublished: b.is_published,
    tags: b.tags || [],
    seo: b.seo || {},
    createdAt: b.created_at,
    updatedAt: b.updated_at
  };
}

function mapCategoryFromDB(c: any): BlogCategory {
  return {
    id: fromUUID(c.id),
    name: c.name,
    slug: c.slug,
    createdAt: c.created_at
  };
}

function mapTestimonialFromDB(t: any): Testimonial {
  return {
    id: t.id,
    clientName: t.client_name,
    clientTitle: t.client_title || undefined,
    rating: t.rating,
    content: t.content,
    avatarUrl: t.avatar_url || undefined,
    isFeatured: t.is_featured,
    createdAt: t.created_at
  };
}

function mapFAQFromDB(f: any): FAQItem {
  return {
    id: f.id,
    question: f.question,
    answer: f.answer,
    category: f.category,
    orderIndex: f.order_index,
    createdAt: f.created_at
  };
}

function mapAwardFromDB(a: any): AwardItem {
  return {
    id: a.id,
    title: a.title,
    year: a.year,
    issuer: a.issuer,
    description: a.description || undefined,
    icon: a.icon || undefined,
    createdAt: a.created_at
  };
}

function mapPartnerFromDB(p: any): PartnerItem {
  return {
    id: p.id,
    name: p.name,
    logoUrl: p.logo_url,
    type: p.type as any,
    isFeatured: p.is_featured,
    createdAt: p.created_at
  };
}

function mapDownloadFromDB(d: any): DownloadItem {
  return {
    id: d.id,
    title: d.title,
    type: d.type as any,
    fileUrl: d.file_url,
    fileSize: d.file_size,
    thumbnailUrl: d.thumbnail_url || undefined,
    isFeatured: d.is_featured,
    createdAt: d.created_at
  };
}

function mapLifestyleFromDB(l: any): LifestyleArticle {
  return {
    id: l.id,
    title: l.title,
    slug: l.slug,
    category: l.category,
    summary: l.summary,
    content: l.content,
    coverImage: l.cover_image,
    isPublished: l.is_published,
    createdAt: l.created_at,
    updatedAt: l.updated_at
  };
}

function mapLeadFromDB(l: any): Lead {
  return {
    id: fromUUID(l.id),
    firstName: l.first_name,
    lastName: l.last_name,
    email: l.email,
    phone: l.phone,
    source: l.source,
    status: l.status as any,
    propertyInterestId: l.property_interest_id ? fromUUID(l.property_interest_id) : undefined,
    notes: l.notes || undefined,
    createdAt: l.created_at,
    updatedAt: l.updated_at
  };
}

function mapAppointmentFromDB(a: any): Appointment {
  return {
    id: fromUUID(a.id),
    leadId: fromUUID(a.lead_id),
    propertyId: a.property_id ? fromUUID(a.property_id) : undefined,
    agentId: fromUUID(a.agent_id),
    appointmentDate: a.appointment_date,
    type: a.type as any,
    status: a.status as any,
    notes: a.notes || undefined,
    createdAt: a.created_at,
    updatedAt: a.updated_at
  };
}

function mapPropertyToDB(p: any): any {
  return {
    id: toUUID(p.id),
    title: p.title,
    slug: p.slug,
    description: p.description,
    price: p.price,
    price_usd: p.priceUsd || null,
    type: p.type,
    status: p.status,
    completion_status: p.completionStatus,
    handover_date: p.handoverDate || null,
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    area_sqft: p.areaSqft,
    parking: p.parking || 0,
    location: p.location,
    community_id: toUUID(p.communityId),
    developer_id: p.developerId ? toUUID(p.developerId) : null,
    agent_id: toUUID(p.agentId),
    latitude: p.latitude || null,
    longitude: p.longitude || null,
    images: p.images || [],
    videos: p.videos || [],
    amenities: p.amenities || [],
    is_featured: p.isFeatured || false,
    property_plan_url: p.propertyPlanUrl || null,
    metadata: p.metadata || {},
    created_at: p.createdAt,
    updated_at: p.updatedAt
  };
}

function mapDeveloperToDB(d: any): any {
  return {
    id: toUUID(d.id),
    name: d.name,
    slug: d.slug,
    logo_url: d.logoUrl || null,
    description: d.description || null,
    founded_year: d.foundedYear || null,
    website: d.website || null,
    is_featured: d.isFeatured || false,
    created_at: d.createdAt,
    updated_at: d.updatedAt
  };
}

function mapCommunityToDB(c: any): any {
  return {
    id: toUUID(c.id),
    name: c.name,
    slug: c.slug,
    description: c.description || null,
    banner_url: c.bannerUrl || null,
    coordinates: c.coordinates || null,
    is_featured: c.isFeatured || false,
    created_at: c.createdAt,
    updated_at: c.updatedAt
  };
}

function mapAgentToDB(a: any): any {
  return {
    id: toUUID(a.id),
    profile_id: a.profileId ? toUUID(a.profileId) : null,
    name: a.name,
    slug: a.slug,
    title: a.title,
    email: a.email,
    phone: a.phone,
    whatsapp: a.whatsapp || null,
    avatar_url: a.avatarUrl || null,
    languages: a.languages || [],
    specialization: a.specialization || [],
    experience_years: a.experienceYears || null,
    bio: a.bio || null,
    is_featured: a.isFeatured || false,
    created_at: a.createdAt,
    updated_at: a.updatedAt
  };
}

function mapLeadToDB(l: any): any {
  return {
    id: toUUID(l.id),
    first_name: l.firstName,
    last_name: l.lastName,
    email: l.email,
    phone: l.phone,
    source: l.source,
    status: l.status,
    property_interest_id: l.propertyInterestId ? toUUID(l.propertyInterestId) : null,
    notes: l.notes || null,
    created_at: l.createdAt,
    updated_at: l.updatedAt
  };
}

function mapAppointmentToDB(a: any): any {
  return {
    id: toUUID(a.id),
    lead_id: toUUID(a.leadId),
    property_id: a.propertyId ? toUUID(a.propertyId) : null,
    agent_id: toUUID(a.agentId),
    appointment_date: a.appointmentDate,
    type: a.type,
    status: a.status,
    notes: a.notes || null,
    created_at: a.createdAt,
    updated_at: a.updatedAt
  };
}

function mapTestimonialToDB(t: any): any {
  return {
    id: toUUID(t.id),
    client_name: t.clientName,
    client_title: t.clientTitle || null,
    rating: t.rating,
    content: t.content,
    avatar_url: t.avatarUrl || null,
    is_featured: t.isFeatured || false,
    created_at: t.createdAt
  };
}

function mapBlogToDB(b: any): any {
  return {
    id: toUUID(b.id),
    title: b.title,
    slug: b.slug,
    summary: b.summary,
    content: b.content,
    cover_image: b.coverImage || null,
    gallery: b.gallery || [],
    author_id: toUUID(b.authorId),
    category: b.category || null,
    status: b.status || (b.isPublished ? "published" : "draft"),
    reading_time: b.readingTime || 5,
    is_featured_article: b.isFeaturedArticle || false,
    related_properties: b.relatedProperties ? b.relatedProperties.map(toUUID) : [],
    related_communities: b.relatedCommunities ? b.relatedCommunities.map(toUUID) : [],
    related_developers: b.relatedDevelopers ? b.relatedDevelopers.map(toUUID) : [],
    related_blogs: b.relatedBlogs ? b.relatedBlogs.map(toUUID) : [],
    published_at: b.publishedAt || null,
    is_published: b.isPublished || false,
    tags: b.tags || [],
    seo: b.seo || {},
    created_at: b.createdAt,
    updated_at: b.updatedAt
  };
}


// Dynamic Content Provider
export const db = {
  // Properties CRUD
  async getProperties(): Promise<Property[]> {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const { data, error } = await supabase.from("properties").select("*, community:communities(*), developer:developers(*), agent:agents(*)");
      if (!error && data) {
        return (data as any[]).map(mapPropertyFromDB);
      }
      if (error) console.error("Supabase getProperties error:", error.message);
    }
    const props = mockDB.get<Property>("properties");
    const comms = mockDB.get<Community>("communities").map(c => ({
      ...c,
      bannerUrl: mapPngToWebp(c.bannerUrl)
    }));
    const devs = mockDB.get<Developer>("developers");
    const ags = mockDB.get<Agent>("agents");
    
    return props.map(p => ({
      ...p,
      images: p.images ? p.images.map(mapPngToWebpString) : [],
      community: comms.find(c => c.id === p.communityId),
      developer: devs.find(d => d.id === p.developerId),
      agent: ags.find(a => a.id === p.agentId),
    }));
  },

  async getPropertyBySlug(slug: string): Promise<Property | null> {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("properties")
        .select("*, community:communities(*), developer:developers(*), agent:agents(*)")
        .eq("slug", slug)
        .single();
      if (!error && data) {
        return mapPropertyFromDB(data);
      }
      if (error) console.error("Supabase getPropertyBySlug error:", error.message);
    }
    const all = await this.getProperties();
    return all.find(p => p.slug === slug) || null;
  },

  async getPropertiesByFilters(filters: {
    purpose?: string;
    type?: string;
    community?: string;
    developer?: string;
    agent?: string;
    ids?: string[];
    minPrice?: number;
    maxPrice?: number;
    minArea?: number;
    maxArea?: number;
    bedrooms?: number;
    bathrooms?: number;
    parking?: number;
    completionStatus?: string;
    isFeatured?: boolean;
    search?: string;
    sort?: string;
    page?: number;
    limit?: number;
    isSummary?: boolean;
  }): Promise<{ properties: Property[]; totalCount: number }> {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      
      const selectStr = filters.isSummary
        ? "id, title, slug, price, type, status, completion_status, bedrooms, bathrooms, area_sqft, location, is_featured, images, developer_id, community_id, agent_id, developer:developers(name)"
        : "*, community:communities(*), developer:developers(*), agent:agents(*)";

      let query = supabase
        .from("properties")
        .select(selectStr, { count: "exact" });

      if (filters.purpose) query = query.eq("status", filters.purpose);
      if (filters.type) query = query.eq("type", filters.type);
      if (filters.community) query = query.eq("community_id", toUUID(filters.community));
      if (filters.developer) query = query.eq("developer_id", toUUID(filters.developer));
      if (filters.agent) query = query.eq("agent_id", toUUID(filters.agent));
      if (filters.ids && filters.ids.length > 0) query = query.in("id", filters.ids.map(toUUID));
      if (filters.minPrice !== undefined) query = query.gte("price", filters.minPrice);
      if (filters.maxPrice !== undefined) query = query.lte("price", filters.maxPrice);
      if (filters.minArea !== undefined) query = query.gte("area_sqft", filters.minArea);
      if (filters.maxArea !== undefined) query = query.lte("area_sqft", filters.maxArea);
      if (filters.bedrooms !== undefined) query = query.gte("bedrooms", filters.bedrooms);
      if (filters.bathrooms !== undefined) query = query.gte("bathrooms", filters.bathrooms);
      if (filters.parking !== undefined) query = query.gte("parking", filters.parking);
      if (filters.completionStatus) query = query.eq("completion_status", filters.completionStatus);
      if (filters.isFeatured !== undefined) query = query.eq("is_featured", filters.isFeatured);
      
      if (filters.search) {
        const q = `%${filters.search}%`;
        query = query.or(`title.ilike.${q},location.ilike.${q},description.ilike.${q}`);
      }

      // Sorting
      switch (filters.sort) {
        case "price-asc": query = query.order("price", { ascending: true }).order("id", { ascending: true }); break;
        case "price-desc": query = query.order("price", { ascending: false }).order("id", { ascending: true }); break;
        case "newest": query = query.order("created_at", { ascending: false }).order("id", { ascending: true }); break;
        case "area-desc": query = query.order("area_sqft", { ascending: false }).order("id", { ascending: true }); break;
        case "featured": query = query.order("is_featured", { ascending: false }).order("id", { ascending: true }); break;
        default: query = query.order("is_featured", { ascending: false }).order("id", { ascending: true });
      }

      // Pagination
      if (filters.page && filters.limit) {
        const from = (filters.page - 1) * filters.limit;
        const to = from + filters.limit - 1;
        query = query.range(from, to);
      } else if (filters.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error, count } = await query;
      if (!error && data) {
        return {
          properties: (data as any[]).map(mapPropertyFromDB),
          totalCount: count || data.length,
        };
      }
      if (error) console.error("Supabase getPropertiesByFilters error:", error.message);
    }

    // Fallback Mock DB query path
    let list = await this.getProperties();
    
    if (filters.purpose) list = list.filter(p => p.status === filters.purpose);
    if (filters.type) list = list.filter(p => p.type === filters.type);
    if (filters.community) list = list.filter(p => p.communityId === filters.community);
    if (filters.developer) list = list.filter(p => p.developerId === filters.developer);
    if (filters.agent) list = list.filter(p => p.agentId === filters.agent);
    if (filters.ids && filters.ids.length > 0) list = list.filter(p => filters.ids!.includes(p.id));
    if (filters.minPrice !== undefined) { const val = filters.minPrice; list = list.filter(p => p.price >= val); }
    if (filters.maxPrice !== undefined) { const val = filters.maxPrice; list = list.filter(p => p.price <= val); }
    if (filters.minArea !== undefined) { const val = filters.minArea; list = list.filter(p => p.areaSqft >= val); }
    if (filters.maxArea !== undefined) { const val = filters.maxArea; list = list.filter(p => p.areaSqft <= val); }
    if (filters.bedrooms !== undefined) { const val = filters.bedrooms; list = list.filter(p => p.bedrooms >= val); }
    if (filters.bathrooms !== undefined) { const val = filters.bathrooms; list = list.filter(p => p.bathrooms >= val); }
    if (filters.parking !== undefined) { const val = filters.parking; list = list.filter(p => (p.parking || 0) >= val); }
    if (filters.completionStatus) list = list.filter(p => p.completionStatus === filters.completionStatus);
    if (filters.isFeatured !== undefined) list = list.filter(p => p.isFeatured === filters.isFeatured);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    // Sorting
    switch (filters.sort) {
      case "price-asc": list.sort((a, b) => a.price - b.price); break;
      case "price-desc": list.sort((a, b) => b.price - a.price); break;
      case "newest": list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
      case "area-desc": list.sort((a, b) => b.areaSqft - a.areaSqft); break;
      case "featured": list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0)); break;
      default: list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    const totalCount = list.length;
    let paginatedList = list;
    if (filters.page && filters.limit) {
      const from = (filters.page - 1) * filters.limit;
      paginatedList = list.slice(from, from + filters.limit);
    } else if (filters.limit) {
      paginatedList = list.slice(0, filters.limit);
    }

    return {
      properties: paginatedList,
      totalCount,
    };
  },

  async getRelatedProperties(property: Property, limit = 6): Promise<Property[]> {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const dbPropId = toUUID(property.id);
      const dbCommId = toUUID(property.communityId);
      const dbDevId = property.developerId ? toUUID(property.developerId) : null;
      
      let query = supabase
        .from("properties")
        .select("*, community:communities(*), developer:developers(*), agent:agents(*)")
        .neq("id", dbPropId);

      const orClauses = [`type.eq.${property.type}`, `community_id.eq.${dbCommId}`];
      if (dbDevId) {
        orClauses.push(`developer_id.eq.${dbDevId}`);
      }
      query = query.or(orClauses.join(",")).limit(limit);

      const { data, error } = await query;
      if (!error && data) {
        return (data as any[]).map(mapPropertyFromDB);
      }
      if (error) console.error("Supabase getRelatedProperties error:", error.message);
    }
    const all = await this.getProperties();
    return all
      .filter(p => p.id !== property.id)
      .filter(p => p.communityId === property.communityId || p.type === property.type || p.developerId === property.developerId)
      .slice(0, limit);
  },

  async createEnquiry(data: { propertyId: string; fullName: string; email: string; phone: string; whatsapp?: string; country?: string; preferredContact?: string; message: string }): Promise<boolean> {
    const nameParts = data.fullName.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ");
    
    await this.createLead({
      firstName,
      lastName,
      email: data.email,
      phone: data.phone,
      source: "property_enquiry",
      status: "new",
      propertyInterestId: data.propertyId,
      notes: data.message + "\n\nWhatsApp: " + (data.whatsapp || "N/A") + "\nCountry: " + (data.country || "N/A") + "\nPreferred Contact: " + (data.preferredContact || "N/A")
    });
    return true;
  },

  async createProperty(property: Omit<Property, "id" | "createdAt" | "updatedAt">): Promise<Property> {
    const id = crypto.randomUUID();
    const newRecord: Property = { ...property, id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const dbRecord = mapPropertyToDB(newRecord);
      const { error } = await supabase.from("properties").insert(dbRecord);
      if (error) {
        console.error("Supabase createProperty error:", error.message);
        throw new Error(error.message);
      }
      return newRecord;
    }
    
    const list = mockDB.get<Property>("properties");
    list.unshift(newRecord);
    mockDB.save("properties", list);
    return newRecord;
  },

  async updateProperty(id: string, property: Partial<Property>): Promise<Property> {
    const updatedAt = new Date().toISOString();
    
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const dbId = toUUID(id);
      const dbPatch: any = {};
      if (property.title !== undefined) dbPatch.title = property.title;
      if (property.slug !== undefined) dbPatch.slug = property.slug;
      if (property.description !== undefined) dbPatch.description = property.description;
      if (property.price !== undefined) dbPatch.price = property.price;
      if (property.priceUsd !== undefined) dbPatch.price_usd = property.priceUsd;
      if (property.type !== undefined) dbPatch.type = property.type;
      if (property.status !== undefined) dbPatch.status = property.status;
      if (property.completionStatus !== undefined) dbPatch.completion_status = property.completionStatus;
      if (property.handoverDate !== undefined) dbPatch.handover_date = property.handoverDate;
      if (property.bedrooms !== undefined) dbPatch.bedrooms = property.bedrooms;
      if (property.bathrooms !== undefined) dbPatch.bathrooms = property.bathrooms;
      if (property.areaSqft !== undefined) dbPatch.area_sqft = property.areaSqft;
      if (property.parking !== undefined) dbPatch.parking = property.parking;
      if (property.location !== undefined) dbPatch.location = property.location;
      if (property.communityId !== undefined) dbPatch.community_id = toUUID(property.communityId);
      if (property.developerId !== undefined) dbPatch.developer_id = property.developerId ? toUUID(property.developerId) : null;
      if (property.agentId !== undefined) dbPatch.agent_id = toUUID(property.agentId);
      if (property.latitude !== undefined) dbPatch.latitude = property.latitude;
      if (property.longitude !== undefined) dbPatch.longitude = property.longitude;
      if (property.images !== undefined) dbPatch.images = property.images;
      if (property.videos !== undefined) dbPatch.videos = property.videos;
      if (property.amenities !== undefined) dbPatch.amenities = property.amenities;
      if (property.isFeatured !== undefined) dbPatch.is_featured = property.isFeatured;
      if (property.propertyPlanUrl !== undefined) dbPatch.property_plan_url = property.propertyPlanUrl;
      if (property.metadata !== undefined) dbPatch.metadata = property.metadata;
      dbPatch.updated_at = updatedAt;
      
      const { error, data } = await supabase.from("properties").update(dbPatch).eq("id", dbId).select().single();
      if (error) {
        console.error("Supabase updateProperty error:", error.message);
        throw new Error(error.message);
      }
      return mapPropertyFromDB(data);
    }
    
    const list = mockDB.get<Property>("properties");
    const idx = list.findIndex((p) => p.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...property, updatedAt };
      mockDB.save("properties", list);
      return list[idx];
    }
    throw new Error("Property not found");
  },

  async deleteProperty(id: string): Promise<boolean> {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const { error } = await supabase.from("properties").delete().eq("id", toUUID(id));
      if (error) {
        console.error("Supabase deleteProperty error:", error.message);
        throw new Error(error.message);
      }
      return true;
    }
    const list = mockDB.get<Property>("properties");
    mockDB.save("properties", list.filter((p) => p.id !== id));
    return true;
  },

  async getDevelopers(filters?: { slug?: string; isFeatured?: boolean; search?: string; id?: string; ids?: string[] }): Promise<Developer[]> {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      let query = supabase.from("developers").select("*");
      if (filters) {
        if (filters.slug) query = query.eq("slug", filters.slug);
        if (filters.isFeatured !== undefined) query = query.eq("is_featured", filters.isFeatured);
        if (filters.id) query = query.eq("id", toUUID(filters.id));
        if (filters.ids && filters.ids.length > 0) query = query.in("id", filters.ids.map(toUUID));
        if (filters.search) {
          const q = `%${filters.search}%`;
          query = query.or(`name.ilike.${q},description.ilike.${q}`);
        }
      }
      const { data, error } = await query;
      if (!error && data) {
        return (data as any[]).map(mapDeveloperFromDB);
      }
      if (error) console.error("Supabase getDevelopers error:", error.message);
    }
    let list = mockDB.get<Developer>("developers");
    if (filters) {
      if (filters.slug) list = list.filter(d => d.slug === filters.slug);
      if (filters.isFeatured !== undefined) list = list.filter(d => d.isFeatured === filters.isFeatured);
      if (filters.id) list = list.filter(d => d.id === filters.id);
      if (filters.ids && filters.ids.length > 0) list = list.filter(d => filters.ids!.includes(d.id));
      if (filters.search) {
        const q = filters.search.toLowerCase();
        list = list.filter(d => d.name.toLowerCase().includes(q) || (d.description && d.description.toLowerCase().includes(q)));
      }
    }
    return list;
  },

  async createDeveloper(developer: Omit<Developer, "id" | "createdAt" | "updatedAt">): Promise<Developer> {
    const id = crypto.randomUUID();
    const newRecord: Developer = { ...developer, id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const dbRecord = mapDeveloperToDB(newRecord);
      const { error } = await supabase.from("developers").insert(dbRecord);
      if (error) {
        console.error("Supabase createDeveloper error:", error.message);
        throw new Error(error.message);
      }
      return newRecord;
    }
    
    const list = mockDB.get<Developer>("developers");
    list.unshift(newRecord);
    mockDB.save("developers", list);
    return newRecord;
  },

  async updateDeveloper(id: string, developer: Partial<Developer>): Promise<Developer> {
    const updatedAt = new Date().toISOString();
    
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const dbId = toUUID(id);
      const dbPatch: any = {};
      if (developer.name !== undefined) dbPatch.name = developer.name;
      if (developer.slug !== undefined) dbPatch.slug = developer.slug;
      if (developer.logoUrl !== undefined) dbPatch.logo_url = developer.logoUrl;
      if (developer.description !== undefined) dbPatch.description = developer.description;
      if (developer.foundedYear !== undefined) dbPatch.founded_year = developer.foundedYear;
      if (developer.website !== undefined) dbPatch.website = developer.website;
      if (developer.isFeatured !== undefined) dbPatch.is_featured = developer.isFeatured;
      dbPatch.updated_at = updatedAt;
      
      const { error, data } = await supabase.from("developers").update(dbPatch).eq("id", dbId).select().single();
      if (error) {
        console.error("Supabase updateDeveloper error:", error.message);
        throw new Error(error.message);
      }
      return mapDeveloperFromDB(data);
    }
    
    const list = mockDB.get<Developer>("developers");
    const idx = list.findIndex((d) => d.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...developer, updatedAt };
      mockDB.save("developers", list);
      return list[idx];
    }
    throw new Error("Developer not found");
  },

  async deleteDeveloper(id: string): Promise<boolean> {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const { error } = await supabase.from("developers").delete().eq("id", toUUID(id));
      if (error) {
        console.error("Supabase deleteDeveloper error:", error.message);
        throw new Error(error.message);
      }
      return true;
    }
    const list = mockDB.get<Developer>("developers");
    mockDB.save("developers", list.filter((d) => d.id !== id));
    return true;
  },

  async getCommunities(filters?: { slug?: string; isFeatured?: boolean; search?: string; id?: string; ids?: string[] }): Promise<Community[]> {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      let query = supabase.from("communities").select("*");
      if (filters) {
        if (filters.slug) query = query.eq("slug", filters.slug);
        if (filters.isFeatured !== undefined) query = query.eq("is_featured", filters.isFeatured);
        if (filters.id) query = query.eq("id", toUUID(filters.id));
        if (filters.ids && filters.ids.length > 0) query = query.in("id", filters.ids.map(toUUID));
        if (filters.search) {
          const q = `%${filters.search}%`;
          query = query.or(`name.ilike.${q},description.ilike.${q}`);
        }
      }
      const { data, error } = await query;
      if (!error && data) {
        return (data as any[]).map(mapCommunityFromDB);
      }
      if (error) console.error("Supabase getCommunities error:", error.message);
    }
    let list = mockDB.get<Community>("communities").map(c => ({
      ...c,
      bannerUrl: mapPngToWebp(c.bannerUrl)
    }));
    if (filters) {
      if (filters.slug) list = list.filter(c => c.slug === filters.slug);
      if (filters.isFeatured !== undefined) list = list.filter(c => c.isFeatured === filters.isFeatured);
      if (filters.id) list = list.filter(c => c.id === filters.id);
      if (filters.ids && filters.ids.length > 0) list = list.filter(c => filters.ids!.includes(c.id));
      if (filters.search) {
        const q = filters.search.toLowerCase();
        list = list.filter(c => c.name.toLowerCase().includes(q) || (c.description && c.description.toLowerCase().includes(q)));
      }
    }
    return list;
  },

  async createCommunity(community: Omit<Community, "id" | "createdAt" | "updatedAt">): Promise<Community> {
    const id = crypto.randomUUID();
    const newRecord: Community = { ...community, id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const dbRecord = mapCommunityToDB(newRecord);
      const { error } = await supabase.from("communities").insert(dbRecord);
      if (error) {
        console.error("Supabase createCommunity error:", error.message);
        throw new Error(error.message);
      }
      return newRecord;
    }
    
    const list = mockDB.get<Community>("communities");
    list.unshift(newRecord);
    mockDB.save("communities", list);
    return newRecord;
  },

  async updateCommunity(id: string, community: Partial<Community>): Promise<Community> {
    const updatedAt = new Date().toISOString();
    
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const dbId = toUUID(id);
      const dbPatch: any = {};
      if (community.name !== undefined) dbPatch.name = community.name;
      if (community.slug !== undefined) dbPatch.slug = community.slug;
      if (community.description !== undefined) dbPatch.description = community.description;
      if (community.bannerUrl !== undefined) dbPatch.banner_url = community.bannerUrl;
      if (community.coordinates !== undefined) dbPatch.coordinates = community.coordinates;
      if (community.isFeatured !== undefined) dbPatch.is_featured = community.isFeatured;
      dbPatch.updated_at = updatedAt;
      
      const { error, data } = await supabase.from("communities").update(dbPatch).eq("id", dbId).select().single();
      if (error) {
        console.error("Supabase updateCommunity error:", error.message);
        throw new Error(error.message);
      }
      return mapCommunityFromDB(data);
    }
    
    const list = mockDB.get<Community>("communities");
    const idx = list.findIndex((c) => c.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...community, updatedAt };
      mockDB.save("communities", list);
      return list[idx];
    }
    throw new Error("Community not found");
  },

  async deleteCommunity(id: string): Promise<boolean> {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const { error } = await supabase.from("communities").delete().eq("id", toUUID(id));
      if (error) {
        console.error("Supabase deleteCommunity error:", error.message);
        throw new Error(error.message);
      }
      return true;
    }
    const list = mockDB.get<Community>("communities");
    mockDB.save("communities", list.filter((c) => c.id !== id));
    return true;
  },

  async getAgents(filters?: { slug?: string; isFeatured?: boolean; search?: string; id?: string; ids?: string[] }): Promise<Agent[]> {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      let query = supabase.from("agents").select("*");
      if (filters) {
        if (filters.slug) query = query.eq("slug", filters.slug);
        if (filters.isFeatured !== undefined) query = query.eq("is_featured", filters.isFeatured);
        if (filters.id) query = query.eq("id", toUUID(filters.id));
        if (filters.ids && filters.ids.length > 0) query = query.in("id", filters.ids.map(toUUID));
        if (filters.search) {
          const q = `%${filters.search}%`;
          query = query.or(`name.ilike.${q},title.ilike.${q},bio.ilike.${q}`);
        }
      }
      const { data, error } = await query;
      if (!error && data) {
        return (data as any[]).map(mapAgentFromDB);
      }
      if (error) console.error("Supabase getAgents error:", error.message);
    }
    let list = mockDB.get<Agent>("agents");
    if (filters) {
      if (filters.slug) list = list.filter(a => a.slug === filters.slug);
      if (filters.isFeatured !== undefined) list = list.filter(a => a.isFeatured === filters.isFeatured);
      if (filters.id) list = list.filter(a => a.id === filters.id);
      if (filters.ids && filters.ids.length > 0) list = list.filter(a => filters.ids!.includes(a.id));
      if (filters.search) {
        const q = filters.search.toLowerCase();
        list = list.filter(a =>
          a.name.toLowerCase().includes(q) ||
          a.title.toLowerCase().includes(q) ||
          (a.bio && a.bio.toLowerCase().includes(q))
        );
      }
    }
    return list;
  },

  async createAgent(agent: Omit<Agent, "id" | "createdAt" | "updatedAt">): Promise<Agent> {
    const id = crypto.randomUUID();
    const newRecord: Agent = { ...agent, id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const dbRecord = mapAgentToDB(newRecord);
      const { error } = await supabase.from("agents").insert(dbRecord);
      if (error) {
        console.error("Supabase createAgent error:", error.message);
        throw new Error(error.message);
      }
      return newRecord;
    }
    
    const list = mockDB.get<Agent>("agents");
    list.unshift(newRecord);
    mockDB.save("agents", list);
    return newRecord;
  },

  async updateAgent(id: string, agent: Partial<Agent>): Promise<Agent> {
    const updatedAt = new Date().toISOString();
    
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const dbId = toUUID(id);
      const dbPatch: any = {};
      if (agent.name !== undefined) dbPatch.name = agent.name;
      if (agent.slug !== undefined) dbPatch.slug = agent.slug;
      if (agent.title !== undefined) dbPatch.title = agent.title;
      if (agent.email !== undefined) dbPatch.email = agent.email;
      if (agent.phone !== undefined) dbPatch.phone = agent.phone;
      if (agent.whatsapp !== undefined) dbPatch.whatsapp = agent.whatsapp;
      if (agent.avatarUrl !== undefined) dbPatch.avatar_url = agent.avatarUrl;
      if (agent.languages !== undefined) dbPatch.languages = agent.languages;
      if (agent.specialization !== undefined) dbPatch.specialization = agent.specialization;
      if (agent.experienceYears !== undefined) dbPatch.experience_years = agent.experienceYears;
      if (agent.bio !== undefined) dbPatch.bio = agent.bio;
      if (agent.isFeatured !== undefined) dbPatch.is_featured = agent.isFeatured;
      dbPatch.updated_at = updatedAt;
      
      const { error, data } = await supabase.from("agents").update(dbPatch).eq("id", dbId).select().single();
      if (error) {
        console.error("Supabase updateAgent error:", error.message);
        throw new Error(error.message);
      }
      return mapAgentFromDB(data);
    }
    
    const list = mockDB.get<Agent>("agents");
    const idx = list.findIndex((a) => a.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...agent, updatedAt };
      mockDB.save("agents", list);
      return list[idx];
    }
    throw new Error("Agent not found");
  },

  async deleteAgent(id: string): Promise<boolean> {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const { error } = await supabase.from("agents").delete().eq("id", toUUID(id));
      if (error) {
        console.error("Supabase deleteAgent error:", error.message);
        throw new Error(error.message);
      }
      return true;
    }
    const list = mockDB.get<Agent>("agents");
    mockDB.save("agents", list.filter((a) => a.id !== id));
    return true;
  },

  // Blogs CMS CRUD
  async getBlogs(): Promise<BlogPost[]> {
    const res = await this.getBlogsByFilters();
    return res.blogs;
  },

  async getBlogsByFilters(filters?: {
    slug?: string;
    category?: string;
    tag?: string;
    search?: string;
    status?: string;
    isFeaturedArticle?: boolean;
    page?: number;
    limit?: number;
    isSummary?: boolean;
  }): Promise<{ blogs: BlogPost[]; totalCount: number }> {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const selectStr = filters?.isSummary
        ? "id, title, slug, summary, cover_image, author_id, tags, reading_time, published_at, is_published, status, is_featured_article, category, created_at, updated_at"
        : "*";

      let query = supabase.from("blogs").select(selectStr, { count: "exact" });

      if (filters) {
        if (filters.slug) query = query.eq("slug", filters.slug);
        if (filters.category && filters.category !== "All") query = query.eq("category", filters.category);
        if (filters.tag) query = query.contains("tags", [filters.tag]);
        if (filters.status) query = query.eq("status", filters.status);
        if (filters.isFeaturedArticle !== undefined) query = query.eq("is_featured_article", filters.isFeaturedArticle);
        if (filters.search) {
          const q = `%${filters.search}%`;
          query = query.or(`title.ilike.${q},summary.ilike.${q}`);
        }
      }

      // Default sorting: published_at desc
      query = query.order("published_at", { ascending: false, nullsFirst: false }).order("id", { ascending: true });

      if (filters) {
        if (filters.page && filters.limit) {
          const from = (filters.page - 1) * filters.limit;
          const to = from + filters.limit - 1;
          query = query.range(from, to);
        } else if (filters.limit) {
          query = query.limit(filters.limit);
        }
      }

      const { data, error, count } = await query;
      if (!error && data) {
        return {
          blogs: (data as any[]).map(mapBlogFromDB),
          totalCount: count || data.length,
        };
      }
      if (error) console.error("Supabase getBlogsByFilters error:", error.message);
    }

    // Fallback Mock DB query path
    let list = mockDB.get<BlogPost>("blogs");
    if (filters) {
      if (filters.slug) list = list.filter(b => b.slug === filters.slug);
      if (filters.category && filters.category !== "All") list = list.filter(b => b.category === filters.category);
      if (filters.tag) list = list.filter(b => b.tags && b.tags.includes(filters.tag!));
      if (filters.status) list = list.filter(b => b.status === filters.status);
      if (filters.isFeaturedArticle !== undefined) list = list.filter(b => b.isFeaturedArticle === filters.isFeaturedArticle);
      if (filters.search) {
        const q = filters.search.toLowerCase();
        list = list.filter(b => b.title.toLowerCase().includes(q) || b.summary.toLowerCase().includes(q));
      }
    }

    list.sort((a, b) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime());

    const totalCount = list.length;
    let paginatedList = list;
    if (filters) {
      if (filters.page && filters.limit) {
        const from = (filters.page - 1) * filters.limit;
        paginatedList = list.slice(from, from + filters.limit);
      } else if (filters.limit) {
        paginatedList = list.slice(0, filters.limit);
      }
    }

    return {
      blogs: paginatedList,
      totalCount,
    };
  },

  async createBlog(blog: Omit<BlogPost, "id" | "createdAt" | "updatedAt">): Promise<BlogPost> {
    const id = crypto.randomUUID();
    const newRecord: BlogPost = { ...blog, id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const dbRecord = mapBlogToDB(newRecord);
      const { error } = await supabase.from("blogs").insert(dbRecord);
      if (error) {
        console.error("Supabase createBlog error:", error.message);
        throw new Error(error.message);
      }
      return newRecord;
    }
    
    const list = mockDB.get<BlogPost>("blogs");
    list.unshift(newRecord);
    mockDB.save("blogs", list);
    return newRecord;
  },

  async updateBlog(id: string, blog: Partial<BlogPost>): Promise<BlogPost> {
    const updatedAt = new Date().toISOString();
    
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const dbId = toUUID(id);
      const dbPatch: any = {};
      if (blog.title !== undefined) dbPatch.title = blog.title;
      if (blog.slug !== undefined) dbPatch.slug = blog.slug;
      if (blog.summary !== undefined) dbPatch.summary = blog.summary;
      if (blog.content !== undefined) dbPatch.content = blog.content;
      if (blog.coverImage !== undefined) dbPatch.cover_image = blog.coverImage;
      if (blog.gallery !== undefined) dbPatch.gallery = blog.gallery;
      if (blog.authorId !== undefined) dbPatch.author_id = toUUID(blog.authorId);
      if (blog.category !== undefined) dbPatch.category = blog.category;
      if (blog.status !== undefined) dbPatch.status = blog.status;
      if (blog.readingTime !== undefined) dbPatch.reading_time = blog.readingTime;
      if (blog.isFeaturedArticle !== undefined) dbPatch.is_featured_article = blog.isFeaturedArticle;
      if (blog.relatedProperties !== undefined) dbPatch.related_properties = blog.relatedProperties.map(toUUID);
      if (blog.relatedCommunities !== undefined) dbPatch.related_communities = blog.relatedCommunities.map(toUUID);
      if (blog.relatedDevelopers !== undefined) dbPatch.related_developers = blog.relatedDevelopers.map(toUUID);
      if (blog.relatedBlogs !== undefined) dbPatch.related_blogs = blog.relatedBlogs.map(toUUID);
      if (blog.publishedAt !== undefined) dbPatch.published_at = blog.publishedAt;
      if (blog.isPublished !== undefined) dbPatch.is_published = blog.isPublished;
      if (blog.tags !== undefined) dbPatch.tags = blog.tags;
      if (blog.seo !== undefined) dbPatch.seo = blog.seo;
      dbPatch.updated_at = updatedAt;
      
      const { error, data } = await supabase.from("blogs").update(dbPatch).eq("id", dbId).select().single();
      if (error) {
        console.error("Supabase updateBlog error:", error.message);
        throw new Error(error.message);
      }
      return mapBlogFromDB(data);
    }
    
    const list = mockDB.get<BlogPost>("blogs");
    const idx = list.findIndex((b) => b.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...blog, updatedAt };
      mockDB.save("blogs", list);
      return list[idx];
    }
    throw new Error("Blog not found");
  },

  async deleteBlog(id: string): Promise<boolean> {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const { error } = await supabase.from("blogs").delete().eq("id", toUUID(id));
      if (error) {
        console.error("Supabase deleteBlog error:", error.message);
        throw new Error(error.message);
      }
      return true;
    }
    const list = mockDB.get<BlogPost>("blogs");
    mockDB.save("blogs", list.filter((b) => b.id !== id));
    return true;
  },

  // Blog Categories CRUD
  async getBlogCategories(): Promise<BlogCategory[]> {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const { data, error } = await supabase.from("blog_categories").select("*").order("name", { ascending: true });
      if (!error && data) {
        return (data as any[]).map(mapCategoryFromDB);
      }
      if (error) console.error("Supabase getBlogCategories error:", error.message);
    }
    let list = mockDB.get<BlogCategory>("blog_categories");
    if (!list || list.length === 0) {
      const defaults = ["Dubai Real Estate News", "Investment Guides", "Market Insights", "Luxury Lifestyle", "Community Guides", "Interior Design", "Property Tips"];
      list = defaults.map((name, idx) => ({
        id: `cat-${idx + 1}`,
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        createdAt: new Date().toISOString()
      }));
      mockDB.save("blog_categories", list);
    }
    return list;
  },

  async createBlogCategory(name: string, slug: string): Promise<BlogCategory> {
    const id = crypto.randomUUID();
    const newRecord: BlogCategory = { id, name, slug, createdAt: new Date().toISOString() };
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const { error } = await supabase.from("blog_categories").insert({
        id: toUUID(id),
        name,
        slug,
        created_at: newRecord.createdAt
      });
      if (error) {
        console.error("Supabase createBlogCategory error:", error.message);
        throw new Error(error.message);
      }
      return newRecord;
    }
    const list = mockDB.get<BlogCategory>("blog_categories");
    list.push(newRecord);
    mockDB.save("blog_categories", list);
    return newRecord;
  },

  async updateBlogCategory(id: string, name: string, slug: string): Promise<BlogCategory> {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const { error, data } = await supabase.from("blog_categories").update({ name, slug }).eq("id", toUUID(id)).select().single();
      if (error) {
        console.error("Supabase updateBlogCategory error:", error.message);
        throw new Error(error.message);
      }
      return mapCategoryFromDB(data);
    }
    const list = mockDB.get<BlogCategory>("blog_categories");
    const idx = list.findIndex((c) => c.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], name, slug };
      mockDB.save("blog_categories", list);
      return list[idx];
    }
    throw new Error("Category not found");
  },

  async deleteBlogCategory(id: string): Promise<boolean> {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const { error } = await supabase.from("blog_categories").delete().eq("id", toUUID(id));
      if (error) {
        console.error("Supabase deleteBlogCategory error:", error.message);
        throw new Error(error.message);
      }
      return true;
    }
    const list = mockDB.get<BlogCategory>("blog_categories");
    mockDB.save("blog_categories", list.filter((c) => c.id !== id));
    return true;
  },

  // Testimonials CRUD
  async getTestimonials(): Promise<Testimonial[]> {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const { data, error } = await supabase.from("testimonials").select("*");
      if (!error && data) {
        return (data as any[]).map(mapTestimonialFromDB);
      }
      if (error) console.error("Supabase getTestimonials error:", error.message);
    }
    return mockDB.get<Testimonial>("testimonials");
  },

  async createTestimonial(testimonial: Omit<Testimonial, "id" | "createdAt">): Promise<Testimonial> {
    const id = crypto.randomUUID();
    const newRecord: Testimonial = { ...testimonial, id, createdAt: new Date().toISOString() };
    
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const dbRecord = mapTestimonialToDB(newRecord);
      const { error } = await supabase.from("testimonials").insert(dbRecord);
      if (error) {
        console.error("Supabase createTestimonial error:", error.message);
        throw new Error(error.message);
      }
      return newRecord;
    }
    
    const list = mockDB.get<Testimonial>("testimonials");
    list.unshift(newRecord);
    mockDB.save("testimonials", list);
    return newRecord;
  },

  async updateTestimonial(id: string, testimonial: Partial<Testimonial>): Promise<Testimonial> {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const dbId = toUUID(id);
      const dbPatch: any = {};
      if (testimonial.clientName !== undefined) dbPatch.client_name = testimonial.clientName;
      if (testimonial.clientTitle !== undefined) dbPatch.client_title = testimonial.clientTitle;
      if (testimonial.rating !== undefined) dbPatch.rating = testimonial.rating;
      if (testimonial.content !== undefined) dbPatch.content = testimonial.content;
      if (testimonial.avatarUrl !== undefined) dbPatch.avatar_url = testimonial.avatarUrl;
      if (testimonial.isFeatured !== undefined) dbPatch.is_featured = testimonial.isFeatured;
      
      const { error, data } = await supabase.from("testimonials").update(dbPatch).eq("id", dbId).select().single();
      if (error) {
        console.error("Supabase updateTestimonial error:", error.message);
        throw new Error(error.message);
      }
      return mapTestimonialFromDB(data);
    }
    
    const list = mockDB.get<Testimonial>("testimonials");
    const idx = list.findIndex((t) => t.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...testimonial };
      mockDB.save("testimonials", list);
      return list[idx];
    }
    throw new Error("Testimonial not found");
  },

  async deleteTestimonial(id: string): Promise<boolean> {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const { error } = await supabase.from("testimonials").delete().eq("id", toUUID(id));
      if (error) {
        console.error("Supabase deleteTestimonial error:", error.message);
        throw new Error(error.message);
      }
      return true;
    }
    const list = mockDB.get<Testimonial>("testimonials");
    mockDB.save("testimonials", list.filter((t) => t.id !== id));
    return true;
  },

  // Leads CRM CRUD
  async getLeads(): Promise<Lead[]> {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const { data, error } = await supabase.from("leads").select("*");
      if (!error && data) {
        return (data as any[]).map(mapLeadFromDB);
      }
      if (error) console.error("Supabase getLeads error:", error.message);
    }
    return mockDB.get<Lead>("leads");
  },

  async createLead(lead: Omit<Lead, "id" | "createdAt" | "updatedAt">): Promise<Lead> {
    const id = crypto.randomUUID();
    const newRecord: Lead = { ...lead, id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const dbRecord = mapLeadToDB(newRecord);
      const { error } = await supabase.from("leads").insert(dbRecord);
      if (error) {
        console.error("Supabase createLead error:", error.message);
        throw new Error(error.message);
      }
      return newRecord;
    }
    
    const list = mockDB.get<Lead>("leads");
    list.unshift(newRecord);
    mockDB.save("leads", list);
    return newRecord;
  },

  async updateLead(id: string, lead: Partial<Lead>): Promise<Lead> {
    const updatedAt = new Date().toISOString();
    
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const dbId = toUUID(id);
      const dbPatch: any = {};
      if (lead.firstName !== undefined) dbPatch.first_name = lead.firstName;
      if (lead.lastName !== undefined) dbPatch.last_name = lead.lastName;
      if (lead.email !== undefined) dbPatch.email = lead.email;
      if (lead.phone !== undefined) dbPatch.phone = lead.phone;
      if (lead.source !== undefined) dbPatch.source = lead.source;
      if (lead.status !== undefined) dbPatch.status = lead.status;
      if (lead.propertyInterestId !== undefined) dbPatch.property_interest_id = lead.propertyInterestId ? toUUID(lead.propertyInterestId) : null;
      if (lead.notes !== undefined) dbPatch.notes = lead.notes;
      dbPatch.updated_at = updatedAt;
      
      const { error, data } = await supabase.from("leads").update(dbPatch).eq("id", dbId).select().single();
      if (error) {
        console.error("Supabase updateLead error:", error.message);
        throw new Error(error.message);
      }
      return data as Lead;
    }
    
    const list = mockDB.get<Lead>("leads");
    const idx = list.findIndex((l) => l.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...lead, updatedAt };
      mockDB.save("leads", list);
      return list[idx];
    }
    throw new Error("Lead not found");
  },

  async deleteLead(id: string): Promise<boolean> {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const { error } = await supabase.from("leads").delete().eq("id", toUUID(id));
      if (error) {
        console.error("Supabase deleteLead error:", error.message);
        throw new Error(error.message);
      }
      return true;
    }
    const list = mockDB.get<Lead>("leads");
    mockDB.save("leads", list.filter((l) => l.id !== id));
    return true;
  },

  // Appointments CRUD
  async getAppointments(): Promise<Appointment[]> {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const { data, error } = await supabase.from("appointments").select("*");
      if (!error && data) {
        return (data as any[]).map(mapAppointmentFromDB);
      }
      if (error) console.error("Supabase getAppointments error:", error.message);
    }
    return mockDB.get<Appointment>("appointments");
  },

  async createAppointment(appointment: Omit<Appointment, "id" | "createdAt" | "updatedAt">): Promise<Appointment> {
    const id = crypto.randomUUID();
    const newRecord: Appointment = { ...appointment, id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const dbRecord = mapAppointmentToDB(newRecord);
      const { error } = await supabase.from("appointments").insert(dbRecord);
      if (error) {
        console.error("Supabase createAppointment error:", error.message);
        throw new Error(error.message);
      }
      return newRecord;
    }
    
    const list = mockDB.get<Appointment>("appointments");
    list.unshift(newRecord);
    mockDB.save("appointments", list);
    return newRecord;
  },

  async updateAppointment(id: string, appointment: Partial<Appointment>): Promise<Appointment> {
    const updatedAt = new Date().toISOString();
    
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const dbId = toUUID(id);
      const dbPatch: any = {};
      if (appointment.leadId !== undefined) dbPatch.lead_id = toUUID(appointment.leadId);
      if (appointment.propertyId !== undefined) dbPatch.property_id = appointment.propertyId ? toUUID(appointment.propertyId) : null;
      if (appointment.agentId !== undefined) dbPatch.agent_id = toUUID(appointment.agentId);
      if (appointment.appointmentDate !== undefined) dbPatch.appointment_date = appointment.appointmentDate;
      if (appointment.type !== undefined) dbPatch.type = appointment.type;
      if (appointment.status !== undefined) dbPatch.status = appointment.status;
      if (appointment.notes !== undefined) dbPatch.notes = appointment.notes;
      dbPatch.updated_at = updatedAt;
      
      const { error, data } = await supabase.from("appointments").update(dbPatch).eq("id", dbId).select().single();
      if (error) {
        console.error("Supabase updateAppointment error:", error.message);
        throw new Error(error.message);
      }
      return data as Appointment;
    }
    
    const list = mockDB.get<Appointment>("appointments");
    const idx = list.findIndex((a) => a.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...appointment, updatedAt };
      mockDB.save("appointments", list);
      return list[idx];
    }
    throw new Error("Appointment not found");
  },

  async deleteAppointment(id: string): Promise<boolean> {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const { error } = await supabase.from("appointments").delete().eq("id", toUUID(id));
      if (error) {
        console.error("Supabase deleteAppointment error:", error.message);
        throw new Error(error.message);
      }
      return true;
    }
    const list = mockDB.get<Appointment>("appointments");
    mockDB.save("appointments", list.filter((a) => a.id !== id));
    return true;
  },

  // Subscribers CRM CRUD
  async getSubscribers(): Promise<string[]> {
    if (typeof window === "undefined") return [];
    return JSON.parse(localStorage.getItem("luxespace_subscribers") || '["luxespace.subscriber@gmail.com"]');
  },

  async addSubscriber(email: string): Promise<boolean> {
    const list = await this.getSubscribers();
    if (!list.includes(email)) {
      list.unshift(email);
      localStorage.setItem("luxespace_subscribers", JSON.stringify(list));
      return true;
    }
    return false;
  },

  async deleteSubscriber(email: string): Promise<boolean> {
    const list = await this.getSubscribers();
    const updated = list.filter((e) => e !== email);
    localStorage.setItem("luxespace_subscribers", JSON.stringify(updated));
    return true;
  },

  // Dynamic Settings CRUD
  async getSettings(): Promise<Record<string, string>> {
    if (typeof window === "undefined") return { companyName: "Luxespace Properties", email: "luxespace@gmail.com", phone: "9745334644" };
    return JSON.parse(localStorage.getItem("luxespace_settings") || '{"companyName": "Luxespace Properties", "email": "luxespace@gmail.com", "phone": "9745334644"}');
  },

  async updateSettings(settings: Record<string, string>): Promise<Record<string, string> | undefined> {
    if (typeof window === "undefined") return;
    const current = await this.getSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem("luxespace_settings", JSON.stringify(updated));
    return updated;
  },

  // FAQs CRUD
  async getFAQs(): Promise<FAQItem[]> {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const { data, error } = await supabase.from("faqs").select("*");
      if (!error && data) {
        return (data as any[]).map(mapFAQFromDB);
      }
      if (error) console.error("Supabase getFAQs error:", error.message);
    }
    return mockDB.get<FAQItem>("faqs");
  },

  // Awards CRUD
  async getAwards(): Promise<AwardItem[]> {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const { data, error } = await supabase.from("awards").select("*");
      if (!error && data) {
        return (data as any[]).map(mapAwardFromDB);
      }
      if (error) console.error("Supabase getAwards error:", error.message);
    }
    return mockDB.get<AwardItem>("awards");
  },

  // Partners CRUD
  async getPartners(): Promise<PartnerItem[]> {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const { data, error } = await supabase.from("partners").select("*");
      if (!error && data) {
        return (data as any[]).map(mapPartnerFromDB);
      }
      if (error) console.error("Supabase getPartners error:", error.message);
    }
    return mockDB.get<PartnerItem>("partners");
  },

  // Downloads CRUD
  async getDownloads(): Promise<DownloadItem[]> {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const { data, error } = await supabase.from("downloads").select("*");
      if (!error && data) {
        return (data as any[]).map(mapDownloadFromDB);
      }
      if (error) console.error("Supabase getDownloads error:", error.message);
    }
    return mockDB.get<DownloadItem>("downloads");
  },

  // Lifestyle Articles CRUD
  async getLifestyle(): Promise<LifestyleArticle[]> {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const { data, error } = await supabase.from("lifestyle").select("*");
      if (!error && data) {
        return (data as any[]).map(mapLifestyleFromDB);
      }
      if (error) console.error("Supabase getLifestyle error:", error.message);
    }
    return mockDB.get<LifestyleArticle>("lifestyle");
  },

  // Newsletter Subscriptions
  async subscribeToNewsletter(email: string): Promise<boolean> {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const { error } = await supabase.from("newsletter_subscribers").insert({ email, status: 'active' });
      if (error) {
        console.error("Supabase subscribeToNewsletter error:", error.message);
        throw new Error(error.message);
      }
      return true;
    }
    const list = mockDB.get<any>("newsletter_subscribers") || [];
    if (!list.some((s: any) => s.email === email)) {
      list.push({ id: crypto.randomUUID(), email, status: 'active', createdAt: new Date().toISOString() });
      mockDB.save("newsletter_subscribers", list);
    }
    return true;
  },

  async getNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const { data, error } = await supabase.from("newsletter_subscribers").select("*").order("created_at", { ascending: false });
      if (!error && data) {
        return (data as any[]).map(d => ({
          id: fromUUID(d.id),
          email: d.email,
          status: d.status,
          createdAt: d.created_at
        }));
      }
      if (error) console.error("Supabase getNewsletterSubscribers error:", error.message);
    }
    const list = mockDB.get<any>("newsletter_subscribers") || [];
    return list.map((d: any) => ({
      id: d.id,
      email: d.email,
      status: d.status,
      createdAt: d.createdAt
    }));
  },

  async deleteNewsletterSubscriber(id: string): Promise<boolean> {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const { error } = await supabase.from("newsletter_subscribers").delete().eq("id", toUUID(id));
      if (error) {
        console.error("Supabase deleteNewsletterSubscriber error:", error.message);
        throw new Error(error.message);
      }
      return true;
    }
    const list = mockDB.get<any>("newsletter_subscribers") || [];
    mockDB.save("newsletter_subscribers", list.filter((s: any) => s.id !== id));
    return true;
  }
};
export default db;

export {
  MOCK_DEVELOPERS,
  MOCK_COMMUNITIES,
  MOCK_AGENTS,
  MOCK_PROPERTIES,
  MOCK_BLOGS,
  MOCK_FAQS,
  MOCK_TESTIMONIALS,
  MOCK_AWARDS,
  MOCK_PARTNERS,
  MOCK_DOWNLOADS,
  MOCK_LIFESTYLE
};
