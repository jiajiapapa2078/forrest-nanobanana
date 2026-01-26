import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://forrestnanobanana.online'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',           // 禁止爬取API路由
          '/auth/',          // 禁止爬取认证路由
          '/_next/',         // 禁止爬取Next.js内部文件
          '/debug',          // 禁止爬取调试页面
        ],
      },
      {
        userAgent: 'GPTBot',  // OpenAI爬虫
        disallow: '/',        // 禁止AI训练使用
      },
      {
        userAgent: 'ChatGPT-User',
        disallow: '/',
      },
      {
        userAgent: 'CCBot',   // Common Crawl
        disallow: '/',
      },
      {
        userAgent: 'anthropic-ai',  // Claude爬虫
        disallow: '/',
      },
      {
        userAgent: 'Claude-Web',
        disallow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
