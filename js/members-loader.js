/**
 * Members Loader - Fetches member data from public Google Sheet CSV
 * Parses CSV and populates PWData.subsections member data dynamically
 */

class MembersLoader {
    static config = {
        csvUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTtut0Ug7UwTi91_mkpFk48TSY_1iZJ3DAwGPioT7-ORsXmjqszaRcv8suV1L1UeMkESGTLhZLJapOA/pub?gid=847868819&single=true&output=csv'
    };

    /**
     * Initialize the members loader (optional, can be skipped if autoPopulateMembers is called directly)
     */
    static init() {
        console.log('MembersLoader initialized');
    }

    /**
     * Parse CSV text into an array of objects.
     * Expects the first row to be headers.
     * @param {string} csvText - Raw CSV text
     * @returns {Array<Object>} Array of parsed rows as objects
     */
    static parseCSV(csvText) {
        const lines = csvText.trim().split('\n');
        if (lines.length < 2) return [];

        // Parse and normalize header row
        const rawHeaders = this.parseCSVLine(lines[0]);
        const headers = rawHeaders.map(h => this.normalizeHeader(h));
        
        // Parse data rows
        const rows = [];
        for (let i = 1; i < lines.length; i++) {
            const values = this.parseCSVLine(lines[i]);
            if (values.length > 0 && values.some(v => v.trim())) {
                // Create object mapping normalized headers to values
                const row = {};
                headers.forEach((header, idx) => {
                    row[header] = values[idx] ? values[idx].trim() : '';
                });
                rows.push(row);
            }
        }
        return rows;
    }

    /**
     * Parse a single CSV line, handling quoted fields with commas.
     * @param {string} line - CSV line
     * @returns {Array<string>} Array of field values
     */
    static parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            const nextChar = line[i + 1];

            if (char === '"') {
                if (inQuotes && nextChar === '"') {
                    // Escaped quote
                    current += '"';
                    i++;
                } else {
                    // Toggle quote state
                    inQuotes = !inQuotes;
                }
            } else if (char === ',' && !inQuotes) {
                // Field separator
                result.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        result.push(current);
        return result;
    }

    /**
     * Normalize header names to canonical keys for easier mapping.
     */
    static normalizeHeader(h) {
        const s = (h || '').toLowerCase().trim();
        // Prefer substring matching to be resilient to minor label changes
        if (s.includes('full name')) return 'full_name';
        if (s.includes('nickname')) return 'nickname';
        if (s.includes('graduating')) return 'graduating_semester';
        if (s.includes('years in ieee p&w')) return 'years';
        if (s.includes('years in ieee p&') || s.includes('years in ieee p') || s === 'years') return 'years';
        if (s.includes('image url')) return 'image_url';
        if (s.includes('display image')) return 'display_image';
        if (s.includes('pw statement') || s.includes('p&w statement') || s.includes('what you enjoy')) return 'pw_statement';
        if (s.includes('subteams') || s.includes('sub-team') || s.includes('sub team') || s.includes('committee sub-teams')) return 'subteam';
        if (s.includes('github')) return 'github';
        if (s.includes('linkedin')) return 'linkedin';
        if (s.includes('years of co-chair') || s.includes('years of cochair') || s.includes('co-chair years')) return 'co_chair_years';
        if (s.includes('co-chair?') || (s.includes('co-chair') && !s.includes('years'))) return 'is_co_chair';
        if (s.includes('email')) return 'email';
        if (s.includes('timestamp')) return 'timestamp';
        return s.replace(/\s+/g, '_');
    }

