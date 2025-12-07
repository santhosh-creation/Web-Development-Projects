// Work Management Dashboard JavaScript

// Application Data
const appData = {
  "projects": [
    {
      "id": "proj-1",
      "title": "Website Redesign",
      "description": "Complete overhaul of company website with modern design",
      "category": "new-work",
      "priority": "high",
      "status": "in-progress",
      "dueDate": "2025-10-15",
      "assignedTo": ["john-doe", "jane-smith"],
      "progress": 65,
      "tags": ["design", "frontend", "urgent"],
      "createdAt": "2025-09-01",
      "updatedAt": "2025-09-13"
    },
    {
      "id": "proj-2", 
      "title": "Mobile App Development",
      "description": "Native iOS and Android app for customer portal",
      "category": "my-new-work",
      "priority": "very-high",
      "status": "planning",
      "dueDate": "2025-11-30",
      "assignedTo": ["alice-johnson"],
      "progress": 25,
      "tags": ["mobile", "development", "ios", "android"],
      "createdAt": "2025-09-05",
      "updatedAt": "2025-09-12"
    },
    {
      "id": "proj-3",
      "title": "Database Migration",
      "description": "Migrate legacy database to cloud infrastructure",
      "category": "normal",
      "priority": "medium",
      "status": "completed",
      "dueDate": "2025-09-30",
      "assignedTo": ["bob-wilson"],
      "progress": 100,
      "tags": ["database", "migration", "infrastructure"],
      "createdAt": "2025-08-15",
      "updatedAt": "2025-09-30"
    },
    {
      "id": "proj-4",
      "title": "Security Audit",
      "description": "Comprehensive security review and penetration testing",
      "category": "very-important",
      "priority": "critical",
      "status": "in-progress",
      "dueDate": "2025-09-25",
      "assignedTo": ["charlie-brown", "diana-prince"],
      "progress": 80,
      "tags": ["security", "audit", "compliance"],
      "createdAt": "2025-09-01",
      "updatedAt": "2025-09-13"
    },
    {
      "id": "proj-5",
      "title": "Legacy System Maintenance",
      "description": "Routine maintenance and bug fixes for old systems",
      "category": "old",
      "priority": "low",
      "status": "on-hold",
      "dueDate": "2025-12-15",
      "assignedTo": ["eve-adams"],
      "progress": 15,
      "tags": ["maintenance", "legacy", "bugs"],
      "createdAt": "2025-08-01",
      "updatedAt": "2025-09-10"
    },
    {
      "id": "proj-6",
      "title": "API Integration",
      "description": "Integrate third-party APIs for enhanced functionality",
      "category": "new-work",
      "priority": "medium",
      "status": "planning",
      "dueDate": "2025-10-30",
      "assignedTo": ["frank-miller"],
      "progress": 10,
      "tags": ["api", "integration", "backend"],
      "createdAt": "2025-09-10",
      "updatedAt": "2025-09-13"
    }
  ],
  "categories": [
    {
      "id": "new-work",
      "title": "New Work Project",
      "color": "#34C759",
      "description": "Fresh projects just started"
    },
    {
      "id": "my-new-work", 
      "title": "My New Work Project",
      "color": "#007AFF",
      "description": "Personal new assignments"
    },
    {
      "id": "old",
      "title": "Old Project", 
      "color": "#8E8E93",
      "description": "Legacy and maintenance projects"
    },
    {
      "id": "normal",
      "title": "Normal Project",
      "color": "#FF9500", 
      "description": "Standard ongoing projects"
    },
    {
      "id": "very-important",
      "title": "Very Important Project",
      "color": "#FF3B30",
      "description": "Critical high-priority projects"
    }
  ],
  "team": [
    {
      "id": "john-doe",
      "name": "John Doe",
      "role": "Frontend Developer",
      "avatar": "JD",
      "email": "john@company.com"
    },
    {
      "id": "jane-smith",
      "name": "Jane Smith", 
      "role": "UI/UX Designer",
      "avatar": "JS",
      "email": "jane@company.com"
    },
    {
      "id": "alice-johnson",
      "name": "Alice Johnson",
      "role": "Mobile Developer", 
      "avatar": "AJ",
      "email": "alice@company.com"
    },
    {
      "id": "bob-wilson",
      "name": "Bob Wilson",
      "role": "Backend Developer",
      "avatar": "BW", 
      "email": "bob@company.com"
    },
    {
      "id": "charlie-brown",
      "name": "Charlie Brown",
      "role": "Security Specialist",
      "avatar": "CB",
      "email": "charlie@company.com"
    },
    {
      "id": "diana-prince",
      "name": "Diana Prince",
      "role": "DevOps Engineer",
      "avatar": "DP",
      "email": "diana@company.com"
    },
    {
      "id": "eve-adams",
      "name": "Eve Adams",
      "role": "System Administrator", 
      "avatar": "EA",
      "email": "eve@company.com"
    },
    {
      "id": "frank-miller",
      "name": "Frank Miller",
      "role": "API Developer",
      "avatar": "FM",
      "email": "frank@company.com"
    }
  ]
};

