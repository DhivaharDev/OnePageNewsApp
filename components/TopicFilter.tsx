'use client'

import { NewsTopic } from '@/lib/types'
import { TOPICS, TOPIC_COLORS } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface TopicFilterProps {
  selectedTopic: NewsTopic | 'All'
  onSelectTopic: (topic: NewsTopic | 'All') => void
}

export default function TopicFilter({
  selectedTopic,
  onSelectTopic,
}: TopicFilterProps) {
  const allTopics: (NewsTopic | 'All')[] = ['All', ...TOPICS]

  const getButtonClasses = (isSelected: boolean) => {
    // Selected state - consistent white background for all buttons
    if (isSelected) {
      return 'bg-white text-gray-900 focus:ring-white'
    }

    // Unselected state - consistent gray background for all buttons
    return 'bg-gray-700 text-gray-300 hover:bg-gray-600'
  }

  return (
    <div className="flex flex-wrap gap-3 justify-center mb-8">
      {allTopics.map((topic) => {
        const isSelected = selectedTopic === topic

        return (
          <button
            key={topic}
            onClick={() => onSelectTopic(topic)}
            className={cn(
              'px-6 py-2.5 rounded-full font-semibold text-sm uppercase tracking-wide transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800',
              getButtonClasses(isSelected)
            )}
            aria-pressed={isSelected}
          >
            {topic}
          </button>
        )
      })}
    </div>
  )
}
