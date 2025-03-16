// Initial data
let jobs = JSON.parse(localStorage.getItem('jobs')) || [
    { id: 1, title: "Web Developer", company: "CodeCo", location: "New York", salary: "$80k", tags: ["Full-Time", "Onsite"], description: "Build websites.", jobType: "full-time", sponsorship: "basic", postedBy: "user1@example.com", date: Date.now() - 86400000 }
];
let users = JSON.parse(localStorage.getItem('users')) || {};
let currentUser = localStorage.getItem('currentUser') || null;
const JOBS_PER_PAGE = 5;
let currentPage = 1;
let infiniteScroll = false;
const suggestions = ["tech", "healthcare", "developer", "nurse", "new york", "remote"];

// Load initial state
document.addEventListener('DOMContentLoaded', () => {
    loadDarkMode();
    updateUserStatus();
    renderJobs();
    updateSuggestions();
});

// Dark mode
document.querySelector('.theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
});

function loadDarkMode() {
    if (localStorage.getItem('darkMode') === 'true') document.body.classList.add('dark-mode');
}

// User authentication
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

document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    if (users[email] && users[email].password === password) {
        currentUser = email;
        localStorage.setItem('currentUser', currentUser);
        updateUserStatus();
        closeModal('login-modal');
        alert('Logged in successfully!');
    } else {
        alert('Invalid credentials!');
    }
});

document.getElementById('signup-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    if (!users[email]) {
        users[email] = { password, savedJobs: [] };
        currentUser = email;
        localStorage.setItem('currentUser', currentUser);
        localStorage.setItem('users', JSON.stringify(users));
        updateUserStatus();
        closeModal('signup-modal');
        alert('Signed up successfully!');
    } else {
        alert('Email already exists!');
    }
});

function googleLogin() {
    const email = "googleuser@example.com";
    if (!users[email]) users[email] = { password: "google", savedJobs: [] };
    currentUser = email;
    localStorage.setItem('currentUser', currentUser);
    localStorage.setItem('users', JSON.stringify(users));
    updateUserStatus();
    closeModal('login-modal');
    alert('Logged in with Google!');
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateUserStatus();
    alert('Logged out!');
}

// Job posting
document.querySelector('.btn-postjob').addEventListener('click', () => {
    if (!currentUser) {
        alert('Please log in to post a job!');
        showLoginModal();
    } else {
        document.getElementById('post-job').classList.toggle('hidden');
        document.querySelector('.job-listings').classList.toggle('hidden');
    }
});

document.getElementById('job-form').addEventListener('submit', (e) => {
    e.preventDefault();
    if (!currentUser) return;
    const job = {
        id: Date.now(),
        title: document.getElementById('job-title').value,
        company: document.getElementById('company').value,
        location: document.getElementById('location').value.toLowerCase(),
        salary: document.getElementById('salary').value || "Not specified",
        description: document.getElementById('description').value,
        tags: document.getElementById('tags').value.split(',').map(t => t.trim()),
        jobType: document.getElementById('job-type-post').value,
        sponsorship: document.querySelector('input[name="sponsorship"]:checked').value,
        postedBy: currentUser,
        date: Date.now(),
        photo: document.getElementById('photo').files[0] ? URL.createObjectURL(document.getElementById('photo').files[0]) : null
    };
    jobs.push(job);
    localStorage.setItem('jobs', JSON.stringify(jobs));
    document.getElementById('job-form').reset();
    document.getElementById('post-job').classList.add('hidden');
    document.querySelector('.job-listings').classList.remove('hidden');
    renderJobs();
});

function previewJob() {
    const preview = document.getElementById('job-preview');
    preview.classList.remove('hidden');
    preview.innerHTML = `
        <h3>${document.getElementById('job-title').value}</h3>
        <p>${document.getElementById('company').value} - ${document.getElementById('location').value}</p>
        <p>${document.getElementById('salary').value || 'Not specified'}</p>
        <p>${document.getElementById('description').value}</p>
        <div class="tags">${document.getElementById('tags').value.split(',').map(t => `<span class="tag">${t.trim()}</span>`).join('')}</div>
    `;
}