// Application State
let currentView = 'dashboard';
let filteredProjects = [...appData.projects];
let draggedProject = null;
let currentProject = null;
let projectChart = null;

// Global functions for modal (needed for inline onclick)
window.openProjectModal = openProjectModal;

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing app...');
    initializeApp();
});

function initializeApp() {
    setupEventListeners();
    switchView('dashboard'); // Start with dashboard view
    loadTheme();
}

// Event Listeners
function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // View Toggle buttons in top nav
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const view = e.target.dataset.view;
            console.log('View button clicked:', view);
            switchView(view);
            updateViewToggle(view);
        });
    });

    // Sidebar Navigation
    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const section = e.currentTarget.dataset.section;
            console.log('Sidebar item clicked:', section);
            switchView(section);
            updateSidebarActive(e.currentTarget);
        });
    });

    // Theme Toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', (e) => {
            e.preventDefault();
            toggleTheme();
        });
    }

    // Search
    const globalSearch = document.getElementById('globalSearch');
    if (globalSearch) {
        globalSearch.addEventListener('input', (e) => {
            console.log('Search input:', e.target.value);
            filterProjects(e.target.value);
        });
    }

    // Filters
    const priorityFilter = document.getElementById('priorityFilter');
    const statusFilter = document.getElementById('statusFilter');
    if (priorityFilter) priorityFilter.addEventListener('change', applyFilters);
    if (statusFilter) statusFilter.addEventListener('change', applyFilters);

    // Add Project Button
    const addProjectBtn = document.querySelector('.add-project-btn');
    if (addProjectBtn) {
        addProjectBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openProjectModal();
        });
    }

    // Modal Events
    const closeModal = document.getElementById('closeModal');
    const cancelProject = document.getElementById('cancelProject');
    const saveProjectBtn = document.getElementById('saveProject');
    const modalBackdrop = document.querySelector('.modal-backdrop');
    
    if (closeModal) closeModal.addEventListener('click', (e) => {
        e.preventDefault();
        closeProjectModal();
    });
    if (cancelProject) cancelProject.addEventListener('click', (e) => {
        e.preventDefault();
        closeProjectModal();
    });
    if (saveProjectBtn) saveProjectBtn.addEventListener('click', (e) => {
        e.preventDefault();
        saveProjectHandler();
    });
    if (modalBackdrop) modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) {
            closeProjectModal();
        }
    });

    // Progress Slider
    const progressSlider = document.getElementById('projectProgress');
    if (progressSlider) {
        progressSlider.addEventListener('input', (e) => {
            const progressValue = document.getElementById('progressValue');
            if (progressValue) {
                progressValue.textContent = e.target.value + '%';
            }
        });
    }

    // Calendar Navigation
    const prevMonth = document.getElementById('prevMonth');
    const nextMonth = document.getElementById('nextMonth');
    if (prevMonth) prevMonth.addEventListener('click', (e) => {
        e.preventDefault();
        navigateCalendar(-1);
    });
    if (nextMonth) nextMonth.addEventListener('click', (e) => {
        e.preventDefault();
        navigateCalendar(1);
    });
}

