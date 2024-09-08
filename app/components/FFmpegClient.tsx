'use client';

import { useState, useRef, useEffect } from 'react'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'
import { Button } from "./ui/button"

interface FFmpegClientProps {
  videoFile: File | null
  outputResolution: string
  outputFormat: string
  setProgress: (progress: number) => void
  setIsConverting: (isConverting: boolean) => void
}

export default function FFmpegClient({ videoFile, outputResolution, outputFormat, setProgress, setIsConverting }: FFmpegClientProps) {
  const ffmpegRef = useRef(new FFmpeg())
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.2/dist/umd'
    const ffmpeg = ffmpegRef.current
    ffmpeg.on('progress', ({ progress }) => {
      setProgress(Math.round(progress * 100))
    })
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    })
    setLoaded(true)
  }

  const handleDownload = async () => {
    if (!videoFile || !loaded) return

    setIsConverting(true)
    setProgress(0)

    const ffmpeg = ffmpegRef.current
    const inputFileName = 'input' + videoFile.name.substring(videoFile.name.lastIndexOf('.'))
    const outputFileName = `output.${outputFormat}`

    await ffmpeg.writeFile(inputFileName, await fetchFile(videoFile))

    await ffmpeg.exec([
      '-i', inputFileName,
      '-vf', `scale=-2:${outputResolution}`,
      '-c:a', 'copy',
      outputFileName
    ])

    const data = await ffmpeg.readFile(outputFileName)
    const blob = new Blob([data], { type: `video/${outputFormat}` })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = outputFileName
    a.click()

    setIsConverting(false)
  }

  return (
    <Button 
      variant="primary" 
      className="w-full py-2 text-sm"
      onClick={handleDownload}
      disabled={!loaded || !videoFile}
    >
      {loaded ? (videoFile ? 'Download Output' : 'Select a file') : 'Loading FFmpeg...'}
    </Button>
  )
}