import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

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
    const { image, prompt } = await request.json();

    if (!image || !prompt) {
      return NextResponse.json(
        { error: 'Image and prompt are required' },
        { status: 400 }
      );
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
    console.error('Error generating image:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    
    // Return more detailed error information
    const errorMessage = error?.message || error?.error?.message || 'Failed to generate image';
    const statusCode = error?.status || error?.response?.status || 500;
    
    return NextResponse.json(
      { 
        error: errorMessage,
        statusCode: statusCode,
        details: error?.error || {}
      },
      { status: 500 }
    );
  }
}
