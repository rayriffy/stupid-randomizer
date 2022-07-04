import { FunctionComponent, memo, useEffect, useState } from 'react'

import { PlaneContent } from './PlaneContent'
import { useTableFetch } from './services/useTableFetch'

export const App: FunctionComponent = memo(props => {
  const [tableCol, setTableCol] = useState(4)
  const [tableRow, setTableRow] = useState(3)

  const [mediaDevices, setMediaDevices] = useState<MediaDeviceInfo[]>([])
  const [selectedMediaId, setSelectMediaId] = useState<string | null>(null)

  useEffect(() => {
    console.log('render')
    // @ts-ignore
    makeTransformable('.box')
  }, [])

  // initialize camera
  useEffect(() => {
    if (navigator.mediaDevices) {
      // list available devices
      navigator.mediaDevices.enumerateDevices().then(o => {
        const videoDevices = o.filter(o => o.kind === 'videoinput')
        setSelectMediaId(videoDevices[0].deviceId)
        setMediaDevices(videoDevices)
      })
    }
  }, [])
  useEffect(() => {
    if (mediaDevices.length > 0 && selectedMediaId !== null) {
      navigator.mediaDevices
        .getUserMedia({
          audio: false,
          video: {
            deviceId: selectedMediaId,
            width: {
              ideal: 1920,
            },
            height: {
              ideal: 1080,
            },
          },
        })
        .then(stream => {
          // @ts-ignore
          document.querySelector<HTMLVideoElement>('#video-stream').srcObject =
            stream
        })
    }
  }, [mediaDevices, selectedMediaId])

  const { refetch, ...rest } = useTableFetch(tableCol, tableRow)

  return (
    <main className="w-screen h-screen relative overflow-hidden">
      <div className="absolute top-4 left-4 py-4 px-6 rounded-lg bg-white font-mono z-50 w-52">
        <h1 className="font-bold">Controls</h1>
        <h2 className="font-semibold text-sm mt-1">Table</h2>
        <div className="flex text-xs space-x-4 mb-2">
          <div>
            <h3>Column</h3>
            <input
              type="number"
              className="w-12 p-1 border-2 border-gray-300 rounded"
              value={tableCol}
              onChange={e => {
                if (Number.isSafeInteger(Number(e.target.value))) {
                  setTableCol(Number(e.target.value))
                }
              }}
            />
          </div>
          <div>
            <h3>Row</h3>
            <input
              type="number"
              className="w-12 p-1 border-2 border-gray-300 rounded"
              value={tableRow}
              onChange={e => {
                if (Number.isSafeInteger(Number(e.target.value))) {
                  setTableRow(Number(e.target.value))
                }
              }}
            />
          </div>
        </div>
        <button
          type="button"
          className="w-full inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          onClick={() => refetch()}
        >
          Re-shuffle
        </button>
        <h2 className="font-semibold text-sm mt-2">Video</h2>
        {mediaDevices.length > 0 && selectedMediaId !== null && (
          <select
            className="mt-1 block w-full pl-1 pr-10 py-1 text-sm border-2 border-gray-300 focus:outline-none sm:text-sm rounded-md"
            defaultValue={selectedMediaId}
            onChange={e => setSelectMediaId(e.target.value)}
          >
            {mediaDevices.map(device => (
              <option
                key={`mediadevice-${device.deviceId}`}
                value={device.deviceId}
              >
                {device.deviceId}
              </option>
            ))}
          </select>
        )}
      </div>
      <div
        className="box bg-gray-100"
        id="box"
        style={{
          opacity: '70%',
        }}
      >
        <PlaneContent {...rest} />
      </div>
      <video
        autoPlay
        id="video-stream"
        className="object-cover pointer-events-none select-none w-full h-full"
      ></video>
      {/* change from <video /> to <img /> below if you don't have a carpet */}
      {/* <img className='object-cover pointer-events-none select-none w-full h-full' src="/DSC02360.jpg" /> */}
    </main>
  )
})