// Job rendering
function renderJobs() {
    const jobsGrid = document.getElementById('jobs-grid');
    jobsGrid.innerHTML = '';
    const filteredJobs = filterJobs();
    const start = infiniteScroll ? 0 : (currentPage - 1) * JOBS_PER_PAGE;
    const end = infiniteScroll ? filteredJobs.length : start + JOBS_PER_PAGE;
    const paginatedJobs = filteredJobs.slice(start, end);

    paginatedJobs.forEach(job => {
        const jobCard = document.createElement('div');
        jobCard.className = `job-card ${job.sponsorship}`;
        jobCard.innerHTML = `
            <h3>${job.title} ${job.sponsorship !== 'basic' ? `<span class="tag sponsored-tag">${job.sponsorship.toUpperCase()}</span>` : ''}</h3>
            <p class="company"><a href="#company-${job.company}">${job.company}</a></p>
            <p class="location">${job.location}</p>
            <p class="salary">${job.salary}</p>
            <div class="tags">${job.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>
            <button class="btn btn-primary mt-20" onclick="showJobDetails(${job.id})">View Details</button>
            ${currentUser === job.postedBy ? `
                <button class="btn btn-secondary mt-20" onclick="editJob(${job.id})">Edit</button>
                <button class="btn btn-danger mt-20" onclick="deleteJob(${job.id})">Delete</button>
            ` : ''}
        `;
        jobsGrid.appendChild(jobCard);
    });

    if (infiniteScroll) {
        document.getElementById('pagination').classList.add('hidden');
        document.getElementById('load-more').classList.remove('hidden');
    } else {
        updatePagination(filteredJobs.length);
        document.getElementById('load-more').classList.add('hidden');
    }
}

function filterJobs() {
    const query = document.getElementById('job-search').value.toLowerCase();
    const category = document.getElementById('category-filter').value;
    const location = document.getElementById('location-filter').value.toLowerCase();
    const salary = parseInt(document.getElementById('salary-range').value);
    const jobType = document.getElementById('job-type-filter').value;
    const remote = document.getElementById('remote-filter').checked;
    const experience = document.getElementById('experience-filter').value;
    const dateFilter = document.getElementById('date-filter').value;

    return jobs.filter(job => {
        const salaryMatch = !job.salary.includes('$') || parseInt(job.salary.replace(/\D/g, '')) * 1000 >= salary;
        const typeMatch = jobType === 'all' || job.jobType === jobType;
        const categoryMatch = category === 'all' || job.tags.includes(category);
        const locationMatch = !location || job.location.includes(location);
        const remoteMatch = !remote || job.tags.includes('remote');
        const experienceMatch = experience === 'all' || job.tags.includes(experience);
        const dateMatch = dateFilter === 'all' || (dateFilter === '24h' && job.date > Date.now() - 86400000) ||
            (dateFilter === '7d' && job.date > Date.now() - 604800000) || (dateFilter === '30d' && job.date > Date.now() - 2592000000);
        const searchMatch = !query || job.title.toLowerCase().includes(query) || job.company.toLowerCase().includes(query) ||
            job.location.includes(query) || job.tags.some(t => t.toLowerCase().includes(query));
        return salaryMatch && typeMatch && categoryMatch && locationMatch && remoteMatch && experienceMatch && dateMatch && searchMatch;
    }).sort((a, b) => {
        const sort = document.getElementById('sort-filter').value;
        if (sort === 'date') return b.date - a.date;
        if (sort === 'salary') return (parseInt(b.salary.replace(/\D/g, '')) || 0) - (parseInt(a.salary.replace(/\D/g, '')) || 0);
        return 0; // relevance (default)
    });
}

function updatePagination(totalJobs) {
    const totalPages = Math.ceil(totalJobs / JOBS_PER_PAGE);
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.className = `btn btn-secondary ${i === currentPage ? 'active' : ''}`;
        btn.onclick = () => { currentPage = i; renderJobs(); };
        pagination.appendChild(btn);
    }
}

function toggleInfiniteScroll() {
    infiniteScroll = document.getElementById('infinite-scroll-toggle').checked;
    renderJobs();
    if (infiniteScroll) {
        window.addEventListener('scroll', handleScroll);
    } else {
        window.removeEventListener('scroll', handleScroll);
    }
}

