// features/raiz/components/BuilderQuestionFlow.tsx
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useBuilderStore } from '../builder-store';
import { BUILDER_QUESTION_MAP, BUILDER_MODULE_MAP } from '../builder-questions';
import { BuilderInputs } from './BuilderInputs';
import { MindmateBadge } from './MindmateBadge';
import { getMindmateQuote, MINDMATE_SUBTEXT_OVERRIDES } from '../mindmate';

export function BuilderQuestionFlow() {
  const activeModule = useBuilderStore((s) => s.activeModule);
  const currentQuestionId = useBuilderStore((s) => s.currentQuestionId);
  const answers = useBuilderStore((s) => s.answers);
  const mindmateMode = useBuilderStore((s) => s.mindmateMode);
  const answerQuestion = useBuilderStore((s) => s.answerQuestion);
  const goBack = useBuilderStore((s) => s.goBack);
  const completeModule = useBuilderStore((s) => s.completeModule);

  const [direction, setDirection] = useState(1);

  if (!activeModule || !currentQuestionId) return null;

  const mod = BUILDER_MODULE_MAP[activeModule];
  const question = BUILDER_QUESTION_MAP[currentQuestionId];
  if (!question || !mod) return null;

  const moduleQuestions = mod.questions;
  const answeredInModule = answers.filter((a) =>
    moduleQuestions.some((q) => q.id === a.questionId),
  ).length;
  const progress = Math.min((answeredInModule / moduleQuestions.length) * 100, 90);

  const subtext = mindmateMode && MINDMATE_SUBTEXT_OVERRIDES[question.id]
    ? MINDMATE_SUBTEXT_OVERRIDES[question.id]
    : question.subtext;

  const quote = mindmateMode ? getMindmateQuote(activeModule) : null;

  const handleAnswer = (value: string | boolean) => {
    setDirection(1);
    answerQuestion(currentQuestionId, value);
  };

  const handleBack = () => {
    if (answers.filter((a) => moduleQuestions.some((q) => q.id === a.questionId)).length === 0) {
      completeModule();
    } else {
      setDirection(-1);
      goBack();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-5 pt-5 pb-3 flex items-center gap-3">
        <button onClick={handleBack} className="p-2 -ml-2 rounded-full text-text-muted hover:text-text transition-colors">
          <span className="text-sm">←</span>
        </button>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-text-muted">{mod.icon} {mod.label}</span>
            {mindmateMode && <MindmateBadge />}
          </div>
          <div className="h-1 bg-border rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-text-muted rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 overflow-y-auto px-5 pt-4 pb-24">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentQuestionId}
            custom={direction}
            variants={{
              enter: (d: number) => ({ x: d * 32, opacity: 0 }),
              center: { x: 0, opacity: 1 },
              exit: (d: number) => ({ x: d * -32, opacity: 0 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <h2 className="text-lg font-medium text-text-heading leading-snug mb-2">
              {question.text}
            </h2>

            {subtext && (
              <p className="text-sm text-text-muted mb-5 leading-relaxed">{subtext}</p>
            )}

            {quote && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-5 pl-3 border-l-2 border-border">
                <p className="text-xs italic text-text-muted leading-relaxed">"{quote.text}"</p>
                <p className="text-xs text-text-muted mt-0.5 opacity-60">— {quote.author}</p>
              </motion.div>
            )}

            <BuilderInputs question={question} onAnswer={handleAnswer} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
