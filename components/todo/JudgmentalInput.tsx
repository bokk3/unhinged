"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

interface JudgmentalInputProps {
  onAdd: (task: string, originalTask: string) => void;
}

const TASK_JUDGMENTS: { pattern: RegExp; replacement: string }[] = [
  { pattern: /buy milk/i, replacement: "Buy milk (because you're too lazy to make your own almond milk)" },
  { pattern: /exercise/i, replacement: "Exercise (we both know this won't happen)" },
  { pattern: /gym/i, replacement: "Go to gym (LOL sure you will)" },
  { pattern: /clean/i, replacement: "Clean (finally addressing the biohazard zone)" },
  { pattern: /laundry/i, replacement: "Do laundry (the mountain of clothes isn't getting smaller)" },
  { pattern: /call mom/i, replacement: "Call mom (she's been waiting, you know)" },
  { pattern: /call dad/i, replacement: "Call dad (he won't say it, but he misses you)" },
  { pattern: /study/i, replacement: "Study (pretending to study doesn't count)" },
  { pattern: /work/i, replacement: "Do work (procrastinating on a to-do list doesn't count as work)" },
  { pattern: /email/i, replacement: "Send email (the draft has been sitting there for days)" },
  { pattern: /doctor/i, replacement: "Doctor appointment (ignored health issues, classic)" },
  { pattern: /dentist/i, replacement: "Dentist visit (when was the last time? Be honest)" },
  { pattern: /sleep/i, replacement: "Get more sleep (typed at 2 AM, probably)" },
  { pattern: /wake up/i, replacement: "Wake up early (we've heard this one before)" },
  { pattern: /diet/i, replacement: "Start diet (starting Monday, right? Always Monday)" },
  { pattern: /water/i, replacement: "Drink more water (your body is 60% disappointment right now)" },
  { pattern: /read/i, replacement: "Read (the book has been on your nightstand for months)" },
  { pattern: /cook/i, replacement: "Cook something (microwave doesn't count)" },
  { pattern: /organize/i, replacement: "Organize (chaos isn't a filing system)" },
  { pattern: /pay/i, replacement: "Pay bills (adulting is hard, isn't it)" },
  { pattern: /grocery/i, replacement: "Get groceries (cereal for dinner again?)" },
  { pattern: /meditat/i, replacement: "Meditate (staring at the wall doesn't count)" },
];

const GENERIC_JUDGMENTS = [
  "(added this because you'll definitely do it this time)",
  "(sure, we'll see about that)",
  "(adding to the pile of broken promises)",
  "(optimistic of you)",
  "(the audacity to think you'll finish this)",
  "(another one for the 'someday' list)",
  "(cute that you think this will happen)",
  "(hope springs eternal, I guess)",
];

export const JudgmentalInput = ({ onAdd }: JudgmentalInputProps) => {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const judgeTask = (task: string): string => {
    // Check specific patterns
    for (const judgment of TASK_JUDGMENTS) {
      if (judgment.pattern.test(task)) {
        return task.replace(judgment.pattern, judgment.replacement);
      }
    }
    
    // Generic judgment for unrecognized tasks
    const genericJudgment = GENERIC_JUDGMENTS[Math.floor(Math.random() * GENERIC_JUDGMENTS.length)];
    return `${task} ${genericJudgment}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const judgedTask = judgeTask(input.trim());
    onAdd(judgedTask, input.trim());
    setInput("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => { setInput(e.target.value); setIsTyping(true); }}
          onBlur={() => setIsTyping(false)}
          placeholder="Add a task (I'll judge it)"
          className="w-full p-4 pr-14 bg-secondary rounded-xl border border-border focus:border-primary focus:outline-none transition-colors"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>
      
      {isTyping && input.length > 0 && (
        <p className="text-xs text-muted-foreground italic pl-2">
          👀 I'm watching what you type...
        </p>
      )}
    </form>
  );
};
