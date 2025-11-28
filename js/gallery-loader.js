/**
 * Gallery Loader - Dynamically load gallery images from GitHub repo
 * Image naming schema: 'topic-semester-subtopic-number'
 * Example: ws-s26-circuits-01.jpg (workshops, spring 2026, circuits, image 1)
 */

const GalleryLoader = {
    // Topic prefixes
    topics: {
        'past-workshops': 'ws',
        'upcoming-workshops': 'ws',
        'circuit-speed-dating': 'csd',
        'micromouse': 'mm',
        'battlebots': 'bb',
        'chill-cook-off': 'cco',
        'pw-weekly-schedule': 'pwm'
    },

    // Configuration - UPDATE THESE WITH YOUR VALUES
    config: {
        repoOwner: 'IEEE-UniversityOfHouston', // GitHub repo owner
        repoName: 'media', // GitHub repo name (where photos folder is)
        photosFolder: 'photographs', // Folder name in repo
        currentSemester: 's26', // Spring 2026
        pastSemester: 'f25', // Fall 2025
        maxImages: 20,
        gitHubToken: null // Optional: GitHub token for higher rate limits
    },

    /**
     * Automatically calculate current and past semesters based on today's date
     * @returns {Object} Object with currentSemester and pastSemester codes
     */
    calculateSemesters() {
        const today = new Date();
        const month = today.getMonth() + 1; // 1-12
        const year = today.getFullYear();

        // Determine current semester
        let currentSemester;
        if (month >= 1 && month <= 5) {
            // January to May = Spring
            currentSemester = `s${String(year).slice(-2)}`;
        } else {
            // June to December = Fall
            currentSemester = `f${String(year).slice(-2)}`;
        }

        // Calculate past semester
        let pastSemester;
        if (month >= 1 && month <= 5) {
            // If current is spring, past is fall of previous year
            const prevYear = String(year - 1).slice(-2);
            pastSemester = `f${prevYear}`;
        } else {
            // If current is fall, past is spring of same year
            const currentYearTwoDigit = String(year).slice(-2);
            pastSemester = `s${currentYearTwoDigit}`;
        }

        return { currentSemester, pastSemester };
    },

    /**
     * Initialize the gallery loader with current and past semesters
     * Call this once at page load to set up semester information
     */
    init() {
        const { currentSemester, pastSemester } = this.calculateSemesters();
        this.config.currentSemester = currentSemester;
        this.config.pastSemester = pastSemester;
        console.log(`Gallery Loader initialized - Current: ${currentSemester}, Past: ${pastSemester}`);
        // Initialize a global metrics object for performance measurements
        if (typeof window !== 'undefined') {
            window.GalleryMetrics = window.GalleryMetrics || {
                fetches: [], // { topicPrefix, semester, start, duration, status }
                images: [], // { src, startTime, duration, transferSize, success }
                addFetch(entry) { this.fetches.push(entry); },
                addImage(entry) { this.images.push(entry); },
                summary() {
                    const totalImages = this.images.length;
                    const loaded = this.images.filter(i => i.success);
                    const avgImageMs = loaded.length ? (loaded.reduce((s,i)=>s+i.duration,0)/loaded.length).toFixed(1) : 0;
                    const totalFetches = this.fetches.length;
                    return { totalImages, loadedCount: loaded.length, avgImageMs, totalFetches };
                }
            };
        }
    },

    /**
     * Fetch images for a given subsection
     * @param {string} subsectionId - The subsection ID (e.g., 'micromouse')
     * @returns {Promise<Array>} Array of image objects with url and filename
     */
    async fetchGalleryImages(subsectionId) {
        const topicPrefix = this.topics[subsectionId];
        
        if (!topicPrefix) {
            console.warn(`No topic prefix found for subsection: ${subsectionId}`);
            return [];
        }

        try {
            // Try current semester first
            let images = await this.fetchImagesByTopicAndSemester(
                topicPrefix,
                this.config.currentSemester
            );

            // If no images found, try past semester (don't error if it fails)
            if (images.length === 0) {
                images = await this.fetchImagesByTopicAndSemester(
                    topicPrefix,
                    this.config.pastSemester
                ).catch(() => []);
            }

            // Limit to maxImages
            return images.slice(0, this.config.maxImages);
        } catch (error) {
            console.error(`Error fetching gallery images for ${subsectionId}:`, error);
            return [];
        }
    },

    /**
     * Fetch images by topic and semester using GitHub API
     * @param {string} topicPrefix - Topic prefix (e.g., 'ws', 'mm')
     * @param {string} semester - Semester code (e.g., 's26', 'f25')
     * @returns {Promise<Array>} Array of image objects
     */
    async fetchImagesByTopicAndSemester(topicPrefix, semester) {
        const apiUrl = `https://api.github.com/repos/${this.config.repoOwner}/${this.config.repoName}/contents/${this.config.photosFolder}`;
        
        try {
            const options = {};
            if (this.config.gitHubToken) {
                options.headers = {
                    'Authorization': `token ${this.config.gitHubToken}`
                };
            }

            const fetchStart = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
            const response = await fetch(apiUrl, options);
            
            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status}`);
            }

            const files = await response.json();

            if (!Array.isArray(files)) {
                console.warn('GitHub API response is not an array');
                return [];
            }

            // Filter files matching several variants of the naming pattern:
            // allow hyphens or underscores (e.g., ws-s26-... or ws_s26_...)
            // include common image extensions including HEIC
            const exts = 'jpg|jpeg|png|gif|webp|heic';
            const pattern = new RegExp(`^${topicPrefix}[-_]${semester}(?:[-_].*)?\\.(${exts})$`, 'i');

            const matchingFiles = files.filter(file => {
                return file.type === 'file' && pattern.test(file.name);
            });

            // Sort by filename (stable predictable order)
            matchingFiles.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

            // Map to image objects with GitHub raw content URLs and display URLs
            const mapped = matchingFiles.map(file => {
                const rawUrl = `https://raw.githubusercontent.com/${this.config.repoOwner}/${this.config.repoName}/main/${this.config.photosFolder}/${encodeURIComponent(file.name)}`;
                const ext = (file.name.split('.').pop() || '').toLowerCase();
                let displayUrl = rawUrl;

                // For HEIC images, use a public image proxy to convert to JPEG for browser display
                if (ext === 'heic') {
                    // images.weserv.nl can proxy and convert remote images to jpeg
                    // Note: this relies on a third-party service and may be rate limited.
                    const proxied = `https://images.weserv.nl/?url=raw.githubusercontent.com/${this.config.repoOwner}/${this.config.repoName}/main/${this.config.photosFolder}/${encodeURIComponent(file.name)}&output=jpeg`;
                    displayUrl = proxied;
                }

                return {
                    filename: file.name,
                    rawUrl,
                    displayUrl,
                    ext
                };
            });

            // record fetch timing
            try {
                const fetchEnd = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
                if (typeof window !== 'undefined' && window.GalleryMetrics) {
                    window.GalleryMetrics.addFetch({ topicPrefix, semester, start: fetchStart, duration: fetchEnd - fetchStart, count: mapped.length, status: response.status });
                }
            } catch (e) {
                // ignore
            }

            return mapped;
        } catch (error) {
            console.error(`Error fetching images for ${topicPrefix}-${semester}:`, error);
            return [];
        }
    },

    /**
     * Update a subsection's gallery with fetched images
     * @param {string} subsectionId - The subsection ID
     * @param {Object} subsection - The subsection data object to update
     */
    async populateGallery(subsectionId, subsection) {
        const images = await this.fetchGalleryImages(subsectionId);

        if (!subsection.gallery) {
            subsection.gallery = {
                type: this.topics[subsectionId] || 'gallery',
                items: []
            };
        }

        if (images.length === 0) {
            subsection.gallery.items = [
                {
                    id: 'no-images-placeholder',
                    title: 'Nothing to display yet.',
                    description: 'Check back soon for photos from upcoming events!',
                    image: null,
                    placeholder: true
                }
            ];
        } else {
            subsection.gallery.items = images.map((img, index) => ({
                id: `gallery-${subsectionId}-${index}`,
                filename: img.filename,
                // prefer displayUrl (converted HEIC) otherwise rawUrl
                image: img.displayUrl || img.rawUrl,
                displayUrl: img.displayUrl || img.rawUrl,
                rawUrl: img.rawUrl,
                ext: img.ext,
                title: img.filename.replace(/\.[^/.]+$/, ''), // Remove file extension
                description: '',
                date: null
            }));
        }
    },

    /**
     * Auto-populate galleries for all subsections in PWData
     * Call this after PWData is loaded but before rendering
     */
    async autoPopulateAllGalleries() {
        if (typeof PWData === 'undefined' || !PWData.subsections) {
            console.warn('PWData not available for gallery population');
            return;
        }

        // Background population: do not touch DOM here so gallery only
        // appears when the user requests it via the UI.
        const globalGalleryEl = null;

        // Get all subsections that have topic prefixes defined
        const subsectionIds = Object.keys(this.topics);

        // Populate galleries for each subsection
        const populationPromises = subsectionIds.map(id => {
            const subsection = PWData.subsections.find(s => s.id === id);
            if (subsection) {
                return this.populateGallery(id, subsection);
            }
            return Promise.resolve();
        });

        try {
            await Promise.all(populationPromises);
            console.log('All galleries populated successfully');
            // background population complete; UI will render gallery on demand
        } catch (error) {
            console.error('Error auto-populating galleries:', error);
            if (globalGalleryEl) {
                globalGalleryEl.innerHTML = `<p class="text-center">Unable to load images.</p>`;
            }
        }
    },

    /**
     * Update config (call this before using the loader)
     * @param {Object} newConfig - Configuration object to merge
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }
};
