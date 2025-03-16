let jobs = JSON.parse(localStorage.getItem('jobs')) || [
    { id: 1, title: "Web Developer", company: "CodeCo", location: "New York", salary: "$80k", tags: ["Full-Time"] }
];
let currentUser = localStorage.getItem('currentUser') || null;
const JOBS_PER_PAGE = 5;
let currentPage = 1;

document.addEventListener('DOMContentLoaded', () => {
    loadDarkMode();
    updateUserStatus();
    renderJobs();
    setupMobileMenu();
    window.addEventListener('scroll', handleScroll);
});

function loadDarkMode() {
    if (localStorage.getItem('darkMode') === 'true') document.body.classList.add('dark-mode');
}

document.querySelector('.theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
});

function setupMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav');
    toggle.addEventListener('click', () => {
        nav.classList.toggle('active');
    });
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && !toggle.contains(e.target) && nav.classList.contains('active')) {
            nav.classList.remove('active');
        }
    });
}

function handleScroll() {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
}

function updateUserStatus() {
    const profile = document.querySelector('.user-profile');
    const signinBtn = document.querySelector('.btn-signin');
    if (currentUser) {
        profile.classList.remove('hidden');
        signinBtn.classList.add('hidden');
        document.getElementById('user-email').textContent = currentUser;
    } else {
        profile.classList.add('hidden');
        signinBtn.classList.remove('hidden');
    }
}

document.querySelector('.btn-postjob').addEventListener('click', () => {
    document.getElementById('post-job').classList.toggle('hidden');
    document.querySelector('.job-listings').classList.toggle('hidden');
});

document.getElementById('job-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const job = {
        id: Date.now(),
        title: document.getElementById('job-title').value,
        company: document.getElementById('company').value,
        location: document.getElementById('location').value,
        salary: "$80k",
        tags: ["New"]
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
        jobCard.className = 'job-card fade-in';
        jobCard.innerHTML = `
            <h3>${job.title}</h3>
            <p>${job.company} - ${job.location}</p>
            <p>${job.salary}</p>
            <div class="tags">${job.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>
            <button class="btn btn-primary mt-20">Apply</button>
        `;
        jobsGrid.appendChild(jobCard);
    });
    updatePagination(filteredJobs.length);
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

function searchJobs() {
    currentPage = 1;
    renderJobs();
}

function updateSalaryValue(value) {
    document.getElementById('salary-value').textContent = `$${parseInt(value).toLocaleString()}+`;
}

document.querySelectorAll('.smooth-scroll').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelector(anchor.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
    });
});

function subscribeToAlerts() {
    document.getElementById('job-alerts').classList.toggle('hidden');
}