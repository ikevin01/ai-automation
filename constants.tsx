
import React from 'react';
import { 
  Zap, 
  MessageSquare, 
  Image as ImageIcon, 
  Mic, 
  GitBranch, 
  Send,
  Play,
  Settings,
  Activity,
  Plus,
  Trash2,
  ChevronRight,
  Database
} from 'lucide-react';
import { StepType } from './types';

export const STEP_METADATA = {
  [StepType.TRIGGER]: {
    label: 'Trigger',
    description: 'Manual or scheduled start',
    icon: <Zap className="w-5 h-5 text-yellow-400" />,
    color: 'bg-yellow-400/10 border-yellow-400/30'
  },
  [StepType.AI_TEXT]: {
    label: 'AI Content',
    description: 'Generate text, summaries, or code',
    icon: <MessageSquare className="w-5 h-5 text-blue-400" />,
    color: 'bg-blue-400/10 border-blue-400/30'
  },
  [StepType.AI_IMAGE]: {
    label: 'AI Creative',
    description: 'Generate stunning visuals',
    icon: <ImageIcon className="w-5 h-5 text-purple-400" />,
    color: 'bg-purple-400/10 border-purple-400/30'
  },
  [StepType.TRANSCRIPTION]: {
    label: 'Speech-to-Text',
    description: 'Transcribe audio recordings',
    icon: <Mic className="w-5 h-5 text-green-400" />,
    color: 'bg-green-400/10 border-green-400/30'
  },
  [StepType.DECISION]: {
    label: 'Logic',
    description: 'Branch your workflow',
    icon: <GitBranch className="w-5 h-5 text-orange-400" />,
    color: 'bg-orange-400/10 border-orange-400/30'
  },
  [StepType.OUTPUT]: {
    label: 'Result',
    description: 'Final data destination',
    icon: <Send className="w-5 h-5 text-pink-400" />,
    color: 'bg-pink-400/10 border-pink-400/30'
  }
};

export const MODELS = {
  TEXT: 'gemini-3-flash-preview',
  PRO: 'gemini-3-pro-preview',
  IMAGE: 'gemini-2.5-flash-image'
};
