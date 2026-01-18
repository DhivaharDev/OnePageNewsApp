'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import { NewsItem } from '@/lib/types'
import NewsCard from './NewsCard'

interface NewsCarouselProps {
  newsItems: NewsItem[]
}

export default function NewsCarousel({ newsItems }: NewsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  // Reset to first card when newsItems change
  useEffect(() => {
    setCurrentIndex(0)
  }, [newsItems])

  const handleDragEnd = (e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 50
    const swipeVelocity = 500

    if (
      info.offset.x > swipeThreshold ||
      info.velocity.x > swipeVelocity
    ) {
      // Swipe right - previous card
      paginate(-1)
    } else if (
      info.offset.x < -swipeThreshold ||
      info.velocity.x < -swipeVelocity
    ) {
      // Swipe left - next card
      paginate(1)
    }
  }

  const paginate = (newDirection: number) => {
    setDirection(newDirection)
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + newDirection
      // Loop around
      if (nextIndex < 0) return newsItems.length - 1
      if (nextIndex >= newsItems.length) return 0
      return nextIndex
    })
  }

  if (newsItems.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500 text-lg">No news available for this topic.</p>
      </div>
    )
  }

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8,
    }),
  }

  return (
    <div className="relative w-full max-w-2xl mx-auto h-full flex flex-col">
      {/* Card Container */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden min-h-0">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
              scale: { duration: 0.2 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className="cursor-grab active:cursor-grabbing max-h-full overflow-auto"
          >
            <NewsCard news={newsItems[currentIndex]} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows - Hidden on mobile, visible on tablet+ */}
      {newsItems.length > 1 && (
        <>
          <button
            onClick={() => paginate(-1)}
            className="hidden sm:block absolute -left-16 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all z-10 focus:outline-none focus:ring-2 focus:ring-gray-400"
            aria-label="Previous card"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => paginate(1)}
            className="hidden sm:block absolute -right-16 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all z-10 focus:outline-none focus:ring-2 focus:ring-gray-400"
            aria-label="Next card"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {newsItems.length > 1 && (
        <div className="flex justify-center gap-2 mt-4 flex-shrink-0">
          {newsItems.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1)
                setCurrentIndex(index)
              }}
              className={cn(
                'w-2 h-2 rounded-full transition-all duration-200',
                index === currentIndex
                  ? 'bg-white w-8'
                  : 'bg-gray-500 hover:bg-gray-400'
              )}
              aria-label={`Go to card ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Swipe Hint */}
      <p className="text-center text-xs text-gray-400 mt-2 sm:hidden flex-shrink-0">
        👈 Swipe to navigate 👉
      </p>
    </div>
  )
}

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
