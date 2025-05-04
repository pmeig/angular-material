export type SlideDirection = 'prev' | 'next'

export type AnimationExecutor = (index?: number) => void

const findDirectionLoop = (currentIndex: number, targetIndex: number, maxSize: number) => {
  let valid = 'next' as SlideDirection
  let invalid = 'prev' as SlideDirection
  if(currentIndex > targetIndex) {
    const tmp = currentIndex
    currentIndex = targetIndex
    targetIndex = tmp
    invalid = 'next'
    valid = 'prev'
  }
  if (targetIndex - currentIndex < (currentIndex + (maxSize - targetIndex))) {
    return valid
  }
  return invalid
};


export const findDirection = (loop: boolean, currentIndex: number, targetIndex: number, maxSize: number)=> {
  if (loop) {
    return findDirectionLoop(currentIndex, targetIndex, maxSize)
  }
  if (currentIndex < targetIndex) return 'next'
  if (currentIndex > targetIndex) return 'prev'
  return null
}
