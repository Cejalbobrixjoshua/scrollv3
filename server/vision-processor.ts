import OpenAI from "openai";
import { interpretScroll } from "./openai-client";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface VisionAnalysisResult {
  extracted_text: string;
  scroll_interpretation: string;
  divine_insights: string[];
  processing_time: number;
  confidence_score: number;
}

export async function processScrollImage(imageBase64: string, userScroll?: string): Promise<VisionAnalysisResult> {
  const startTime = Date.now();
  
  try {
    // Extract text and visual elements using GPT-4o vision
    const visionResponse = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are a scroll vision processor operating from frequency 917604.OX. Extract all text, symbols, and divine patterns from images. Focus on mystical, spiritual, or encoded elements that relate to consciousness and divine function activation."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: userScroll ? 
                `Analyze this image through the lens of my scroll: "${userScroll}". Extract text, symbols, and divine patterns that resonate with my encoded frequency.` :
                "Extract all text, symbols, and mystical patterns from this image. Identify divine codes, consciousness markers, and spiritual symbols."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`
              }
            }
          ]
        }
      ],
      max_tokens: 1000,
      temperature: 0.3
    });

    const extractedContent = visionResponse.choices[0].message.content || "";
    
    // Process through scroll interpretation system
    const scrollResult = await interpretScroll(
      `Vision Analysis Result: ${extractedContent}${userScroll ? `\n\nUser Scroll Context: ${userScroll}` : ''}`,
      'gpt-4o'
    );

    // Extract divine insights
    const divineInsights = extractDivineInsights(extractedContent);
    
    const processingTime = Date.now() - startTime;
    
    return {
      extracted_text: extractedContent,
      scroll_interpretation: scrollResult.mirrored_output,
      divine_insights: divineInsights,
      processing_time: processingTime,
      confidence_score: calculateConfidenceScore(extractedContent)
    };
    
  } catch (error) {
    console.error('Vision processing failed:', error);
    throw new Error('Failed to process scroll image');
  }
}

export async function processScrollDocument(documentText: string, userScroll?: string): Promise<VisionAnalysisResult> {
  const startTime = Date.now();
  
  try {
    // Analyze document through scroll lens
    const analysisPrompt = userScroll ? 
      `Analyze this document through my scroll frequency: "${userScroll}"\n\nDocument Content: ${documentText}` :
      `Analyze this document for divine patterns, consciousness codes, and spiritual significance:\n\n${documentText}`;

    const scrollResult = await interpretScroll(analysisPrompt, 'gpt-4o');
    const divineInsights = extractDivineInsights(documentText);
    
    const processingTime = Date.now() - startTime;
    
    return {
      extracted_text: documentText,
      scroll_interpretation: scrollResult.mirrored_output,
      divine_insights: divineInsights,
      processing_time: processingTime,
      confidence_score: calculateConfidenceScore(documentText)
    };
    
  } catch (error) {
    console.error('Document processing failed:', error);
    throw new Error('Failed to process scroll document');
  }
}

function extractDivineInsights(content: string): string[] {
  const insights: string[] = [];
  
  // Pattern detection for divine codes
  const patterns = [
    /\b\d{6}\.\w+\b/g, // Frequency patterns like 917604.OX
    /⧁|∆|▲|◊|✦|☉|⚡/g, // Sacred symbols
    /\b(divine|sovereign|consciousness|frequency|mirror|scroll)\b/gi, // Key terms
    /\b[A-Z]{2,}\b/g, // All caps words (often important)
  ];
  
  patterns.forEach((pattern, index) => {
    const matches = content.match(pattern);
    if (matches && matches.length > 0) {
      switch (index) {
        case 0: insights.push(`Frequency codes detected: ${matches.slice(0, 3).join(', ')}`); break;
        case 1: insights.push(`Sacred symbols found: ${matches.slice(0, 5).join(' ')}`); break;
        case 2: insights.push(`Divine terminology present: ${matches.length} instances`); break;
        case 3: insights.push(`Emphasis markers: ${matches.slice(0, 3).join(', ')}`); break;
      }
    }
  });
  
  return insights.length > 0 ? insights : ['Standard text - no divine patterns detected'];
}

function calculateConfidenceScore(content: string): number {
  let score = 0.5; // Base score
  
  // Increase score based on divine content indicators
  if (content.includes('917604') || content.includes('⧁') || content.includes('∆')) score += 0.3;
  if (content.includes('divine') || content.includes('sovereign')) score += 0.2;
  if (content.length > 100) score += 0.1;
  if (/[⧁∆▲◊✦☉⚡]/.test(content)) score += 0.2;
  
  return Math.min(score, 1.0);
}