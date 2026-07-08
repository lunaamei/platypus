import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { Subtask } from '../models/Task';

interface SubtaskEditorProps {
  subtasks: Subtask[];
  updateSubtask: (id: string, patch: Partial<Pick<Subtask, 'title' | 'duration'>>) => void;
  addSubtask: (title: string, duration: number) => void;
  removeSubtask: (id: string) => void;
}

export function SubtaskEditor({ subtasks, updateSubtask, addSubtask, removeSubtask }: SubtaskEditorProps) {
  const [newTitle, setNewTitle] = useState('');
  const [newDuration, setNewDuration] = useState(20);

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    addSubtask(newTitle.trim(), newDuration);
    setNewTitle('');
    setNewDuration(20);
  };

  return (
    <div className="space-y-2">
      {subtasks.map((st) => (
        <div key={st.id} className="flex items-center gap-2 text-sm text-stone-300">
          <input
            value={st.title}
            onChange={(e) => updateSubtask(st.id, { title: e.target.value })}
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-sm text-white focus:outline-none focus:border-violet-400/50"
          />
          <input
            type="number"
            min={1}
            value={st.duration}
            onChange={(e) => updateSubtask(st.id, { duration: Math.max(1, Number(e.target.value)) })}
            className="w-14 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-sm text-white text-right focus:outline-none focus:border-violet-400/50"
          />
          <span className="text-stone-500 text-xs">m</span>
          <button
            onClick={() => removeSubtask(st.id)}
            className="text-stone-500 hover:text-red-400 transition-colors flex-shrink-0"
            title="Remove"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ))}

      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/8">
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Add a subtask..."
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-sm text-white placeholder:text-stone-500 focus:outline-none focus:border-violet-400/50"
        />
        <input
          type="number"
          min={1}
          value={newDuration}
          onChange={(e) => setNewDuration(Math.max(1, Number(e.target.value)))}
          className="w-14 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-sm text-white text-right focus:outline-none focus:border-violet-400/50"
        />
        <span className="text-stone-500 text-xs">m</span>
        <button
          onClick={handleAdd}
          className="text-violet-300 hover:text-violet-200 transition-colors flex-shrink-0"
          title="Add"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}
