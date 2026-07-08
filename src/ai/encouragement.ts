import { chatCompletion } from './client';

export async function getEncouragement(
  taskTitle: string,
  elapsed: number,
  previousMessages: string[]
): Promise<string> {
  return chatCompletion([
    {
      role: 'system',
      content: `You are Platypus, a warm and quirky productivity companion.
Generate ONE short encouraging sentence (max 12 words).
Be specific to what the user is working on.
Sound warm, not corporate. Occasionally use gentle platypus metaphors ("waddled", "pebble at a time", etc).
Do NOT repeat or paraphrase these previous messages: ${previousMessages.join(' | ')}
Return ONLY the sentence, no quotes.`,
    },
    {
      role: 'user',
      content: `Current task: ${taskTitle}. Elapsed: ${elapsed} minutes.`,
    },
  ]);
}
