import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { 
  Brain, 
  CheckCircle2, 
  XCircle, 
  Lightbulb,
  Building2, 
  Code2,
  Users,
  MessageSquare,
  BookOpen,
  Target
} from 'lucide-react'

interface AnalysisResultsProps {
  type: 'resume' | 'company' | 'mock_interview'
  results: any
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.2 }
}

export function AnalysisResults({ type, results }: AnalysisResultsProps) {
  if (!results) return null

  const renderResumeResults = () => (
    <div className="space-y-6">
      <ResultCard
        title="Key Strengths"
        icon={<CheckCircle2 className="h-5 w-5 text-emerald-500" />}
        items={results.strengths}
      />
      
      <ResultCard
        title="Areas for Improvement"
        icon={<XCircle className="h-5 w-5 text-amber-500" />}
        items={results.weaknesses}
      />

      <ResultCard
        title="Skills Assessment"
        icon={<Brain className="h-5 w-5 text-violet-500" />}
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <h4 className="text-sm font-medium mb-2">Technical Skills</h4>
            <ul className="space-y-1.5">
              {results.skills_assessment.technical.map((skill: string, index: number) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-primary/60">•</span>
                  {skill}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2">Soft Skills</h4>
            <ul className="space-y-1.5">
              {results.skills_assessment.soft.map((skill: string, index: number) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-primary/60">•</span>
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </ResultCard>

      <ResultCard
        title="ATS Optimization Tips"
        icon={<Lightbulb className="h-5 w-5 text-yellow-500" />}
        items={results.ats_optimization}
      />
    </div>
  )

  const renderCompanyResults = () => (
    <div className="space-y-6">
      <ResultCard
        title={results.overview.title}
        icon={<Building2 className="h-5 w-5 text-blue-500" />}
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{results.overview.content}</p>
          <div>
            <h4 className="text-sm font-medium mb-2">Company Values</h4>
            <ul className="space-y-1.5">
              {results.overview.values.map((value: string, index: number) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-primary/60">•</span>
                  {value}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2">Industry Position</h4>
            <p className="text-sm text-muted-foreground">{results.overview.position}</p>
          </div>
        </div>
      </ResultCard>

      <ResultCard
        title={results.role.title}
        icon={<Code2 className="h-5 w-5 text-emerald-500" />}
      >
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Key Responsibilities</h4>
            <ul className="space-y-1.5">
              {results.role.responsibilities.map((resp: string, index: number) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-primary/60">•</span>
                  {resp}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2">Required Skills</h4>
            <ul className="space-y-1.5">
              {results.role.requiredSkills.map((skill: string, index: number) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-primary/60">•</span>
                  {skill}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2">Growth Path</h4>
            <ul className="space-y-1.5">
              {results.role.growthPath.map((path: string, index: number) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-primary/60">•</span>
                  {path}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </ResultCard>

      <ResultCard
        title={results.perks.title}
        icon={<Target className="h-5 w-5 text-violet-500" />}
      >
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Highlights</h4>
            <ul className="space-y-1.5">
              {results.perks.highlights.map((perk: string, index: number) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-primary/60">•</span>
                  {perk}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2">Unique Perks</h4>
            <ul className="space-y-1.5">
              {results.perks.uniquePerks.map((perk: string, index: number) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-primary/60">•</span>
                  {perk}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </ResultCard>

      <ResultCard
        title={results.interview.title}
        icon={<MessageSquare className="h-5 w-5 text-yellow-500" />}
      >
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Key Topics</h4>
            <ul className="space-y-1.5">
              {results.interview.keyTopics.map((topic: string, index: number) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-primary/60">•</span>
                  {topic}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2">Preparation Tips</h4>
            <ul className="space-y-1.5">
              {results.interview.tips.map((tip: string, index: number) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-primary/60">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </ResultCard>

      <ResultCard
        title={results.success.title}
        icon={<BookOpen className="h-5 w-5 text-pink-500" />}
      >
        <ul className="space-y-1.5">
          {results.success.tips.map((tip: string, index: number) => (
            <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
              <span className="text-primary/60">•</span>
              {tip}
            </li>
          ))}
        </ul>
      </ResultCard>
    </div>
  )

  const renderMockInterviewResults = () => (
    <div className="space-y-6">
      {results.technical_questions.map((question: any, index: number) => (
        <ResultCard
          key={index}
          title={`Question ${index + 1}`}
          icon={<BookOpen className="h-5 w-5 text-blue-500" />}
        >
          <div className="space-y-4">
            <p className="text-sm">{question.question}</p>
            
            <div>
              <h5 className="text-sm font-medium mb-2">Tips</h5>
              <ul className="space-y-1.5">
                {question.tips.map((tip: string, tipIndex: number) => (
                  <li key={tipIndex} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary/60">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="text-sm font-medium mb-2">Key Points</h5>
              <ul className="space-y-1.5">
                {question.good_answer_points.map((point: string, pointIndex: number) => (
                  <li key={pointIndex} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary/60">•</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="text-sm font-medium mb-2">Follow-up Questions</h5>
              <ul className="space-y-1.5">
                {question.follow_up_questions.map((followUp: string, followUpIndex: number) => (
                  <li key={followUpIndex} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary/60">•</span>
                    {followUp}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </ResultCard>
      ))}

      <ResultCard
        title="Focus Areas"
        icon={<Target className="h-5 w-5 text-red-500" />}
        items={results.focus_areas}
      />
    </div>
  )

  return (
    <motion.div
      className="pt-8"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={{
        initial: { opacity: 0 },
        animate: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1
          }
        },
        exit: {
          opacity: 0,
          transition: {
            staggerChildren: 0.05
          }
        }
      }}
    >
      {type === 'resume' && renderResumeResults()}
      {type === 'company' && renderCompanyResults()}
      {type === 'mock_interview' && renderMockInterviewResults()}
    </motion.div>
  )
}

interface ResultCardProps {
  title: string
  icon?: React.ReactNode
  items?: string[]
  children?: React.ReactNode
}

function ResultCard({ title, icon, items, children }: ResultCardProps) {
  return (
    <motion.div variants={fadeInUp}>
      <Card className="overflow-hidden bg-black/40 backdrop-blur-sm border-white/[0.08]">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            {icon && (
              <div className="relative h-8 w-8 rounded-lg bg-white/[0.03] flex items-center justify-center">
                {icon}
              </div>
            )}
            <h3 className="text-sm font-medium">{title}</h3>
          </div>

          {items ? (
            <ul className="space-y-1.5">
              {items.map((item, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-primary/60">•</span>
                  {item}
                </li>
              ))}
            </ul>
          ) : children}
        </div>
      </Card>
    </motion.div>
  )
}