// View Management
function switchView(viewName) {
    console.log('Switching to view:', viewName);
    
    // Hide all views
    document.querySelectorAll('.view-content').forEach(view => {
        view.classList.add('hidden');
    });

    // Show selected view
    const viewMap = {
        'kanban': 'kanbanView',
        'projects': 'kanbanView',
        'dashboard': 'dashboardView', 
        'calendar': 'calendarView',
        'team': 'teamView',
        'analytics': 'analyticsView',
        'settings': 'analyticsView' // Use analytics view for settings
    };

    const targetViewId = viewMap[viewName];
    const viewElement = document.getElementById(targetViewId);
    
    console.log('Target view ID:', targetViewId, 'Element found:', !!viewElement);
    
    if (viewElement) {
        viewElement.classList.remove('hidden');
        currentView = viewName;
        
        // Render view-specific content
        setTimeout(() => {
            if (viewName === 'dashboard') {
                renderDashboard();
            } else if (viewName === 'kanban' || viewName === 'projects') {
                renderKanbanBoard();
            } else if (viewName === 'calendar') {
                renderCalendar();
            } else if (viewName === 'team') {
                renderTeam();
            } else if (viewName === 'analytics' || viewName === 'settings') {
                renderAnalyticsView();
            }
        }, 50);
    } else {
        console.error('View element not found:', targetViewId);
    }
}

function updateViewToggle(activeView) {
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.view === activeView) {
            btn.classList.add('active');
        }
    });
}

function updateSidebarActive(activeItem) {
    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.classList.remove('active');
    });
    activeItem.classList.add('active');
}

// Kanban Board
function renderKanbanBoard() {
    console.log('Rendering Kanban board...');
    const board = document.getElementById('kanbanBoard');
    if (!board) {
        console.error('Kanban board element not found');
        return;
    }
    
    board.innerHTML = '';

    appData.categories.forEach(category => {
        const column = createKanbanColumn(category);
        board.appendChild(column);
    });
}

function createKanbanColumn(category) {
    const categoryProjects = filteredProjects.filter(p => p.category === category.id);
    
    const column = document.createElement('div');
    column.className = 'kanban-column';
    column.dataset.categoryId = category.id;

    column.innerHTML = `
        <div class="column-header">
            <div class="column-indicator" style="background-color: ${category.color}"></div>
            <span class="column-title">${category.title}</span>
            <span class="column-count">${categoryProjects.length}</span>
        </div>
        <div class="project-cards" data-category="${category.id}"></div>
    `;

    const cardsContainer = column.querySelector('.project-cards');
    
    // Add drop zone functionality
    setupDropZone(cardsContainer);

    // Add project cards
    categoryProjects.forEach(project => {
        const card = createProjectCard(project);
        cardsContainer.appendChild(card);
    });

    return column;
}

function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.dataset.projectId = project.id;
    card.draggable = true;

    const assignees = project.assignedTo.map(id => {
        const member = appData.team.find(t => t.id === id);
        return member ? `<div class="assignee-avatar" style="background-color: ${getAvatarColor(member.avatar)}">${member.avatar}</div>` : '';
    }).join('');

    const dueDate = new Date(project.dueDate);
    const today = new Date();
    const isOverdue = dueDate < today && project.status !== 'completed';
    const dueDateClass = isOverdue ? 'due-date overdue' : 'due-date';

    card.innerHTML = `
        <div class="card-header">
            <h4 class="card-title">${project.title}</h4>
            <span class="priority-badge priority-${project.priority}">${project.priority.replace('-', ' ')}</span>
        </div>
        <p class="card-description">${project.description}</p>
        <div class="card-meta">
            <span class="${dueDateClass}">Due: ${formatDate(project.dueDate)}</span>
        </div>
        <div class="progress-bar">
            <div class="progress-fill" style="width: ${project.progress}%"></div>
        </div>
        <div class="card-footer">
            <div class="assignees">${assignees}</div>
            <div class="card-actions">
                <button class="action-btn" type="button">✏️</button>
            </div>
        </div>
    `;

    // Add drag event listeners
    setupDragEvents(card);

    // Add click event for opening modal (click on card but not on button)
    card.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Card clicked:', project.id);
        if (!e.target.closest('.action-btn')) {
            openProjectModal(project.id);
        }
    });

    // Add action button click event
    const actionBtn = card.querySelector('.action-btn');
    if (actionBtn) {
        actionBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Action button clicked:', project.id);
            openProjectModal(project.id);
        });
    }

    return card;
}

