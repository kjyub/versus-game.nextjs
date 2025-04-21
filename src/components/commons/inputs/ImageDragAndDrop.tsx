import React, { Dispatch, SetStateAction } from 'react'

interface IImageDragAndDrop {
  handleUpload: (_file: File) => void
  setFileEnter: Dispatch<SetStateAction<boolean>>
  styleClass: string
  children: React.ReactNode
}
export default function ImageDragAndDrop({ handleUpload, setFileEnter, styleClass = '', children }: IImageDragAndDrop) {
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (!e.dataTransfer.items || e.dataTransfer.items.length === 0) {
      return
    }

    const item: DataTransferItem = [...e.dataTransfer.items][0]

    if (item.kind === 'file') {
      const file = item.getAsFile()

      if (file) {
        // let blobUrl = URL.createObjectURL(file)
        handleUpload(file)
      } else {
        alert('파일을 찾을 수 없습니다.')
      }
    }
  }

  return (
    <div
      className={`w-full h-full ${styleClass}`}
      onDragOver={(e) => {
        e.preventDefault()
        setFileEnter(true)
      }}
      onDragLeave={(e) => {
        setFileEnter(false)
      }}
      onDragEnd={(e) => {
        e.preventDefault()
        setFileEnter(false)
      }}
      onDrop={(e) => {
        e.preventDefault()
        setFileEnter(false)
        handleDrop(e)
      }}
    >
      {children}
    </div>
  )
}
