'use client';

import { useState, useEffect } from 'react'
import { Button } from "./ui/button"

interface FFmpegClientProps {
  videoFile: File | null
  outputResolution: string
  outputFormat: string
  setProgress: (progress: number) => void
  setIsConverting: (isConverting: boolean) => void
}

export default function FFmpegClient({ videoFile, outputResolution, outputFormat, setProgress, setIsConverting }: FFmpegClientProps) {
  const [ffmpeg, setFFmpeg] = useState<any>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    import('@ffmpeg/ffmpeg').then(({ FFmpeg }) => {
      setFFmpeg(new FFmpeg())
    })
  }, [])

  useEffect(() => {
    if (ffmpeg) {
      load()
    }
  }, [ffmpeg])

  const load = async () => {
    const { toBlobURL } = await import('@ffmpeg/util')
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.2/dist/umd'
    ffmpeg.on('progress', ({ progress }: { progress: number }) => {
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

    const { fetchFile } = await import('@ffmpeg/util')
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