/**
 * P&W Page - Data Structure
 * Contains all data for workshops, projects, committee, resources, and subsections
 * All image URLs have been updated from Unsplash placeholders to the organization's media assets.
 */

const PWData = {
    workshops: [
        {
            id: 'past-workshops',
            name: 'Past Workshops',
            description: 'View workshops from previous semesters.'
        },
        {
            id: 'upcoming-workshops',
            name: 'Upcoming Workshops',
            description: 'Check out what\'s coming next.'
        }
    ],

    projects: [
        {
            id: 'micromouse',
            name: 'Micromouse',
            picture: 'https://github.com/IEEE-UniversityOfHouston/media/blob/main/photographs/mm_f24_1.jpg?raw=true',
            description: 'Build a an autonomous robot designed to tackle a maze-solving competition!'
        },
        {
            id: 'battlebots',
            name: 'Battlebots',
            picture: 'https://github.com/IEEE-UniversityOfHouston/media/blob/main/assets/roboticsuh.png?raw=true',
            description: 'Join a community of combat robotics enthusiasts! Collaboration with Robotics@UH.'
        }
    ],

    committee: [
        {
            id: 'circuit-speed-dating',
            name: 'Circuit Speed Dating',
            picture: 'https://images.weserv.nl/?url=' + encodeURIComponent('https://github.com/IEEE-UniversityOfHouston/media/blob/main/photographs/csd_f25_19.HEIC?raw=true') + '&output=webp',
            description: 'Get to know analog circuits in quick, fun sessions.'
        },
        {
            id: 'chill-cook-off',
            name: 'Chill Cook-off Initiative',
            picture: 'https://github.com/IEEE-UniversityOfHouston/media/blob/main/photographs/cco-f25-prototile2.jpg?raw=true',
            description: 'A collaborative project we showcase for our Annual Chili Cook-off.'
        },
        {
            id: 'meet-members',
            name: 'Meet The Members',
            picture: 'https://github.com/IEEE-UniversityOfHouston/media/blob/main/photographs/csd_f25_27.jpg?raw=true',
            description: 'Get to know the P&W team.'
        }
    ],
    getInvolved: [
        {
            id: 'pw-weekly-schedule',
            title: 'Weekly Schedule',
            picture: 'https://github.com/IEEE-UniversityOfHouston/media/blob/main/assets/pw_promo.png?raw=true',
            description: 'Our weekly P&W committee meetings are open to all IEEE@UH members. Join us to work on your own projects, or learn about what we\'re building! Our mission is to create a community of enthusiasts.',
            link: '#pw-weekly-schedule',
            linkText: 'View Schedule'
        },
        {
            id: 'pw-interest-form',
            title: 'Interest Form',
            picture: 'https://github.com/IEEE-UniversityOfHouston/media/blob/main/photographs/csd_f25_12.HEIC?raw=true',
            description: 'So we can tailor our P&W committee meetings to your availability, please fill out this form! There is an additional section for members interested in joining the P&W Committee! Join Now!',
            link: '#pw-interest-form',
            linkText: 'Fill Form'
        },
        {
            id: 'propose-workshop',
            title: 'Propose a Workshop',
            picture: 'https://github.com/IEEE-UniversityOfHouston/media/blob/main/photographs/ws-f25-kicadplugins.png?raw=true',
            description: 'Have a skill to teach? Apply to collaborate on a workshop. You\'re also welcome to contact us directly.',
            link: '#propose-workshop',
            linkText: 'Propose Here'
        },
        {
            id: 'contact-info',
            title: 'Contact Us',
            picture: 'https://github.com/IEEE-UniversityOfHouston/media/blob/main/assets/ieeelogo.png?raw=true',
            description: 'Reach out to Kenny or Behlool with questions or ideas.',
            link: '#contact-info',
            linkText: 'Contact Info'
        }
    ],

    subsections: [
        {
            id: 'past-workshops',
            title: 'Past Workshops',
            picture: 'https://github.com/IEEE-UniversityOfHouston/media/blob/main/photographs/ws_f25_pcb1.HEIC?raw=true',
            description: 'Archive of past semester workshops',
            workshops: [
                {
                    id: 'fall-2025-intro-pcbs',
                    title: 'Intro to PCBs',
                    date: 'Sept 26, 2025',
                    picture: 'https://github.com/IEEE-UniversityOfHouston/workshops/blob/main/promos/F25-PCBDESIGN.png?raw=true',
                    description: 'Reading and writing schematics (+ breadboard basics), Schematics & PCBs in EasyEDA and KiCad, Symbols and footprints in KiCad, Exporting Gerber files.'
                },
                {
                    id: 'fall-2025-intro-python',
                    title: 'Intro to Python (IEEE-NSM)',
                    date: 'Oct 1, 2025',
                    picture: 'https://github.com/IEEE-UniversityOfHouston/workshops/blob/main/promos/F25-NSM-PYTHON.png?raw=true',
                    description: 'Covered variables, data types, indexing, control flow, functions, and libraries.'
                },
                {
                    id: 'fall-2025-kicad-plugins',
                    title: 'KiCad Plugins',
                    date: 'Oct 10, 2025',
                    picture: 'https://github.com/IEEE-UniversityOfHouston/workshops/blob/main/promos/F25-KICAD-PLUGINS.png?raw=true',
                    description: 'Plugin installation from GitHub and Plugin Manager. Automation, fabrication, and documentation plugins demonstrated.'
                },
                {
                    id: 'fall-2025-git-linux',
                    title: 'Intro to Git & Linux',
                    date: 'Oct 14, 2025',
                    picture: 'https://github.com/IEEE-UniversityOfHouston/workshops/blob/main/promos/F25-GITLINUX.png?raw=true',
                    description: 'GNU/Linux overview, Git basics, environment setup, SSH access, and CLI practice.'
                },
                {
                    id: 'fall-2025-soldering',
                    title: 'Soldering Workshop (AIAA)',
                    date: 'Nov 18, 2025',
                    picture: 'https://github.com/IEEE-UniversityOfHouston/workshops/blob/main/promos/F25-AIAAXROBOTICS-SOLDERING.png?raw=true',
                    description: 'Soldering header pins, soldering on perf boards, desoldering, wire soldering, and crimping connectors.'
                }
            ]
            ,
        },
        {
            id: 'upcoming-workshops',
            title: 'Upcoming Workshops',
            picture: 'https://github.com/IEEE-UniversityOfHouston/media/blob/main/assets/1.png?raw=true',
            description: 'Planned workshops for upcoming semesters',
            workshops: [
                {
                    id: 'spring-2026-3d-slicing',
                    title: '3D Slicing Workshop (ASME)',
                    date: 'Jan-Feb, 2026',
                    picture: 'https://github.com/IEEE-UniversityOfHouston/media/blob/main/assets/1.png?raw=true',
                    description: 'Slicing parameters, infill, layer height, print tolerances, printer setup and maintenance.'
                },
                {
                    id: 'spring-2026-soldering',
                    title: 'Soldering Workshop',
                    date: 'Feb, 2026',
                    picture: 'https://github.com/IEEE-UniversityOfHouston/media/blob/main/assets/1.png?raw=true',
                    description: 'Hands-on soldering practice covering headers, perf boards, desoldering, and connectors.'
                },
                {
                    id: 'spring-2026-wireless',
                    title: 'Wireless Transceiver / RC Car Project',
                    date: 'Early March, 2026',
                    picture: 'https://github.com/IEEE-UniversityOfHouston/media/blob/main/assets/roboticsuh.png?raw=true',
                    description: 'Using nRF24L01/HC-12 modules, motor control, power systems, and debugging wireless control.'
                },
                {
                    id: 'spring-2026-pcb-redux',
                    title: 'Intro to PCBs: Redux',
                    date: 'Late March, 2026',
                    picture: 'https://github.com/IEEE-UniversityOfHouston/media/blob/main/assets/1.png?raw=true',
                    description: 'Advanced schematic/documentation practices, routing techniques, Gerber preparation and verification.'
                },
                {
                    id: 'spring-2026-simulation',
                    title: 'Simulation Software (IEEE-NSM)',
                    date: 'Mid-April, 2026',
                    picture: 'https://github.com/IEEE-UniversityOfHouston/media/blob/main/assets/1.png?raw=true',
                    description: 'Intro to ngspice, FEMM, MATLAB; setting up simulations and interpreting results.'
                }
            ]
        },
        {
            id: 'micromouse',
            title: 'Micromouse',
            picture: 'https://github.com/IEEE-UniversityOfHouston/media/blob/main/photographs/mm_f24_1.jpg?raw=true',
            description: `<div class="project-details">
                <h4>Autonomous Maze-Solving Robot Competition</h4>
                <p><strong>Overview:</strong> Micromouse is an international competition where students design and build small robots that autonomously navigate and solve mazes.</p>
                <p><strong>What We Do:</strong> Our team designs the robot hardware, programs the maze-solving algorithm, and optimizes for speed and accuracy.</p>
                <p><strong>Skills Involved:</strong> PCB design, embedded systems, C/C++ programming, robotics, control systems, mechanical design.</p>
                <p><strong>Get Involved:</strong> All skill levels welcome! Whether you're interested in electronics, programming, or mechanical design, there's a role for you.</p>
            </div>`
        },
        {
            id: 'battlebots',
            title: 'Battlebots',
            picture: 'https://github.com/IEEE-UniversityOfHouston/media/blob/main/assets/roboticsuh.png?raw=true',
            description: `<div class="project-details">
                <h4>tbd</h4>
            </div>`
        },
        {
            id: 'circuit-speed-dating',
            title: 'Circuit Speed Dating',
            picture: 'https://github.com/IEEE-UniversityOfHouston/circuit-speed-dating/blob/main/fall_2025/F25-CSD-V2.png?raw=true',
            description: 'Circuit Speed Dating is a series of biweekly events that aims to introduce you to iconic analog circuits. Float from station to station to learn about all the circuits our committee prepared that week!'
        },
        {
            id: 'chill-cook-off',
            title: 'Chill Cook-off Initiative',
            picture: 'https://github.com/IEEE-UniversityOfHouston/media/blob/main/assets/3.png?raw=true',
            description: 'For decades, IEEE@UH has hosted an annual Chili Cook-Off. Starting this year, we want to design and assemble interactive installations at each Chili Cook-Off! Interested? Consider joining the P&W Committee!',
            editionGroups: {
                thisYear: {
                    id: 'cco-2025',
                    year: '2025',
                    title: 'Chill Cook-off 2025',
                    picture: 'https://github.com/IEEE-UniversityOfHouston/media/blob/main/photographs/cco-f25-prototile1.jpg?raw=true',
                    description: '<p>Our 2025 Chill Cook-off will feature a DIY interactive dance floor built by yours truly! -PW Committee.</p>'
                },
                past: []
            }
        },
        {
            id: 'meet-members',
            title: 'Meet The Members',
            picture: 'https://github.com/IEEE-UniversityOfHouston/media/blob/main/assets/3.png?raw=true',
            description: 'Get to know the students behind the Projects & Workshops team. Learn about their interests, current projects, and how they got involved with P&W.',
            members: []
        },
        {
            id: 'pw-weekly-schedule',
            title: 'P&W Weekly Schedule',
            picture: 'https://images.weserv.nl/?url=' + encodeURIComponent('https://github.com/IEEE-UniversityOfHouston/media/blob/main/photographs/ws_f25_pcb1.HEIC?raw=true') + '&output=webp',
            description: 'Check our meeting times and workshop schedule to plan ahead and never miss an event! We meet weekly on [Day] at [Time] in [Location].'
        },
        {
            id: 'pw-interest-form',
            title: 'P&W Interest Form',
            picture: 'https://github.com/IEEE-UniversityOfHouston/media/blob/main/assets/4.png?raw=true',
            description: 'Let us know what projects and workshops interest you. Your feedback helps us plan better workshops and identify collaborators for projects. Fill out the form and we\'ll be in touch!',
            formUrl: 'https://forms.gle/hvs63LwkjzV9FWDK7'
        },
        {
            id: 'propose-workshop',
            title: 'Propose a Workshop',
            picture: 'https://github.com/IEEE-UniversityOfHouston/media/blob/main/assets/1.png?raw=true',
            description: `<div class="workshop-proposal">
                <h4>Have a Skill to Share? Propose a Workshop!</h4>
                <p><strong>We're looking for workshop leaders on topics like:</strong></p>
                <ul>
                    <li>Electronics & PCB design</li>
                    <li>Embedded systems & microcontrollers</li>
                    <li>Programming languages</li>
                    <li>Mechanical design & CAD</li>
                    <li>Signal processing</li>
                    <li>Robotics & control systems</li>
                    <li>Power electronics</li>
                    <li>Machine learning applications</li>
                </ul>
                <p>Fill out the form to propose your workshop idea!</p>
            </div>`,
            formUrl: 'https://forms.gle/x4wWDeaKJ5tAuvRY7'
        },
        {
            id: 'contact-info',
            title: 'Contact Information',
            picture: 'https://github.com/IEEE-UniversityOfHouston/media/blob/main/assets/ieee.png?raw=true',
            description: `<div class="contact-info">
                <p><strong>Kenny - Lead</strong></p>
                <p>Email: kenny@example.com</p>
                <p><strong>Co-Lead</strong></p>
                <p>Email: colead@example.com</p>
                <p><strong>Follow Us:</strong></p>
                <ul>
                    <li>Discord: [Discord Server Link]</li>
                    <li>Email: pw@ieee.uh.edu</li>
                </ul>
            </div>`
        },
    ],

};