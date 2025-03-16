let jobs = JSON.parse(localStorage.getItem('jobs')) || [];
let currentUser = localStorage.getItem('currentUser') || null;
let userRole = localStorage.getItem('userRole') || 'individual';
let savedJobs = JSON.parse(localStorage.getItem('savedJobs')) || [];
let applications = JSON.parse(localStorage.getItem('applications')) || [];
let reviews = JSON.parse(localStorage.getItem('reviews')) || [];
let companies = JSON.parse(localStorage.getItem('companies')) || [];
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
    populateFilters();
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
    const jobForm = document.getElementById('job-form');
    const companyForm = document.getElementById('company-form');
    const salaryForm = document.getElementById('salary-calculator-form');

    if (signinForm) {
        signinForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const role = document.getElementById('user-role').value;
            const email = document.getElementById('signin-email').value;
            const password = document.getElementById('signin-password').value;
            const users = JSON.parse(localStorage.getItem('users')) || {};
            if (users[email] && users[email].password === password) {
                currentUser = email;
                userRole = users[email].role;
                localStorage.setItem('currentUser', currentUser);
                localStorage.setItem('userRole', userRole);
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
            const role = document.getElementById('signup-role').value;
            const name = document.getElementById('signup-name').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            const users = JSON.parse(localStorage.getItem('users')) || {};
            if (!users[email]) {
                users[email] = { password, name, role };
                localStorage.setItem('users', JSON.stringify(users));
                currentUser = email;
                userRole = role;
                localStorage.setItem('currentUser', currentUser);
                localStorage.setItem('userRole', userRole);
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
                id: Date.now(),
                company: document.getElementById('review-company').value,
                rating: parseInt(document.getElementById('review-rating').value),
                text: document.getElementById('review-text').value,
                author: currentUser.split('@')[0],
                timestamp: new Date().toISOString()
            };
            reviews.push(review);
            localStorage.setItem('reviews', JSON.stringify(reviews));
            closeModal('review-form-modal');
            renderReviews();
            populateFilters();
        });
    }

    if (jobForm) {
        jobForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!currentUser || userRole !== 'company') {
                alert('Only companies can post jobs! Please sign in as a company.');
                return;
            }
            const job = {
                id: Date.now(),
                title: document.getElementById('job-title').value,
                company: document.getElementById('job-company').value,
                location: document.getElementById('job-location').value,
                salary: document.getElementById('job-salary').value,
                tags: [document.getElementById('job-category').value],
                featured: false,
                description: document.getElementById('job-description').value,
                experience: document.getElementById('job-experience').value,
                type: document.getElementById('job-type').value,
                remote: document.getElementById('job-remote').checked,
                companyId: currentUser,
                timestamp: new Date().toISOString()
            };
            jobs.push(job);
            localStorage.setItem('jobs', JSON.stringify(jobs));
            closeModal('post-job-modal');
            renderJobs();
            showNotification(`New job posted: ${job.title} at ${job.company}!`);
        });
    }

    if (companyForm) {
        companyForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!currentUser || userRole !== 'company') {
                alert('Only companies can add company profiles!');
                return;
            }
            const company = {
                id: Date.now(),
                name: document.getElementById('company-name').value,
                description: document.getElementById('company-description').value,
                positions: parseInt(document.getElementById('company-positions').value),
                companyId: currentUser,
                timestamp: new Date().toISOString()
            };
            companies.push(company);
            localStorage.setItem('companies', JSON.stringify(companies));
            closeModal('company-form-modal');
            renderCompanies();
            populateFilters();
        });
    }

    if (salaryForm) {
        salaryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const role = document.getElementById('salary-role').value;
            const location = document.getElementById('salary-location').value;
            const result = document.getElementById('salary-result');
            const salaryData = {
                'web-developer': { 'new york': 80000, 'boston': 75000 },
                'nurse': { 'new york': 90000, 'boston': 85000 },
                'financial-analyst': { 'new york': 85000, 'boston': 80000 }
            };
            const estimatedSalary = salaryData[role] && salaryData[role][location.toLowerCase()] || 0;
            result.classList.remove('hidden');
            result.innerHTML = `<p>Estimated Salary: <strong>$${estimatedSalary}/year</strong></p>`;
        });
    }
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showNotification(message) {
    const notification = document.querySelector('.notification');
    if (notification) {
        notification.querySelector('p').textContent = message;
        notification.classList.remove('hidden');
        setTimeout(() => {
            notification.classList.add('hidden');
        }, 5000);
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
    const userRoleElement = document.getElementById('user-role');
    const users = JSON.parse(localStorage.getItem('users')) || {};
    if (currentUser) {
        signinBtn.classList.add('hidden');
        profileDropdown.classList.remove('hidden');
        if (userName && userEmail && userRoleElement) {
            userName.textContent = users[currentUser].name || currentUser.split('@')[0];
            userEmail.textContent = currentUser;
            userRoleElement.textContent = userRole.charAt(0).toUpperCase() + userRole.slice(1);
        }
    } else {
        signinBtn.classList.remove('hidden');
        profileDropdown.classList.add('hidden');
        if (userName && userEmail && userRoleElement) {
            userName.textContent = 'Guest';
            userEmail.textContent = 'guest@example.com';
            userRoleElement.textContent = 'Individual';
        }
    }
}

function socialLogin(provider) {
    currentUser = provider + 'user@example.com';
    userRole = 'individual';
    localStorage.setItem('currentUser', currentUser);
    localStorage.setItem('userRole', userRole);
    updateUserStatus();
    window.location.href = 'index.html';
}

function showLoginModal() {
    window.location.href = 'signin.html';
}

function showPostJobModal() {
    if (!currentUser || userRole !== 'company') {
        alert('Only companies can post jobs! Please sign in as a company.');
        window.location.href = 'signin.html';
        return;
    }
    const modal = document.getElementById('post-job-modal');
    modal.classList.remove('hidden');
}

function showReviewForm() {
    if (!currentUser) {
        alert('Please sign in to submit a review!');
        window.location.href = 'signin.html';
        return;
    }
    const modal = document.getElementById('review-form-modal');
    populateCompanyDropdown();
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

function showCompanyForm() {
    if (!currentUser || userRole !== 'company') {
        alert('Only companies can add company profiles!');
        window.location.href = 'signin.html';
        return;
    }
    const modal = document.getElementById('company-form-modal');
    modal.classList.remove('hidden');
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
        window.location.href = 'signin.html';
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
    if (!currentUser) {
        alert('Please sign in to apply!');
        window.location.href = 'signin.html';
        return;
    }
    const jobId = parseInt(document.getElementById('job-details-content').dataset.jobId);
    const application = {
        id: Date.now(),
        jobId,
        userId: currentUser,
        name: document.getElementById('applicant-name').value,
        email: document.getElementById('applicant-email').value,
        status: 'Pending',
        timestamp: new Date().toISOString()
    };
    applications.push(application);
    localStorage.setItem('applications', JSON.stringify(applications));
    alert('Application submitted!');
    closeModal('job-details-modal');
    renderApplications();
});

document.getElementById('job-form').addEventListener('submit', (e) => {
    e.preventDefault();
    if (!currentUser || userRole !== 'company') {
        alert('Only companies can post jobs! Please sign in as a company.');
        window.location.href = 'signin.html';
        return;
    }
    const job = {
        id: Date.now(),
        title: document.getElementById('job-title').value,
        company: document.getElementById('job-company').value,
        location: document.getElementById('job-location').value,
        salary: document.getElementById('job-salary').value,
        tags: [document.getElementById('job-category').value],
        featured: false,
        description: document.getElementById('job-description').value,
        experience: document.getElementById('job-experience').value,
        type: document.getElementById('job-type').value,
        remote: document.getElementById('job-remote').checked,
        companyId: currentUser,
        timestamp: new Date().toISOString()
    };
    jobs.push(job);
    localStorage.setItem('jobs', JSON.stringify(jobs));
    closeModal('post-job-modal');
    renderJobs();
    showNotification(`New job posted: ${job.title} at ${job.company}!`);
});

document.getElementById('company-form').addEventListener('submit', (e) => {
    e.preventDefault();
    if (!currentUser || userRole !== 'company') {
        alert('Only companies can add company profiles!');
        window.location.href = 'signin.html';
        return;
    }
    const company = {
        id: Date.now(),
        name: document.getElementById('company-name').value,
        description: document.getElementById('company-description').value,
        positions: parseInt(document.getElementById('company-positions').value),
        companyId: currentUser,
        timestamp: new Date().toISOString()
    };
    companies.push(company);
    localStorage.setItem('companies', JSON.stringify(companies));
    closeModal('company-form-modal');
    renderCompanies();
    populateFilters();
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
                <button class="btn btn-secondary mt-20" onclick="updateApplicationStatus(${app.id}, 'Reviewed')">Mark Reviewed</button>
            </div>
        ` : '';
    }).join('');
}

function updateApplicationStatus(appId, status) {
    const appIndex = applications.findIndex(a => a.id === appId);
    if (appIndex !== -1) {
        applications[appIndex].status = status;
        localStorage.setItem('applications', JSON.stringify(applications));
        renderApplications();
    }
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
    const spinner = reviewList.querySelector('.loading-spinner');
    spinner.classList.remove('hidden');
    reviewList.style.opacity = '0.5';
    setTimeout(() => {
        spinner.classList.add('hidden');
        reviewList.style.opacity = '1';
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
    }, 1000);
}

function filterReviews() {
    renderReviews();
}

function renderCompanies() {
    const companyGrid = document.getElementById('company-grid');
    if (!companyGrid) return;
    const spinner = companyGrid.querySelector('.loading-spinner');
    spinner.classList.remove('hidden');
    companyGrid.style.opacity = '0.5';
    setTimeout(() => {
        spinner.classList.add('hidden');
        companyGrid.style.opacity = '1';
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
    }, 1000);
}

function filterCompanies() {
    renderCompanies();
}

function followCompany(companyId) {
    if (!currentUser) {
        alert('Please sign in to follow companies!');
        window.location.href = 'signin.html';
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

function populateFilters() {
    const companyFilter = document.getElementById('company-filter');
    const reviewCompany = document.getElementById('review-company');
    if (companyFilter && reviewCompany) {
        const uniqueCompanies = [...new Set(companies.map(c => c.name))];
        companyFilter.innerHTML = '<option value="all">All Companies</option>' + uniqueCompanies.map(c => `<option value="${c.toLowerCase()}">${c}</option>`).join('');
        reviewCompany.innerHTML = '<option value="">Select Company</option>' + uniqueCompanies.map(c => `<option value="${c.toLowerCase()}">${c}</option>`).join('');
    }
    const salaryRole = document.getElementById('salary-role');
    if (salaryRole) {
        const uniqueRoles = [...new Set(jobs.map(j => j.title.toLowerCase()))];
        salaryRole.innerHTML = '<option value="">Select Role</option>' + uniqueRoles.map(r => `<option value="${r}">${r.charAt(0).toUpperCase() + r.slice(1)}</option>`).join('');
    }
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
        const salaryMatch = !job.salary || parseInt(job.salary.replace(/\D/g, '')) * 1000 >= salary;
        const categoryMatch = (category === 'all' && heroCategory === 'all') || job.tags.includes(category) || job.tags.includes(heroCategory);
        const locationMatch = !location || job.location.toLowerCase().includes(location);
        const remoteMatch = !remote || job.remote;
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
        if (sort === 'date') return new Date(b.timestamp) - new Date(a.timestamp);
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
    userRole = 'individual';
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userRole');
    updateUserStatus();
    window.location.href = 'index.html';
}

function switchRole() {
    userRole = userRole === 'individual' ? 'company' : 'individual';
    localStorage.setItem('userRole', userRole);
    updateUserStatus();
    window.location.href = 'dashboard.html';
}

document.querySelectorAll('.smooth-scroll').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelector(anchor.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
        if (window.innerWidth <= 768) document.querySelector('.nav').classList.remove('active');
    });
});