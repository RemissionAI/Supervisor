import z from 'zod'

export default z
  .instanceof(File)
  .refine(file => file.type === 'application/pdf', {
    message: 'The file must be a valid PDF',
  })
  .refine(file => file.size <= 20 * 1024 * 1024, {
    message: 'The PDF file size must not exceed 20MB',
  })
  .refine(file => file.size > 0, {
    message: 'The PDF file must not be empty',
  })