    /**
     * Fetch member data from the public Google Sheet CSV.
     * @returns {Promise<Array>} Array of member objects
     */
    static async fetchMembersFromSheet() {
        try {
            const response = await fetch(this.config.csvUrl);
            if (!response.ok) {
                console.error('Failed to fetch members CSV:', response.status);
                return [];
            }
            const csvText = await response.text();
            const rows = this.parseCSV(csvText);
            
            // Map CSV columns to member object structure
            const members = rows.map(row => {
                // Parse image URL (handle Google Drive links)
                // Prefer explicit image URL provided by the form
                const originalImageUrl = row['image_url'] || '';
                let imageUrl = originalImageUrl ||
                               row['image'] ||
                               row['display_image'] ||
                               'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop';
                
                // Convert Google Drive file IDs to direct image URLs if needed
                if (imageUrl && imageUrl.includes('drive.google.com/open?id=')) {
                    const fileId = imageUrl.match(/id=([^&]+)/)?.[1];
                    if (fileId) {
                        imageUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
                    }
                }
                // Also handle standard Drive file URLs: https://drive.google.com/file/d/FILE_ID/view
                if (imageUrl && imageUrl.includes('drive.google.com/file/d/')) {
                    const match = imageUrl.match(/drive\.google\.com\/file\/d\/([^/]+)/);
                    const fileId = match ? match[1] : null;
                    if (fileId) {
                        imageUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
                    }
                }
                
                // Convert HEIC images to web-compatible format using proxy
                if (imageUrl && (imageUrl.toLowerCase().endsWith('.heic') || imageUrl.toLowerCase().includes('.heic'))) {
                    const encodedUrl = encodeURIComponent(imageUrl);
                    imageUrl = `https://images.weserv.nl/?url=${encodedUrl}&output=webp`;
                }
                
                // Parse years in P&W (may be comma-separated)
                const yearsStr = row['years'] || '';
                const years = yearsStr
                    .split(/[,\n;]/)
                    .map(y => y.trim())
                    .filter(y => y.length > 0);
                
                // Parse social links
                const github = row['github'] || row['github_profile_link'] || '';
                const linkedin = row['linkedin'] || row['linkedin_profile_link'] || '';
                
                // Parse co-chair status and years
                const isCoChair = ((row['is_co_chair'] || '')).toLowerCase().includes('yes');
                const coChairYearsStr = row['co_chair_years'] || '';
                const coChairYears = coChairYearsStr
                    .split(/[,\n;]/)
                    .map(y => y.trim())
                    .filter(y => y.length > 0);
                
                // Graduating semester (e.g., "Spring 2026")
                const graduatingSemester = row['graduating_semester'] || '';

                return {
                    name: row['full_name'] || row['name'] || 'Member',
                    nickname: row['nickname'] || '',
                    subteam: row['subteam'] || '',
                    years: years,
                    pwStatement: row['pw_statement'] || 'Active in P&W Committee',
                    github: github,
                    linkedin: linkedin,
                    image: imageUrl,
                    imageUrl: originalImageUrl || imageUrl,
                    graduatingSemester: graduatingSemester,
                    isCoChair: isCoChair,
                    coChairYears: coChairYears
                };
            });

            // Filter out any rows that look like header prompts rather than data
            const cleaned = members.filter(m => {
                return m.name && m.name.toLowerCase() !== 'full name';
            });

            console.log(`Loaded ${cleaned.length} members from Google Sheet`);
            return cleaned;
        } catch (error) {
            console.error('Error fetching members from sheet:', error);
            return [];
        }
    }

    /**
     * Auto-populate the "meet-members" subsection with data from the Google Sheet.
     * Call this during page initialization before rendering.
     */
    static async autoPopulateMembers() {
        if (typeof PWData === 'undefined') {
            console.warn('PWData not available for member population');
            return;
        }

        const members = await this.fetchMembersFromSheet();
        
        // Find the "meet-members" subsection and populate it
        const meetMembersSection = PWData.subsections.find(s => s.id === 'meet-members');
        if (meetMembersSection) {
            meetMembersSection.members = members;
            console.log('Meet members section updated with dynamic data');
        }
    }
}

// Export for Node.js test usage (harmless in browser)
try { module.exports = { MembersLoader }; } catch (_) {}

// Simple CLI test: `node js/members-loader.js --test-members`
if (typeof process !== 'undefined' && Array.isArray(process.argv) && process.argv.includes('--test-members')) {
    (async () => {
        console.log('[MembersLoader] Running CLI test...');
        try {
            const members = await MembersLoader.fetchMembersFromSheet();
            console.log(`[MembersLoader] Parsed members: ${members.length}`);
            // Print a compact preview of first few entries
            members.slice(0, 5).forEach((m, i) => {
                console.log(`#${i+1}`, {
                    name: m.name,
                    nickname: m.nickname,
                    subteam: m.subteam,
                    years: m.years,
                    graduatingSemester: m.graduatingSemester,
                    pwStatement: m.pwStatement,
                    github: m.github,
                    linkedin: m.linkedin,
                    imageUrl: m.imageUrl,
                    isCoChair: m.isCoChair,
                    coChairYears: m.coChairYears,
                });
            });
            if (members.length > 5) console.log('...');
        } catch (err) {
            console.error('[MembersLoader] Test failed:', err);
            process.exitCode = 1;
        }
    })();
}
