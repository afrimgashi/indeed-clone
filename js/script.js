let jobs = JSON.parse(localStorage.getItem('jobs')) || [
    { id: 1, title: "Web Developer", company: "CodeCo", location: "New York", salary: "$80k", tags: ["Full-Time", "Tech"], featured: false, description: "Build and maintain web applications." },
    { id: 2, title: "Nurse Practitioner", company: "HealthCare Inc", location: "Boston", salary: "$90k", tags: ["Full-Time", "Healthcare"], featured: true, description: "Provide patient care in a hospital setting." },
    { id: 3, title: "Financial Analyst", company: "FinanceCorp", location: "Chicago", salary: "$85k", tags: ["Full-Time", "Finance"], featured: false, description: "Analyze financial data and trends." },
    { id: 4, title: "Software Engineer", company: "TechStar", location: "San Francisco", salary: "$120k", tags: ["Full-Time", "Tech", "Remote"], featured: true, description: "Develop scalable software solutions." },
    { id: 5, title: "Medical Assistant", company: "MediCare", location: "Los Angeles", salary: "$60k", tags: ["Part-Time", "Healthcare"], featured: false, description: "Assist doctors with patient care." }
];
let currentUser = localStorage.getItem('currentUser') || null;
const JOBS_PER_PAGE = 5;
let currentPage = 1;
const suggestions = ["tech", "healthcare", "finance", "developer", "nurse", "new york", "remote"];

document.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    updateUserStatus();
    renderJobs();
    renderFeaturedJobs();
    setupMobileMenu();
    setupFilterToggle();
    setupStickySearch();
    window.addEventListener('scroll', handleScroll);
});

function loadTheme() {
    if (localStorage.getItem('theme') === 'light') document.body.classList.add('light-mode');
}

document.querySelector('.theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
    document.querySelector('.theme-toggle i').classList.toggle('fa-sun');
    document.querySelector('.theme-toggle i').classList.toggle('fa-moon');
});

function setupMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav');
    toggle.addEventListener('click', () => {
        nav.classList.toggle('active');
    });
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && !toggle.contains(e.target) && nav.classList.contains('active')) {
            nav.classList.remove('active');
        }
    });
}

function setupFilterToggle() {
    const toggle = document.querySelector('.toggle-filters');
    const content = document.querySelector('.filter-content');
    if (toggle) {
        toggle.addEventListener('click', () => {
            content.classList.toggle('active');
        });
    }
}

function setupStickySearch() {
    const stickySearch = document.querySelector('.sticky-search');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            stickySearch.classList.add('active');
        } else {
            stickySearch.classList.remove('active');
        }
    });
}

function handleScroll() {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
}

function updateUserStatus() {
    const signinBtn = document.querySelector('.btn-signin');
    if (currentUser) signinBtn.classList.add('hidden');
    else signinBtn.classList.remove('hidden');
}

function showLoginModal() {
    alert('Login modal coming soon!');
}

function showPostJob() {
    if (!currentUser) {
        alert('Please sign in to post a job!');
        showLoginModal();
    } else {
        document.getElementById('post-job').classList.toggle('hidden');
        document.querySelector('.job-listings').classList.toggle('hidden');
    }
}

function showJobDetails(id) {
    const job = jobs.find(j => j.id === id);
    if (!job) return;
    const modal = document.getElementById('job-details-modal');
    const content = document.getElementById('job-details-content');
    content.innerHTML = `
        <h2>${job.title}</h2>
        <p>${job.company} - ${job.location}</p>
        <p>${job.salary}</p>
        <p>${job.description}</p>
        <div class="tags">${job.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>
    `;
    modal.classList.remove('hidden');
}

function closeModal(id) {
    document.getElementById(id).classList.add('hidden');
}

document.getElementById('apply-form').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Application submitted!');
    closeModal('job-details-modal');
});