// Drag and Drop
function setupDragEvents(card) {
    card.addEventListener('dragstart', (e) => {
        console.log('Drag start:', e.target.dataset.projectId);
        draggedProject = e.target.dataset.projectId;
        e.target.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', draggedProject);
    });

    card.addEventListener('dragend', (e) => {
        console.log('Drag end');
        e.target.classList.remove('dragging');
        // Don't reset draggedProject here - let drop handler handle it
    });
}

function setupDropZone(container) {
    container.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        container.classList.add('drag-over');
    });

    container.addEventListener('dragleave', (e) => {
        e.preventDefault();
        // Only remove drag-over if we're actually leaving the container
        const rect = container.getBoundingClientRect();
        const x = e.clientX;
        const y = e.clientY;
        if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
            container.classList.remove('drag-over');
        }
    });

    container.addEventListener('drop', (e) => {
        e.preventDefault();
        container.classList.remove('drag-over');
        
        console.log('Drop event - draggedProject:', draggedProject);
        if (draggedProject) {
            const newCategory = container.dataset.category;
            console.log('Moving to category:', newCategory);
            moveProjectToCategory(draggedProject, newCategory);
            draggedProject = null; // Reset after successful drop
        }
    });
}

function moveProjectToCategory(projectId, newCategory) {
    console.log('Moving project', projectId, 'to category', newCategory);
    const project = appData.projects.find(p => p.id === projectId);
    if (project && project.category !== newCategory) {
        const oldCategory = project.category;
        project.category = newCategory;
        project.updatedAt = new Date().toISOString().split('T')[0];
        
        // Update filtered projects
        const filteredProject = filteredProjects.find(p => p.id === projectId);
        if (filteredProject) {
            filteredProject.category = newCategory;
        }
        
        // Re-render kanban board
        renderKanbanBoard();
        
        // Show success message
        showNotification(`Project "${project.title}" moved successfully!`);
        console.log('Project moved successfully');
    }
}

// Project Modal
function openProjectModal(projectId = null) {
    console.log('Opening project modal for:', projectId);
    const modal = document.getElementById('projectModal');
    const title = document.getElementById('modalTitle');
    
    if (!modal || !title) {
        console.error('Modal elements not found');
        return;
    }
    
    if (projectId) {
        currentProject = appData.projects.find(p => p.id === projectId);
        title.textContent = 'Edit Project';
        if (currentProject) {
            fillProjectForm(currentProject);
        }
    } else {
        currentProject = null;
        title.textContent = 'New Project';
        clearProjectForm();
    }
    
    modal.classList.remove('hidden');
    console.log('Modal opened');
}

function closeProjectModal() {
    console.log('Closing project modal');
    const modal = document.getElementById('projectModal');
    if (modal) {
        modal.classList.add('hidden');
    }
    currentProject = null;
}

function fillProjectForm(project) {
    const elements = {
        projectTitle: document.getElementById('projectTitle'),
        projectDescription: document.getElementById('projectDescription'),
        projectPriority: document.getElementById('projectPriority'),
        projectStatus: document.getElementById('projectStatus'),
        projectDueDate: document.getElementById('projectDueDate'),
        projectProgress: document.getElementById('projectProgress'),
        progressValue: document.getElementById('progressValue')
    };

    if (elements.projectTitle) elements.projectTitle.value = project.title;
    if (elements.projectDescription) elements.projectDescription.value = project.description;
    if (elements.projectPriority) elements.projectPriority.value = project.priority;
    if (elements.projectStatus) elements.projectStatus.value = project.status;
    if (elements.projectDueDate) elements.projectDueDate.value = project.dueDate;
    if (elements.projectProgress) elements.projectProgress.value = project.progress;
    if (elements.progressValue) elements.progressValue.textContent = project.progress + '%';
}

