import type { Subtask } from '../models/Task';
import { chatCompletion } from './client';

export async function generatePlan(goal: string): Promise<{ title: string; subtasks: Subtask[] }> {
  const content = await chatCompletion([
    {
      role: 'system',
      content: `You are an expert productivity coach. Break the user's goal into 3-6 realistic subtasks.
Each task should take 15-45 minutes and be clearly actionable.
Return ONLY valid JSON: { "title": string, "tasks": [{ "title": string, "duration": number }] }`,
    },
    { role: 'user', content: goal },
  ]);

  const data = JSON.parse(content);
  return {
    title: data.title,
    subtasks: (data.tasks as Array<{ title: string; duration: number }>).map((t, i) => ({
      id: String(i),
      title: t.title,
      duration: t.duration,
      completed: false,
    })),
  };
}
