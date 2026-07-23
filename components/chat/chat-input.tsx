'use client'

import { Send, Paperclip } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'



import { supabase } from '@/lib/supabase'
import * as XLSX from 'xlsx'



interface Props {
  chatId: string | null
  service: string
  onMessageSent: () => void

  dataset: any[]
  setDataset: React.Dispatch<React.SetStateAction<any[]>>
}


export default function ChatInput({
  chatId,
  service,
  onMessageSent,
  dataset,
  setDataset,
}: Props) {


  const [prompt, setPrompt] = useState('')
  const [sending, setSending] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  // Excel data
  const datasetRef = useRef<any[]>([])


useEffect(() => {
  datasetRef.current = dataset
}, [dataset])

  async function parseExcel(file: File) {

    try {

      console.log("FILE RECEIVED:", file.name)


      const buffer = await file.arrayBuffer()


      const workbook = XLSX.read(buffer, {
        type: "array",
      })


      console.log(
        "WORKBOOK SHEETS:",
        workbook.SheetNames
      )


      const sheet =
        workbook.Sheets[workbook.SheetNames[0]]


      const json =
        XLSX.utils.sheet_to_json(sheet)


      console.log(
        "PARSED DATA:",
        json
      )


      setDataset(json)

      // keep latest data immediately
      datasetRef.current = json


    } catch (error) {

      console.error(
        "EXCEL PARSE ERROR:",
        error
      )

    }

  }





  async function handleSend() {

    const message = prompt.trim()


    if (!chatId) {

      alert('Please create a new chat first.')

      return

    }


    if (!message || sending) return



    try {

      setSending(true)



      const {
        data: { user },
      } = await supabase.auth.getUser()



      if (!user) {

        throw new Error(
          'User not logged in'
        )

      }



      console.log(
        "DATASET BEFORE SEND:",
        datasetRef.current
      )



      const response = await fetch(
        '/api/chat',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },


          body: JSON.stringify({

            service,

            conversation_id: chatId,

            user_id: user.id,

            prompt: message,


            dataset:
              service === "data_analysis"
                ? datasetRef.current
                : []

          }),

        }
      )



      const data =
        await response.json()

      console.log("FRONTEND RESPONSE:", data)

      console.log(
        'CHAT RESPONSE:',
        data
      )



      if (data.downloadUrl) {

        window.open(
          data.downloadUrl
        )

      }



      if (!response.ok) {

        console.log(
          'API ERROR:',
          data
        )


        throw new Error(
          data.error ||
          'AI request failed'
        )

      }




      if (!data?.response) {

        throw new Error(
          'No AI response received'
        )

      }




      setPrompt('')

      setSelectedFile(null)



      onMessageSent()



    } catch (error) {


      console.error(error)

      alert(
        'Failed to send message.'
      )


    } finally {

      setSending(false)

    }

  }







  function handleKeyDown(
    e: React.KeyboardEvent<HTMLInputElement>
  ) {


    if (
      e.key === 'Enter' &&
      !e.shiftKey
    ) {

      e.preventDefault()

      handleSend()

    }

  }







  const acceptedFileTypes =
    service === "data_analysis"
      ? ".xlsx,.xls,.csv"
      : service === "image"
      ? "image/*"
      : service === "document"
      ? ".pdf,.doc,.docx"
      : "*"






  return (

    <div className="border-t border-slate-200 bg-white p-6">


      <div className="mx-auto max-w-4xl">





        {
          selectedFile && (

            <div className="mb-3 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-100 px-4 py-2 text-sm text-slate-700">

              <Paperclip size={16}/>

              <span>
                {selectedFile.name}
              </span>

            </div>

          )
        }






        <div className="flex items-center gap-3 rounded-2xl border border-slate-300 bg-white px-5 py-3 shadow-sm">






          <input

            id="file-upload"

            type="file"

            accept={acceptedFileTypes}

            className="hidden"


            onChange={async (e)=>{


              console.log(
                "UPLOAD EVENT FIRED"
              )



              const file =
                e.target.files?.[0]



              console.log(
                "SELECTED FILE:",
                file
              )



              if(!file) return



              setSelectedFile(file)



              if(
                service === "data_analysis"
              ){

                await parseExcel(file)

              }



            }}


          />






          <label

            htmlFor="file-upload"

            className="cursor-pointer rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-[#006A4E]"

          >

            <Paperclip size={20}/>

          </label>








          <input

            value={prompt}

            onChange={(e)=>
              setPrompt(e.target.value)
            }


            onKeyDown={handleKeyDown}


            disabled={sending}


            placeholder={
              service === 'image'
              ? 'Describe the image you want to generate...'
              : service === 'document'
              ? 'Describe the document you want...'
              : service === 'data_analysis'
              ? 'Ask about your data or upload an Excel file...'
              : 'Ask anything...'
            }


            className="flex-1 bg-transparent text-slate-900 placeholder:text-slate-400 outline-none"

          />








          <button

            onClick={handleSend}

            disabled={sending}

            className="rounded-lg bg-[#006A4E] p-3 text-white transition hover:bg-[#00543E] disabled:opacity-50"

          >

            <Send size={18}/>

          </button>





        </div>



      </div>



    </div>

  )

}