document.getElementById('job-form').addEventListener('submit', (e) => {
    e.preventDefault();
    if (!currentUser) return;
    const job = {
        id: Date.now(),
        title: document.getElementById('job-title').value,
        company: document.getElementById('company').value,
        location: document.getElementById('location').value,
        salary: "$80k",
        tags: ["New"],
        featured: false,
        description: "Job description placeholder."
    };
    jobs.push(job);
    localStorage.setItem('jobs', JSON.stringify(jobs));
    document.getElementById('job-form').reset();
    document.getElementById('post-job').classList.add('hidden');
    document.querySelector('.job-listings').classList.remove('hidden');
    renderJobs();
});

function renderJobs() {
    const jobsGrid = document.getElementById('jobs-grid');
    jobsGrid.innerHTML = '';
    const filteredJobs = filterJobs();
    const start = (currentPage - 1) * JOBS_PER_PAGE;
    const end = start + JOBS_PER_PAGE;
    const paginatedJobs = filteredJobs.slice(start, end);

    paginatedJobs.forEach(job => {
        const jobCard = document.createElement('div');
        jobCard.className = `job-card fade-in ${job.featured ? 'featured' : ''}`;
        jobCard.innerHTML = `
            <h3>${job.title}</h3>
            <p>${job.company} - ${job.location}</p>
            <p>${job.salary}</p>
            <div class="tags">${job.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>
            <button class="btn btn-primary mt-20" onclick="showJobDetails(${job.id})">View Details</button>
        `;
        jobsGrid.appendChild(jobCard);
    });
    updatePagination(filteredJobs.length);
    updateSuggestions();
}

function renderFeaturedJobs() {
    const featuredJobs = jobs.filter(job => job.featured);
    const carousel = document.getElementById('featured-jobs-carousel');
    carousel.innerHTML = featuredJobs.map(job => `
        <div class="carousel-item">
            <h3>${job.title}</h3>
            <p>${job.company}</p>
        </div>
    `).join('');
}

function filterJobs() {
    const query = document.getElementById('hero-search').value.toLowerCase();
    const category = document.getElementById('category-filter').value;
    const location = document.getElementById('location-filter').value.toLowerCase();
    const salary = parseInt(document.getElementById('salary-range').value);
    const remote = document.getElementById('remote-filter').checked;

    return jobs.filter(job => {
        const salaryMatch = !job.salary.includes('$') || parseInt(job.salary.replace(/\D/g, '')) * 1000 >= salary;
        const categoryMatch = category === 'all' || job.tags.includes(category);
        const locationMatch = !location || job.location.toLowerCase().includes(location);
        const remoteMatch = !remote || job.tags.includes('remote');
        const searchMatch = !query || job.title.toLowerCase().includes(query) || job.company.toLowerCase().includes(query);
        return salaryMatch && categoryMatch && locationMatch && remoteMatch && searchMatch;
    });
}

function updatePagination(totalJobs) {
    const totalPages = Math.ceil(totalJobs / JOBS_PER_PAGE);
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.className = 'btn btn-secondary';
        btn.onclick = () => { currentPage = i; renderJobs(); };
        if (i === currentPage) btn.classList.add('active');
        pagination.appendChild(btn);
    }
}

function sortJobs() {
    const sort = document.getElementById('sort-filter').value;
    jobs.sort((a, b) => {
        if (sort === 'date') return b.id - a.id;
        if (sort === 'salary') return parseInt(b.salary.replace(/\D/g, '')) - parseInt(a.salary.replace(/\D/g, ''));
        return 0;
    });
    renderJobs();
}

function searchJobs() {
    currentPage = 1;
    renderJobs();
}

function updateSalaryValue(value) {
    document.getElementById('salary-value').textContent = `$${parseInt(value).toLocaleString()}+`;
}

function updateSuggestions() {
    const query = document.getElementById('hero-search').value.toLowerCase();
    const datalist = document.getElementById('search-suggestions');
    datalist.innerHTML = suggestions.filter(s => s.includes(query)).map(s => `<option value="${s}">`).join('');
}

document.querySelectorAll('.smooth-scroll').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelector(anchor.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
        if (window.innerWidth <= 768) document.querySelector('.nav').classList.remove('active');
    });
});