'use client';

import { useState, useRef, useEffect } from 'react'
import { Select } from "./components/ui/select"
import { Button } from "./components/ui/button"
import dynamic from 'next/dynamic'

const FFmpegClient = dynamic(() => import('./components/FFmpegClient'), { ssr: false })

export default function Home() {
  const [progress, setProgress] = useState(0)
  const [isConverting, setIsConverting] = useState(false)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [outputResolution, setOutputResolution] = useState('144')
  const [outputFormat, setOutputFormat] = useState('mp4')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setVideoFile(e.target.files[0])
    }
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
        <FFmpegClient
          videoFile={videoFile}
          outputResolution={outputResolution}
          outputFormat={outputFormat}
          setProgress={setProgress}
          setIsConverting={setIsConverting}
        />
      </div>
    </div>
  )
}