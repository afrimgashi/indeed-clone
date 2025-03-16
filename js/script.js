let jobs = JSON.parse(localStorage.getItem('jobs')) || [
    { id: 1, title: "Web Developer", company: "CodeCo", location: "New York", salary: "$80k", tags: ["Full-Time", "Tech"], featured: false, description: "Build and maintain web applications.", experience: "Mid", type: "Full-Time" },
    { id: 2, title: "Nurse Practitioner", company: "HealthCare Inc", location: "Boston", salary: "$90k", tags: ["Full-Time", "Healthcare"], featured: true, description: "Provide patient care in a hospital setting.", experience: "Senior", type: "Full-Time" },
    { id: 3, title: "Financial Analyst", company: "FinanceCorp", location: "Chicago", salary: "$85k", tags: ["Full-Time", "Finance"], featured: false, description: "Analyze financial data and trends.", experience: "Entry", type: "Full-Time" },
    { id: 4, title: "Software Engineer", company: "TechStar", location: "San Francisco", salary: "$120k", tags: ["Full-Time", "Tech", "Remote"], featured: true, description: "Develop scalable software solutions.", experience: "Senior", type: "Full-Time" },
    { id: 5, title: "Medical Assistant", company: "MediCare", location: "Los Angeles", salary: "$60k", tags: ["Part-Time", "Healthcare"], featured: false, description: "Assist doctors with patient care.", experience: "Entry", type: "Part-Time" }
];
let currentUser = localStorage.getItem('currentUser') || null;
let savedJobs = JSON.parse(localStorage.getItem('savedJobs')) || [];
let applications = JSON.parse(localStorage.getItem('applications')) || [];
let reviews = JSON.parse(localStorage.getItem('reviews')) || [
    { company: "techstar", rating: 5, text: "Great company culture and opportunities for growth.", author: "Alex M." },
    { company: "healthcare-inc", rating: 4, text: "Supportive team, but long hours.", author: "Emily R." },
    { company: "financecorp", rating: 3, text: "Good pay, but management needs improvement.", author: "John D." }
];
let followedCompanies = JSON.parse(localStorage.getItem('followedCompanies')) || [];
const JOBS_PER_PAGE = 5;
let currentPage = 1;
const suggestions = ["tech", "healthcare", "finance", "developer", "nurse", "new york", "remote"];

document.addEventListener('DOMContentLoaded', () => {
    updateUserStatus();
    renderJobs();
    renderFeaturedJobs();
    renderApplications();
    renderSavedJobs();
    renderReviews();
    renderCompanies();
    setupMobileMenu();
    setupFilterToggle();
    setupProfileDropdown();
    setupBackToTop();
    showNotification();
    setupForms();
    window.addEventListener('scroll', handleScroll);
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

function setupProfileDropdown() {
    const profileBtn = document.querySelector('.profile-btn');
    const dropdown = document.querySelector('.dropdown-content');
    if (profileBtn) {
        profileBtn.addEventListener('click', () => {
            dropdown.classList.toggle('hidden');
        });
        document.addEventListener('click', (e) => {
            if (!profileBtn.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.classList.add('hidden');
            }
        });
    }
}

function setupBackToTop() {
    const backToTop = document.querySelector('.back-to-top');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.classList.remove('hidden');
        } else {
            backToTop.classList.add('hidden');
        }
    });
}