function clearProjectForm() {
    const elements = {
        projectTitle: document.getElementById('projectTitle'),
        projectDescription: document.getElementById('projectDescription'),
        projectPriority: document.getElementById('projectPriority'),
        projectStatus: document.getElementById('projectStatus'),
        projectDueDate: document.getElementById('projectDueDate'),
        projectProgress: document.getElementById('projectProgress'),
        progressValue: document.getElementById('progressValue')
    };

    if (elements.projectTitle) elements.projectTitle.value = '';
    if (elements.projectDescription) elements.projectDescription.value = '';
    if (elements.projectPriority) elements.projectPriority.value = 'medium';
    if (elements.projectStatus) elements.projectStatus.value = 'planning';
    if (elements.projectDueDate) elements.projectDueDate.value = '';
    if (elements.projectProgress) elements.projectProgress.value = 0;
    if (elements.progressValue) elements.progressValue.textContent = '0%';
}

function saveProjectHandler() {
    console.log('Saving project...');
    const titleEl = document.getElementById('projectTitle');
    const descriptionEl = document.getElementById('projectDescription');
    const priorityEl = document.getElementById('projectPriority');
    const statusEl = document.getElementById('projectStatus');
    const dueDateEl = document.getElementById('projectDueDate');
    const progressEl = document.getElementById('projectProgress');

    if (!titleEl) return;

    const title = titleEl.value.trim();
    const description = descriptionEl ? descriptionEl.value.trim() : '';
    const priority = priorityEl ? priorityEl.value : 'medium';
    const status = statusEl ? statusEl.value : 'planning';
    const dueDate = dueDateEl ? dueDateEl.value : '';
    const progress = progressEl ? parseInt(progressEl.value) : 0;

    if (!title) {
        showNotification('Please enter a project title', 'error');
        return;
    }

    if (currentProject) {
        // Update existing project
        currentProject.title = title;
        currentProject.description = description;
        currentProject.priority = priority;
        currentProject.status = status;
        currentProject.dueDate = dueDate;
        currentProject.progress = progress;
        currentProject.updatedAt = new Date().toISOString().split('T')[0];
        
        // Update in filtered projects as well
        const filteredProject = filteredProjects.find(p => p.id === currentProject.id);
        if (filteredProject) {
            Object.assign(filteredProject, currentProject);
        }
        
        showNotification('Project updated successfully!');
    } else {
        // Create new project
        const newProject = {
            id: 'proj-' + Date.now(),
            title,
            description,
            category: 'new-work',
            priority,
            status,
            dueDate,
            assignedTo: [],
            progress,
            tags: [],
            createdAt: new Date().toISOString().split('T')[0],
            updatedAt: new Date().toISOString().split('T')[0]
        };
        
        appData.projects.push(newProject);
        filteredProjects.push(newProject);
        showNotification('Project created successfully!');
    }

    closeProjectModal();
    
    // Re-render current view
    if (currentView === 'kanban' || currentView === 'projects') {
        renderKanbanBoard();
    } else if (currentView === 'dashboard') {
        renderDashboard();
    }
}

// Search and Filters
function filterProjects(searchTerm) {
    console.log('Filtering projects with term:', searchTerm);
    
    if (!searchTerm.trim()) {
        filteredProjects = [...appData.projects];
    } else {
        filteredProjects = appData.projects.filter(project => {
            const searchLower = searchTerm.toLowerCase();
            const matchesTitle = project.title.toLowerCase().includes(searchLower);
            const matchesDescription = project.description.toLowerCase().includes(searchLower);
            const matchesTags = project.tags.some(tag => tag.toLowerCase().includes(searchLower));
            
            return matchesTitle || matchesDescription || matchesTags;
        });
    }
    
    console.log('Filtered projects count:', filteredProjects.length);
    
    if (currentView === 'kanban' || currentView === 'projects') {
        renderKanbanBoard();
    }
}

