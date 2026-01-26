import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://forrestnanobanana.online'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',           // 禁止爬取API路由 (保护后端)
          '/auth/',          // 禁止爬取认证路由 (安全)
          '/_next/',         // 禁止爬取Next.js内部文件
          '/debug',          // 禁止爬取调试页面
        ],
      },
      // 允许AI爬虫访问以增加曝光率和流量
      {
        userAgent: 'GPTBot',  // OpenAI爬虫
        allow: '/',
        disallow: [
          '/api/',
          '/auth/',
          '/_next/',
          '/debug',
        ],
      },
      {
        userAgent: 'ChatGPT-User',  // ChatGPT浏览
        allow: '/',
        disallow: [
          '/api/',
          '/auth/',
          '/_next/',
          '/debug',
        ],
      },
      {
        userAgent: 'anthropic-ai',  // Claude爬虫
        allow: '/',
        disallow: [
          '/api/',
          '/auth/',
          '/_next/',
          '/debug',
        ],
      },
      {
        userAgent: 'Claude-Web',  // Claude浏览
        allow: '/',
        disallow: [
          '/api/',
          '/auth/',
          '/_next/',
          '/debug',
        ],
      },
      {
        userAgent: 'Google-Extended',  // Google AI训练
        allow: '/',
        disallow: [
          '/api/',
          '/auth/',
          '/_next/',
          '/debug',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