function setupForms() {
    const signinForm = document.getElementById('signin-form');
    const signupForm = document.getElementById('signup-form');
    const reviewForm = document.getElementById('review-form');
    const salaryForm = document.getElementById('salary-calculator-form');

    if (signinForm) {
        signinForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('signin-email').value;
            const password = document.getElementById('signin-password').value;
            const users = JSON.parse(localStorage.getItem('users')) || {};
            if (users[email] && users[email].password === password) {
                currentUser = email;
                localStorage.setItem('currentUser', currentUser);
                updateUserStatus();
                window.location.href = 'index.html';
            } else {
                alert('Invalid credentials!');
            }
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            const users = JSON.parse(localStorage.getItem('users')) || {};
            if (!users[email]) {
                users[email] = { password, name: email.split('@')[0] };
                localStorage.setItem('users', JSON.stringify(users));
                currentUser = email;
                localStorage.setItem('currentUser', currentUser);
                updateUserStatus();
                window.location.href = 'index.html';
            } else {
                alert('Email already exists!');
            }
        });
    }

    if (reviewForm) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!currentUser) {
                alert('Please sign in to submit a review!');
                return;
            }
            const review = {
                company: document.getElementById('review-company').value,
                rating: parseInt(document.getElementById('review-rating').value),
                text: document.getElementById('review-text').value,
                author: currentUser.split('@')[0]
            };
            reviews.push(review);
            localStorage.setItem('reviews', JSON.stringify(reviews));
            closeModal('review-form-modal');
            renderReviews();
        });
    }

    if (salaryForm) {
        salaryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const result = document.getElementById('salary-result');
            result.classList.remove('hidden');
            result.innerHTML = `<p>Estimated Salary: <strong>$80,000/year</strong></p>`;
        });
    }
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showNotification() {
    const notification = document.querySelector('.notification');
    if (notification) {
        setTimeout(() => {
            notification.classList.remove('hidden');
        }, 2000);
    }
}

function closeNotification() {
    const notification = document.querySelector('.notification');
    notification.classList.add('hidden');
}

function handleScroll() {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
}

function updateUserStatus() {
    const signinBtn = document.querySelector('.btn-signin');
    const profileDropdown = document.querySelector('.profile-dropdown');
    const userName = document.getElementById('user-name');
    const userEmail = document.getElementById('user-email');
    if (currentUser) {
        signinBtn.classList.add('hidden');
        profileDropdown.classList.remove('hidden');
        if (userName && userEmail) {
            userName.textContent = currentUser.split('@')[0];
            userEmail.textContent = currentUser;
        }
    } else {
        signinBtn.classList.remove('hidden');
        profileDropdown.classList.add('hidden');
        if (userName && userEmail) {
            userName.textContent = 'Guest';
            userEmail.textContent = 'guest@example.com';
        }
    }
}

function socialLogin(provider) {
    currentUser = provider + 'user@example.com';
    localStorage.setItem('currentUser', currentUser);
    updateUserStatus();
    window.location.href = 'index.html';
}

