import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { users, posts, memories, tags, postTags } from './src/db/schema';

async function runMigrations() {
  const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/biscuitblog';
  
  // For migration, we need a connection that automatically closes
  const migrationClient = postgres(connectionString, { max: 1 });
  const db = drizzle(migrationClient);
  
  try {
    console.log('🔄 Running database migrations...');
    
    // Create tables directly using schema
    await db.execute(`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" serial PRIMARY KEY NOT NULL,
        "email" varchar(255) NOT NULL,
        "name" varchar(255) NOT NULL,
        "avatar" varchar(255),
        "google_id" varchar(255),
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL,
        CONSTRAINT "users_email_unique" UNIQUE("email"),
        CONSTRAINT "users_google_id_unique" UNIQUE("google_id")
      );
    `);
    
    await db.execute(`
      CREATE TABLE IF NOT EXISTS "posts" (
        "id" serial PRIMARY KEY NOT NULL,
        "title" varchar(255) NOT NULL,
        "slug" varchar(255) NOT NULL,
        "excerpt" text,
        "content" text NOT NULL,
        "cover_image" varchar(255),
        "published" boolean DEFAULT false NOT NULL,
        "published_at" timestamp,
        "author_id" integer NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL,
        CONSTRAINT "posts_slug_unique" UNIQUE("slug")
      );
    `);
    
    await db.execute(`
      CREATE TABLE IF NOT EXISTS "memories" (
        "id" serial PRIMARY KEY NOT NULL,
        "title" varchar(255) NOT NULL,
        "description" text,
        "date" timestamp NOT NULL,
        "image" varchar(255),
        "content" text,
        "author_id" integer NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL
      );
    `);
    
    await db.execute(`
      CREATE TABLE IF NOT EXISTS "tags" (
        "id" serial PRIMARY KEY NOT NULL,
        "name" varchar(100) NOT NULL,
        "slug" varchar(100) NOT NULL,
        "color" varchar(7) DEFAULT '#3B82F6' NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL,
        CONSTRAINT "tags_name_unique" UNIQUE("name"),
        CONSTRAINT "tags_slug_unique" UNIQUE("slug")
      );
    `);
    
    await db.execute(`
      CREATE TABLE IF NOT EXISTS "post_tags" (
        "id" serial PRIMARY KEY NOT NULL,
        "post_id" integer NOT NULL,
        "tag_id" integer NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL
      );
    `);
    
    // Add foreign key constraints
    await db.execute(`
      DO $$ BEGIN
        ALTER TABLE "posts" ADD CONSTRAINT "posts_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE cascade;
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
    
    await db.execute(`
      DO $$ BEGIN
        ALTER TABLE "memories" ADD CONSTRAINT "memories_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE cascade;
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
    
    await db.execute(`
      DO $$ BEGIN
        ALTER TABLE "post_tags" ADD CONSTRAINT "post_tags_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE cascade;
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
    
    await db.execute(`
      DO $$ BEGIN
        ALTER TABLE "post_tags" ADD CONSTRAINT "post_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE cascade;
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
    
    console.log('✅ Database migrations completed successfully!');
    
    // Seed some sample data
    console.log('🌱 Seeding sample data...');
    
    // Insert sample tags
    await db.execute(`
      INSERT INTO "tags" ("name", "slug", "color") VALUES 
        ('Technology', 'technology', '#3B82F6'),
        ('Travel', 'travel', '#10B981'),
        ('Food', 'food', '#F59E0B'),
        ('Personal', 'personal', '#8B5CF6'),
        ('Tutorial', 'tutorial', '#EF4444')
      ON CONFLICT ("name") DO NOTHING;
    `);
    
    console.log('✅ Sample data seeded successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await migrationClient.end();
  }
}

// Check if we have a database connection
async function checkDatabaseConnection() {
  const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/biscuitblog';
  
  try {
    const client = postgres(connectionString, { max: 1 });
    await client`SELECT 1`;
    await client.end();
    return true;
  } catch (error) {
    return false;
  }
}

async function main() {
  console.log('🔍 Checking database connection...');
  
  const hasConnection = await checkDatabaseConnection();
  
  if (!hasConnection) {
    console.log('❌ Could not connect to PostgreSQL database.');
    console.log('📋 To set up PostgreSQL:');
    console.log('1. Install PostgreSQL: https://www.postgresql.org/download/');
    console.log('2. Create database: createdb biscuitblog');
    console.log('3. Update DATABASE_URL in .env file');
    console.log('4. Run this script again: npm run migrate');
    process.exit(1);
  }
  
  console.log('✅ Database connection successful!');
  await runMigrations();
}

if (require.main === module) {
  main();
}

export { runMigrations };