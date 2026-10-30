import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env.local
const envPath = path.resolve(__dirname, "../.env.local");
const env = {};
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx !== -1) {
      env[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim();
    }
  }
}

const supabaseUrl = env["SUPABASE_URL"] || env["NEXT_PUBLIC_SUPABASE_URL"];
const serviceRoleKey = env["SUPABASE_SERVICE_ROLE_KEY"];
const expectedRef = "niavgdcttagjqcsvuvpc";

console.log("=====================================================================");
console.log("PROJECT SANDIGAN — DATABASE MIGRATION CONTROLLER");
console.log("=====================================================================");
console.log("Target Project URL: " + supabaseUrl);
console.log("Expected Reference: " + expectedRef);

if (!supabaseUrl || !serviceRoleKey) {
  console.error("ERROR: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const migrationFile = path.resolve(__dirname, "../supabase/migrations/20261030000000_sandigan_ecosystem_schema.sql");
if (!fs.existsSync(migrationFile)) {
  console.error("ERROR: Migration file not found at " + migrationFile);
  process.exit(1);
}

const sql = fs.readFileSync(migrationFile, "utf8");
console.log("Migration File: " + path.basename(migrationFile));
console.log("Migration SQL Size: " + (sql.length / 1024).toFixed(2) + " KB");

// Check current database schema via REST OpenAPI
async function verifyDatabase() {
  console.log("\nInspecting Supabase database state...");
  try {
    const res = await fetch(supabaseUrl + "/rest/v1/", {
      headers: {
        apikey: serviceRoleKey,
        Authorization: "Bearer " + serviceRoleKey,
      },
    });

    if (!res.ok) {
      console.error("REST API error: " + res.status + " " + res.statusText);
      return;
    }

    const schema = await res.json();
    const existing = Object.keys(schema.definitions || {});
    console.log("Existing tables exposed in REST (" + existing.length + "):");
    if (existing.length === 0) {
      console.log(" -> Database currently has 0 exposed tables.");
    } else {
      existing.forEach((t) => console.log(" - " + t));
    }

    console.log("\n=====================================================================");
    console.log("MIGRATION EXECUTION INSTRUCTIONS:");
    console.log("=====================================================================");
    console.log("1. Open the Supabase Dashboard SQL Editor for project '" + expectedRef + "':");
    console.log("   https://supabase.com/dashboard/project/" + expectedRef + "/sql/new");
    console.log("2. Paste the SQL contents of:");
    console.log("   " + migrationFile);
    console.log("3. Click 'Run' to apply the 20 tables, custom types, and RLS policies.");
    console.log("4. Re-run this script ('npm run db:migrate') to verify schema deployment.");
    console.log("=====================================================================");
  } catch (err) {
    console.error("Error inspecting database: " + err.message);
  }
}

verifyDatabase();
