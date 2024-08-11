import { closestCenter, closestCorners, pointerWithin, rectIntersection } from '@dnd-kit/core'

export function customCollisionDetectionAlgorithm(args: any) {
  // First, let's see if there are any collisions with the pointer

  const closetCenterCollisions = closestCenter(args)
  if (closetCenterCollisions.length > 0) {
    return closetCenterCollisions
  }

  const pointerWithinCollisions = pointerWithin(args)
  if (pointerWithinCollisions.length > 0) {
    return pointerWithinCollisions
  }

  const closetCornersCollisions = closestCorners(args)
  if (closetCornersCollisions.length > 0) {
    return closetCornersCollisions
  }

  const recIntersectionCollisions = rectIntersection(args)
  if (recIntersectionCollisions.length > 0) {
    return recIntersectionCollisions
  }

  return closestCorners(args)
}
