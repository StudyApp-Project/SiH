/**
 * src/app/(app)/assessment/[id]/AssessmentQuestion.tsx
 *
 * Question display component: Bilingual, accessible, touch-friendly
 */

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface QuestionProps {
  question: {
    id: string;
    question_text: string;
    question_text_hi: string;
    answer_choices: string[];
    answer_choices_hi: string[];
  };
  language: 'en' | 'hi';
  selectedAnswer: number | null;
  onSelectAnswer: (answerIndex: number) => void;
}

export default function AssessmentQuestion({
  question,
  language,
  selectedAnswer,
  onSelectAnswer,
}: QuestionProps) {
  const questionText = language === 'en' ? question.question_text : question.question_text_hi;
  const choices = language === 'en' ? question.answer_choices : question.answer_choices_hi;

  return (
    <div className="space-y-6">
      {/* Question Text */}
      <div>
        <h2 className="text-xl font-semibold mb-2 text-foreground leading-relaxed">
          {questionText}
        </h2>
        <p className="text-sm text-muted-foreground">Select one answer to proceed</p>
      </div>

      {/* Answer Choices */}
      <RadioGroup value={selectedAnswer !== null ? selectedAnswer.toString() : ''}>
        <div className="space-y-3">
          {choices.map((choice, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors min-h-12 ${
                selectedAnswer === index
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-muted-foreground'
              }`}
              onClick={() => onSelectAnswer(index)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onSelectAnswer(index);
                }
              }}
            >
              <RadioGroupItem
                value={index.toString()}
                id={`choice-${index}`}
                checked={selectedAnswer === index}
                onClick={() => onSelectAnswer(index)}
                className="mt-1"
              />
              <Label
                htmlFor={`choice-${index}`}
                className="flex-1 cursor-pointer text-base leading-relaxed font-medium"
              >
                {choice}
              </Label>
            </div>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
}
