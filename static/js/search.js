// Simple client-side search functionality
class SimpleSearch {
    constructor() {
        this.searchIndex = [];
        this.init();
    }

    async init() {
        try {
            const response = await fetch('/index.json');
            this.searchIndex = await response.json();
            console.log('Search index loaded:', this.searchIndex.length, 'pages');
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
            searchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const query = searchInput.value.trim();
                if (query) {
                    this.performSearch(query);
                }
            });

            // Real-time search as user types
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.trim();
                if (query.length > 2) {
                    this.performSearch(query);
                }
            });
        }
    }

    performSearch(query) {
        const results = this.searchIndex.filter(page => {
            const searchText = (page.title + ' ' + page.content + ' ' + page.summary).toLowerCase();
            return searchText.includes(query.toLowerCase());
        });

        this.displayResults(results, query);
    }

    displayResults(results, query) {
        // Remove existing search results
        const existingResults = document.querySelector('.search-results');
        if (existingResults) {
            existingResults.remove();
        }

        // Create results container
        const resultsContainer = document.createElement('div');
        resultsContainer.className = 'search-results';
        
        if (results.length === 0) {
            resultsContainer.innerHTML = `
                <div class="search-no-results">
                    <h3>Không tìm thấy kết quả cho "${query}"</h3>
                    <p>Thử từ khóa khác hoặc kiểm tra chính tả.</p>
                </div>
            `;
        } else {
            let resultsHTML = `<div class="search-results-header">
                <h3>Kết quả tìm kiếm cho "${query}" (${results.length} kết quả)</h3>
            </div>`;
            
            results.forEach(result => {
                resultsHTML += `
                    <div class="search-result-item">
                        <h4><a href="${result.href}">${result.title}</a></h4>
                        <p>${result.summary ? result.summary.substring(0, 150) + '...' : ''}</p>
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