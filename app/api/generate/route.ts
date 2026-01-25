import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@/lib/supabase/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { imageUploadSchema } from '@/lib/validation';
import { createErrorResponse, UnauthorizedError, RateLimitError, ValidationError } from '@/lib/error-handler';

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "https://imgeditor.co",
    "X-Title": "Nano Banana Image Editor",
  },
});

export async function POST(request: NextRequest) {
  try {
    // 1. 速率限制检查 (10次/分钟)
    const rateLimitResult = await checkRateLimit(request, 10);
    if (!rateLimitResult.success) {
      throw new RateLimitError(rateLimitResult.error);
    }

    // 2. 验证用户登录状态
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Authentication not configured' },
        { status: 500 }
      );
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new UnauthorizedError('Please sign in to use the image editor');
    }

    console.log('Authenticated user:', user.email);

    // 3. 输入验证
    const body = await request.json();
    const validationResult = imageUploadSchema.safeParse(body);
    
    if (!validationResult.success) {
      throw new ValidationError('Invalid input data', validationResult.error.errors);
    }

    const { image, prompt } = validationResult.data;

    if (!image || !prompt) {
      throw new ValidationError('Image and prompt are required');
    }

    // Validate API key
    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    console.log('Sending request to OpenRouter API...');

    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.5-flash-image",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt,
            },
            {
              type: "image_url",
              image_url: {
                url: image,
              },
            },
          ],
        },
      ],
      // @ts-ignore - modalities is supported but not in types
      modalities: ["image", "text"],
    });

    console.log('Received response from OpenRouter API');

    const message = completion.choices[0].message;
    
    // Extract generated images from the response
    // @ts-ignore - images field exists but not in types
    const generatedImages = message.images || [];

    console.log('Generated images count:', generatedImages.length);

    return NextResponse.json({ 
      result: message.content,
      images: generatedImages 
    });
  } catch (error: any) {
    return createErrorResponse(error);
  }
}
