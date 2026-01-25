/**
 * 输入验证工具
 * 防止XSS、SQL注入等攻击
 */

import { z } from 'zod'

/**
 * 图片上传验证
 */
export const imageUploadSchema = z.object({
  image: z
    .string()
    .refine((val) => val.startsWith('data:image/'), {
      message: 'Invalid image format. Must be a data URL.',
    })
    .refine(
      (val) => {
        // 检查base64大小 (约10MB)
        const base64Data = val.split(',')[1]
        if (!base64Data) return false
        const sizeInBytes = (base64Data.length * 3) / 4
        return sizeInBytes <= 10 * 1024 * 1024
      },
      {
        message: 'Image size must be less than 10MB',
      }
    )
    .refine(
      (val) => {
        // 验证MIME类型
        const mimeMatch = val.match(/^data:image\/(png|jpeg|jpg|gif|webp);base64,/)
        return mimeMatch !== null
      },
      {
        message: 'Invalid image type. Allowed: PNG, JPEG, JPG, GIF, WEBP',
      }
    ),
  prompt: z
    .string()
    .min(1, 'Prompt is required')
    .max(1000, 'Prompt must be less than 1000 characters')
    .refine((val) => !/<script|javascript:|onerror|onclick/i.test(val), {
      message: 'Invalid characters detected in prompt',
    })
    .refine((val) => !/(\bOR\b|\bAND\b).*=.*('|")/i.test(val), {
      message: 'Suspicious pattern detected in prompt',
    }),
})

/**
 * Email验证
 */
export const emailSchema = z
  .string()
  .email('Invalid email address')
  .max(255, 'Email too long')

/**
 * URL验证
 */
export const urlSchema = z
  .string()
  .url('Invalid URL')
  .refine((val) => val.startsWith('https://'), {
    message: 'Only HTTPS URLs are allowed',
  })

/**
 * 清理HTML标签
 */
export function sanitizeHtml(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

/**
 * 清理SQL特殊字符
 */
export function sanitizeSql(input: string): string {
  return input
    .replace(/'/g, "''")
    .replace(/;/g, '')
    .replace(/--/g, '')
    .replace(/\/\*/g, '')
    .replace(/\*\//g, '')
}

/**
 * 验证文件大小
 */
export function validateFileSize(
  base64String: string,
  maxSizeMB: number = 10
): { valid: boolean; error?: string } {
  try {
    const base64Data = base64String.split(',')[1]
    if (!base64Data) {
      return { valid: false, error: 'Invalid base64 data' }
    }

    const sizeInBytes = (base64Data.length * 3) / 4
    const sizeInMB = sizeInBytes / (1024 * 1024)

    if (sizeInMB > maxSizeMB) {
      return {
        valid: false,
        error: `File size (${sizeInMB.toFixed(2)}MB) exceeds maximum allowed size (${maxSizeMB}MB)`,
      }
    }

    return { valid: true }
  } catch (error) {
    return { valid: false, error: 'Failed to validate file size' }
  }
}

/**
 * 验证图片尺寸
 */
export async function validateImageDimensions(
  base64String: string,
  maxWidth: number = 4096,
  maxHeight: number = 4096
): Promise<{ valid: boolean; error?: string; dimensions?: { width: number; height: number } }> {
  return new Promise((resolve) => {
    const img = new Image()
    
    img.onload = () => {
      if (img.width > maxWidth || img.height > maxHeight) {
        resolve({
          valid: false,
          error: `Image dimensions (${img.width}x${img.height}) exceed maximum allowed (${maxWidth}x${maxHeight})`,
          dimensions: { width: img.width, height: img.height },
        })
      } else {
        resolve({
          valid: true,
          dimensions: { width: img.width, height: img.height },
        })
      }
    }
    
    img.onerror = () => {
      resolve({
        valid: false,
        error: 'Failed to load image',
      })
    }
    
    img.src = base64String
  })
}

/**
 * 检测恶意内容
 */
export function detectMaliciousContent(input: string): { safe: boolean; reason?: string } {
  const maliciousPatterns = [
    /<script/i,
    /javascript:/i,
    /onerror=/i,
    /onclick=/i,
    /onload=/i,
    /<iframe/i,
    /eval\(/i,
    /document\.cookie/i,
    /window\.location/i,
  ]

  for (const pattern of maliciousPatterns) {
    if (pattern.test(input)) {
      return {
        safe: false,
        reason: `Malicious pattern detected: ${pattern.source}`,
      }
    }
  }

  return { safe: true }
}
