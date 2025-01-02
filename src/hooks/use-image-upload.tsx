import { generateId, humanBytes } from "@/lib/utils"
import { useCallback, useState } from "react"

type FileUploadState = {
  uploadKey: string
  file: File
  preview: string | true | null
  name: string | null
  size: string | null
  isUploading: boolean
  isError: string | null
}

type FileUploadStateMap = Record<string, FileUploadState>

export function useFileUpload() {
  const [fileState, setfileState] = useState<FileUploadStateMap>({})

  const handleFilePreview = useCallback(
    async ({
      key,
      event,
      setValue,
      keyprefix = "",
    }: {
      key: string
      event: React.ChangeEvent<HTMLInputElement>
      setValue: (field: string, value: string) => void
      keyprefix?: string
    }) => {
      const uploadKey = keyprefix + (key || generateId())

      const files = event.target.files
      if (!(files instanceof FileList) || !files.length) return

      const file = files[0]
      const commonState = {
        uploadKey,
        file,
        name: file.name,
        size: file.type.split("/")[1] + " • " + humanBytes(file.size),
        isUploading: false,
        isError: null,
      }

      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = () => {
          if (reader.result) {
            setfileState((prev) => ({
              ...prev,
              [key]: {
                ...prev[key],
                ...commonState,
                preview: reader.result as string,
              },
            }))
            setValue(
              key,
              JSON.stringify({ key: uploadKey, value: reader.result }),
            )
          }
        }
        reader.readAsDataURL(file)
      } else {
        setfileState((prev) => ({
          ...prev,
          [key]: {
            ...prev[key],
            ...commonState,
            preview: true,
          },
        }))
        setValue(key, JSON.stringify({ key: uploadKey, value: true }))
      }
    },
    [],
  )

  // const handleFileUpload = useCallback(
  //   async ({
  //     key,
  //     event,
  //   }: {
  //     key: string
  //     event: React.ChangeEvent<HTMLInputElement>
  //   }) => {
  //     const files = event.target.files
  //     if (!(files instanceof FileList) || !files.length) return

  //     let file = files[0]

  //     if (file.type.startsWith("image/")) {
  //       try {
  //         const compressedFile = await new Promise<File>((resolve, reject) => {
  //           new Compressor(file, {
  //             quality: 0.9,
  //             success(result) {
  //               resolve(result as File)
  //             },
  //             error(err) {
  //               reject(err)
  //             },
  //           })
  //         })

  //         if (compressedFile.size < file.size) file = compressedFile
  //       } catch (err) {
  //         console.error("Image compression failed:", err)
  //       }
  //     }

  //     try {
  //       const checksum = await createChecksum(file)

  //       const signedUrlResponse = await fetch("/api/v1/s3/upload", {
  //         method: "PUT",
  //         body: JSON.stringify({
  //           Key: customKey,
  //           ContentType: file.type,
  //           ContentLength: file.size,
  //           ChecksumSHA256: checksum,
  //         }),
  //       })

  //       if (!signedUrlResponse.ok) {
  //         throw new Error("Failed to fetch signed URL.")
  //       }

  //       const { url } = await signedUrlResponse.json()

  //       const uploadResponse = await fetch(url, {
  //         method: "PUT",
  //         headers: {
  //           "Content-Type": file.type,
  //         },
  //         body: file,
  //       })

  //       if (!uploadResponse.ok) {
  //         throw new Error("File upload failed.")
  //       }

  //       console.log("File uploaded successfully.")

  //       setfileState((prev) => ({
  //         ...prev,
  //         [key]: {
  //           ...prev[key],
  //           isUploading: false,
  //           uploadError: null,
  //         },
  //       }))

  //       return null
  //     } catch (err) {
  //       setfileState((prev) => ({
  //         ...prev,
  //         [key]: {
  //           ...prev[key],
  //           isUploading: false,
  //           uploadError: (err as Error).message,
  //         },
  //       }))
  //       console.error("File upload failed:", err)
  //       return null
  //     }
  //   },
  //   [customKey],
  // )

  return { fileState, handleFilePreview }
}
