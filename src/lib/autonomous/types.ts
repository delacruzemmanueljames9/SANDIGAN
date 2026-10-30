import { z } from "zod";

export const TaskPrioritySchema = z.enum(["low", "normal", "high", "critical"]);
export const TaskStatusSchema = z.enum([
  "pending",
  "in_progress",
  "completed",
  "failed",
  "dead_letter",
  "awaiting_approval",
]);

export const EnqueueTaskSchema = z.object({
  officerId: z.string().min(1, "Officer ID is required"),
  taskType: z.string().min(1, "Task type is required"),
  payload: z.record(z.unknown()).default({}),
  priority: TaskPrioritySchema.default("normal"),
  maxAttempts: z.number().int().min(1).max(10).default(3),
  scheduledFor: z.string().datetime().optional(),
});

export type EnqueueTaskInput = z.infer<typeof EnqueueTaskSchema>;

export const UpdateJobStatusSchema = z.object({
  jobId: z.string().uuid("Invalid job ID format"),
  action: z.enum(["pause", "resume", "trigger"]),
});

export type UpdateJobStatusInput = z.infer<typeof UpdateJobStatusSchema>;

export const ProcessQueueBatchSchema = z.object({
  batchSize: z.number().int().min(1).max(20).default(5),
  officerId: z.string().optional(),
});

export type ProcessQueueBatchInput = z.infer<typeof ProcessQueueBatchSchema>;

export const FounderApprovalActionSchema = z.object({
  approvalId: z.string().uuid("Invalid approval ID"),
  decision: z.enum(["approved", "rejected"]),
  decisionNotes: z.string().max(1000).optional(),
});

export type FounderApprovalActionInput = z.infer<typeof FounderApprovalActionSchema>;
