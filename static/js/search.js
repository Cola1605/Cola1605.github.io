// Enhanced search with vector embeddings support
class SimpleSearch {
    constructor() {
        this.searchIndex = [];
        this.vectorSearch = null;
        this.useVectorSearch = false;
        this.init();
    }

    async init() {
        try {
            const response = await fetch('/index.json');
            this.searchIndex = await response.json();
            console.log('Search index loaded:', this.searchIndex.length, 'pages');
            
            // Initialize vector search
            this.vectorSearch = new VectorSearch();
            console.log('Vector search initialized');
        } catch (error) {
            console.warn('Search index not found, using basic search');
            this.initBasicSearch();
        }
        this.setupSearchForm();
    }

    initBasicSearch() {
        // Fallback: collect page data from current page
        const posts = document.querySelectorAll('.post');
        this.searchIndex = Array.from(posts).map(post => {
            const title = post.querySelector('.post-title, h1, h2')?.textContent || '';
            const summary = post.querySelector('.post-summary, .excerpt, p')?.textContent || '';
            const href = post.querySelector('a')?.href || window.location.href;
            return { title, summary, href, body: title + ' ' + summary };
        });
    }

    setupSearchForm() {
        const searchForm = document.querySelector('.widget-search .widget__form');
        const searchInput = document.querySelector('.widget-search .widget__field');
        
        if (searchForm && searchInput) {
            // Add search mode toggle
            this.addSearchModeToggle(searchForm);
            
            searchForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const query = searchInput.value.trim();
                if (query) {
                    await this.performSearch(query);
                }
            });

            // Real-time search as user types (only for keyword search)
            searchInput.addEventListener('input', async (e) => {
                const query = e.target.value.trim();
                if (query.length > 2 && !this.useVectorSearch) {
                    this.performSearch(query);
                }
            });
        }
    }

    // Add toggle between keyword and vector search
    addSearchModeToggle(searchForm) {
        const toggle = document.createElement('div');
        toggle.className = 'search-mode-toggle';
        toggle.innerHTML = `
            <label class="search-toggle-label">
                <input type="checkbox" id="vector-search-toggle" />
                <span>🔮 Tìm kiếm thông minh (AI)</span>
            </label>
        `;
        searchForm.appendChild(toggle);

        const checkbox = toggle.querySelector('#vector-search-toggle');
        checkbox.addEventListener('change', (e) => {
            this.useVectorSearch = e.target.checked;
            console.log('Search mode:', this.useVectorSearch ? 'Vector' : 'Keyword');
            
            // Show loading message for first vector search
            if (this.useVectorSearch && this.vectorSearch && !this.vectorSearch.isLoaded) {
                this.showLoadingMessage();
            }
        });
    }

    showLoadingMessage() {
        const existingMsg = document.querySelector('.vector-loading-msg');
        if (existingMsg) return;

        const msg = document.createElement('div');
        msg.className = 'vector-loading-msg';
        msg.style.cssText = 'padding: 1rem; background: #e3f2fd; border-radius: 6px; margin: 1rem 0; text-align: center;';
        msg.innerHTML = '🔄 Đang tải AI search engine lần đầu... (có thể mất 10-20 giây)';
        
        const main = document.querySelector('main, .main-content, .content');
        if (main) {
            main.insertBefore(msg, main.firstChild);
            
            // Remove after embeddings are loaded
            if (this.vectorSearch) {
                this.vectorSearch.preload().then(() => {
                    msg.remove();
                });
            }
        }
    }

    async performSearch(query) {
        // Use vector search if enabled
        if (this.useVectorSearch && this.vectorSearch) {
            await this.performVectorSearch(query);
        } else {
            this.performKeywordSearch(query);
        }
    }

    // Vector-based semantic search
    async performVectorSearch(query) {
        try {
            // Show loading indicator
            this.showSearchLoading(query, 'vector');

            const results = await this.vectorSearch.search(query, 10);
            
            // Filter results with score > 0.3 (reasonable similarity threshold)
            const filteredResults = results.filter(r => r.score > 0.3);
            
            this.displayResults(filteredResults, query, 'vector');
        } catch (error) {
            console.error('Vector search failed:', error);
            // Fallback to keyword search
            this.useVectorSearch = false;
            this.performKeywordSearch(query);
            alert('AI search gặp lỗi. Đã chuyển sang tìm kiếm thông thường.');
        }
    }

    // Original keyword search
    performKeywordSearch(query) {
        const results = this.searchIndex.filter(page => {
            const searchText = (page.title + ' ' + page.content + ' ' + page.summary).toLowerCase();
            return searchText.includes(query.toLowerCase());
        });

        this.displayResults(results, query, 'keyword');
    }

    showSearchLoading(query, mode) {
        const existingResults = document.querySelector('.search-results');
        if (existingResults) {
            existingResults.remove();
        }

        const loadingContainer = document.createElement('div');
        loadingContainer.className = 'search-results search-loading';
        loadingContainer.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <div class="loading-spinner" style="margin: 0 auto 1rem; width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #0366d6; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                <p>🔍 Đang tìm kiếm${mode === 'vector' ? ' (AI)' : ''}: "${query}"...</p>
            </div>
            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        `;

        const main = document.querySelector('main, .main-content, .content');
        if (main) {
            main.appendChild(loadingContainer);
        }
    }

    displayResults(results, query, mode = 'keyword') {
        // Remove existing search results and loading
        const existingResults = document.querySelector('.search-results');
        if (existingResults) {
            existingResults.remove();
        }

        // Create results container
        const resultsContainer = document.createElement('div');
        resultsContainer.className = 'search-results';
        
        const modeLabel = mode === 'vector' ? '🔮 AI Search' : '🔍 Keyword Search';
        
        if (results.length === 0) {
            resultsContainer.innerHTML = `
                <div class="search-no-results">
                    <h3>Không tìm thấy kết quả cho "${query}" (${modeLabel})</h3>
                    <p>Thử từ khóa khác hoặc ${mode === 'vector' ? 'tắt AI search để dùng tìm kiếm thông thường' : 'bật AI search để tìm theo ngữ nghĩa'}.</p>
                </div>
            `;
        } else {
            let resultsHTML = `<div class="search-results-header">
                <h3>${modeLabel}: "${query}" (${results.length} kết quả)</h3>
            </div>`;
            
            results.forEach((result, index) => {
                const scoreDisplay = mode === 'vector' && result.score ? 
                    `<span class="similarity-score" style="color: #28a745; font-size: 0.85rem; margin-left: 0.5rem;">
                        ${(result.score * 100).toFixed(1)}% phù hợp
                    </span>` : '';
                
                const categories = result.categories && result.categories.length > 0 ?
                    `<div class="result-categories" style="margin-top: 0.5rem; font-size: 0.85rem;">
                        📁 ${result.categories.join(', ')}
                    </div>` : '';
                
                resultsHTML += `
                    <div class="search-result-item">
                        <h4>
                            <span class="result-rank">${index + 1}.</span>
                            <a href="${result.url || result.href}">${result.title}</a>
                            ${scoreDisplay}
                        </h4>
                        <p>${result.description || result.summary || ''}</p>
                        ${categories}
                    </div>
                `;
            });
            
            resultsContainer.innerHTML = resultsHTML;
        }

        // Insert results after main content
        const main = document.querySelector('main, .main-content, .content');
        if (main) {
            main.appendChild(resultsContainer);
            resultsContainer.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

// Initialize search when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SimpleSearch();
});