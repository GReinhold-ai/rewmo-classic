// src/pages/learn/finance/[slug].tsx
// Dynamic Finance Lesson Page
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  Clock, 
  Award,
  BookOpen,
  Play,
  PauseCircle
} from "lucide-react";
import { useAuth } from "@/lib/AuthProvider";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";

// Lesson content database
const LESSON_CONTENT: Record<string, LessonData> = {
  "power-of-five-dollars": {
    id: "pf-1-1",
    title: "The Power of $5/Day",
    description: "How small daily savings compound into life-changing wealth over time.",
    duration: "10 min",
    points: 25,
    category: "Personal Finance",
    nextLesson: "50-30-20-budget",
    prevLesson: null,
    content: [
      {
        type: "intro",
        text: "$5 seems like nothing. A coffee. A snack. Forgettable. But what if that $5 could change your life?"
      },
      {
        type: "section",
        title: "The Math That Changes Everything",
        text: `$5 a day is:
• **$150 a month**
• **$1,825 a year**
• **$18,250 over a decade**

But here's where it gets interesting. Invested at a 7% average return, that $5/day becomes **$25,000+ in 10 years**.

Over 30 years? **$185,000+**.

From five dollars. Every day.`
      },
      {
        type: "section",
        title: "The Hidden Wealth Leak",
        text: `Most people don't feel poor because of big expenses. They feel poor because of hundreds of small ones that add up invisibly.

The daily coffee. The subscription you forgot about. The convenience store snack. The "it's only $5" purchases.

None of these feel significant in the moment. But they compound—against you.`
      },
      {
        type: "callout",
        title: "💡 Key Insight",
        text: "The same compound interest that can make you wealthy works against you when you spend instead of save. Every $5 spent is $25+ lost over time."
      },
      {
        type: "section",
        title: "The Fix: Awareness, Not Deprivation",
        text: `The solution isn't dramatic sacrifice. It's awareness.

When you see where the $5 goes, you can redirect it. Not deprivation—redirection.

**Try this:** For one week, note every purchase under $10. Add it up at the end. That number is your hidden wealth leak.`
      },
      {
        type: "action",
        title: "🎯 Your Action Item",
        text: "Track every purchase under $10 for the next 7 days. Use your phone's notes app or a simple spreadsheet. At the end of the week, calculate your total. That's your potential monthly savings × 12 for annual impact."
      },
      {
        type: "summary",
        title: "Key Takeaways",
        points: [
          "$5/day = $1,825/year = $25,000+ in 10 years (invested)",
          "Small expenses compound against you invisibly",
          "Awareness beats deprivation—see where money goes",
          "Redirect, don't restrict"
        ]
      }
    ],
    quiz: [
      {
        question: "How much does $5/day become over one year?",
        options: ["$365", "$1,825", "$500", "$3,650"],
        correct: 1
      },
      {
        question: "Invested at 7% return, $5/day becomes approximately how much in 10 years?",
        options: ["$18,250", "$10,000", "$25,000+", "$50,000"],
        correct: 2
      },
      {
        question: "What's the recommended approach to small spending?",
        options: ["Eliminate all small purchases", "Ignore them—they don't matter", "Track and redirect awareness", "Only spend on weekends"],
        correct: 2
      }
    ]
  },
  "50-30-20-budget": {
    id: "pf-1-2",
    title: "The 50/30/20 Budget",
    description: "A simple framework to allocate your income: needs, wants, and savings.",
    duration: "15 min",
    points: 25,
    category: "Personal Finance",
    nextLesson: "track-your-spending",
    prevLesson: "power-of-five-dollars",
    content: [
      {
        type: "intro",
        text: "Budgeting doesn't have to be complicated. The 50/30/20 rule gives you a simple framework that actually works."
      },
      {
        type: "section",
        title: "The 50/30/20 Breakdown",
        text: `**50% — Needs**
Housing, utilities, groceries, insurance, minimum debt payments, transportation to work. Things you literally cannot live without.

**30% — Wants**
Dining out, entertainment, hobbies, vacations, upgrades, subscriptions. Nice to have, not need to have.

**20% — Savings & Debt**
Emergency fund, retirement, investments, extra debt payments. Future you.`
      },
      {
        type: "callout",
        title: "💡 Why This Works",
        text: "The 50/30/20 rule works because it's simple enough to actually follow. No tracking every penny. No guilt about enjoying life. Just three buckets."
      },
      {
        type: "section",
        title: "How to Apply It",
        text: `1. **Calculate your after-tax income** (what hits your bank account)
2. **Multiply by the percentages:**
   - Needs: Income × 0.50
   - Wants: Income × 0.30
   - Savings: Income × 0.20
3. **Compare to your actual spending**
4. **Adjust where needed**`
      },
      {
        type: "example",
        title: "📊 Example: $4,000/month take-home",
        text: `• Needs (50%): $2,000 — rent, utilities, groceries, car payment
• Wants (30%): $1,200 — dining, entertainment, shopping
• Savings (20%): $800 — retirement, emergency fund, investments`
      },
      {
        type: "section",
        title: "What If Your Needs Exceed 50%?",
        text: `This is common, especially in high cost-of-living areas. Options:

1. **Increase income** — side gig, raise, new job
2. **Reduce housing costs** — roommate, different area, negotiate rent
3. **Temporarily adjust ratios** — 60/20/20 while you work on it
4. **Eliminate car payment** — this is often the hidden budget killer`
      },
      {
        type: "action",
        title: "🎯 Your Action Item",
        text: "Calculate your personal 50/30/20 numbers using your actual take-home pay. Then look at last month's spending. Where do you actually stand? No judgment—just awareness."
      },
      {
        type: "summary",
        title: "Key Takeaways",
        points: [
          "50% Needs, 30% Wants, 20% Savings",
          "Simple beats complicated for budgeting",
          "If needs exceed 50%, focus on housing and transportation",
          "Adjust ratios temporarily if needed, but always save something"
        ]
      }
    ],
    quiz: [
      {
        question: "In the 50/30/20 rule, what percentage goes to 'Wants'?",
        options: ["50%", "30%", "20%", "40%"],
        correct: 1
      },
      {
        question: "Which category does 'rent' fall into?",
        options: ["Wants", "Savings", "Needs", "Investments"],
        correct: 2
      },
      {
        question: "If your take-home pay is $5,000/month, how much should go to savings?",
        options: ["$500", "$1,000", "$1,500", "$2,500"],
        correct: 1
      }
    ]
  },
  // Add more lessons as needed...
};

