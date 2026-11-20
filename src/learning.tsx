import { useId, useState } from 'react'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { External } from './ui'
import { lessonPath, lessons, type Lesson } from './learning-data'
import type { StoryQuiz, StorySource } from './story-contract'

export type Progress = { completed: string[]; complete: (id: string) => void }
export const storyExerciseId = (id: string, quiz: StoryQuiz) => 'story/' + id + '/' + quiz.id

export function QuickCheck({ quiz, sources, done, complete }: {
  quiz: StoryQuiz; sources: StorySource[]; done: boolean; complete: () => void
}) {
  const group = useId()
  const [selected, select] = useState<number | null>(null)
  const [checked, setChecked] = useState(false)
  return <form className="quick-check" onSubmit={event => {
    event.preventDefault()
    if (selected === null || checked) return
    setChecked(true)
    complete()
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
      <button type="button" className="link-button" onClick={() => { select(null); setChecked(false) }}>Try again</button>
    </div> : <div className="quick-submit">
      <button className="button" type="submit" disabled={selected === null}>Check answer <ArrowRight size={16} aria-hidden="true" /></button>
      {done && <span><Check size={15} aria-hidden="true" /> Completed</span>}
    </div>}
  </form>
}

export function LearnPage({ completed }: Progress) {
  return <section className="wrap standard-page editorial-page">
    <div className="catalogue-title editorial-title"><p className="editorial-kicker">Learn</p><h1>Understand the process.</h1><p>Short lessons on reading political records, understanding policy and preparing to vote.</p></div>
    <div className="lesson-list">
      {lessons.map(lesson => <article className="lesson-entry" key={lesson.id}>
        <p className="editorial-kicker">{lesson.topic}</p>
        <h2><a href={lessonPath(lesson.id)}>{lesson.title}</a></h2>
        <p>{lesson.introduction}</p>
        <a className="text-link" href={lessonPath(lesson.id)}>{completed.includes(lesson.id) ? 'Review lesson' : 'Start lesson'} <ArrowRight size={16} aria-hidden="true" /></a>
      </article>)}
    </div>
    <section className="editorial-section practice-links"><h2>More practice</h2><div className="inline-actions">
      <a className="button button-secondary" href="/practice">Election rehearsal <ArrowRight size={16} aria-hidden="true" /></a>
      <a className="button button-secondary" href="/parties/practice">Party recognition <ArrowRight size={16} aria-hidden="true" /></a>
      <a className="text-link" href="/rights">Voting rights <ArrowRight size={16} aria-hidden="true" /></a>
    </div></section>
  </section>
}

export function LessonPage({ lesson, ...progress }: { lesson: Lesson } & Progress) {
  return <article className="wrap standard-page editorial-page lesson-page">
    <a className="text-link back-link" href="/learn"><ArrowLeft size={16} aria-hidden="true" /> All lessons</a>
    <header className="catalogue-title editorial-title"><p className="editorial-kicker">{lesson.topic}</p><h1>{lesson.title}</h1><p>{lesson.introduction}</p></header>
    <section className="lesson-body" aria-label="Lesson exercise">
      <QuickCheck quiz={lesson.quiz} sources={lesson.sources} done={progress.completed.includes(lesson.id)} complete={() => progress.complete(lesson.id)} />
      <div className="lesson-sources"><h2>Read the source</h2>{lesson.sources.map(source => <External key={source.id} href={source.url}>{source.title}</External>)}</div>
    </section>
    <a className="text-link lesson-return" href="/elections">Back to 2027 Elections <ArrowRight size={16} aria-hidden="true" /></a>
  </article>
}
