import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  MOCK_DEVELOPERS,
  MOCK_COMMUNITIES,
  MOCK_AGENTS,
  MOCK_PROPERTIES,
  MOCK_BLOGS,
  MOCK_TESTIMONIALS,
  MOCK_FAQS,
  MOCK_AWARDS,
  MOCK_PARTNERS,
  MOCK_DOWNLOADS,
  MOCK_LIFESTYLE
} from "../lib/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function toUUID(id: string): string {
  if (!id) return id;
  // Check if it's already a valid UUID
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

function escapeSQLValue(val: any, colName?: string): string {
  if (val === null || val === undefined) return "NULL";
  if (typeof val === "boolean") return val ? "TRUE" : "FALSE";
  if (typeof val === "number") return val.toString();
  
  if (Array.isArray(val)) {
    const escapedItems = val.map((item) => {
      const s = item.toString().replace(/"/g, '\\"').replace(/'/g, "''");
      return `"${s}"`;
    });
    return `'{${escapedItems.join(",")}}'`;
  }
  
  if (typeof val === "object") {
    return `'${JSON.stringify(val).replace(/'/g, "''")}'::jsonb`;
  }
  
  const str = val.toString();
  // If this column is a UUID key field, map it
  if (colName && ["id", "developer_id", "community_id", "agent_id", "author_id"].includes(colName)) {
    return `'${toUUID(str)}'`;
  }
  return `'${str.replace(/'/g, "''")}'`;
}

function generateInserts(tableName: string, data: any[], customMapping: Record<string, string> = {}): string {
  if (data.length === 0) return "";
  
  const sample = data[0];
  const columns: string[] = [];
  const keys: string[] = [];

  for (const k of Object.keys(sample)) {
    keys.push(k);
    const colName = customMapping[k] || k.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
    columns.push(colName);
  }

  const valuesLines = data.map((row) => {
    const vals = keys.map((k, idx) => {
      const colName = columns[idx];
      return escapeSQLValue(row[k], colName);
    });
    return `(${vals.join(", ")})`;
  });

  return `INSERT INTO public.${tableName} (${columns.join(", ")})\nVALUES\n${valuesLines.join(",\n")}\nON CONFLICT (id) DO UPDATE SET\n${columns.map(col => `${col} = EXCLUDED.${col}`).join(", ")};`;
}

function generateBlogsInserts(): string {
  const dummyProfileId = "00000000-0000-0000-0000-000000000000";
  
  const profileSQL = `INSERT INTO public.profiles (id, full_name, email, role)
VALUES ('${dummyProfileId}', 'Luxespace Executive Officer', 'executive@luxespace.ae', 'super_admin')
ON CONFLICT (id) DO NOTHING;`;

  const blogsData = MOCK_BLOGS.map(blog => {
    const copy = { ...blog };
    delete (copy as any).author;
    // Map authorId to system dummy admin
    copy.authorId = dummyProfileId;
    return copy;
  });

  const blogsSQL = generateInserts("blogs", blogsData, { authorId: "author_id" });
  return `${profileSQL}\n\n${blogsSQL}`;
}

function generatePropertiesInserts(): string {
  const data = MOCK_PROPERTIES.map(p => {
    const copy = { ...p };
    delete (copy as any).community;
    delete (copy as any).developer;
    delete (copy as any).agent;
    return copy;
  });
  return generateInserts("properties", data);
}

function run() {
  console.log("Generating Seed SQL with UUID mapping...");

  const sqlBlocks: string[] = [];
  sqlBlocks.push("BEGIN;");
  
  // Seeding blocks in order
  sqlBlocks.push(generateInserts("developers", MOCK_DEVELOPERS));
  sqlBlocks.push(generateInserts("communities", MOCK_COMMUNITIES));
  sqlBlocks.push(generateInserts("agents", MOCK_AGENTS));
  sqlBlocks.push(generatePropertiesInserts());
  sqlBlocks.push(generateBlogsInserts());
  sqlBlocks.push(generateInserts("testimonials", MOCK_TESTIMONIALS));
  sqlBlocks.push(generateInserts("faqs", MOCK_FAQS));
  sqlBlocks.push(generateInserts("awards", MOCK_AWARDS));
  sqlBlocks.push(generateInserts("partners", MOCK_PARTNERS));
  sqlBlocks.push(generateInserts("downloads", MOCK_DOWNLOADS));
  sqlBlocks.push(generateInserts("lifestyle", MOCK_LIFESTYLE));

  sqlBlocks.push("COMMIT;");

  const finalSQL = sqlBlocks.join("\n\n");
  const outputPath = path.join(__dirname, "../supabase/seed.sql");
  fs.writeFileSync(outputPath, finalSQL, "utf-8");
  console.log(`Seed SQL successfully generated at: ${outputPath}`);
}

run();
