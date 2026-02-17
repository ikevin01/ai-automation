
export enum StepType {
  TRIGGER = 'TRIGGER',
  AI_TEXT = 'AI_TEXT',
  AI_IMAGE = 'AI_IMAGE',
  TRANSCRIPTION = 'TRANSCRIPTION',
  DECISION = 'DECISION',
  OUTPUT = 'OUTPUT'
}

export interface WorkflowStep {
  id: string;
  type: StepType;
  title: string;
  status?: 'idle' | 'running' | 'completed' | 'error';
  config: {
    prompt?: string;
    model?: string;
    condition?: string;
    aspectRatio?: '1:1' | '16:9' | '9:16';
    systemInstruction?: string;
    temperature?: number;
  };
  output?: any;
  error?: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  status: 'idle' | 'running' | 'completed' | 'error';
  lastRun?: Date;
}

export interface ExecutionLog {
  id: string;
  workflowId: string;
  timestamp: Date;
  status: 'success' | 'failure';
  details: string;
}

export interface PlanLimits {
  textRuns: number | 'unlimited';
  imageRuns: number | 'unlimited';
}

export const PLAN_LIMITS: Record<string, PlanLimits> = {
  'Starter': { textRuns: 100, imageRuns: 10 },
  'Pro': { textRuns: 'unlimited', imageRuns: 200 },
  'Enterprise': { textRuns: 'unlimited', imageRuns: 'unlimited' }
};
