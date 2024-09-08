'use client';

import { useState, useRef, useEffect } from 'react'
import { Select } from "./components/ui/select"
import { Button } from "./components/ui/button"
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'

export default function Home() {
  const [progress, setProgress] = useState(0)
  const [isConverting, setIsConverting] = useState(false)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [outputResolution, setOutputResolution] = useState('144')
  const [outputFormat, setOutputFormat] = useState('mp4')
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setVideoFile(e.target.files[0])
    }
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
    <div className="max-w-md mx-auto p-4 bg-[#ECE9D8] border-[#0054E3] border-2 shadow-md font-sans text-sm">
      <div className="bg-gradient-to-r from-[#0054E3] to-[#2683FF] flex justify-between items-center px-2 py-1 mb-4">
        <div className="text-white font-bold">Video Converter</div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="w-5 h-5 bg-[#ECE9D8] hover:bg-[#ECE9D8]">
            <span className="sr-only">Close</span>
            <span className="text-black">×</span>
          </Button>
        </div>
      </div>
      <div className="bg-white p-4 flex flex-col gap-4">
        <div>
          <div className="font-bold mb-2">Select video file to convert:</div>
          <div className="flex gap-2">
            <input type="file" accept="video/*" onChange={handleFileChange} className="flex-grow border border-gray-300 rounded px-2 py-1" />
          </div>
        </div>
        <div>
          <div className="font-bold mb-2">Output resolution:</div>
          <Select onChange={(e) => setOutputResolution(e.target.value)}>
            <option value="144">144p</option>
            <option value="240">240p</option>
            <option value="360">360p</option>
            <option value="480">480p</option>
          </Select>
        </div>
        <div>
          <div className="font-bold mb-2">Output format:</div>
          <Select onChange={(e) => setOutputFormat(e.target.value)}>
            <option value="mp4">MP4</option>
            <option value="webm">WebM</option>
            <option value="avi">AVI</option>
          </Select>
        </div>
        <div className="border border-gray-300 rounded p-4 mt-4">
          <div className="font-bold mb-2">Conversion Progress:</div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{width: `${progress}%`}}></div>
          </div>
          <div className="text-right mt-1 text-sm text-gray-500">{progress}%</div>
        </div>
        <Button 
          variant="primary" 
          className="w-full py-2 text-sm"
          onClick={handleDownload}
          disabled={isConverting || !videoFile || !loaded}
        >
          {isConverting ? 'Converting...' : 'Download Output'}
        </Button>
      </div>
    </div>
  )
}