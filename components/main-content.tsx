'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  FileText,
  Image,
  Wand2,
  Palette,
  MoreHorizontal,
  Plus,
  Mic,
  Upload,
  ImageIcon,
  BarChart3
} from 'lucide-react'

const tools = [
  { icon: FileText, title: 'Text Service', href: '/workspace/text', service: 'text' },
  { icon: Image, title: 'Image Service', href: '/workspace/image', service: 'image' },
  { icon: FileText, title: 'Document Generation', href: '/workspace/document', service: 'document' },
  { icon: Palette, title: 'Design Support', href: '/workspace/design', service: 'design' },
  { icon: Wand2, title: 'Presentation', href: '/workspace/presentation', service: 'presentation' },
  { icon: BarChart3, title: 'Data Analysis', href: '/workspace/data_analysis', service: 'data_analysis' },
  { icon: MoreHorizontal, title: 'More Services', href: '/workspace/more', service: 'more' },
]

interface MainContentProps {
  allowedServices?: string[]
}

const recentProjects = [
  { title: 'Marketing Strategy Document', edited: 'Updated 2 hours ago' },
  { title: 'Q2 Business Presentation', edited: 'Updated 1 hour ago' },
  { title: 'Landing Page UI Design', edited: 'Updated 1 day ago' },
  { title: 'AI in Healthcare Blog', edited: 'Updated 2 days ago' },
]

export default function MainContent({ allowedServices }: MainContentProps) {
  console.log("ALLOWED SERVICES:", allowedServices);
  const [showMenu, setShowMenu] = useState(false)
  const router = useRouter()
  const [selectedFile, setSelectedFile] = useState('')
  const [selectedImage, setSelectedImage] = useState('')

  const visibleTools = allowedServices
    ? tools.filter((tool) => allowedServices.includes(tool.service))
    : tools

    console.log("VISIBLE TOOLS:", visibleTools);

  const menuRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleVoice() {
    setShowMenu(false)
    alert('🎤 Voice input will be available soon.')
  }

  function handleFileUpload() {
    fileInputRef.current?.click()
    setShowMenu(false)
  }

  function handleImageUpload() {
    imageInputRef.current?.click()
    setShowMenu(false)
  }

  return (
    <main className="flex-1 overflow-y-auto bg-white">
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) {
            setSelectedFile(e.target.files[0].name)
          }
        }}
      />

      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) {
            setSelectedImage(e.target.files[0].name)
          }
        }}
      />

      <div className="bg-gradient-to-b from-[#E8F3EF] to-white px-12 pb-16 pt-20">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-8 text-5xl font-bold text-slate-900">
            Government AI Services
          </h1>

          <div className="relative">
            <input
              type="text"
              placeholder="Ask anything, create anything..."
              className="w-full rounded-2xl border-2 border-[#006A4E] bg-white px-6 py-4 text-lg !text-slate-900 placeholder:text-slate-400 !caret-slate-900 shadow-lg transition-all focus:border-[#006A4E] focus:outline-none focus:ring-2 focus:ring-[#006A4E]/20"
            />

            <div ref={menuRef} className="absolute right-4 top-1/2 -translate-y-1/2">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#006A4E] text-white hover:bg-[#00543E]"
              >
                <Plus size={20} />
              </button>

              {showMenu && (
                <div className="absolute right-0 top-full mt-2 w-52 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
                  <button
                    onClick={handleVoice}
                    className="flex w-full items-center gap-3 px-4 py-3 text-sm text-slate-700 transition-colors hover:bg-[#E8F3EF] hover:text-[#006A4E]"
                  >
                    <Mic size={18} />
                    Voice Input
                  </button>

                  <button
                    onClick={handleFileUpload}
                    className="flex w-full items-center gap-3 px-4 py-3 text-sm text-slate-700 transition-colors hover:bg-[#E8F3EF] hover:text-[#006A4E]"
                  >
                    <Upload size={18} />
                    Upload File
                  </button>

                  <button
                    onClick={handleImageUpload}
                    className="flex w-full items-center gap-3 px-4 py-3 text-sm text-slate-700 transition-colors hover:bg-[#E8F3EF] hover:text-[#006A4E]"
                  >
                    <ImageIcon size={18} />
                    Upload Image
                  </button>
                </div>
              )}
            </div>
          </div>

          {(selectedFile || selectedImage) && (
            <div className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-left">
              {selectedFile && (
                <p className="text-sm text-slate-700">
                  📄 Selected File:
                  <span className="font-semibold"> {selectedFile}</span>
                </p>
              )}

              {selectedImage && (
                <p className="mt-2 text-sm text-slate-700">
                  🖼 Selected Image:
                  <span className="font-semibold"> {selectedImage}</span>
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="px-12 pb-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-wrap justify-center gap-8">
            {visibleTools.map((tool, index) => (
              <div
                key={index}
                onClick={() => router.push(tool.href)}
                className="cursor-pointer flex flex-col items-center gap-3 transition-transform hover:scale-105"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-[#E8F3EF]">
                  <tool.icon size={30} className="text-[#006A4E]" />
                </div>

                <p className="text-center text-sm font-semibold text-slate-900">
                  {tool.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-12 pb-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-center justify-center gap-4">
            <h3 className="text-lg font-semibold">Recent Activities</h3>
            <a href="#" className="text-sm text-[#006A4E]">
              View all
            </a>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {recentProjects.map((project, index) => (
              <div
                key={index}
                className="rounded-lg border border-slate-200 bg-white p-4 transition hover:border-[#006A4E] hover:shadow-md"
              >
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded bg-[#E8F3EF]">
                  <FileText size={20} className="text-[#006A4E]" />
                </div>

                <h4 className="text-sm font-semibold">{project.title}</h4>
                <p className="mt-1 text-xs text-slate-500">{project.edited}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}