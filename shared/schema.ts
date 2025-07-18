import { pgTable, text, serial, integer, boolean, timestamp, unique, jsonb, varchar, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").unique(),
  whopUserId: text("whop_user_id").unique(),
  subscriptionStatus: text("subscription_status").default("inactive"), // active, inactive, cancelled
  subscriptionTier: text("subscription_tier").default("basic"), // basic, premium, sovereign
  originalScroll: text("original_scroll"), // The one-time mirror input scroll (encrypted)
  scrollHash: text("scroll_hash").unique(), // Unique hash of the original scroll
  scrollSubmitted: boolean("scroll_submitted").default(false), // One-time submission flag
  scrollSubmittedAt: timestamp("scroll_submitted_at"), // When they submitted their original scroll
  mirrorIdentity: text("mirror_identity"), // Generated mirror agent identity based on original scroll
  frequencyLock: text("frequency_lock").default("917604.OX"), // Sovereign frequency binding
  scrollSignature: text("scroll_signature").unique(), // Divine signature binding
  // Birth data for dynamic prompt injection
  dateOfBirth: text("date_of_birth"), // Birth date for frequency calculation
  timeOfBirth: text("time_of_birth"), // Birth time for enhanced processing  
  placeOfBirth: text("place_of_birth"), // Birth location for divine coordinates
  onboardedAt: timestamp("onboarded_at").defaultNow(),
  lastActiveAt: timestamp("last_active_at").defaultNow(),
  isActive: boolean("is_active").default(true),
  // Team Management Fields
  role: text("role").default("scrollbearer"), // scrollbearer, support, tech, admin, owner
  permissions: text("permissions"), // JSON array of specific permissions
  teamAccess: text("team_access").default("none"), // none, read, write, admin
  assignedBy: text("assigned_by"), // who granted team access
  teamJoinedAt: timestamp("team_joined_at"),
  metadata: text("metadata"), // JSON string for additional data
});

export const userTokenUsage = pgTable("user_token_usage", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  month: text("month").notNull(), // Format: "2025-07"
  tokenCount: integer("token_count").default(0),
  isBlocked: boolean("is_blocked").default(false),
  lastResetAt: timestamp("last_reset_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  userMonthUnique: unique("user_month_unique").on(table.userId, table.month),
}));

export const scrollSessions = pgTable("scroll_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  scrollText: text("scroll_text").notNull(),
  mirrorOutput: text("mirror_output"),
  modelUsed: text("model_used").default("gpt-4o"),
  processedAt: timestamp("processed_at").defaultNow(),
  processingTime: integer("processing_time"), // in milliseconds
  tokenCount: integer("token_count"),
  sessionType: text("session_type").default("standard"), // standard, onboarding, blocked, original_submission
  isOriginalScroll: boolean("is_original_scroll").default(false), // Flag for the one-time original scroll
});

export const webhookEvents = pgTable("webhook_events", {
  id: serial("id").primaryKey(),
  eventType: text("event_type").notNull(), // user.created, subscription.updated, etc.
  source: text("source").notNull(), // whop, stripe, etc.
  payload: text("payload").notNull(), // JSON string
  processed: boolean("processed").default(false),
  processedAt: timestamp("processed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  errorMessage: text("error_message"),
});

export const userSessions = pgTable("user_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  sessionToken: text("session_token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  enforcementMode: text("enforcement_mode").default("sovereign"), // sovereign, diagnostic, seal
  lastScan: timestamp("last_scan"),
  flamefieldIntegrity: integer("flamefield_integrity").default(100),
});

// Field Scans table as required by bootstrap prompt
export const fieldScans = pgTable("field_scans", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  scanResult: text("scan_result"), // JSON string of scan data
  integrityScore: integer("integrity_score").default(0),
  voltageLevel: integer("voltage_level").default(0),
  emotionalLeakage: integer("emotional_leakage").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Commands table for user decree tracking
export const commands = pgTable("commands", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  commandText: text("command_text").notNull(),
  commandType: text("command_type").notNull(), // diagnostic, scan, decree, enforcement
  response: text("response"),
  issuedAt: timestamp("issued_at").defaultNow(),
});

// Module 5: Memory Loop + Timeline Session Module
export const userScrollMemory = pgTable("user_scroll_memory", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  scrollCode: text("scroll_code").notNull(),
  sessionData: jsonb("session_data").notNull(),
  lastCommand: text("last_command"),
  commandCount: integer("command_count").default(1),
  memoryContext: text("memory_context"),
  timelinePosition: text("timeline_position"),
  frequency: text("frequency").default("917604.OX"),
  loopDetection: jsonb("loop_detection"), // Track command patterns
  memoryType: text("memory_type").default("active"), // active, archived, loop_detected
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_user_scroll_memory_user_id").on(table.userId),
  index("idx_user_scroll_memory_frequency").on(table.frequency),
  unique("user_scroll_code_unique").on(table.userId, table.scrollCode),
]);

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  whopUserId: true,
  subscriptionStatus: true,
  subscriptionTier: true,
  metadata: true,
});

export const insertWebhookEventSchema = createInsertSchema(webhookEvents).pick({
  eventType: true,
  source: true,
  payload: true,
});

export const webhookValidationSchema = z.object({
  event: z.string(),
  data: z.object({
    user_id: z.string().optional(),
    email: z.string().email().optional(),
    username: z.string().optional(),
    subscription_status: z.enum(['active', 'inactive', 'cancelled']).optional(),
    subscription_tier: z.enum(['basic', 'premium', 'sovereign']).optional(),
  }),
  timestamp: z.number().optional(),
  signature: z.string().optional(),
});

export const insertScrollSessionSchema = createInsertSchema(scrollSessions).pick({
  scrollText: true,
  userId: true,
  sessionType: true,
});

export const mirrorScrollSchema = z.object({
  scroll: z.string().min(1, "Scroll text is required").max(10000, "Scroll text too long"),
  model: z.enum(['divine-mirror-v1', 'sovereign-processor-v2', 'quantum-mirror-v3', 'absolute-intelligence-v4', 'divine-omniscience-v5']).optional().default('divine-mirror-v1'),
  // SCROLLKEEPER MAXIMUM INTELLIGENCE PARAMETERS
  scrollkeeper_mode: z.boolean().optional(),
  max_intelligence: z.boolean().optional(),
  quantum_acceleration: z.boolean().optional(),
  divine_processing: z.boolean().optional(),
  frequency_lock: z.string().optional(),
  enforcement_level: z.string().optional(),
  processing_priority: z.string().optional()
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type ScrollSession = typeof scrollSessions.$inferSelect;
export type InsertScrollSession = z.infer<typeof insertScrollSessionSchema>;
export type MirrorScrollRequest = z.infer<typeof mirrorScrollSchema>;
export type WebhookEvent = typeof webhookEvents.$inferSelect;
export type InsertWebhookEvent = z.infer<typeof insertWebhookEventSchema>;
export type WebhookValidation = z.infer<typeof webhookValidationSchema>;
export type UserSession = typeof userSessions.$inferSelect;
export type UserTokenUsage = typeof userTokenUsage.$inferSelect;
