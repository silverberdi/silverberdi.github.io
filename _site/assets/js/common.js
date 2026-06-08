/*!
 * Common JavaScript for Coderon-style theme
 */

document.addEventListener('DOMContentLoaded', function() {

  // ============================================
  // Dark Mode Toggle
  // ============================================
  const toggleTheme = document.querySelector('.toggle-theme');

  if (toggleTheme) {
    toggleTheme.addEventListener('click', function() {
      const currentTheme = localStorage.getItem('theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      localStorage.setItem('theme', newTheme);
      
      if (newTheme === 'dark') {
        document.documentElement.setAttribute('dark', '');
        document.documentElement.classList.add('dark-mode');
      } else {
        document.documentElement.removeAttribute('dark');
        document.documentElement.classList.remove('dark-mode');
      }
    });
  }

  // ============================================
  // Mobile Menu Toggle
  // ============================================
  const hamburger = document.querySelector('.hamburger');
  const mainNav = document.querySelector('.main-nav');

  if (hamburger && mainNav) {
    hamburger.addEventListener('click', function() {
      hamburger.classList.toggle('is-open');
      mainNav.classList.toggle('is-visible');
    });
  }

  // ============================================
  // Scroll to Top Button
  // ============================================
  const topButton = document.querySelector('.top');

  if (topButton) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 400) {
        topButton.classList.add('is-active');
      } else {
        topButton.classList.remove('is-active');
      }
    });

    topButton.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ============================================
  // Search Functionality
  // ============================================
  const searchButton = document.querySelector('.search-button');
  const searchOverlay = document.querySelector('.search');
  const searchClose = document.querySelector('.search__close');
  const searchInput = document.querySelector('.search__text');
  const searchResults = document.querySelector('#js-results-container');
  const searchOverlayBg = document.querySelector('.search__overlay');

  function openSearch() {
    if (searchOverlay) {
      searchOverlay.classList.add('is-visible');
      document.body.classList.add('search-is-visible');
      if (searchInput) {
        setTimeout(function() {
          searchInput.focus();
        }, 300);
      }
    }
  }

  function closeSearch() {
    if (searchOverlay) {
      searchOverlay.classList.remove('is-visible');
      document.body.classList.remove('search-is-visible');
      if (searchInput) {
        searchInput.value = '';
      }
      if (searchResults) {
        searchResults.innerHTML = '';
      }
    }
  }

  if (searchButton) {
    searchButton.addEventListener('click', openSearch);
  }

  if (searchClose) {
    searchClose.addEventListener('click', closeSearch);
  }

  if (searchOverlayBg) {
    searchOverlayBg.addEventListener('click', closeSearch);
  }

  // Close search with Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && searchOverlay && searchOverlay.classList.contains('is-visible')) {
      closeSearch();
    }
  });

  // Simple search filtering
  if (searchInput && searchResults) {
    searchInput.addEventListener('input', function() {
      const query = this.value.toLowerCase().trim();
      
      if (query.length < 2) {
        searchResults.innerHTML = '';
        return;
      }

      // Fetch search data
      fetch('/search.json')
        .then(function(response) { return response.json(); })
        .then(function(posts) {
          var results = posts.filter(function(post) {
            return post.title.toLowerCase().includes(query) ||
                   post.tags.toLowerCase().includes(query) ||
                   post.description.toLowerCase().includes(query);
          });

          if (results.length === 0) {
            searchResults.innerHTML = '<div class="no-results">No results found</div>';
            return;
          }

          var html = '';
          results.slice(0, 10).forEach(function(post) {
            html += '<div class="article">' +
                      '<div class="article__inner">' +
                        '<div class="article__content">' +
                          '<h3 class="article__title">' +
                            '<a href="' + post.url + '">' + post.title + '</a>' +
                          '</h3>' +
                          '<div class="article__meta">' +
                            '<span class="article__date">' + post.date + '</span>' +
                          '</div>' +
                        '</div>' +
                      '</div>' +
                    '</div>';
          });
          searchResults.innerHTML = html;
        })
        .catch(function() {
          searchResults.innerHTML = '<div class="no-results">Search not available</div>';
        });
    });
  }

  // ============================================
  // View Toggle (Grid/List)
  // ============================================
  const blogToggle = document.querySelector('.blog__toggle');
  const articles = document.querySelectorAll('.article');

  if (blogToggle) {
    blogToggle.addEventListener('click', function() {
      blogToggle.classList.toggle('view-list');
      document.querySelector('.section .row').classList.toggle('view-list');
      
      articles.forEach(function(article) {
        article.classList.toggle('article--flexible');
      });
    });
  }

  // ============================================
  // Lazy Loading Images
  // ============================================
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  
  if ('loading' in HTMLImageElement.prototype) {
    lazyImages.forEach(function(img) {
      img.src = img.src;
    });
  } else {
    lazyImages.forEach(function(img) {
      img.loading = 'auto';
    });
  }

  // ============================================
  // Latest Posts Carousel (Splide)
  // ============================================
  var latestPostsCarousel = document.querySelector('.latest-posts-carousel');
  if (latestPostsCarousel && typeof Splide !== 'undefined') {
    var splide = new Splide('.latest-posts-carousel', {
      type: 'loop',
      perPage: 3,
      perMove: 1,
      gap: '0px',
      pagination: true,
      arrows: true,
      breakpoints: {
        1024: { perPage: 2 },
        768: { perPage: 1 }
      }
    });
    splide.mount();
  }

  // ============================================
  // Disable animations on resize
  // ============================================
  var disableAnimations;
  
  window.addEventListener('resize', function() {
    document.body.classList.add('disable-animation');
    clearTimeout(disableAnimations);
    disableAnimations = setTimeout(function() {
      document.body.classList.remove('disable-animation');
    }, 400);
  });
});