interface LessonData {
  id: string;
  title: string;
  description: string;
  duration: string;
  points: number;
  category: string;
  nextLesson: string | null;
  prevLesson: string | null;
  content: ContentBlock[];
  quiz: QuizQuestion[];
}

interface ContentBlock {
  type: "intro" | "section" | "callout" | "action" | "summary" | "example";
  title?: string;
  text?: string;
  points?: string[];
}

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
}

// ===========================================
// MAIN COMPONENT
// ===========================================
export default function FinanceLessonPage({ lesson }: { lesson: LessonData | null }) {
  const { currentUser } = useAuth();
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Check if lesson is already completed
    async function checkCompletion() {
      if (currentUser?.uid && lesson) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          const completed = userDoc.data()?.completedLessons || [];
          setIsCompleted(completed.includes(lesson.id));
        }
      }
    }
    checkCompletion();
  }, [currentUser, lesson]);

  if (!lesson) {
    return (
      <div className="min-h-screen bg-[#003B49] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#FF9151] mb-4">Lesson Not Found</h1>
          <Link href="/learn/finance" className="text-[#15C5C1] underline">
            ← Back to Finance Training
          </Link>
        </div>
      </div>
    );
  }

  const handleQuizAnswer = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...quizAnswers];
    newAnswers[questionIndex] = answerIndex;
    setQuizAnswers(newAnswers);
  };

  const handleQuizSubmit = async () => {
    setQuizSubmitted(true);
    
    // Check if all answers are correct
    const allCorrect = lesson.quiz.every((q, i) => quizAnswers[i] === q.correct);
    
    if (allCorrect && currentUser?.uid && !isCompleted) {
      setSaving(true);
      try {
        // Mark lesson as completed and add points
        await updateDoc(doc(db, "users", currentUser.uid), {
          completedLessons: arrayUnion(lesson.id),
          points: (await getDoc(doc(db, "users", currentUser.uid))).data()?.points + lesson.points || lesson.points
        });
        setIsCompleted(true);
      } catch (error) {
        console.error("Error saving completion:", error);
      }
      setSaving(false);
    }
  };

  const quizScore = quizSubmitted 
    ? lesson.quiz.filter((q, i) => quizAnswers[i] === q.correct).length 
    : 0;

  return (
    <>
      <Head>
        <title>{lesson.title} | Finance Training | RewmoAI</title>
        <meta name="description" content={lesson.description} />
      </Head>

      <div className="min-h-screen bg-[#003B49]">
        {/* Header */}
        <div className="border-b border-white/10 bg-[#002530]">
          <div className="mx-auto max-w-4xl px-4 py-4">
            <Link href="/learn/finance" className="text-[#15C5C1] hover:text-white text-sm flex items-center gap-1">
              <ChevronLeft className="w-4 h-4" /> Back to Finance Training
            </Link>
          </div>
        </div>

        {/* Lesson Content */}
        <div className="mx-auto max-w-4xl px-4 py-8">
          {/* Title Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 text-sm text-[#B6E7EB] mb-2">
              <span className="px-2 py-1 bg-[#15C5C1]/20 rounded">{lesson.category}</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {lesson.duration}</span>
              <span className="flex items-center gap-1 text-[#FF9151]"><Award className="w-4 h-4" /> +{lesson.points} pts</span>
              {isCompleted && (
                <span className="flex items-center gap-1 text-green-400"><CheckCircle className="w-4 h-4" /> Completed</span>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">{lesson.title}</h1>
            <p className="text-lg text-[#B6E7EB]">{lesson.description}</p>
          </div>

          {/* Content Blocks */}
          <div className="space-y-6 mb-12">
            {lesson.content.map((block, index) => (
              <ContentBlock key={index} block={block} />
            ))}
          </div>

          {/* Quiz Section */}
          {!showQuiz ? (
            <div className="bg-[#072b33] rounded-2xl p-8 border border-[#15C5C1]/20 text-center">
              <BookOpen className="w-12 h-12 text-[#15C5C1] mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Ready to Test Your Knowledge?</h2>
              <p className="text-[#B6E7EB] mb-6">
                Complete the quiz to earn {lesson.points} points and mark this lesson complete.
              </p>
              <button
                onClick={() => setShowQuiz(true)}
                className="px-8 py-3 bg-[#15C5C1] text-[#003B49] font-bold rounded-xl hover:bg-[#1ad4d0] transition"
              >
                Start Quiz
              </button>
            </div>
          ) : (
            <div className="bg-[#072b33] rounded-2xl p-8 border border-[#15C5C1]/20">
              <h2 className="text-2xl font-bold text-white mb-6">📝 Quiz</h2>
              
              <div className="space-y-6">
                {lesson.quiz.map((q, qIndex) => (
                  <div key={qIndex} className="bg-[#003B49] rounded-xl p-6">
                    <p className="text-white font-medium mb-4">{qIndex + 1}. {q.question}</p>
                    <div className="space-y-2">
                      {q.options.map((option, oIndex) => {
                        const isSelected = quizAnswers[qIndex] === oIndex;
                        const isCorrect = q.correct === oIndex;
                        const showResult = quizSubmitted;
                        
                        return (
                          <button
                            key={oIndex}
                            onClick={() => !quizSubmitted && handleQuizAnswer(qIndex, oIndex)}
                            disabled={quizSubmitted}
                            className={`w-full text-left p-3 rounded-lg border transition ${
                              showResult
                                ? isCorrect
                                  ? "bg-green-500/20 border-green-500 text-green-400"
                                  : isSelected
                                  ? "bg-red-500/20 border-red-500 text-red-400"
                                  : "border-white/10 text-slate-400"
                                : isSelected
                                ? "bg-[#15C5C1]/20 border-[#15C5C1] text-white"
                                : "border-white/10 text-slate-300 hover:border-white/30"
                            }`}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {!quizSubmitted ? (
                <button
                  onClick={handleQuizSubmit}
                  disabled={quizAnswers.length !== lesson.quiz.length}
                  className="mt-6 w-full py-3 bg-[#FF9151] text-[#003B49] font-bold rounded-xl hover:bg-[#FFA36C] transition disabled:opacity-50"
                >
                  Submit Quiz
                </button>
              ) : (
                <div className="mt-6 text-center">
                  <div className={`text-2xl font-bold mb-2 ${
                    quizScore === lesson.quiz.length ? 'text-green-400' : 'text-yellow-400'
                  }`}>
                    {quizScore}/{lesson.quiz.length} Correct
                  </div>
                  {quizScore === lesson.quiz.length ? (
                    <p className="text-green-400">
                      🎉 Perfect! You earned +{lesson.points} points!
                    </p>
                  ) : (
                    <p className="text-[#B6E7EB]">
                      Review the material and try again to earn your points.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8 pt-8 border-t border-white/10">
            {lesson.prevLesson ? (
              <Link
                href={`/learn/finance/${lesson.prevLesson}`}
                className="flex items-center gap-2 text-[#B6E7EB] hover:text-white"
              >
                <ChevronLeft className="w-5 h-5" /> Previous Lesson
              </Link>
            ) : (
              <div />
            )}
            {lesson.nextLesson && (
              <Link
                href={`/learn/finance/${lesson.nextLesson}`}
                className="flex items-center gap-2 px-6 py-2 bg-[#15C5C1] text-[#003B49] font-bold rounded-lg hover:bg-[#1ad4d0] transition"
              >
                Next Lesson <ChevronRight className="w-5 h-5" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// Content Block Component
function ContentBlock({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "intro":
      return (
        <p className="text-xl text-[#B6E7EB] italic border-l-4 border-[#FF9151] pl-4">
          {block.text}
        </p>
      );
    
    case "section":
      return (
        <div>
          {block.title && (
            <h2 className="text-xl font-bold text-[#15C5C1] mb-3">{block.title}</h2>
          )}
          <div className="text-[#B6E7EB] whitespace-pre-line leading-relaxed prose-invert">
            {block.text?.split('**').map((part, i) => 
              i % 2 === 1 ? <strong key={i} className="text-white">{part}</strong> : part
            )}
          </div>
        </div>
      );
    
    case "callout":
      return (
        <div className="bg-[#15C5C1]/10 border border-[#15C5C1]/30 rounded-xl p-6">
          {block.title && (
            <h3 className="font-bold text-[#15C5C1] mb-2">{block.title}</h3>
          )}
          <p className="text-white">{block.text}</p>
        </div>
      );
    
    case "action":
      return (
        <div className="bg-[#FF9151]/10 border border-[#FF9151]/30 rounded-xl p-6">
          {block.title && (
            <h3 className="font-bold text-[#FF9151] mb-2">{block.title}</h3>
          )}
          <p className="text-white">{block.text}</p>
        </div>
      );
    
    case "example":
      return (
        <div className="bg-[#072b33] border border-white/10 rounded-xl p-6">
          {block.title && (
            <h3 className="font-bold text-white mb-2">{block.title}</h3>
          )}
          <p className="text-[#B6E7EB] whitespace-pre-line">{block.text}</p>
        </div>
      );
    
    case "summary":
      return (
        <div className="bg-[#003B49] border border-[#15C5C1]/30 rounded-xl p-6">
          {block.title && (
            <h3 className="font-bold text-[#15C5C1] mb-3">{block.title}</h3>
          )}
          <ul className="space-y-2">
            {block.points?.map((point, i) => (
              <li key={i} className="flex items-start gap-2 text-white">
                <CheckCircle className="w-5 h-5 text-[#15C5C1] flex-shrink-0 mt-0.5" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      );
    
    default:
      return null;
  }
}

// ===========================================
// STATIC GENERATION
// ===========================================
export const getStaticPaths: GetStaticPaths = async () => {
  const paths = Object.keys(LESSON_CONTENT).map((slug) => ({
    params: { slug },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  const lesson = LESSON_CONTENT[slug] || null;

  return {
    props: {
      lesson,
    },
  };
};
