'use client'
import PlanBuilder from './PlanBuilder'

export default function NewPlanPage({ params }) {
  return <PlanBuilder clientId={params.id} />
}