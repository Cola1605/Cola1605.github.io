#!/usr/bin/env node

/**
 * Quick test for vector search functionality
 */

const fs = require('fs');
const path = require('path');

const EMBEDDINGS_FILE = path.join(__dirname, '../static/data/embeddings.min.json');

async function test() {
  console.log('🧪 Testing Vector Search Setup\n');
  
  // Check if embeddings file exists
  console.log('1️⃣ Checking embeddings file...');
  if (!fs.existsSync(EMBEDDINGS_FILE)) {
    console.log('❌ embeddings.min.json not found!');
    console.log('   Run: npm run generate-embeddings');
    process.exit(1);
  }
  console.log('✅ Embeddings file exists\n');
  
  // Load and validate embeddings
  console.log('2️⃣ Loading embeddings...');
  const embeddings = JSON.parse(fs.readFileSync(EMBEDDINGS_FILE, 'utf-8'));
  console.log(`✅ Loaded ${embeddings.length} embeddings\n`);
  
  // Check structure
  console.log('3️⃣ Validating structure...');
  const sample = embeddings[0];
  const requiredFields = ['title', 'description', 'url', 'embedding'];
  const missingFields = requiredFields.filter(f => !sample.hasOwnProperty(f));
  
  if (missingFields.length > 0) {
    console.log('❌ Missing fields:', missingFields);
    process.exit(1);
  }
  console.log('✅ Structure valid\n');
  
  // Check embedding dimensions
  console.log('4️⃣ Checking embedding dimensions...');
  const dims = sample.embedding.length;
  if (dims !== 384) {
    console.log(`❌ Expected 384 dimensions, got ${dims}`);
    process.exit(1);
  }
  console.log(`✅ Embeddings are ${dims}-dimensional\n`);
  
  // File size
  console.log('5️⃣ Checking file size...');
  const stats = fs.statSync(EMBEDDINGS_FILE);
  const sizeKB = (stats.size / 1024).toFixed(2);
  console.log(`📊 File size: ${sizeKB} KB`);
  
  if (stats.size > 1024 * 1024) {
    console.log('⚠️  File is larger than 1MB, may slow down loading');
  } else {
    console.log('✅ File size acceptable\n');
  }
  
  // Sample data
  console.log('6️⃣ Sample embeddings:');
  embeddings.slice(0, 3).forEach((item, i) => {
    console.log(`\n   ${i + 1}. ${item.title}`);
    console.log(`      URL: ${item.url}`);
    console.log(`      Categories: ${item.categories?.join(', ') || 'None'}`);
    console.log(`      Embedding: [${item.embedding.slice(0, 3).map(v => v.toFixed(4)).join(', ')}...]`);
  });
  
  // Test cosine similarity function
  console.log('\n\n7️⃣ Testing cosine similarity...');
  const vec1 = embeddings[0].embedding;
  const vec2 = embeddings[1].embedding;
  
  function cosineSimilarity(a, b) {
    let dot = 0, normA = 0, normB = 0;
    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
  }
  
  const similarity = cosineSimilarity(vec1, vec2);
  console.log(`   Similarity between post 1 and 2: ${(similarity * 100).toFixed(2)}%`);
  
  if (similarity >= 0 && similarity <= 1) {
    console.log('✅ Cosine similarity working correctly\n');
  } else {
    console.log('❌ Cosine similarity out of range!');
    process.exit(1);
  }
  
  // Final summary
  console.log('═'.repeat(50));
  console.log('✨ All tests passed!');
  console.log('═'.repeat(50));
  console.log('\n📊 Summary:');
  console.log(`   Total posts: ${embeddings.length}`);
  console.log(`   Embedding dimensions: ${dims}`);
  console.log(`   File size: ${sizeKB} KB`);
  console.log(`   Average embedding: ${JSON.stringify(sample.embedding).length} bytes`);
  console.log('\n🚀 Vector search is ready to use!');
  console.log('\n💡 Next steps:');
  console.log('   1. Run: hugo server');
  console.log('   2. Visit: http://localhost:1313');
  console.log('   3. Try AI search in the search widget');
  console.log('   4. Toggle "🔮 Tìm kiếm thông minh (AI)"');
}

test().catch(error => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});
