/**
 * Batch Video Generation
 * Generate multiple videos in parallel from CSV or templates
 */

import { generateVideo } from './video-generator';
import { createProject } from '../firestore/projects';
import { deductCredits } from '../firestore/init';

export interface BatchVideoConfig {
  userId: string;
  template: {
    avatar: string;
    voice: string;
    aspectRatio: '9:16' | '16:9' | '1:1';
    background?: string;
  };
  variations: Array<{
    title: string;
    script: string;
    tags?: string[];
  }>;
}

export interface BatchResult {
  total: number;
  successful: number;
  failed: number;
  projectIds: string[];
  errors: Array<{
    index: number;
    error: string;
  }>;
}

/**
 * Generate multiple videos in batch
 */
export async function generateBatchVideos(config: BatchVideoConfig): Promise<BatchResult> {
  const { userId, template, variations } = config;

  console.log(`🎬 Starting batch generation: ${variations.length} videos`);

  // Calculate total credits needed
  const creditsPerVideo = 5; // Approximate
  const totalCreditsNeeded = variations.length * creditsPerVideo;

  // Deduct all credits upfront
  try {
    await deductCredits(userId, totalCreditsNeeded);
  } catch (error: any) {
    throw new Error(`Insufficient credits: need ${totalCreditsNeeded}, ${error.message}`);
  }

  const projectIds: string[] = [];
  const errors: Array<{ index: number; error: string }> = [];

  // Process in batches of 5 to avoid overwhelming the system
  const BATCH_SIZE = 5;
  for (let i = 0; i < variations.length; i += BATCH_SIZE) {
    const batch = variations.slice(i, i + BATCH_SIZE);

    const batchPromises = batch.map(async (variation, index) => {
      try {
        // Create project
        const projectId = await createProject(userId, {
          title: variation.title,
          script: variation.script,
          avatar: template.avatar,
          voice: template.voice,
          aspectRatio: template.aspectRatio,
          background: template.background || 'gradient',
          tags: variation.tags || [],
          creditsUsed: creditsPerVideo,
        });

        projectIds.push(projectId);

        // Start video generation (async)
        generateVideo({
          projectId,
          userId,
          script: variation.script,
          avatar: template.avatar,
          voice: template.voice,
          aspectRatio: template.aspectRatio,
          background: template.background || 'gradient',
        }).catch((error) => {
          console.error(`Batch video ${i + index} failed:`, error);
          errors.push({
            index: i + index,
            error: error.message,
          });
        });

        return { success: true, projectId };
      } catch (error: any) {
        errors.push({
          index: i + index,
          error: error.message,
        });
        return { success: false, error: error.message };
      }
    });

    await Promise.all(batchPromises);

    // Wait a bit between batches to avoid rate limiting
    if (i + BATCH_SIZE < variations.length) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  const successful = projectIds.length;
  const failed = errors.length;

  console.log(`✅ Batch complete: ${successful} successful, ${failed} failed`);

  return {
    total: variations.length,
    successful,
    failed,
    projectIds,
    errors,
  };
}

/**
 * Parse CSV data for batch generation
 */
export function parseCSVForBatch(csvContent: string): Array<{
  title: string;
  script: string;
  tags?: string[];
}> {
  const lines = csvContent.split('\n').filter((line) => line.trim());

  // First line should be headers
  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());

  const titleIndex = headers.indexOf('title');
  const scriptIndex = headers.indexOf('script');
  const tagsIndex = headers.indexOf('tags');

  if (titleIndex === -1 || scriptIndex === -1) {
    throw new Error('CSV must have "title" and "script" columns');
  }

  const variations = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);

    if (values.length <= Math.max(titleIndex, scriptIndex)) {
      continue; // Skip invalid lines
    }

    const variation: any = {
      title: values[titleIndex],
      script: values[scriptIndex],
    };

    if (tagsIndex !== -1 && values[tagsIndex]) {
      variation.tags = values[tagsIndex].split('|').map((t) => t.trim());
    }

    variations.push(variation);
  }

  return variations;
}

/**
 * Parse a single CSV line (handles quoted values)
 */
function parseCSVLine(line: string): string[] {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

/**
 * Generate variations from a template
 */
export function generateTemplateVariations(baseScript: string, variations: Array<{
  [key: string]: string;
}>): Array<{ title: string; script: string }> {
  return variations.map((vars, index) => {
    let script = baseScript;

    // Replace placeholders with actual values
    Object.keys(vars).forEach((key) => {
      const placeholder = `{{${key}}}`;
      script = script.replace(new RegExp(placeholder, 'g'), vars[key]);
    });

    return {
      title: `Video ${index + 1}`,
      script,
    };
  });
}
