/**
 * Documentation Site JavaScript
 * 
 * This file handles all interactive elements of our documentation site:
 * - Mobile sidebar toggle
 * - Search functionality
 * - Table of contents generation
 * - Smooth scrolling for anchor links
 */

document.addEventListener('DOMContentLoaded', function() {
    // Mobile sidebar toggle
    initSidebarToggle();
    
    // Generate table of contents
    generateTableOfContents();
    
    // Enable smooth scrolling
    enableSmoothScrolling();
    
    // Initialize search functionality
    initSearch();
});

/**
 * Initialize mobile sidebar toggle functionality
 */
function initSidebarToggle() {
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
        
        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', function(event) {
            const isClickInsideSidebar = sidebar.contains(event.target);
            const isClickOnToggle = sidebarToggle.contains(event.target);
            
            if (!isClickInsideSidebar && !isClickOnToggle && sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
            }
        });
    }
}

/**
 * Generate a table of contents based on headings in the content
 */
function generateTableOfContents() {
    const pageContent = document.querySelector('.page-content');
    const headings = pageContent ? pageContent.querySelectorAll('h2, h3') : [];
    
    if (headings.length > 2) {
        // Create TOC container
        const tocContainer = document.createElement('div');
        tocContainer.className = 'table-of-contents';
        tocContainer.innerHTML = '<h3>On this page</h3><ul></ul>';
        
        const tocList = tocContainer.querySelector('ul');
        
        // Add IDs to headings and create TOC items
        headings.forEach((heading, index) => {
            const headingId = heading.id || `heading-${index}`;
            heading.id = headingId;
            
            const listItem = document.createElement('li');
            listItem.className = heading.tagName.toLowerCase();
            
            const link = document.createElement('a');
            link.href = `#${headingId}`;
            link.textContent = heading.textContent;
            
            listItem.appendChild(link);
            tocList.appendChild(listItem);
        });
        
        // Insert TOC at the beginning of the content
        if (headings.length > 0) {
            pageContent.insertBefore(tocContainer, pageContent.firstChild);
        }
    }
}

/**
 * Enable smooth scrolling for anchor links
 */
function enableSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                const headerOffset = 90; // Account for fixed header
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL hash without scrolling
                history.pushState(null, null, targetId);
            }
        });
    });
}

/**
 * Initialize search functionality
 */
function initSearch() {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    
    if (searchInput && searchButton) {
        // Simple client-side search (for a more robust solution, consider server-side search)
        const performSearch = () => {
            const searchTerm = searchInput.value.trim().toLowerCase();
            
            if (searchTerm.length < 2) {
                alert('Please enter at least 2 characters to search');
                return;
            }
            
            // Redirect to search results page with query parameter
            window.location.href = `search.php?q=${encodeURIComponent(searchTerm)}`;
        };
        
        // Search on button click
        searchButton.addEventListener('click', performSearch);
        
        // Search on Enter key press
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
}

/**
 * Highlight code blocks if Prism.js is available
 * This function checks if Prism is loaded and applies syntax highlighting
 */
function highlightCodeBlocks() {
    // Check if Prism is available
    if (typeof Prism !== 'undefined') {
        // Let Prism highlight all code blocks
        Prism.highlightAll();
    }
}

/**
 * Track reading progress and show a progress indicator
 */
function initReadingProgress() {
    // Create progress bar element if it doesn't exist
    let progressBar = document.querySelector('.reading-progress');
    if (!progressBar) {
        progressBar = document.createElement('div');
        progressBar.className = 'reading-progress';
        document.body.appendChild(progressBar);
    }

    // Update progress bar width on scroll
    window.addEventListener('scroll', function() {
        // Calculate how far down the page the user has scrolled
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = scrollTop / docHeight * 100;
        
        // Update progress bar width
        progressBar.style.width = scrollPercent + '%';
    });
}

/**
 * Add copy buttons to code blocks
 */
function addCodeCopyButtons() {
    const codeBlocks = document.querySelectorAll('pre code');
    
    codeBlocks.forEach(block => {
        // Create container for the code block if not already wrapped
        let preElement = block.parentElement;
        let container = preElement.parentElement;
        
        if (container.tagName !== 'DIV' || !container.classList.contains('code-container')) {
            container = document.createElement('div');
            container.className = 'code-container';
            preElement.parentNode.insertBefore(container, preElement);
            container.appendChild(preElement);
        }
        
        // Create copy button
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-code-button';
        copyButton.textContent = 'Copy';
        
        // Add copy functionality
        copyButton.addEventListener('click', function() {
            const code = block.textContent;
            navigator.clipboard.writeText(code).then(() => {
                // Indicate success
                copyButton.textContent = 'Copied!';
                setTimeout(() => {
                    copyButton.textContent = 'Copy';
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy code: ', err);
                copyButton.textContent = 'Error';
            });
        });
        
        // Add button to container
        container.appendChild(copyButton);
    });
}

/**
 * Initialize GitHub edit links to direct to the correct source file
 */
function initGitHubLinks() {
    const editLinks = document.querySelectorAll('.edit-on-github');
    
    editLinks.forEach(link => {
        // Add click tracking
        link.addEventListener('click', function(e) {
            // You could add analytics tracking here
            console.log('Edit on GitHub link clicked');
        });
    });
}

// Call all initialization functions when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Functions already called above
    initSidebarToggle();
    generateTableOfContents();
    enableSmoothScrolling();
    initSearch();
    
    // Additional functions
    highlightCodeBlocks();
    initReadingProgress();
    addCodeCopyButtons();
    initGitHubLinks();
});