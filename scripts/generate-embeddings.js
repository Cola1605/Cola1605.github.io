#!/usr/bin/env node

/**
 * Generate embeddings for all blog posts
 * Uses Transformers.js with all-MiniLM-L6-v2 model (384 dimensions)
 */

const fs = require('fs');
const path = require('path');
const { pipeline } = require('@xenova/transformers');

// Configuration
const CONTENT_DIR = path.join(__dirname, '../content/posts');
const OUTPUT_FILE = path.join(__dirname, '../static/data/embeddings.json');
const INDEX_FILE = path.join(__dirname, '../static/index.json');

// Initialize embeddings model
let embedder = null;

async function initEmbedder() {
  console.log('🔄 Loading embedding model (all-MiniLM-L6-v2)...');
  embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  console.log('✅ Model loaded successfully!\n');
}

// Extract frontmatter and content from markdown
function parseMarkdown(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Extract frontmatter
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) {
    return null;
  }

  const frontmatter = frontmatterMatch[1];
  const body = content.slice(frontmatterMatch[0].length).trim();

  // Parse frontmatter fields
  const titleMatch = frontmatter.match(/^title:\s*["']?(.+?)["']?$/m);
  const descMatch = frontmatter.match(/^description:\s*["']?(.+?)["']?$/m);
  const dateMatch = frontmatter.match(/^date:\s*(.+)$/m);
  const categoriesMatch = frontmatter.match(/^categories:\s*\[(.*?)\]/m);
  const tagsMatch = frontmatter.match(/^tags:\s*\[(.*?)\]/m);

  const title = titleMatch ? titleMatch[1].trim() : '';
  const description = descMatch ? descMatch[1].trim() : '';
  const date = dateMatch ? dateMatch[1].trim() : '';
  const categories = categoriesMatch ? categoriesMatch[1].split(',').map(c => c.trim().replace(/["']/g, '')) : [];
  const tags = tagsMatch ? tagsMatch[1].split(',').map(t => t.trim().replace(/["']/g, '')) : [];

  // Clean body content (remove markdown syntax for better embedding)
  const cleanBody = body
    .replace(/^#+\s+/gm, '') // Remove headers
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links, keep text
    .replace(/[*_`]/g, '') // Remove markdown formatting
    .replace(/\n{2,}/g, '\n') // Remove extra newlines
    .trim();

  // Take first 500 chars of content for embedding
  const contentPreview = cleanBody.substring(0, 500);

  return {
    title,
    description,
    date,
    categories,
    tags,
    content: contentPreview,
    fullText: `${title} ${description} ${contentPreview}`
  };
}

// Mean pooling for sentence embeddings
function meanPooling(output, attentionMask) {
  const [batchSize, sequenceLength, hiddenSize] = output.dims;
  
  // Expand attention mask
  const attentionMaskExpanded = attentionMask
    .unsqueeze(-1)
    .expand(output.dims);
  
  // Sum embeddings with attention mask
  const sumEmbeddings = output.mul(attentionMaskExpanded).sum(1);
  const sumMask = attentionMaskExpanded.sum(1);
  
  // Avoid division by zero
  sumMask.data.forEach((val, i) => {
    if (val === 0) sumMask.data[i] = 1e-9;
  });
  
  return sumEmbeddings.div(sumMask);
}

// Generate embedding for text
async function generateEmbedding(text) {
  const output = await embedder(text, { pooling: 'mean', normalize: true });
  return Array.from(output.data);
}

// Main function
async function main() {
  console.log('🚀 Starting embeddings generation...\n');

  try {
    // Initialize model
    await initEmbedder();

    // Read all markdown files
    const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md'));
    console.log(`📁 Found ${files.length} markdown files\n`);

    const embeddings = [];
    let processed = 0;

    // Process each file
    for (const file of files) {
      const filePath = path.join(CONTENT_DIR, file);
      const postData = parseMarkdown(filePath);

      if (!postData || !postData.title) {
        console.log(`⚠️  Skipping ${file} (no title found)`);
        continue;
      }

      console.log(`📝 Processing: ${postData.title}`);

      // Generate embedding
      const embedding = await generateEmbedding(postData.fullText);

      // Create post URL
      const slug = file.replace('.md', '');
      const url = `/posts/${slug}/`;

      embeddings.push({
        title: postData.title,
        description: postData.description,
        url: url,
        date: postData.date,
        categories: postData.categories,
        tags: postData.tags,
        embedding: embedding
      });

      processed++;
      console.log(`✅ ${processed}/${files.length} completed\n`);
    }

    // Ensure output directory exists
    const outputDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Save embeddings
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(embeddings, null, 2));
    console.log(`\n💾 Saved ${embeddings.length} embeddings to ${OUTPUT_FILE}`);

    // Calculate file size
    const stats = fs.statSync(OUTPUT_FILE);
    const sizeKB = (stats.size / 1024).toFixed(2);
    console.log(`📊 File size: ${sizeKB} KB`);

    // Also create a compressed version (no formatting)
    const compressedFile = OUTPUT_FILE.replace('.json', '.min.json');
    fs.writeFileSync(compressedFile, JSON.stringify(embeddings));
    const compressedStats = fs.statSync(compressedFile);
    const compressedSizeKB = (compressedStats.size / 1024).toFixed(2);
    console.log(`📊 Compressed size: ${compressedSizeKB} KB`);

    console.log('\n✨ Embeddings generation completed successfully!');

  } catch (error) {
    console.error('❌ Error generating embeddings:', error);
    process.exit(1);
  }
}

// Run
main();