function showLoginModal() {
    window.location.href = 'signin.html';
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

function showReviewForm() {
    const modal = document.getElementById('review-form-modal');
    modal.classList.remove('hidden');
}

function showSigninForm() {
    document.querySelector('.auth-form').classList.remove('hidden');
    document.getElementById('signup-form-container').classList.add('hidden');
}

function showSignupForm() {
    document.querySelector('.auth-form').classList.add('hidden');
    document.getElementById('signup-form-container').classList.remove('hidden');
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
        <div class="tags">${job.tags.map(tag => `<span class="tag"><i class="fas fa-tag"></i> ${tag}</span>`).join('')}</div>
        <button class="btn btn-secondary mt-20" onclick="saveJob(${job.id})">${savedJobs.includes(job.id) ? 'Unsave Job' : 'Save Job'}</button>
    `;
    content.dataset.jobId = id;
    modal.classList.remove('hidden');
}

function saveJob(id) {
    if (!currentUser) {
        alert('Please sign in to save jobs!');
        return;
    }
    const index = savedJobs.indexOf(id);
    if (index === -1) {
        savedJobs.push(id);
        alert('Job saved!');
    } else {
        savedJobs.splice(index, 1);
        alert('Job unsaved!');
    }
    localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
    showJobDetails(id);
    renderSavedJobs();
}

function closeModal(id) {
    document.getElementById(id).classList.add('hidden');
}

document.getElementById('apply-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const jobId = parseInt(document.getElementById('job-details-content').dataset.jobId);
    const application = {
        jobId,
        name: document.getElementById('applicant-name').value,
        email: document.getElementById('applicant-email').value,
        status: 'Pending'
    };
    applications.push(application);
    localStorage.setItem('applications', JSON.stringify(applications));
    alert('Application submitted!');
    closeModal('job-details-modal');
    renderApplications();
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
        description: "Job description placeholder.",
        experience: "Mid",
        type: "Full-Time"
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
    const spinner = jobsGrid.querySelector('.loading-spinner');
    spinner.classList.remove('hidden');
    jobsGrid.style.opacity = '0.5';
    setTimeout(() => {
        spinner.classList.add('hidden');
        jobsGrid.style.opacity = '1';
        const filteredJobs = filterJobs();
        const start = (currentPage - 1) * JOBS_PER_PAGE;
        const end = start + JOBS_PER_PAGE;
        const paginatedJobs = filteredJobs.slice(start, end);

        jobsGrid.innerHTML = paginatedJobs.map(job => `
            <div class="job-card fade-in ${job.featured ? 'featured' : ''}">
                <h3>${job.title}</h3>
                <p>${job.company} - ${job.location}</p>
                <p>${job.salary}</p>
                <div class="tags">${job.tags.map(tag => `<span class="tag"><i class="fas fa-tag"></i> ${tag}</span>`).join('')}</div>
                <button class="btn btn-primary mt-20" onclick="showJobDetails(${job.id})">View Details</button>
            </div>
        `).join('') || '<p>No jobs found.</p>';
        updatePagination(filteredJobs.length);
        updateSuggestions();
    }, 1000);
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

function renderApplications() {
    const applicationsList = document.getElementById('applications-list');
    applicationsList.innerHTML = applications.length === 0 ? '<p>No applications yet.</p>' : applications.map(app => {
        const job = jobs.find(j => j.id === app.jobId);
        return job ? `
            <div class="application-item">
                <p><strong>${job.title}</strong> at ${job.company}</p>
                <p>Status: ${app.status}</p>
            </div>
        ` : '';
    }).join('');
}

function renderSavedJobs() {
    const savedJobsList = document.getElementById('saved-jobs-list');
    if (!savedJobsList) return;
    savedJobsList.innerHTML = savedJobs.length === 0 ? '<p>No saved jobs yet.</p>' : savedJobs.map(jobId => {
        const job = jobs.find(j => j.id === jobId);
        return job ? `
            <div class="job-card fade-in">
                <h3>${job.title}</h3>
                <p>${job.company} - ${job.location}</p>
                <p>${job.salary}</p>
                <div class="tags">${job.tags.map(tag => `<span class="tag"><i class="fas fa-tag"></i> ${tag}</span>`).join('')}</div>
                <button class="btn btn-primary mt-20" onclick="showJobDetails(${job.id})">View Details</button>
                <button class="btn btn-secondary mt-20" onclick="saveJob(${job.id})">Unsave</button>
            </div>
        ` : '';
    }).join('');
}

function renderReviews() {
    const reviewList = document.getElementById('review-list');
    if (!reviewList) return;
    const companyFilter = document.getElementById('company-filter').value;
    const ratingFilter = document.getElementById('rating-filter').value;
    const filteredReviews = reviews.filter(review => {
        const companyMatch = companyFilter === 'all' || review.company === companyFilter;
        const ratingMatch = ratingFilter === 'all' || review.rating === parseInt(ratingFilter);
        return companyMatch && ratingMatch;
    });
    reviewList.innerHTML = filteredReviews.map(review => `
        <div class="review-card fade-in">
            <h2>${review.company.charAt(0).toUpperCase() + review.company.slice(1)}</h2>
            <div class="rating">
                ${Array(review.rating).fill('<i class="fas fa-star"></i>').join('')}${Array(5 - review.rating).fill('<i class="far fa-star"></i>').join('')}
            </div>
            <p>"${review.text}"</p>
            <span>— ${review.author}</span>
        </div>
    `).join('') || '<p>No reviews found.</p>';
}

function filterReviews() {
    renderReviews();
}

function renderCompanies() {
    const companyGrid = document.getElementById('company-grid');
    if (!companyGrid) return;
    const companies = [
        { name: 'TechStar', description: 'Leading tech company with a focus on innovation.', positions: 10, id: 'techstar' },
        { name: 'HealthCare Inc', description: 'Providing top-notch healthcare services.', positions: 5, id: 'healthcare-inc' },
        { name: 'FinanceCorp', description: 'Financial services and consulting.', positions: 8, id: 'financecorp' }
    ];
    const query = document.getElementById('company-search') ? document.getElementById('company-search').value.toLowerCase() : '';
    const filteredCompanies = companies.filter(company => company.name.toLowerCase().includes(query));
    companyGrid.innerHTML = filteredCompanies.map(company => `
        <div class="company-card fade-in">
            <h2>${company.name}</h2>
            <p>${company.description}</p>
            <p><strong>Open Positions:</strong> ${company.positions}</p>
            <button class="btn btn-primary" onclick="followCompany('${company.id}')">${followedCompanies.includes(company.id) ? 'Unfollow' : 'Follow'}</button>
        </div>
    `).join('') || '<p>No companies found.</p>';
}

function filterCompanies() {
    renderCompanies();
}

function followCompany(companyId) {
    if (!currentUser) {
        alert('Please sign in to follow companies!');
        return;
    }
    const index = followedCompanies.indexOf(companyId);
    if (index === -1) {
        followedCompanies.push(companyId);
        alert('Followed company!');
    } else {
        followedCompanies.splice(index, 1);
        alert('Unfollowed company!');
    }
    localStorage.setItem('followedCompanies', JSON.stringify(followedCompanies));
    renderCompanies();
}

function filterJobs() {
    const query = document.getElementById('hero-search').value.toLowerCase();
    const heroCategory = document.getElementById('hero-category-filter').value;
    const category = document.getElementById('category-filter').value;
    const location = document.getElementById('location-filter').value.toLowerCase();
    const salary = parseInt(document.getElementById('salary-range').value);
    const remote = document.getElementById('remote-filter').checked;
    const experience = document.getElementById('experience-filter') ? document.getElementById('experience-filter').value : 'all';
    const jobType = document.getElementById('job-type-filter') ? document.getElementById('job-type-filter').value : 'all';

    return jobs.filter(job => {
        const salaryMatch = !job.salary.includes('$') || parseInt(job.salary.replace(/\D/g, '')) * 1000 >= salary;
        const categoryMatch = (category === 'all' && heroCategory === 'all') || job.tags.includes(category) || job.tags.includes(heroCategory);
        const locationMatch = !location || job.location.toLowerCase().includes(location);
        const remoteMatch = !remote || job.tags.includes('remote');
        const searchMatch = !query || job.title.toLowerCase().includes(query) || job.company.toLowerCase().includes(query);
        const experienceMatch = experience === 'all' || job.experience.toLowerCase() === experience;
        const typeMatch = jobType === 'all' || job.type.toLowerCase() === jobType;
        return salaryMatch && categoryMatch && locationMatch && remoteMatch && searchMatch && experienceMatch && typeMatch;
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

function updateSuggestions() {
    const query = document.getElementById('hero-search').value.toLowerCase();
    const datalist = document.getElementById('search-suggestions');
    datalist.innerHTML = suggestions.filter(s => s.includes(query)).map(s => `<option value="${s}">`).join('');
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateUserStatus();
    window.location.href = 'index.html';
}

document.querySelectorAll('.smooth-scroll').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelector(anchor.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
        if (window.innerWidth <= 768) document.querySelector('.nav').classList.remove('active');
    });
});