import { useId, useState } from 'react'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { External } from './ui'
import { lessonPath, lessons, type Lesson } from './learning-data'
import type { StoryQuiz, StorySource } from './story-contract'

export type ExerciseStatus = 'attempted' | 'correct'
export type Progress = {
  outcomes: Record<string, ExerciseStatus>
  recordAttempt: (id: string, correct: boolean) => void
}
export const storyExerciseId = (id: string, quiz: StoryQuiz) => 'story/' + id + '/' + quiz.id

export function ExerciseStatusLabel({ status }: { status?: ExerciseStatus }) {
  if (!status) return null
  return <span className="exercise-status" data-correct={status === 'correct' || undefined}>
    {status === 'correct' && <Check size={15} aria-hidden="true" />}{status === 'correct' ? 'Answered correctly' : 'Attempted'}
  </span>
}

export function QuickCheck({ quiz, sources, status, submitAnswer }: {
  quiz: StoryQuiz; sources: StorySource[]; status?: ExerciseStatus; submitAnswer: (correct: boolean) => void
}) {
  const group = useId()
  const [selected, select] = useState<number | null>(null)
  const [checked, setChecked] = useState(false)
  return <form className="quick-check" onSubmit={event => {
    event.preventDefault()
    if (selected === null || checked) return
    setChecked(true)
    submitAnswer(selected === quiz.correct)
  }}>
    <fieldset disabled={checked}>
      <legend>{quiz.prompt}</legend>
      {quiz.options.map((option, index) => <label className="quick-option" key={index} data-correct={checked && index === quiz.correct || undefined}>
        <input type="radio" name={group} checked={selected === index} onChange={() => select(index)} />
        <span>{option}</span>
        {checked && index === quiz.correct && <Check size={17} aria-hidden="true" />}
      </label>)}
    </fieldset>
    {checked ? <div className="quick-feedback">
      <p role="status"><strong>{selected === quiz.correct ? 'That’s right.' : 'Here’s the answer.'}</strong> {quiz.explanation}</p>
      {sources.filter(source => quiz.sourceIds.includes(source.id)).map(source => <External key={source.id} href={source.url}>{source.title}</External>)}
      <button type="button" className="link-button" onClick={event => {
        const first = event.currentTarget.form?.querySelector<HTMLInputElement>('input[type="radio"]')
        select(null)
        setChecked(false)
        requestAnimationFrame(() => first?.focus())
      }}>Try again</button>
      <ExerciseStatusLabel status={status} />
    </div> : <div className="quick-submit">
      <button className="button" type="submit" disabled={selected === null}>Check answer <ArrowRight size={16} aria-hidden="true" /></button>
      <ExerciseStatusLabel status={status} />
    </div>}
  </form>
}

export function LearnPage({ outcomes }: Progress) {
  return <section className="wrap standard-page editorial-page">
    <div className="catalogue-title editorial-title"><p className="editorial-kicker">Civic learning</p><h1>Practise reading the record</h1><p>Short lessons on reading political records, understanding policy and preparing to vote.</p></div>
    <div className="lesson-list">
      {lessons.map(lesson => <article className="lesson-entry" key={lesson.id}>
        <p className="editorial-kicker">{lesson.topic}</p>
        <h2><a href={lessonPath(lesson.id)}>{lesson.title}</a></h2>
        <p>{lesson.introduction}</p>
        <a className="text-link" href={lessonPath(lesson.id)}>{outcomes[lesson.id] === 'correct' ? 'Review lesson' : outcomes[lesson.id] === 'attempted' ? 'Retry lesson' : 'Start lesson'} <ArrowRight size={16} aria-hidden="true" /></a>
      </article>)}
    </div>
    <section className="editorial-section practice-links"><h2>More practice</h2><div className="inline-actions">
      <a className="button button-secondary" href="/practice">Election rehearsal <ArrowRight size={16} aria-hidden="true" /></a>
      <a className="button button-secondary" href="/parties/practice">Party recognition <ArrowRight size={16} aria-hidden="true" /></a>
      <a className="text-link" href="/rights">Voting rights <ArrowRight size={16} aria-hidden="true" /></a>
    </div></section>
  </section>
}

export function LessonPage({ lesson, outcomes, recordAttempt }: { lesson: Lesson } & Progress) {
  return <article className="wrap standard-page editorial-page lesson-page">
    <a className="text-link back-link" href="/learn"><ArrowLeft size={16} aria-hidden="true" /> All lessons</a>
    <header className="catalogue-title editorial-title"><p className="editorial-kicker">{lesson.topic}</p><h1>{lesson.title}</h1><p>{lesson.introduction}</p></header>
    <section className="lesson-body" aria-label="Lesson exercise">
      <QuickCheck quiz={lesson.quiz} sources={lesson.sources} status={outcomes[lesson.id]} submitAnswer={correct => recordAttempt(lesson.id, correct)} />
      <div className="lesson-sources"><h2>Read the source</h2>{lesson.sources.map(source => <External key={source.id} href={source.url}>{source.title}</External>)}</div>
    </section>
    <a className="text-link lesson-return" href="/elections">Back to 2027 Elections <ArrowRight size={16} aria-hidden="true" /></a>
  </article>
}
