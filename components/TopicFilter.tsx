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

  const getButtonClasses = (topic: NewsTopic | 'All', isSelected: boolean) => {
    // Unselected state - consistent for all buttons
    if (!isSelected) {
      return 'bg-gray-700 text-gray-300 hover:bg-gray-600'
    }

    // Selected state - different color for each topic
    switch (topic) {
      case 'All':
        return 'bg-white text-gray-900 focus:ring-white'
      case 'AI':
        return 'bg-blue-500 text-white focus:ring-blue-500'
      case 'Stock':
        return 'bg-green-500 text-white focus:ring-green-500'
      case 'Election':
        return 'bg-purple-500 text-white focus:ring-purple-500'
      default:
        return 'bg-white text-gray-900'
    }
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
              getButtonClasses(topic, isSelected)
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