function applyFilters() {
    const priorityFilter = document.getElementById('priorityFilter');
    const statusFilter = document.getElementById('statusFilter');
    const searchInput = document.getElementById('globalSearch');

    const priorityValue = priorityFilter ? priorityFilter.value : '';
    const statusValue = statusFilter ? statusFilter.value : '';
    const searchTerm = searchInput ? searchInput.value : '';

    filteredProjects = appData.projects.filter(project => {
        const matchesPriority = !priorityValue || project.priority === priorityValue;
        const matchesStatus = !statusValue || project.status === statusValue;
        const matchesSearch = !searchTerm || 
            project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
        
        return matchesPriority && matchesStatus && matchesSearch;
    });
    
    if (currentView === 'kanban' || currentView === 'projects') {
        renderKanbanBoard();
    }
}

// Dashboard
function renderDashboard() {
    console.log('Rendering dashboard...');
    calculateAndUpdateMetrics();
    renderProjectChart();
    renderRecentActivity();
}

function calculateAndUpdateMetrics() {
    const total = appData.projects.length;
    const completed = appData.projects.filter(p => p.status === 'completed').length;
    const inProgress = appData.projects.filter(p => p.status === 'in-progress').length;
    
    const today = new Date();
    const upcoming = appData.projects.filter(p => {
        const dueDate = new Date(p.dueDate);
        const diff = (dueDate - today) / (1000 * 60 * 60 * 24);
        return diff <= 7 && diff >= 0 && p.status !== 'completed';
    }).length;

    const totalEl = document.getElementById('totalProjects');
    const completedEl = document.getElementById('completedProjects');
    const inProgressEl = document.getElementById('inProgressProjects');
    const upcomingEl = document.getElementById('upcomingDeadlines');

    if (totalEl) totalEl.textContent = total;
    if (completedEl) completedEl.textContent = completed;
    if (inProgressEl) inProgressEl.textContent = inProgress;
    if (upcomingEl) upcomingEl.textContent = upcoming;
}

