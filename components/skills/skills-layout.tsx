'use client'

import { useEffect, useState } from 'react'

import { supabase } from '@/lib/supabase'

import EntityLayout from '@/components/library/entity-layout'
import EntityCard from '@/components/library/entity-card'
import EntityDialog from '@/components/library/entity-dialog'

import SkillForm from './skill-form'

export interface Skill {
  id: string
  name: string
  description: string
  category: string
  system_prompt: string
  favorite: boolean
}

export default function SkillsLayout() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)

  const [openDialog, setOpenDialog] = useState(false)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('General')
  const [systemPrompt, setSystemPrompt] = useState('')
  const [favorite, setFavorite] = useState(false)

  async function loadSkills() {
    try {
      setLoading(true)

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const response = await fetch(
        `/api/skills?user_id=${user.id}`
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error)
      }

      setSkills(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSkills()
  }, [])

  async function createSkill() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const response = await fetch('/api/skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          name,
          description,
          category,
          system_prompt: systemPrompt,
          favorite,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error)
      }

      setName('')
      setDescription('')
      setCategory('General')
      setSystemPrompt('')
      setFavorite(false)

      setOpenDialog(false)

      loadSkills()
    } catch (error) {
      console.error(error)
      alert('Failed to create skill.')
    }
  }

  async function deleteSkill(id: string) {
    try {
      const response = await fetch(`/api/skills/${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error)
      }

      loadSkills()
    } catch (error) {
      console.error(error)
      alert('Failed to delete skill.')
    }
  }

  async function toggleFavorite(
    id: string,
    current: boolean
  ) {
    try {
      const response = await fetch(
        `/api/skills/${id}/favorite`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            favorite: !current,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error)
      }

      loadSkills()
    } catch (error) {
      console.error(error)
    }
  }

    return (
    <>
      <EntityLayout
        title="Skills"
        description="Create reusable AI skills and assistants."
        loading={loading}
        items={skills}
        emptyTitle="No Skills Yet"
        emptyDescription="Create your first AI skill."
        onCreate={() => setOpenDialog(true)}
        renderItem={(skill) => (
          <EntityCard
            key={skill.id}
            id={skill.id}
            title={skill.name}
            description={skill.description}
            badge={skill.category}
            favorite={skill.favorite}
            onFavorite={() =>
              toggleFavorite(skill.id, skill.favorite)
            }
            onDelete={() => {
              if (
                confirm(`Delete "${skill.name}"?`)
              ) {
                deleteSkill(skill.id)
              }
            }}
          >
            <p className="line-clamp-4 text-sm text-slate-500">
              {skill.system_prompt}
            </p>
          </EntityCard>
        )}
      />

      <EntityDialog
        open={openDialog}
        title="Create Skill"
        subtitle="Save reusable AI instructions."
        submitText="Create Skill"
        onClose={() => setOpenDialog(false)}
        onSubmit={createSkill}
      >
        <SkillForm
          name={name}
          description={description}
          category={category}
          systemPrompt={systemPrompt}
          favorite={favorite}
          setName={setName}
          setDescription={setDescription}
          setCategory={setCategory}
          setSystemPrompt={setSystemPrompt}
          setFavorite={setFavorite}
        />
      </EntityDialog>
    </>
  )
}