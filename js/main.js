/**
 * P&W Page - Main JavaScript
 * Handles section toggling and interactive features
 */

class PWPage {
    constructor() {
        this.currentSection = 'workshops';
        this.init();
    }

    async init() {
        // Initialize gallery loader first (calculates current/past semesters)
        GalleryLoader.init();
        
        // Auto-populate all galleries from GitHub
        await GalleryLoader.autoPopulateAllGalleries();
        
        this.setupEventListeners();
        this.loadContent();
    }

    // Map top-level sections to topic prefixes (used to filter gallery)
    sectionTopicMap() {
        return {
            'workshops': ['ws'],
            'projects': ['mm', 'bb'],
            'committee': ['csd', 'cco'],
            'get-involved': ['pwm']
        };
    }

    setupEventListeners() {
        // Section buttons on carousel overlay
        document.querySelectorAll('.section-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = btn.getAttribute('data-section');
                this.toggleSection(section);
                this.updateActiveButton(btn);
            });
        });

        // Content card clicks
        document.querySelectorAll('.item-card').forEach(card => {
            card.addEventListener('click', () => {
                const section = card.getAttribute('data-section');
                if (section) {
                    this.showSubsection(section);
                }
            });
        });

        // Card links in get-involved
        document.querySelectorAll('.card-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.showSubsection(targetId);
            });
        });
    }

    toggleSection(sectionId) {
        // Hide all main sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active-section');
        });

        // Show the selected section
        const section = document.getElementById(sectionId);
        if (section) {
            section.classList.add('active-section');
            this.currentSection = sectionId;
        }

        // Hide all subsections
        document.querySelectorAll('.subsection-item').forEach(item => {
            item.classList.remove('active');
        });

        // Update gallery to only show images for the selected top-level section
        if (typeof PWData !== 'undefined') {
            this.populateGallery(PWData.subsections, sectionId);
        }
    }

    updateActiveButton(activeBtn) {
        // Remove active class from all buttons
        document.querySelectorAll('.section-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        // Add active class to clicked button
        activeBtn.classList.add('active');
    }

    showSubsection(subsectionId) {
        // Hide all subsections
        document.querySelectorAll('.subsection-item').forEach(item => {
            item.classList.remove('active');
        });

        // Show the selected subsection
        const subsection = document.getElementById(subsectionId);
        if (subsection) {
            subsection.classList.add('active');
            // Scroll to the subsection
            setTimeout(() => {
                subsection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    }

    loadContent() {
        // Load data and populate sections
        if (typeof PWData !== 'undefined') {
            this.populateWorkshops(PWData.workshops);
            this.populateProjects(PWData.projects);
            this.populateCommittee(PWData.committee);
            this.populateResources(PWData.resources);
            this.populateGetInvolved(PWData.getInvolved);
            this.generateSubsections(PWData.subsections);
            // Do not render the global gallery on initial load.
            // The gallery will be rendered when the user clicks a top-level
            // section button which calls `toggleSection()` and triggers
            // `populateGallery(...)` with the appropriate filter.
        }
    }

    populateWorkshops(workshops) {
        const list = document.getElementById('workshops-list');
        if (!list || !workshops) return;

        list.innerHTML = workshops.map(workshop => `
            <div class="item-card" data-section="${workshop.id}">
                <h4>${workshop.name}</h4>
                <p>${workshop.description}</p>
            </div>
        `).join('');

        // Reattach click listeners
        list.querySelectorAll('.item-card').forEach(card => {
            card.addEventListener('click', () => {
                const section = card.getAttribute('data-section');
                if (section) {
                    this.showSubsection(section);
                }
            });
        });
    }

    populateProjects(projects) {
        const list = document.getElementById('projects-list');
        if (!list || !projects) return;

        list.innerHTML = projects.map(project => `
            <div class="item-card" data-section="${project.id}">
                ${project.picture ? `<img src="${project.picture}" alt="${project.name}" class="card-image">` : ''}
                <h4>${project.name}</h4>
                <p>${project.description}</p>
            </div>
        `).join('');

        // Reattach click listeners
        list.querySelectorAll('.item-card').forEach(card => {
            card.addEventListener('click', () => {
                const section = card.getAttribute('data-section');
                if (section) {
                    this.showSubsection(section);
                }
            });
        });
    }

    populateCommittee(committee) {
        const list = document.getElementById('committee-list');
        if (!list || !committee) return;

        list.innerHTML = committee.map(member => `
            <div class="item-card" data-section="${member.id}">
                ${member.picture ? `<img src="${member.picture}" alt="${member.name}" class="card-image">` : ''}
                <h4>${member.name}</h4>
                <p>${member.description}</p>
            </div>
        `).join('');

        // Reattach click listeners
        list.querySelectorAll('.item-card').forEach(card => {
            card.addEventListener('click', () => {
                const section = card.getAttribute('data-section');
                if (section) {
                    this.showSubsection(section);
                }
            });
        });
    }

    populateResources(resources) {
        const list = document.getElementById('resources-list');
        if (!list || !resources) return;

        list.innerHTML = resources.map(resource => `
            <div class="item-card" data-section="${resource.id}">
                <h4>${resource.name}</h4>
                <p>${resource.description}</p>
            </div>
        `).join('');

        // Reattach click listeners
        list.querySelectorAll('.item-card').forEach(card => {
            card.addEventListener('click', () => {
                const section = card.getAttribute('data-section');
                if (section) {
                    this.showSubsection(section);
                }
            });
        });
    }

    /**
     * Get current active section
     */
    getCurrentSection() {
        return this.currentSection;
    }

    /**
     * Render the global gallery. Optionally filter by a top-level section id
     * so only images for that section's topics are shown.
     * @param {Array} subsections - PWData.subsections
     * @param {string} [sectionFilter] - one of 'workshops','projects','committee','get-involved'
     */
    populateGallery(subsections, sectionFilter) {
        const container = document.getElementById('gallery-container');
        if (!container || !subsections) return;

        // Collect all gallery images from subsections (flattened)
        const images = [];
        // If a sectionFilter is provided, determine allowed topic prefixes
        let allowedPrefixes = null;
        if (sectionFilter) {
            const map = this.sectionTopicMap();
            allowedPrefixes = map[sectionFilter] || null;
        }

        subsections.forEach(section => {
            // If we're filtering, skip subsections whose topic prefix isn't allowed
            if (allowedPrefixes) {
                const prefix = GalleryLoader.topics[section.id];
                if (!prefix || !allowedPrefixes.includes(prefix)) return;
            }

            if (section.gallery && Array.isArray(section.gallery.items)) {
                section.gallery.items.forEach(item => {
                    // support both 'displayUrl' (converted HEIC), 'image' and 'rawUrl'
                    const src = item.displayUrl || item.image || item.url || item;
                    const raw = item.rawUrl || item.image || null;
                    if (src) images.push({ src, raw, id: item.id || item.filename || `${section.id}-${images.length}` });
                });
            }
        });

        // Render a simple image grid (no captions/cards)
        if (images.length === 0) {
            container.innerHTML = '<div class="gallery-container"><p class="text-center">Nothing to display yet.</p></div>';
        } else {
            const imgsHtml = images.map(img => `
                <img class="gallery-img" data-id="${img.id}" data-raw="${img.raw || ''}" src="${img.src}" loading="lazy" alt="gallery-image" />
            `).join('');
            container.innerHTML = `<div class="gallery-container"><div class="gallery-heading">Gallery</div><div class="gallery-grid simple">${imgsHtml}</div></div>`;

            // Attach error handlers to fallback to raw URL or placeholder for unsupported formats
            const placeholder = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="100%" height="100%" fill="%23222a3a"/><text x="50%" y="50%" fill="%23cbd5e1" font-size="20" font-family="Arial,Helvetica,sans-serif" dominant-baseline="middle" text-anchor="middle">Image not available</text></svg>';
            container.querySelectorAll('.gallery-img').forEach(imgEl => {
                imgEl.addEventListener('error', () => {
                    const raw = imgEl.getAttribute('data-raw');
                    if (raw && imgEl.src !== raw) {
                        imgEl.src = raw;
                    } else {
                        imgEl.src = placeholder;
                    }
                });
                // clicking opens the raw image in a new tab
                imgEl.addEventListener('click', () => {
                    const raw = imgEl.getAttribute('data-raw') || imgEl.src;
                    window.open(raw, '_blank');
                });
            });

            // After a short delay, collect Resource Timing entries for images
            setTimeout(() => {
                try {
                    const resources = performance.getEntriesByType('resource');
                    container.querySelectorAll('.gallery-img').forEach(imgEl => {
                        const src = imgEl.src;
                        // Find matching resource entry
                        const entry = resources.find(r => r.name === src || r.name === decodeURIComponent(src));
                        if (entry) {
                            const rec = { src: entry.name, startTime: entry.startTime, duration: entry.duration, transferSize: entry.transferSize || 0, success: true };
                            if (window.GalleryMetrics) window.GalleryMetrics.addImage(rec);
                        } else {
                            // fallback: record small record with timestamp
                            const rec = { src, startTime: performance.now(), duration: 0, transferSize: 0, success: false };
                            if (window.GalleryMetrics) window.GalleryMetrics.addImage(rec);
                        }
                    });
                    // log summary
                    if (window.GalleryMetrics) {
                        console.info('GalleryMetrics summary:', window.GalleryMetrics.summary());
                    }
                } catch (e) {
                    // ignore
                }
            }, 1000);
        }

        // No subsection-level gallery click handlers — global gallery handles clicks.
    }

    populateGetInvolved(items) {
        const grid = document.getElementById('get-involved-grid');
        if (!grid || !items) return;

        grid.innerHTML = items.map(item => `
            <div class="involvement-card" data-section="${item.id}">
                ${item.picture ? `<img src="${item.picture}" alt="${item.title}" class="card-image">` : ''}
                <h3>${item.title}</h3>
                <p>${item.description}</p>
                <a href="${item.link}" class="card-link">${item.linkText}</a>
            </div>
        `).join('');

        // Reattach click listeners
        grid.querySelectorAll('.card-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.showSubsection(targetId);
            });
        });

        // Add click listeners to cards
        grid.querySelectorAll('.involvement-card').forEach(card => {
            card.addEventListener('click', () => {
                const section = card.getAttribute('data-section');
                if (section) {
                    this.showSubsection(section);
                }
            });
        });
    }

    generateSubsections(subsections) {
        const container = document.getElementById('subsections-container');
        if (!container || !subsections) return;
        container.innerHTML = subsections.map(subsection => {
            // Workshops style (grid of poster cards)
            let workshopsHtml = '';
            if (subsection.workshops && subsection.workshops.length) {
                workshopsHtml = `
                    <div class="workshop-grid">
                        ${subsection.workshops.map(w => `
                            <article class="workshop-card" id="${w.id}" data-section="${subsection.id}">
                                ${w.picture ? `<img src="${w.picture}" alt="${w.title}" class="workshop-image">` : ''}
                                <div class="workshop-body">
                                    <h4 class="workshop-title">${w.title}</h4>
                                    <p class="workshop-date">${w.date || ''}</p>
                                    <p class="workshop-desc">${w.description}</p>
                                </div>
                            </article>
                        `).join('')}
                    </div>
                `;
            }

            // Members grid (if present)
            let membersHtml = '';
            if (subsection.members && subsection.members.length) {
                membersHtml = `
                    <div class="members-grid">
                        ${subsection.members.map(member => `
                            <div class="member-card">
                                <img src="${member.image}" alt="${member.name}" class="member-image">
                                <h4>${member.name}</h4>
                                <p class="member-role">${member.role}</p>
                                <p class="member-interests">${member.interests}</p>
                            </div>
                        `).join('')}
                    </div>
                `;
            }

            // Edition groups (e.g., Chill Cook-off: this year / past years)
            let editionGroupsHtml = '';
            if (subsection.editionGroups) {
                const thisYear = subsection.editionGroups.thisYear;
                const past = subsection.editionGroups.past || [];
                editionGroupsHtml = `
                    <div class="edition-block">
                        <div class="edition-tabs">
                            <button class="edition-btn active" data-target="this-year-${subsection.id}">This Year</button>
                            <button class="edition-btn" data-target="past-${subsection.id}">Past</button>
                        </div>
                        <div class="edition-contents">
                            <div class="edition-content" data-edition="this-year-${subsection.id}">
                                ${thisYear ? `
                                    <article class="edition-card">
                                        ${thisYear.picture ? `<img src="${thisYear.picture}" alt="${thisYear.title}" class="workshop-image">` : ''}
                                        <div class="workshop-body">
                                            <h4 class="workshop-title">${thisYear.title}</h4>
                                            <p class="workshop-date">${thisYear.year}</p>
                                            <p class="workshop-desc">${thisYear.description}</p>
                                        </div>
                                    </article>
                                ` : '<p>No current edition available.</p>'}
                            </div>
                            <div class="edition-content ${past.length === 0 ? 'hidden' : ''}" data-edition="past-${subsection.id}">
                                ${past.length === 0 ? '<p>No projects available</p>' : past.map(p => `
                                    <article class="edition-card">
                                        ${p.picture ? `<img src="${p.picture}" alt="${p.title}" class="workshop-image">` : ''}
                                        <div class="workshop-body">
                                            <h4 class="workshop-title">${p.title}</h4>
                                            <p class="workshop-date">${p.year || p.date || ''}</p>
                                            <p class="workshop-desc">${p.description}</p>
                                        </div>
                                    </article>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                `;
            }

            // We do not render per-subsection galleries here because a global
            // gallery is shown below all subsections. Keep this empty.
            let galleryHtml = '';

            // Special rendering for certain subsections
            let subsectionImageHtml = subsection.picture ? `<img src="${subsection.picture}" alt="${subsection.title}" class="subsection-image">` : '';

            // Make weekly schedule display side-by-side: image left, text right
            // Build a special layout for this subsection so title/description
            // appear to the right of the tall flyer image.
            let titleHtml = `<h3>${subsection.title}</h3>`;
            let descHtml = `<p>${subsection.description || ''}</p>`;
            if (subsection.id === 'pw-weekly-schedule') {
                if (subsection.picture) {
                    subsectionImageHtml = `
                        <div class="subsection-side-by-side">
                            <div class="subsection-image-wrap">
                                <img src="${subsection.picture}" alt="${subsection.title}" class="subsection-image subsection-image-vertical">
                            </div>
                            <div class="subsection-side-content">
                                <h3>${subsection.title}</h3>
                                <p>${subsection.description || ''}</p>
                            </div>
                        </div>
                    `;
                    // Clear the separate title/description since included above
                    titleHtml = '';
                    descHtml = '';
                } else {
                    // If no picture, fall back to default single-column layout
                    subsectionImageHtml = '';
                }
            }

            // If a subsection provides a `formUrl` or `embedUrl`, render an iframe.
            // Note: Google short links (forms.gle) generally cannot be embedded
            // directly. Provide a helpful placeholder telling the maintainer
            // to use the embeddable docs.google.com URL instead.
            let formEmbedHtml = '';
            const formUrl = subsection.formUrl || subsection.embedUrl || subsection.form || '';
            if (formUrl) {
                // Detect Google short link which won't embed reliably
                if (formUrl.includes('forms.gle')) {
                    // Attempt to embed the short link directly. Some Google
                    // short-links will redirect to an embeddable docs.google.com
                    // URL and will load in an iframe; others will not. Provide
                    // an explicit open-in-new-tab link so users can still access
                    // the form if the iframe is blocked.
                    formEmbedHtml = `
                        <div class="form-embed">
                            <iframe src="${formUrl}" title="${subsection.title}" frameborder="0" loading="lazy"></iframe>
                            <div class="form-embed-fallback text-center mt-1">If the form does not display, <a href="${formUrl}" target="_blank" rel="noopener">open it in a new tab</a> or replace <code>subsection.formUrl</code> with the form's embeddable docs.google.com URL.</div>
                        </div>
                    `;
                } else {
                    // Auto-append Google Forms embed parameter if necessary
                    let embedSrc = formUrl;
                    if (embedSrc.includes('docs.google.com/forms') && !embedSrc.includes('embedded=true')) {
                        embedSrc += (embedSrc.includes('?') ? '&' : '?') + 'embedded=true';
                    }
                    formEmbedHtml = `
                        <div class="form-embed">
                            <iframe src="${embedSrc}" title="${subsection.title}" frameborder="0" loading="lazy"></iframe>
                        </div>
                    `;
                }
            }

            return `
                <section id="${subsection.id}" class="subsection-item">
                    ${subsectionImageHtml}
                    ${titleHtml}
                    ${descHtml}
                    ${workshopsHtml}
                    ${editionGroupsHtml}
                    ${membersHtml}
                    ${formEmbedHtml}
                    ${galleryHtml}
                </section>
            `;
        }).join('');

        // After inserting subsections HTML, attach edition tab handlers
        // so users can toggle between "This Year" and "Past" editions.
        container.querySelectorAll('.edition-tabs').forEach(tabWrap => {
            const buttons = Array.from(tabWrap.querySelectorAll('.edition-btn'));
            const section = tabWrap.closest('.subsection-item');
            if (!section) return;
            const contents = Array.from(section.querySelectorAll('.edition-content'));

            buttons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const target = btn.getAttribute('data-target');
                    // toggle active button
                    buttons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    // show/hide contents
                    contents.forEach(c => {
                        c.classList.toggle('hidden', c.getAttribute('data-edition') !== target);
                    });
                });
            });
        });

        // No subsection-level gallery click handlers — global gallery handles clicks.
    }
}

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.pwPage = new PWPage();
});
