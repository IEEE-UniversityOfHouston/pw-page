/**
 * P&W Page - Main JavaScript
 * Handles section toggling and interactive features
 */

class PWPage {
    constructor() {
        this.currentSection = 'workshops';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadContent();
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
        }
    }

    loadContent() {
        // Load data and populate sections
        if (typeof PWData !== 'undefined') {
            this.populateWorkshops(PWData.workshops);
            this.populateProjects(PWData.projects);
            this.populateCommittee(PWData.committee);
            this.populateResources(PWData.resources);
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
            <div class="item-card">
                <h4>${member.name}</h4>
                <p>${member.role}</p>
            </div>
        `).join('');
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
}

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.pwPage = new PWPage();
});
