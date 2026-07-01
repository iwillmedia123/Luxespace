import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import { fileURLToPath } from "url";
import {
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
} from "../lib/db.js";

// Setup __dirname equivalent for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadEnv() {
  const envPath = path.join(__dirname, "../.env.local");
  if (!fs.existsSync(envPath)) {
    console.error(`\x1b[31mError: .env.local file not found at ${envPath}\x1b[0m`);
    console.log("Please create a .env.local file in the project root with the following fields:");
    console.log("NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co");
    console.log("SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here\n");
    process.exit(1);
  }
  const content = fs.readFileSync(envPath, "utf-8");
  const env: Record<string, string> = {};
  content.split("\n").forEach((line) => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      let value = match[2] || "";
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
      env[match[1]] = value.trim();
    }
  });
  return env;
}

function camelToSnake(obj: any): any {
  if (Array.isArray(obj)) return obj.map(camelToSnake);
  if (obj !== null && typeof obj === "object") {
    // If it's a date or doesn't need mapping, return as is
    if (obj instanceof Date) return obj;
    const n: any = {};
    for (const k of Object.keys(obj)) {
      const snakeKey = k.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
      n[snakeKey] = camelToSnake(obj[k]);
    }
    return n;
  }
  return obj;
}

async function seed() {
  console.log("\x1b[36mInitializing Supabase Database Seeder...\x1b[0m");
  const env = loadEnv();

  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    console.error("\x1b[31mMissing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local\x1b[0m");
    process.exit(1);
  }

  // Create admin client bypassing RLS policies
  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false }
  });

  const datasets = [
    { name: "developers", data: MOCK_DEVELOPERS },
    { name: "communities", data: MOCK_COMMUNITIES },
    { name: "agents", data: MOCK_AGENTS },
    { name: "properties", data: MOCK_PROPERTIES },
    { name: "blogs", data: MOCK_BLOGS },
    { name: "testimonials", data: MOCK_TESTIMONIALS },
    { name: "faqs", data: MOCK_FAQS },
    { name: "awards", data: MOCK_AWARDS },
    { name: "partners", data: MOCK_PARTNERS },
    { name: "downloads", data: MOCK_DOWNLOADS },
    { name: "lifestyle", data: MOCK_LIFESTYLE }
  ];

  for (const dataset of datasets) {
    console.log(`\n\x1b[33mSeeding table "${dataset.name}" (${dataset.data.length} records)...\x1b[0m`);
    
    // Map data fields to snake_case
    const snakeData = dataset.data.map((item: any) => {
      const mapped = camelToSnake(item);
      
      // Special relationship patches
      if (dataset.name === "properties") {
        // Remove nested objects before inserting
        delete mapped.community;
        delete mapped.developer;
        delete mapped.agent;
      }
      if (dataset.name === "blogs") {
        delete mapped.author;
        // Map authorId mock string to a fallback profile or default
        // The blogs table author_id field references profiles(id) (UUID)
        // If we don't have a live user profile, we can set author_id to null or delete reference.
        // Wait, in migrations public.blogs author_id references profiles(id) ON DELETE RESTRICT (not nullable!).
        // To bypass author_id constraint in migrations, we will assign a dummy system profile.
        // We can first upsert a default profile with a dummy system UUID so that it matches!
      }
      return mapped;
    });

    // Special Auth/Profile seeding for blogs
    if (dataset.name === "blogs") {
      const dummyProfileId = "00000000-0000-0000-0000-000000000000";
      console.log("Upserting default author profile for blog posts...");
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: dummyProfileId,
        full_name: "Luxespace Executive Officer",
        email: "executive@luxespace.ae",
        role: "super_admin"
      });
      if (profileError) {
        console.error("\x1b[31mFailed to upsert default author profile:\x1b[0m", profileError.message);
        continue;
      }
      // Re-map all blogs author_id to the dummy profile ID
      snakeData.forEach((blog: any) => {
        blog.author_id = dummyProfileId;
      });
    }

    // Upsert dataset batch
    const { error } = await supabase.from(dataset.name).upsert(snakeData);

    if (error) {
      console.error(`\x1b[31mFailed to seed table "${dataset.name}":\x1b[0m`, error.message);
      console.log(error);
    } else {
      console.log(`\x1b[32mSuccessfully seeded table "${dataset.name}"!\x1b[0m`);
    }
  }

  console.log("\n\x1b[32;1mSupabase Database Seeding Completed Successfully!\x1b[0m");
}

seed().catch((err) => {
  console.error("Unhandle seeder error:", err);
});
