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
        
        // Initialize members loader
        if (typeof MembersLoader !== 'undefined') {
            MembersLoader.init();
            await MembersLoader.autoPopulateMembers();
        }
        
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

    // Determine which top-level section a subsection belongs to
    getParentSectionForSubsection(subsectionId) {
        try {
            if (typeof PWData === 'undefined') return null;
            const inList = (arr) => Array.isArray(arr) && arr.some(x => x.id === subsectionId);
            if (inList(PWData.workshops)) return 'workshops';
            if (inList(PWData.projects)) return 'projects';
            if (inList(PWData.committee)) return 'committee';
            if (inList(PWData.getInvolved)) return 'get-involved';
        } catch (_) {}
        return null;
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
        // Ensure the correct top-level section is visible
        const parent = this.getParentSectionForSubsection(subsectionId);
        if (parent && parent !== this.currentSection) {
            this.toggleSection(parent);
        }

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
                // Collect all unique years for filtering
                const allYears = new Set();
                subsection.members.forEach(m => {
                    (m.years || []).forEach(y => allYears.add(y));
                });
                const yearsArray = Array.from(allYears).sort().reverse();
                const currentYear = new Date().getFullYear().toString();
                const defaultYear = yearsArray.find(y => y === currentYear) || (yearsArray.length > 0 ? yearsArray[0] : null);
                
                // Separate co-chairs from regular members
                const regularMembers = subsection.members.filter(m => !m.isCoChair);
                const coChairs = subsection.members.filter(m => m.isCoChair);
                
                // Build year filter buttons
                const yearFilterButtons = yearsArray.length > 1 ? `
                    <div class="members-year-filter">
                        <label>Filter by year:</label>
                        <div class="year-filter-buttons">
                            ${yearsArray.map(year => `
                                <button class="year-filter-btn ${year === defaultYear ? 'active' : ''}" data-year="${year}">${year}</button>
                            `).join('')}
                        </div>
                    </div>
                ` : '';
                
                // Build regular members grid
                const regularMembersGrid = `
                    <div class="members-grid" data-member-type="regular">
                        ${regularMembers.map(member => `
                            <div class="member-card" data-years="${(member.years || []).join(',')}">
                                <img src="${member.image}" alt="${member.name}" class="member-image">
                                <div class="member-info">
                                    <h4 class="member-name">${member.name}</h4>
                                    ${member.nickname ? `<p class="member-nickname">${member.nickname}</p>` : ''}
                                    ${member.subteam ? `<p class="member-subteam">${member.subteam}</p>` : ''}
                                    ${member.graduatingSemester ? `<p class="member-grad">Graduating: ${member.graduatingSemester}</p>` : ''}
                                    ${member.pwStatement ? `<p class="member-statement">${member.pwStatement}</p>` : ''}
                                    ${member.imageUrl ? `<div class="member-image-url"><img src="${member.imageUrl}" alt="${member.name} image url" class="member-image-alt"></div>` : ''}
                                    <div class="member-links">
                                        ${member.github ? `<a href="${member.github}" target="_blank" rel="noopener" title="GitHub">
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>
                        </a>` : ''}
                                        ${member.linkedin ? `<a href="${member.linkedin}" target="_blank" rel="noopener" title="LinkedIn">
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 15 0 14.487 0 13.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm11.55 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/></svg>
                        </a>` : ''}
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `;
                
                // Build co-chairs section (displayed at the bottom)
                const coChairsSection = coChairs.length > 0 ? `
                    <div class="co-chairs-section">
                        <h3>Co-Chairs</h3>
                        <div class="co-chairs-grid">
                            ${coChairs.map(coChair => `
                                <div class="co-chair-card" data-years="${(coChair.coChairYears || []).join(',')}">
                                    <img src="${coChair.image}" alt="${coChair.name}" class="member-image">
                                    <div class="member-info">
                                        <h4 class="member-name">${coChair.name}</h4>
                                        ${coChair.nickname ? `<p class="member-nickname">${coChair.nickname}</p>` : ''}
                                        ${coChair.subteam ? `<p class="member-subteam">${coChair.subteam}</p>` : ''}
                                        ${coChair.graduatingSemester ? `<p class="member-grad">Graduating: ${coChair.graduatingSemester}</p>` : ''}
                                        <p class="co-chair-years">Co-Chair: ${(coChair.coChairYears || []).join(', ')}</p>
                                        ${coChair.pwStatement ? `<p class="member-statement">${coChair.pwStatement}</p>` : ''}
                                        ${coChair.imageUrl ? `<div class="member-image-url"><img src="${coChair.imageUrl}" alt="${coChair.name} image url" class="member-image-alt"></div>` : ''}
                                        <div class="member-links">
                                            ${coChair.github ? `<a href="${coChair.github}" target="_blank" rel="noopener" title="GitHub">
                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>
                            </a>` : ''}
                                            ${coChair.linkedin ? `<a href="${coChair.linkedin}" target="_blank" rel="noopener" title="LinkedIn">
                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 15 0 14.487 0 13.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm11.55 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/></svg>
                        </a>` : ''}
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : '';
                
                membersHtml = `
                    <div class="members-section">
                        ${yearFilterButtons}
                        ${regularMembersGrid}
                        ${coChairsSection}
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

        // Attach year filter handlers for members section
        container.querySelectorAll('.year-filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const selectedYear = btn.getAttribute('data-year');
                const filterContainer = btn.closest('.members-year-filter');
                const membersSection = filterContainer.closest('.members-section');
                const memberCards = membersSection.querySelectorAll('.member-card');
                
                // Update active button
                filterContainer.querySelectorAll('.year-filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Filter member cards by selected year
                memberCards.forEach(card => {
                    const yearsStr = card.getAttribute('data-years') || '';
                    const years = yearsStr.split(',').filter(y => y.trim());
                    const shouldShow = years.includes(selectedYear);
                    card.style.display = shouldShow ? '' : 'none';
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
