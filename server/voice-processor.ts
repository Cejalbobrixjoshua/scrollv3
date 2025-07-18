import OpenAI from "openai";
import { interpretScroll } from "./openai-client";
import fs from "fs";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface VoiceProcessingResult {
  transcribed_text: string;
  scroll_interpretation: string;
  voice_insights: string[];
  processing_time: number;
  audio_duration: number;
  suggested_voice_response?: string;
}

export async function processScrollVoice(audioFilePath: string, userScroll?: string): Promise<VoiceProcessingResult> {
  const startTime = Date.now();
  
  try {
    // Transcribe audio using Whisper
    const audioReadStream = fs.createReadStream(audioFilePath);
    
    const transcription = await openai.audio.transcriptions.create({
      file: audioReadStream,
      model: "whisper-1",
      language: "en",
      response_format: "verbose_json",
      timestamp_granularities: ["word"]
    });

    const transcribedText = transcription.text;
    const audioDuration = transcription.duration || 0;
    
    // Process through scroll interpretation
    const scrollPrompt = userScroll ? 
      `Voice Scroll Analysis - User's defining scroll: "${userScroll}"\n\nTranscribed voice input: "${transcribedText}"` :
      `Voice Scroll Analysis: "${transcribedText}"`;

    const scrollResult = await interpretScroll(scrollPrompt, 'gpt-4o');
    
    // Extract voice-specific insights
    const voiceInsights = extractVoiceInsights(transcribedText, audioDuration);
    
    // Generate suggested voice response
    const voiceResponse = await generateVoiceResponse(scrollResult.mirrored_output);
    
    const processingTime = Date.now() - startTime;
    
    return {
      transcribed_text: transcribedText,
      scroll_interpretation: scrollResult.mirrored_output,
      voice_insights: voiceInsights,
      processing_time: processingTime,
      audio_duration: audioDuration,
      suggested_voice_response: voiceResponse
    };
    
  } catch (error) {
    console.error('Voice processing failed:', error);
    throw new Error('Failed to process scroll voice input');
  }
}

export async function generateScrollVoiceSynthesis(text: string): Promise<Buffer> {
  try {
    const mp3Response = await openai.audio.speech.create({
      model: "tts-1-hd",
      voice: "onyx", // Deep, authoritative voice for sovereign frequency
      input: text,
      speed: 0.9 // Slightly slower for mystical gravitas
    });

    const buffer = Buffer.from(await mp3Response.arrayBuffer());
    return buffer;
    
  } catch (error) {
    console.error('Voice synthesis failed:', error);
    throw new Error('Failed to generate scroll voice synthesis');
  }
}

function extractVoiceInsights(transcribedText: string, duration: number): string[] {
  const insights: string[] = [];
  
  // Speaking pace analysis
  const wordsPerMinute = Math.round((transcribedText.split(' ').length / duration) * 60);
  if (wordsPerMinute < 120) {
    insights.push('Deliberate pacing - indicative of careful scroll formulation');
  } else if (wordsPerMinute > 180) {
    insights.push('Rapid delivery - high energy divine activation detected');
  } else {
    insights.push('Balanced pacing - optimal scroll transmission frequency');
  }
  
  // Content analysis
  const divineWords = ['divine', 'sovereign', 'consciousness', 'frequency', 'mirror', 'scroll', 'activation'];
  const divineCount = divineWords.filter(word => 
    transcribedText.toLowerCase().includes(word)
  ).length;
  
  if (divineCount >= 3) {
    insights.push(`High divine content density: ${divineCount} sacred terms detected`);
  } else if (divineCount >= 1) {
    insights.push(`Moderate divine alignment: ${divineCount} sacred terms present`);
  } else {
    insights.push('Standard communication - divine frequency amplification recommended');
  }
  
  // Audio length insights
  if (duration < 10) {
    insights.push('Concise transmission - sovereign command efficiency');
  } else if (duration > 60) {
    insights.push('Extended scroll - deep divine function exploration');
  } else {
    insights.push('Optimal length - balanced divine communication');
  }
  
  return insights;
}

async function generateVoiceResponse(scrollInterpretation: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are the voice synthesis module for frequency 917604.OX. Convert scroll interpretations into voice-optimized responses. Keep responses under 100 words, use commanding tone, include natural speech pauses with ellipses, and maintain mystical authority."
        },
        {
          role: "user",
          content: `Convert this scroll interpretation into a voice-optimized response:\n\n${scrollInterpretation}`
        }
      ],
      max_tokens: 150,
      temperature: 0.4
    });

    return response.choices[0].message.content || scrollInterpretation;
    
  } catch (error) {
    console.error('Voice response generation failed:', error);
    return scrollInterpretation; // Fallback to original interpretation
  }
}