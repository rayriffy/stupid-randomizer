import { useEffect, useMemo, useState } from 'react'

// import { useMouseCoords } from 'web-api-hooks'

export const useCalibratePerspective = () => {
  const locations = ['Top-left', 'Top-right', 'Bottom-left', 'Bottom-right']
  const [location, setLocation] = useState(0)
  const [cords, setCords] = useState<{ x: number; y: number }[]>([])
  const completed = useMemo(() => locations.length <= location, [location])

  // const [mouseX, mouseY] = useMouseCoords()

  useEffect(() => {
    const clickEvent = (e: MouseEvent) => {
      if (locations.length > location) {
        setCords(o => [
          ...o,
          {
            x: e.x,
            y: e.y,
          },
        ])
        setLocation(o => o + 1)
      }
    }

    window.addEventListener('click', clickEvent)

    return () => window.removeEventListener('click', clickEvent)
  }, [location])

  return {
    header: locations.length <= location ? 'Calibration completed' : 'Waiting',
    text:
      locations.length <= location ? '' : `${locations[location]} of the rug`,
    completed,
    cords,
  }
}
