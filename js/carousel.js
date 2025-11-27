/**
 * Carousel functionality for hero banner
 */

class CarouselManager {
    constructor() {
        this.currentSlide = 0;
        this.slides = document.querySelectorAll('.carousel-slide');
        this.indicators = document.querySelectorAll('.indicator');
        this.prevBtn = document.getElementById('carousel-prev');
        this.nextBtn = document.getElementById('carousel-next');
        this.navButtons = document.querySelectorAll('.section-btn');
        this.autoplayInterval = null;
        this.autoplayDelay = 5000; // 5 seconds

        // Map slides to sections
        this.slideToSectionMap = {
            0: 'workshops',
            1: 'projects',
            2: 'committee',
            3: 'get-involved'
        };

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateNavButtonHighlight();
        this.startAutoplay();
    }

    setupEventListeners() {
        // Navigation buttons
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }

        // Indicators
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });

        // Nav buttons - sync carousel with button clicks
        this.navButtons.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                this.goToSlide(index);
            });
        });

        // Pause autoplay on interaction
        this.prevBtn?.addEventListener('mouseenter', () => this.stopAutoplay());
        this.nextBtn?.addEventListener('mouseenter', () => this.stopAutoplay());
        this.prevBtn?.addEventListener('mouseleave', () => this.startAutoplay());
        this.nextBtn?.addEventListener('mouseleave', () => this.startAutoplay());
    }

    showSlide(index) {
        // Wrap around
        if (index >= this.slides.length) {
            this.currentSlide = 0;
        } else if (index < 0) {
            this.currentSlide = this.slides.length - 1;
        } else {
            this.currentSlide = index;
        }

        // Update slides
        this.slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === this.currentSlide) {
                slide.classList.add('active');
            }
        });

        // Update indicators
        this.indicators.forEach((indicator, i) => {
            indicator.classList.remove('active');
            if (i === this.currentSlide) {
                indicator.classList.add('active');
            }
        });

        // Update nav button highlight
        this.updateNavButtonHighlight();
    }

    updateNavButtonHighlight() {
        this.navButtons.forEach((btn, index) => {
            btn.classList.remove('active');
            if (index === this.currentSlide) {
                btn.classList.add('active');
            }
        });
    }

    nextSlide() {
        this.showSlide(this.currentSlide + 1);
    }

    prevSlide() {
        this.showSlide(this.currentSlide - 1);
    }

    goToSlide(index) {
        this.showSlide(index);
    }

    startAutoplay() {
        if (this.autoplayInterval) {
            return;
        }

        this.autoplayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoplayDelay);
    }

    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }

    setAutoplayDelay(delay) {
        this.autoplayDelay = delay;
        this.stopAutoplay();
        this.startAutoplay();
    }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.carousel = new CarouselManager();
});
