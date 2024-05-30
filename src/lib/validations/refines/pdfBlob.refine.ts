import z from 'zod'

export const pdfBlob = z
  .instanceof(Blob)
  .refine(
    (blob) => {
      return blob.type === 'application/pdf'
    },
    {
      message: 'The file must be a valid PDF',
    },
  )
  .refine(
    (blob) => {
      return blob.size <= 20 * 1024 * 1024
    },
    {
      message: 'The PDF file size must not exceed 20MB',
    },
  )
  .refine(
    (blob) => {
      return blob.size > 0
    },
    {
      message: 'The PDF file must not be empty',
    },
  )