function handleScroll() {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        renderJobs();
    }
}

document.getElementById('load-more').addEventListener('click', () => {
    currentPage++;
    renderJobs();
});

// Search
function searchJobs() {
    currentPage = 1;
    renderJobs();
    updateSuggestions();
}

function updateSuggestions() {
    const query = document.getElementById('job-search').value.toLowerCase();
    const datalist = document.getElementById('search-suggestions');
    datalist.innerHTML = suggestions.filter(s => s.includes(query)).map(s => `<option value="${s}">`).join('');
}

function updateSalaryValue(value) {
    document.getElementById('salary-value').textContent = `$${parseInt(value).toLocaleString()}+`;
}

// Job CRUD
function showJobDetails(id) {
    const job = jobs.find(j => j.id === id);
    if (!job) return;
    const modal = document.getElementById('job-details-modal');
    const content = document.getElementById('job-details-content');
    content.innerHTML = `
        <h3>${job.title}</h3>
        <p>${job.company} - ${job.location}</p>
        <p>${job.salary}</p>
        <p>${job.description}</p>
        <div class="tags">${job.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>
        ${job.photo ? `<img src="${job.photo}" alt="Job photo" style="max-width: 100%; margin-top: 10px;">` : ''}
        <button class="btn btn-primary mt-20" onclick="document.getElementById('apply-form').classList.toggle('hidden')">Apply Now</button>
    `;
    modal.classList.remove('hidden');
}

document.getElementById('apply-form').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Application submitted!');
    closeModal('job-details-modal');
});

function editJob(id) {
    const job = jobs.find(j => j.id === id);
    if (job && currentUser === job.postedBy) {
        document.getElementById('job-title').value = job.title;
        document.getElementById('company').value = job.company;
        document.getElementById('location').value = job.location;
        document.getElementById('salary').value = job.salary === "Not specified" ? '' : job.salary;
        document.getElementById('description').value = job.description;
        document.getElementById('tags').value = job.tags.join(', ');
        document.getElementById('job-type-post').value = job.jobType;
        document.querySelector(`input[name="sponsorship"][value="${job.sponsorship}"]`).checked = true;
        document.getElementById('post-job').classList.remove('hidden');
        document.querySelector('.job-listings').classList.add('hidden');
        document.getElementById('job-form').onsubmit = (e) => {
            e.preventDefault();
            saveEdit(id);
        };
    }
}

function saveEdit(id) {
    const job = jobs.find(j => j.id === id);
    if (job && currentUser === job.postedBy) {
        job.title = document.getElementById('job-title').value;
        job.company = document.getElementById('company').value;
        job.location = document.getElementById('location').value.toLowerCase();
        job.salary = document.getElementById('salary').value || "Not specified";
        job.description = document.getElementById('description').value;
        job.tags = document.getElementById('tags').value.split(',').map(t => t.trim());
        job.jobType = document.getElementById('job-type-post').value;
        job.sponsorship = document.querySelector('input[name="sponsorship"]:checked').value;
        localStorage.setItem('jobs', JSON.stringify(jobs));
        document.getElementById('job-form').reset();
        document.getElementById('post-job').classList.add('hidden');
        document.querySelector('.job-listings').classList.remove('hidden');
        renderJobs();
        document.getElementById('job-form').onsubmit = (e) => addJob(e);
    }
}

function deleteJob(id) {
    if (confirm('Are you sure you want to delete this job?')) {
        jobs = jobs.filter(j => j.id !== id);
        localStorage.setItem('jobs', JSON.stringify(jobs));
        renderJobs();
    }
}

// Modals
function showLoginModal() {
    document.getElementById('login-modal').classList.remove('hidden');
}

function showSignupModal() {
    closeModal('login-modal');
    document.getElementById('signup-modal').classList.remove('hidden');
}

function showResumeModal() {
    document.getElementById('resume-modal').classList.remove('hidden');
}

function closeModal(id) {
    document.getElementById(id).classList.add('hidden');
}

document.getElementById('resume-form').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Resume uploaded!');
    closeModal('resume-modal');
});

// Job alerts
function subscribeToAlerts() {
    alert('Job alerts subscribed! (Placeholder)');
}