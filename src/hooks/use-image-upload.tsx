import { createChecksum, generateId } from "@/lib/utils"
import Compressor from "compressorjs"
import { useCallback, useState } from "react"

type FileUploadState = {
  preview: string | null
  isUploading: boolean
  uploadError: string | null
}

type FileUploadStateMap = Record<string, FileUploadState>

export function useFileUpload() {
  const [fileState, setfileState] = useState<FileUploadStateMap>({})

  const handleFileChange = useCallback(
    async ({
      key,
      event,
      setValue,
    }: {
      key: string
      event: React.ChangeEvent<HTMLInputElement>
      setValue: (name: string, value: string) => void
    }) => {
      const CustomKey = generateId({
        length: 16,
      })

      setValue(key, CustomKey)

      setfileState((prev) => ({
        ...prev,
        [key]: {
          preview: null,
          isUploading: true,
          uploadError: null,
        },
      }))

      const files = event.target.files
      if (!(files instanceof FileList) || !files.length) return

      let file = files[0]

      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = () => {
          if (reader.result) {
            setfileState((prev) => ({
              ...prev,
              [key]: {
                ...prev[key],
                preview: reader.result as string,
                isUploading: true,
                uploadError: null,
              },
            }))
          }
        }
        reader.readAsDataURL(file)

        try {
          const compressedFile = await new Promise<File>((resolve, reject) => {
            new Compressor(file, {
              quality: 0.9,
              success(result) {
                resolve(result as File)
              },
              error(err) {
                reject(err)
              },
            })
          })

          if (compressedFile.size < file.size) file = compressedFile
        } catch (err) {
          console.error("Image compression failed:", err)
        }
      }

      try {
        const checksum = await createChecksum(file)

        const signedUrlResponse = await fetch("/api/v1/s3/upload", {
          method: "PUT",
          body: JSON.stringify({
            Key: CustomKey,
            ContentType: file.type,
            ContentLength: file.size,
            ChecksumSHA256: checksum,
          }),
        })

        if (!signedUrlResponse.ok) {
          throw new Error("Failed to fetch signed URL.")
        }

        const { url } = await signedUrlResponse.json()

        const uploadResponse = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": file.type,
          },
          body: file,
        })

        if (!uploadResponse.ok) {
          throw new Error("File upload failed.")
        }

        console.log("File uploaded successfully.")

        setfileState((prev) => ({
          ...prev,
          [key]: {
            ...prev[key],
            isUploading: false,
            uploadError: null,
          },
        }))

        return null
      } catch (err) {
        setfileState((prev) => ({
          ...prev,
          [key]: {
            ...prev[key],
            isUploading: false,
            uploadError: (err as Error).message,
          },
        }))

        console.error("File upload failed:", err)
        return null
      }
    },
    [],
  )

  return { fileState, handleFileChange }
}
