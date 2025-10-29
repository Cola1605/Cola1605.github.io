/**
 * Vector Search using pre-computed embeddings
 * Uses cosine similarity for semantic search
 */

class VectorSearch {
    constructor() {
        this.embeddings = [];
        this.isLoaded = false;
        this.isLoading = false;
        this.transformersPipeline = null;
    }

    // Load embeddings data
    async loadEmbeddings() {
        if (this.isLoaded) return;
        if (this.isLoading) {
            // Wait for existing load to complete
            while (this.isLoading) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            return;
        }

        this.isLoading = true;
        try {
            console.log('📥 Loading embeddings...');
            const response = await fetch('/data/embeddings.min.json');
            this.embeddings = await response.json();
            this.isLoaded = true;
            console.log(`✅ Loaded ${this.embeddings.length} post embeddings`);
        } catch (error) {
            console.error('❌ Failed to load embeddings:', error);
            throw error;
        } finally {
            this.isLoading = false;
        }
    }

    // Load Transformers.js for query embedding
    async loadTransformers() {
        if (this.transformersPipeline) return;

        try {
            console.log('📥 Loading Transformers.js...');
            
            // Dynamically import transformers
            const { pipeline } = await import('https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.1');
            
            console.log('🔄 Loading embedding model...');
            this.transformersPipeline = await pipeline(
                'feature-extraction', 
                'Xenova/all-MiniLM-L6-v2'
            );
            
            console.log('✅ Transformers.js loaded successfully!');
        } catch (error) {
            console.error('❌ Failed to load Transformers.js:', error);
            throw error;
        }
    }

    // Generate embedding for query text
    async generateQueryEmbedding(text) {
        if (!this.transformersPipeline) {
            await this.loadTransformers();
        }

        const output = await this.transformersPipeline(text, {
            pooling: 'mean',
            normalize: true
        });

        return Array.from(output.data);
    }

    // Calculate cosine similarity between two vectors
    cosineSimilarity(vecA, vecB) {
        if (vecA.length !== vecB.length) {
            throw new Error('Vectors must have same length');
        }

        let dotProduct = 0;
        let normA = 0;
        let normB = 0;

        for (let i = 0; i < vecA.length; i++) {
            dotProduct += vecA[i] * vecB[i];
            normA += vecA[i] * vecA[i];
            normB += vecB[i] * vecB[i];
        }

        if (normA === 0 || normB === 0) return 0;

        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }

    // Search using vector similarity
    async search(query, topK = 10) {
        // Ensure embeddings are loaded
        if (!this.isLoaded) {
            await this.loadEmbeddings();
        }

        console.log(`🔍 Searching for: "${query}"`);

        // Generate query embedding
        const queryEmbedding = await this.generateQueryEmbedding(query);

        // Calculate similarity for all posts
        const results = this.embeddings.map(post => {
            const similarity = this.cosineSimilarity(queryEmbedding, post.embedding);
            return {
                title: post.title,
                description: post.description,
                url: post.url,
                date: post.date,
                categories: post.categories,
                tags: post.tags,
                score: similarity
            };
        });

        // Sort by similarity score (descending)
        results.sort((a, b) => b.score - a.score);

        // Return top K results
        return results.slice(0, topK);
    }

    // Preload for faster first search
    async preload() {
        try {
            await Promise.all([
                this.loadEmbeddings(),
                this.loadTransformers()
            ]);
            console.log('✅ Vector search ready!');
        } catch (error) {
            console.warn('⚠️ Vector search preload failed:', error);
        }
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VectorSearch;
}