function renderProjectChart() {
    const canvas = document.getElementById('projectChart');
    if (!canvas) {
        console.error('Project chart canvas not found');
        return;
    }
    
    // Destroy existing chart
    if (projectChart) {
        projectChart.destroy();
    }
    
    const ctx = canvas.getContext('2d');
    
    const categoryData = appData.categories.map(category => ({
        label: category.title,
        count: appData.projects.filter(p => p.category === category.id).length,
        color: category.color
    }));

    projectChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: categoryData.map(d => d.label),
            datasets: [{
                data: categoryData.map(d => d.count),
                backgroundColor: categoryData.map(d => d.color),
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function renderRecentActivity() {
    const activityList = document.getElementById('activityList');
    if (!activityList) return;
    
    const recentProjects = appData.projects
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0, 5);

    activityList.innerHTML = recentProjects.map(project => `
        <div class="activity-item">
            <div class="activity-icon">📋</div>
            <div class="activity-text">
                <strong>${project.title}</strong> was updated on ${formatDate(project.updatedAt)}
            </div>
        </div>
    `).join('');
}

// Calendar
let currentCalendarDate = new Date();

function renderCalendar() {
    console.log('Rendering calendar...');
    const calendarGrid = document.getElementById('calendarGrid');
    const currentMonthElement = document.getElementById('currentMonth');
    
    if (!calendarGrid || !currentMonthElement) {
        console.error('Calendar elements not found');
        return;
    }
    
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();
    
    currentMonthElement.textContent = new Date(year, month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    calendarGrid.innerHTML = '';
    
    // Add day headers
    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayHeaders.forEach(day => {
        const header = document.createElement('div');
        header.className = 'calendar-day-header';
        header.style.cssText = 'font-weight: 600; padding: 8px; text-align: center; background: var(--color-secondary); color: var(--color-text-secondary);';
        header.textContent = day;
        calendarGrid.appendChild(header);
    });
    
    // Add calendar days
    for (let i = 0; i < 42; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);
        
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        
        if (currentDate.getMonth() !== month) {
            dayElement.classList.add('other-month');
        }
        
        const dayProjects = appData.projects.filter(project => {
            const projectDate = new Date(project.dueDate);
            return projectDate.toDateString() === currentDate.toDateString();
        });
        
        dayElement.innerHTML = `
            <div class="calendar-day-number">${currentDate.getDate()}</div>
            ${dayProjects.map(project => `
                <div class="calendar-event" style="background-color: ${getCategoryColor(project.category)}">
                    ${project.title}
                </div>
            `).join('')}
        `;
        
        calendarGrid.appendChild(dayElement);
    }
}

function navigateCalendar(direction) {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() + direction);
    renderCalendar();
}

// Team
function renderTeam() {
    console.log('Rendering team...');
    const teamGrid = document.getElementById('teamGrid');
    if (!teamGrid) {
        console.error('Team grid not found');
        return;
    }
    
    teamGrid.innerHTML = appData.team.map(member => {
        const assignedProjects = appData.projects.filter(p => p.assignedTo.includes(member.id));
        
        return `
            <div class="team-card">
                <div class="team-avatar-large" style="background-color: ${getAvatarColor(member.avatar)}">${member.avatar}</div>
                <div class="team-name">${member.name}</div>
                <div class="team-role">${member.role}</div>
                <div class="team-projects">${assignedProjects.length} active projects</div>
            </div>
        `;
    }).join('');
}

// Analytics
function renderAnalyticsView() {
    console.log('Rendering analytics...');
    // Simple analytics rendering - can be expanded
    const analyticsCards = document.querySelectorAll('.analytics-card');
    if (analyticsCards.length > 0) {
        const completionRate = Math.round((appData.projects.filter(p => p.status === 'completed').length / appData.projects.length) * 100);
        const productivityScore = 78; // Mock data
        
        analyticsCards.forEach((card, index) => {
            if (index === 0) {
                const scoreEl = card.querySelector('.productivity-score');
                if (scoreEl) scoreEl.textContent = productivityScore + '%';
            }
            if (index === 1) {
                const rateEl = card.querySelector('.completion-rate');
                if (rateEl) rateEl.textContent = completionRate + '%';
            }
        });
    }
}

// Theme Management
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-color-scheme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    console.log('Toggling theme from', currentTheme, 'to', newTheme);
    
    document.documentElement.setAttribute('data-color-scheme', newTheme);
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
        themeBtn.textContent = newTheme === 'light' ? '🌙' : '☀️';
    }
    
    showNotification(`Switched to ${newTheme} theme`);
}

function loadTheme() {
    const savedTheme = 'light';
    document.documentElement.setAttribute('data-color-scheme', savedTheme);
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
        themeBtn.textContent = savedTheme === 'light' ? '🌙' : '☀️';
    }
}

// Utility Functions
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function getCategoryColor(categoryId) {
    const category = appData.categories.find(c => c.id === categoryId);
    return category ? category.color : '#8E8E93';
}

function getAvatarColor(avatar) {
    const colors = ['#007AFF', '#34C759', '#FF9500', '#FF3B30', '#AF52DE', '#00C7BE'];
    const index = avatar.charCodeAt(0) % colors.length;
    return colors[index];
}

function showNotification(message, type = 'success') {
    console.log('Showing notification:', message, type);
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-base);
        padding: var(--space-12) var(--space-16);
        box-shadow: var(--shadow-lg);
        z-index: 3000;
        transform: translateX(100%);
        transition: transform 0.3s ease-out;
        max-width: 300px;
        font-size: var(--font-size-sm);
    `;
    
    if (type === 'error') {
        notification.style.borderColor = 'var(--color-error)';
        notification.style.color = 'var(--color-error)';
    } else {
        notification.style.borderColor = 'var(--color-success)';
        notification.style.color = 'var(--color-success)';
    }
    
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}