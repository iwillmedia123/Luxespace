import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function run() {
  const seedPath = path.join(__dirname, "../supabase/seed.sql");
  if (!fs.existsSync(seedPath)) {
    console.error("seed.sql not found!");
    process.exit(1);
  }

  const content = fs.readFileSync(seedPath, "utf-8");
  
  // We will parse the content by INSERT INTO blocks
  const blocks = content.split("INSERT INTO ");
  
  // The first block contains "BEGIN;" and developers, communities, agents inserts
  // Let's split the properties block
  const propertiesBlock = blocks.find(b => b.startsWith("public.properties"));
  
  if (!propertiesBlock) {
    console.error("Properties block not found in seed.sql!");
    process.exit(1);
  }

  // Parse the properties values
  const propertiesHeader = "INSERT INTO " + propertiesBlock.substring(0, propertiesBlock.indexOf("VALUES") + 6) + "\n";
  const valuesStartIdx = propertiesBlock.indexOf("VALUES") + 6;
  const conflictIdx = propertiesBlock.indexOf("ON CONFLICT");
  
  const valuesText = propertiesBlock.substring(valuesStartIdx, conflictIdx).trim();
  const conflictText = propertiesBlock.substring(conflictIdx).trim();
  
  // Split values by ")," or similar to get individual records
  // Since each record ends with "),", we can split by "),\n" or similar
  const records = valuesText.split(/\),\s*\n/);
  
  console.log(`Found ${records.length} property records. Splitting...`);
  
  const chunkSize = 25;
  const propertyChunks: string[] = [];
  
  for (let i = 0; i < records.length; i += chunkSize) {
    const chunk = records.slice(i, i + chunkSize);
    // Reconstruct values list
    let chunkText = chunk.join("),\n");
    if (!chunkText.endsWith(")")) chunkText += ")";
    
    const sql = `BEGIN;\n\n${propertiesHeader}${chunkText}\n${conflictText}\n\nCOMMIT;`;
    propertyChunks.push(sql);
  }

  // Write properties chunks
  propertyChunks.forEach((sql, index) => {
    const filePath = path.join(__dirname, `../supabase/seed_properties_${index + 1}.sql`);
    fs.writeFileSync(filePath, sql, "utf-8");
    console.log(`Wrote properties chunk ${index + 1} to ${filePath}`);
  });

  // Extract the remaining tables block (everything after properties)
  const restBlocks = blocks.filter(b => !b.startsWith("public.properties") && !b.startsWith("BEGIN") && !b.startsWith("public.developers") && !b.startsWith("public.communities") && !b.startsWith("public.agents"));
  
  const restSQL = "BEGIN;\n\n" + restBlocks.map(b => "INSERT INTO " + b).join("\n\n") + "\n\nCOMMIT;";
  
  // Clean up any double commits/begins from the join
  const cleanRestSQL = restSQL
    .replace(/COMMIT;\s*;?\s*INSERT INTO/g, "INSERT INTO")
    .replace(/BEGIN;\s*;?\s*INSERT INTO/g, "INSERT INTO")
    .replace(/COMMIT;\s*COMMIT;/g, "COMMIT;");

  const restFilePath = path.join(__dirname, "../supabase/seed_rest.sql");
  fs.writeFileSync(restFilePath, cleanRestSQL, "utf-8");
  console.log(`Wrote rest of tables to ${restFilePath}`);
}

run();
