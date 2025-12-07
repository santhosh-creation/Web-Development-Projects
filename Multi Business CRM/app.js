// Application Data
let appData = {
  "workspaces": {
    "astrology": {
      "name": "Astrology Business",
      "theme": "astrology",
      "contacts": [
        {
          "id": "ast_1",
          "name": "Sarah Johnson",
          "phone": "+1-555-0123",
          "email": "sarah.j@email.com",
          "address": "123 Mystic Lane, Starville, CA 90210",
          "source": "Website",
          "status": "Active Client",
          "notes": [
            {"date": "2025-09-01", "text": "Interested in yearly horoscope reading"},
            {"date": "2025-09-05", "text": "Completed birth chart analysis - very satisfied"}
          ]
        },
        {
          "id": "ast_2", 
          "name": "Michael Chen",
          "phone": "+1-555-0124",
          "email": "m.chen@email.com",
          "address": "456 Crystal Ave, Moontown, CA 90211",
          "source": "Referral",
          "status": "Lead",
          "notes": [
            {"date": "2025-09-08", "text": "Referred by Sarah - looking for compatibility reading"}
          ]
        }
      ],
      "jobs": [
        {
          "id": "job_ast_1",
          "contactId": "ast_1",
          "title": "Yearly Horoscope Reading for Sarah J.",
          "description": "Complete yearly horoscope with monthly breakdowns and guidance",
          "creationDate": "2025-09-01",
          "dueDate": "2025-09-15",
          "status": "Completed",
          "quotedAmount": 150,
          "paidAmount": 150,
          "paymentStatus": "Paid",
          "issues": [],
          "notes": [
            {"date": "2025-09-01", "text": "Started birth chart analysis"},
            {"date": "2025-09-12", "text": "Completed reading - client very happy"}
          ]
        },
        {
          "id": "job_ast_2",
          "contactId": "ast_2",
          "title": "Compatibility Reading for Michael C.",
          "description": "Relationship compatibility analysis with detailed report",
          "creationDate": "2025-09-08",
          "dueDate": "2025-09-20",
          "status": "In Progress",
          "quotedAmount": 120,
          "paidAmount": 60,
          "paymentStatus": "Partially Paid",
          "issues": [],
          "notes": [
            {"date": "2025-09-08", "text": "Received birth details for both partners"}
          ]
        }
      ]
    },
    "electrical": {
      "name": "Electrical Services Business",
      "theme": "electrical",
      "contacts": [
        {
          "id": "elec_1",
          "name": "David Wilson",
          "phone": "+1-555-0125",
          "email": "d.wilson@email.com",
          "address": "789 Oak Street, Powerville, TX 75001",
          "source": "Direct Call",
          "status": "Active Client",
          "notes": [
            {"date": "2025-08-25", "text": "Full house rewiring needed - old 1960s wiring"},
            {"date": "2025-09-02", "text": "Started work on main panel upgrade"}
          ]
        },
        {
          "id": "elec_2",
          "name": "Lisa Rodriguez",
          "phone": "+1-555-0126", 
          "email": "lisa.r@email.com",
          "address": "321 Pine Road, Voltburg, TX 75002",
          "source": "Website",
          "status": "Lead",
          "notes": [
            {"date": "2025-09-07", "text": "Kitchen renovation - needs additional outlets and lighting"}
          ]
        }
      ],
      "jobs": [
        {
          "id": "job_elec_1",
          "contactId": "elec_1",
          "title": "Full House Rewiring for Wilson Residence",
          "description": "Complete electrical system upgrade including new panel, outlets, and fixtures",
          "creationDate": "2025-08-25",
          "dueDate": "2025-09-30",
          "status": "In Progress",
          "quotedAmount": 8500,
          "paidAmount": 4250,
          "paymentStatus": "Partially Paid",
          "issues": [
            {
              "id": "issue_1",
              "title": "Asbestos found in walls",
              "description": "Found asbestos insulation around old wiring - need remediation before continuing",
              "dateReported": "2025-09-03",
              "status": "Under Review",
              "resolution": ""
            }
          ],
          "notes": [
            {"date": "2025-08-25", "text": "Site inspection completed - extensive work needed"},
            {"date": "2025-09-02", "text": "Started main panel installation"},
            {"date": "2025-09-03", "text": "Work paused due to asbestos discovery"}
          ]
        },
        {
          "id": "job_elec_2",
          "contactId": "elec_2",
          "title": "Kitchen Renovation Electrical Work",
          "description": "Install 6 new outlets, under-cabinet lighting, and pendant fixtures",
          "creationDate": "2025-09-07",
          "dueDate": "2025-09-25",
          "status": "Pending",
          "quotedAmount": 1200,
          "paidAmount": 0,
          "paymentStatus": "Unpaid",
          "issues": [],
          "notes": [
            {"date": "2025-09-07", "text": "Initial consultation - waiting for permit approval"}
          ]
        }
      ]
    },
    "family": {
      "name": "Family Contacts",
      "theme": "family",
      "contacts": [
        {
          "id": "fam_1",
          "name": "Mom - Patricia Smith",
          "phone": "+1-555-0127",
          "relationship": "Mother",
          "birthday": "1965-03-15",
          "address": "555 Elm Street, Hometown, FL 33101",
          "notes": [
            {"date": "2025-09-01", "text": "Called to check in - doing well"},
            {"date": "2025-09-05", "text": "Reminded about doctor appointment next week"}
          ]
        },
        {
          "id": "fam_2",
          "name": "Uncle Joe",
          "phone": "+1-555-0128",
          "relationship": "Uncle",
          "birthday": "1958-07-22",
          "address": "777 Maple Drive, Riverside, FL 33102",
          "notes": [
            {"date": "2025-08-30", "text": "Invited to family BBQ next month"}
          ]
        },
        {
          "id": "fam_3",
          "name": "Cousin Maria",
          "phone": "+1-555-0129",
          "relationship": "Cousin",
          "birthday": "1990-11-08",
          "address": "999 Cedar Lane, Lakeside, FL 33103",
          "notes": [
            {"date": "2025-09-06", "text": "Congratulated on new job promotion"}
          ]
        }
      ]
    }
  },
  "currentStats": {
    "astrology": {
      "todaysTasks": 2,
      "activeJobs": 1,
      "completedThisMonth": 3,
      "pendingPayments": 1
    },
    "electrical": {
      "todaysTasks": 1,
      "activeJobs": 1,
      "completedThisMonth": 2,
      "pendingPayments": 2
    },
    "family": {
      "upcomingBirthdays": 1,
      "recentContacts": 3
    }
  }
};

// Application State
let currentWorkspace = null;
let currentTab = 'dashboard';
let editingContact = null;
let editingJob = null;

// Global functions for onclick handlers
window.editContact = editContact;
window.deleteContact = deleteContact;
window.editJob = editJob;
window.markJobComplete = markJobComplete;
window.deleteJob = deleteJob;

// Utility Functions
function generateId(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString();
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

function saveData() {
  console.log('Data would be saved to localStorage in a real environment');
}

function loadData() {
  console.log('Data would be loaded from localStorage in a real environment');
}

// Theme Management
function applyWorkspaceTheme(workspaceId) {
  document.body.className = `workspace-${workspaceId}`;
}

function updateWorkspaceDisplay(workspace) {
  const icons = {
    astrology: '✨',
    electrical: '⚡',
    family: '👨‍👩‍👧‍👦'
  };
  
  const iconEl = document.getElementById('current-workspace-icon');
  const nameEl = document.getElementById('current-workspace-name');
  const jobsTab = document.getElementById('jobs-tab');
  
  if (iconEl) iconEl.textContent = icons[workspace.theme];
  if (nameEl) nameEl.textContent = workspace.name;
  
  // Show/hide jobs tab for family workspace
  if (jobsTab) {
    if (workspace.theme === 'family') {
      jobsTab.style.display = 'none';
      if (currentTab === 'jobs') {
        switchTab('dashboard');
      }
    } else {
      jobsTab.style.display = 'block';
    }
  }
}

// Workspace Management
function selectWorkspace(workspaceId) {
  console.log('selectWorkspace called with:', workspaceId);
  
  currentWorkspace = workspaceId;
  const workspace = appData.workspaces[workspaceId];
  
  if (!workspace) {
    console.error('Workspace not found:', workspaceId);
    return;
  }
  
  // Apply theme
  applyWorkspaceTheme(workspaceId);
  
  // Update workspace display
  updateWorkspaceDisplay(workspace);
  
  // Switch screens
  const workspaceSelection = document.getElementById('workspace-selection');
  const mainApp = document.getElementById('main-app');
  
  if (workspaceSelection) {
    workspaceSelection.style.display = 'none';
  }
  
  if (mainApp) {
    mainApp.style.display = 'block';
    mainApp.classList.remove('hidden');
  }
  
  // Initialize the dashboard tab
  switchTab('dashboard');
  
  // Load content
  updateDashboard();
  updateContactsList();
  updateJobsList();
  
  console.log('Workspace selection completed');
}

function switchWorkspace() {
  const workspaceSelection = document.getElementById('workspace-selection');
  const mainApp = document.getElementById('main-app');
  
  if (workspaceSelection) {
    workspaceSelection.style.display = 'block';
  }
  
  if (mainApp) {
    mainApp.style.display = 'none';
  }
  
  currentWorkspace = null;
}

// Tab Management
function switchTab(tabName) {
  currentTab = tabName;
  
  // Update nav tabs
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
  if (activeTab) {
    activeTab.classList.add('active');
  }
  
  // Update tab content
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.remove('active');
  });
  
  let targetTab;
  if (tabName === 'jobs') {
    targetTab = document.getElementById('jobs-tab-content');
  } else {
    targetTab = document.getElementById(`${tabName}-tab`);
  }
  
  if (targetTab) {
    targetTab.classList.add('active');
  }
}

// Dashboard Functions
function updateDashboard() {
  if (!currentWorkspace) return;
  
  const workspace = appData.workspaces[currentWorkspace];
  const stats = appData.currentStats[currentWorkspace];
  
  if (workspace.theme === 'family') {
    updateFamilyDashboard(workspace, stats);
  } else {
    updateBusinessDashboard(workspace, stats);
  }
  
  updateRecentActivity(workspace);
  
  // Update chart with delay to ensure DOM is ready
  setTimeout(() => {
    updateChart(workspace);
  }, 100);
}

function updateBusinessDashboard(workspace, stats) {
  const todaysTasksEl = document.getElementById('todays-tasks');
  const activeJobsEl = document.getElementById('active-jobs');
  const pendingPaymentsEl = document.getElementById('pending-payments');
  
  if (todaysTasksEl) todaysTasksEl.textContent = stats.todaysTasks || 0;
  if (activeJobsEl) activeJobsEl.textContent = stats.activeJobs || 0;
  if (pendingPaymentsEl) pendingPaymentsEl.textContent = stats.pendingPayments || 0;
  
  // Show business widgets
  const widgets = ['active-jobs-widget', 'pending-payments-widget', 'stats-chart-widget'];
  widgets.forEach(widgetId => {
    const widget = document.getElementById(widgetId);
    if (widget) widget.style.display = 'block';
  });
}

function updateFamilyDashboard(workspace, stats) {
  const todaysTasksEl = document.getElementById('todays-tasks');
  if (todaysTasksEl) {
    todaysTasksEl.textContent = stats.upcomingBirthdays || 0;
    const label = todaysTasksEl.nextElementSibling;
    if (label) label.textContent = 'Upcoming birthdays';
  }
  
  // Hide business-specific widgets
  const widgets = ['active-jobs-widget', 'pending-payments-widget', 'stats-chart-widget'];
  widgets.forEach(widgetId => {
    const widget = document.getElementById(widgetId);
    if (widget) widget.style.display = 'none';
  });
}

function updateRecentActivity(workspace) {
  const activityList = document.getElementById('recent-activity-list');
  if (!activityList) return;
  
  const activities = [];
  
  // Collect recent notes from contacts and jobs
  workspace.contacts.forEach(contact => {
    if (contact.notes) {
      contact.notes.forEach(note => {
        activities.push({
          type: 'contact',
          title: `Note added for ${contact.name}`,
          text: note.text,
          date: note.date,
          icon: '👤'
        });
      });
    }
  });
  
  if (workspace.jobs) {
    workspace.jobs.forEach(job => {
      if (job.notes) {
        job.notes.forEach(note => {
          activities.push({
            type: 'job',
            title: `Job update: ${job.title}`,
            text: note.text,
            date: note.date,
            icon: '💼'
          });
        });
      }
    });
  }
  
  // Sort by date and take latest 5
  activities.sort((a, b) => new Date(b.date) - new Date(a.date));
  const recentActivities = activities.slice(0, 5);
  
  activityList.innerHTML = recentActivities.map(activity => `
    <div class="activity-item">
      <div class="activity-icon">${activity.icon}</div>
      <div class="activity-content">
        <div class="activity-title">${activity.title}</div>
        <div class="activity-meta">${formatDate(activity.date)} • ${activity.text}</div>
      </div>
    </div>
  `).join('');
  
  if (recentActivities.length === 0) {
    activityList.innerHTML = '<p style="text-align: center; color: var(--color-text-secondary);">No recent activity</p>';
  }
}

function updateChart(workspace) {
  if (workspace.theme === 'family') return;
  
  const ctx = document.getElementById('monthly-chart');
  if (!ctx || typeof Chart === 'undefined') {
    console.warn('Chart.js not available or canvas not found');
    return;
  }
  
  const stats = appData.currentStats[currentWorkspace];
  
  // Destroy existing chart if it exists
  if (window.monthlyChart) {
    window.monthlyChart.destroy();
  }
  
  try {
    window.monthlyChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Completed', 'In Progress', 'Pending'],
        datasets: [{
          data: [
            stats.completedThisMonth || 0,
            stats.activeJobs || 0,
            (workspace.jobs?.filter(job => job.status === 'Pending').length) || 0
          ],
          backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C']
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
  } catch (error) {
    console.error('Error creating chart:', error);
  }
}

// Contact Management
function updateContactsList() {
  if (!currentWorkspace) return;
  
  const workspace = appData.workspaces[currentWorkspace];
  const contactsList = document.getElementById('contacts-list');
  
  if (!contactsList) return;
  
  contactsList.innerHTML = workspace.contacts.map(contact => {
    const isFamily = workspace.theme === 'family';
    
    return `
      <div class="contact-card">
        <div class="contact-header">
          <h3 class="contact-name">${contact.name}</h3>
          ${!isFamily ? `<span class="contact-status contact-status--${contact.status.toLowerCase().replace(' ', '')}">${contact.status}</span>` : ''}
        </div>
        <div class="contact-details">
          <div class="contact-detail">
            <span>📞</span>
            <span>${contact.phone}</span>
          </div>
          ${contact.email ? `
            <div class="contact-detail">
              <span>✉️</span>
              <span>${contact.email}</span>
            </div>
          ` : ''}
          ${contact.relationship ? `
            <div class="contact-detail">
              <span>👥</span>
              <span>${contact.relationship}</span>
            </div>
          ` : ''}
          ${contact.birthday ? `
            <div class="contact-detail">
              <span>🎂</span>
              <span>${formatDate(contact.birthday)}</span>
            </div>
          ` : ''}
          ${contact.address ? `
            <div class="contact-detail">
              <span>📍</span>
              <span>${contact.address}</span>
            </div>
          ` : ''}
        </div>
        <div class="contact-actions">
          <button class="btn btn--sm btn--outline" onclick="editContact('${contact.id}')">Edit</button>
          <button class="btn btn--sm btn--secondary" onclick="deleteContact('${contact.id}')">Delete</button>
        </div>
      </div>
    `;
  }).join('');
}

function showContactModal(contact = null) {
  editingContact = contact;
  const modal = document.getElementById('contact-modal');
  const title = document.getElementById('contact-modal-title');
  const isFamily = currentWorkspace === 'family';
  
  if (!modal || !title) return;
  
  title.textContent = contact ? 'Edit Contact' : 'Add Contact';
  
  // Show/hide fields based on workspace
  const fields = {
    'contact-email-group': !isFamily,
    'contact-source-group': !isFamily,
    'contact-status-group': !isFamily,
    'contact-relationship-group': isFamily,
    'contact-birthday-group': isFamily
  };
  
  Object.entries(fields).forEach(([fieldId, show]) => {
    const field = document.getElementById(fieldId);
    if (field) field.style.display = show ? 'block' : 'none';
  });
  
  // Fill form if editing
  if (contact) {
    const fieldMap = {
      'contact-name': contact.name,
      'contact-phone': contact.phone,
      'contact-email': contact.email || '',
      'contact-address': contact.address || '',
      'contact-source': contact.source || 'Referral',
      'contact-status': contact.status || 'Lead',
      'contact-relationship': contact.relationship || '',
      'contact-birthday': contact.birthday || ''
    };
    
    Object.entries(fieldMap).forEach(([fieldId, value]) => {
      const field = document.getElementById(fieldId);
      if (field) field.value = value;
    });
  } else {
    const form = document.getElementById('contact-form');
    if (form) form.reset();
  }
  
  modal.classList.remove('hidden');
}

function saveContact() {
  const workspace = appData.workspaces[currentWorkspace];
  const isFamily = currentWorkspace === 'family';
  
  const contactData = {
    name: document.getElementById('contact-name').value,
    phone: document.getElementById('contact-phone').value,
    address: document.getElementById('contact-address').value,
    notes: []
  };
  
  if (!isFamily) {
    contactData.email = document.getElementById('contact-email').value;
    contactData.source = document.getElementById('contact-source').value;
    contactData.status = document.getElementById('contact-status').value;
  } else {
    contactData.relationship = document.getElementById('contact-relationship').value;
    contactData.birthday = document.getElementById('contact-birthday').value;
  }
  
  if (editingContact) {
    // Update existing contact
    const index = workspace.contacts.findIndex(c => c.id === editingContact.id);
    workspace.contacts[index] = { ...editingContact, ...contactData };
  } else {
    // Add new contact
    contactData.id = generateId(currentWorkspace.substring(0, 3));
    workspace.contacts.push(contactData);
  }
  
  saveData();
  updateContactsList();
  closeModal('contact-modal');
  
  // Show success animation
  const contactsList = document.getElementById('contacts-list');
  if (contactsList) {
    contactsList.classList.add('success-flash');
    setTimeout(() => {
      contactsList.classList.remove('success-flash');
    }, 400);
  }
}

function editContact(contactId) {
  const workspace = appData.workspaces[currentWorkspace];
  const contact = workspace.contacts.find(c => c.id === contactId);
  showContactModal(contact);
}

function deleteContact(contactId) {
  if (confirm('Are you sure you want to delete this contact?')) {
    const workspace = appData.workspaces[currentWorkspace];
    workspace.contacts = workspace.contacts.filter(c => c.id !== contactId);
    saveData();
    updateContactsList();
  }
}

// Job Management
function updateJobsList() {
  if (!currentWorkspace || currentWorkspace === 'family') return;
  
  const workspace = appData.workspaces[currentWorkspace];
  const jobsList = document.getElementById('jobs-list');
  
  if (!jobsList) return;
  
  if (!workspace.jobs || workspace.jobs.length === 0) {
    jobsList.innerHTML = '<p style="text-align: center; color: var(--color-text-secondary);">No jobs found.</p>';
    return;
  }
  
  jobsList.innerHTML = workspace.jobs.map(job => {
    const contact = workspace.contacts.find(c => c.id === job.contactId);
    const isOverdue = new Date(job.dueDate) < new Date() && job.status !== 'Completed';
    
    return `
      <div class="job-card" data-job-id="${job.id}">
        <div class="job-header">
          <h3 class="job-title">${job.title}</h3>
          <span class="job-status job-status--${job.status.toLowerCase().replace(' ', '-')}">${job.status}</span>
        </div>
        
        <div class="job-financial">
          <div class="financial-item">
            <div class="financial-label">Quoted</div>
            <div class="financial-value">${formatCurrency(job.quotedAmount)}</div>
          </div>
          <div class="financial-item">
            <div class="financial-label">Paid</div>
            <div class="financial-value">${formatCurrency(job.paidAmount)}</div>
          </div>
          <div class="financial-item">
            <div class="financial-label">Balance</div>
            <div class="financial-value">${formatCurrency(job.quotedAmount - job.paidAmount)}</div>
          </div>
          <div class="financial-item">
            <div class="financial-label">Payment</div>
            <div class="financial-value ${isOverdue ? 'text-error' : ''}">${job.paymentStatus}</div>
          </div>
        </div>
        
        <div class="job-meta">
          <div class="job-meta-item">
            <div class="job-meta-label">Client</div>
            <div class="job-meta-value">${contact ? contact.name : 'Unknown'}</div>
          </div>
          <div class="job-meta-item">
            <div class="job-meta-label">Created</div>
            <div class="job-meta-value">${formatDate(job.creationDate)}</div>
          </div>
          <div class="job-meta-item">
            <div class="job-meta-label">Due Date</div>
            <div class="job-meta-value ${isOverdue ? 'text-error' : ''}">${formatDate(job.dueDate)}</div>
          </div>
          ${job.issues && job.issues.length > 0 ? `
            <div class="job-meta-item">
              <div class="job-meta-label">Issues</div>
              <div class="job-meta-value">${job.issues.length} open</div>
            </div>
          ` : ''}
        </div>
        
        <div class="job-description">${job.description}</div>
        
        <div class="job-actions">
          <button class="btn btn--sm btn--outline" onclick="editJob('${job.id}')">Edit</button>
          ${job.status !== 'Completed' ? `
            <button class="btn btn--sm btn--primary" onclick="markJobComplete('${job.id}')">Mark Complete</button>
          ` : ''}
          <button class="btn btn--sm btn--secondary" onclick="deleteJob('${job.id}')">Delete</button>
        </div>
      </div>
    `;
  }).join('');
}

function showJobModal(job = null) {
  if (currentWorkspace === 'family') return;
  
  editingJob = job;
  const modal = document.getElementById('job-modal');
  const title = document.getElementById('job-modal-title');
  const clientSelect = document.getElementById('job-client');
  
  if (!modal || !title || !clientSelect) return;
  
  title.textContent = job ? 'Edit Job' : 'Create Job';
  
  // Populate client dropdown
  const workspace = appData.workspaces[currentWorkspace];
  clientSelect.innerHTML = '<option value="">Choose a client...</option>' +
    workspace.contacts.map(contact => 
      `<option value="${contact.id}" ${job && job.contactId === contact.id ? 'selected' : ''}>${contact.name}</option>`
    ).join('');
  
  // Fill form if editing
  if (job) {
    const fields = {
      'job-title': job.title,
      'job-description': job.description,
      'job-due-date': job.dueDate,
      'job-amount': job.quotedAmount
    };
    
    Object.entries(fields).forEach(([fieldId, value]) => {
      const field = document.getElementById(fieldId);
      if (field) field.value = value;
    });
  } else {
    const form = document.getElementById('job-form');
    if (form) form.reset();
  }
  
  modal.classList.remove('hidden');
}

function saveJob() {
  if (currentWorkspace === 'family') return;
  
  const workspace = appData.workspaces[currentWorkspace];
  
  const jobData = {
    contactId: document.getElementById('job-client').value,
    title: document.getElementById('job-title').value,
    description: document.getElementById('job-description').value,
    dueDate: document.getElementById('job-due-date').value,
    quotedAmount: parseFloat(document.getElementById('job-amount').value) || 0,
    paidAmount: 0,
    paymentStatus: 'Unpaid',
    status: 'Pending',
    issues: [],
    notes: []
  };
  
  if (editingJob) {
    // Update existing job
    const index = workspace.jobs.findIndex(j => j.id === editingJob.id);
    workspace.jobs[index] = { ...editingJob, ...jobData };
  } else {
    // Add new job
    jobData.id = generateId('job_' + currentWorkspace.substring(0, 3));
    jobData.creationDate = new Date().toISOString().split('T')[0];
    if (!workspace.jobs) workspace.jobs = [];
    workspace.jobs.push(jobData);
  }
  
  saveData();
  updateJobsList();
  updateDashboard();
  closeModal('job-modal');
  
  // Show success animation
  const jobsList = document.getElementById('jobs-list');
  if (jobsList) {
    jobsList.classList.add('success-flash');
    setTimeout(() => {
      jobsList.classList.remove('success-flash');
    }, 400);
  }
}

function editJob(jobId) {
  const workspace = appData.workspaces[currentWorkspace];
  const job = workspace.jobs.find(j => j.id === jobId);
  showJobModal(job);
}

function markJobComplete(jobId) {
  const workspace = appData.workspaces[currentWorkspace];
  const job = workspace.jobs.find(j => j.id === jobId);
  
  if (job) {
    job.status = 'Completed';
    if (job.paymentStatus === 'Unpaid') {
      job.paymentStatus = 'Paid';
      job.paidAmount = job.quotedAmount;
    }
    
    // Add completion note
    if (!job.notes) job.notes = [];
    job.notes.push({
      date: new Date().toISOString().split('T')[0],
      text: 'Job marked as completed'
    });
    
    saveData();
    updateJobsList();
    updateDashboard();
    
    // Animate the job card
    const jobCard = document.querySelector(`[data-job-id="${jobId}"]`);
    if (jobCard) {
      jobCard.classList.add('job-complete-animation');
      setTimeout(() => {
        jobCard.classList.remove('job-complete-animation');
      }, 600);
    }
  }
}

function deleteJob(jobId) {
  if (confirm('Are you sure you want to delete this job?')) {
    const workspace = appData.workspaces[currentWorkspace];
    workspace.jobs = workspace.jobs.filter(j => j.id !== jobId);
    saveData();
    updateJobsList();
    updateDashboard();
  }
}

// Search Functionality
function initializeSearch() {
  const searchInput = document.getElementById('global-search');
  if (!searchInput) return;
  
  let searchTimeout;
  
  searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      performSearch(e.target.value);
    }, 300);
  });
}

function performSearch(query) {
  if (!query.trim()) {
    updateContactsList();
    updateJobsList();
    return;
  }
  
  const workspace = appData.workspaces[currentWorkspace];
  query = query.toLowerCase();
  
  // Filter contacts
  const filteredContacts = workspace.contacts.filter(contact => 
    contact.name.toLowerCase().includes(query) ||
    contact.phone.includes(query) ||
    (contact.email && contact.email.toLowerCase().includes(query))
  );
  
  // Filter jobs
  let filteredJobs = [];
  if (workspace.jobs) {
    filteredJobs = workspace.jobs.filter(job =>
      job.title.toLowerCase().includes(query) ||
      job.description.toLowerCase().includes(query)
    );
  }
  
  // Update displays with filtered results
  updateContactsListWithData(filteredContacts);
  updateJobsListWithData(filteredJobs);
}

function updateContactsListWithData(contacts) {
  const contactsList = document.getElementById('contacts-list');
  const workspace = appData.workspaces[currentWorkspace];
  const isFamily = workspace.theme === 'family';
  
  if (!contactsList) return;
  
  contactsList.innerHTML = contacts.map(contact => {
    return `
      <div class="contact-card">
        <div class="contact-header">
          <h3 class="contact-name">${contact.name}</h3>
          ${!isFamily ? `<span class="contact-status contact-status--${contact.status.toLowerCase().replace(' ', '')}">${contact.status}</span>` : ''}
        </div>
        <div class="contact-details">
          <div class="contact-detail">
            <span>📞</span>
            <span>${contact.phone}</span>
          </div>
          ${contact.email ? `
            <div class="contact-detail">
              <span>✉️</span>
              <span>${contact.email}</span>
            </div>
          ` : ''}
          ${contact.relationship ? `
            <div class="contact-detail">
              <span>👥</span>
              <span>${contact.relationship}</span>
            </div>
          ` : ''}
          ${contact.birthday ? `
            <div class="contact-detail">
              <span>🎂</span>
              <span>${formatDate(contact.birthday)}</span>
            </div>
          ` : ''}
        </div>
        <div class="contact-actions">
          <button class="btn btn--sm btn--outline" onclick="editContact('${contact.id}')">Edit</button>
          <button class="btn btn--sm btn--secondary" onclick="deleteContact('${contact.id}')">Delete</button>
        </div>
      </div>
    `;
  }).join('');
}

function updateJobsListWithData(jobs) {
  if (currentWorkspace === 'family') return;
  
  const jobsList = document.getElementById('jobs-list');
  const workspace = appData.workspaces[currentWorkspace];
  
  if (!jobsList) return;
  
  jobsList.innerHTML = jobs.map(job => {
    const contact = workspace.contacts.find(c => c.id === job.contactId);
    const isOverdue = new Date(job.dueDate) < new Date() && job.status !== 'Completed';
    
    return `
      <div class="job-card" data-job-id="${job.id}">
        <div class="job-header">
          <h3 class="job-title">${job.title}</h3>
          <span class="job-status job-status--${job.status.toLowerCase().replace(' ', '-')}">${job.status}</span>
        </div>
        
        <div class="job-financial">
          <div class="financial-item">
            <div class="financial-label">Quoted</div>
            <div class="financial-value">${formatCurrency(job.quotedAmount)}</div>
          </div>
          <div class="financial-item">
            <div class="financial-label">Paid</div>
            <div class="financial-value">${formatCurrency(job.paidAmount)}</div>
          </div>
          <div class="financial-item">
            <div class="financial-label">Balance</div>
            <div class="financial-value">${formatCurrency(job.quotedAmount - job.paidAmount)}</div>
          </div>
        </div>
        
        <div class="job-description">${job.description}</div>
        
        <div class="job-actions">
          <button class="btn btn--sm btn--outline" onclick="editJob('${job.id}')">Edit</button>
          ${job.status !== 'Completed' ? `
            <button class="btn btn--sm btn--primary" onclick="markJobComplete('${job.id}')">Mark Complete</button>
          ` : ''}
          <button class="btn btn--sm btn--secondary" onclick="deleteJob('${job.id}')">Delete</button>
        </div>
      </div>
    `;
  }).join('');
}

// Modal Management
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('hidden');
  }
  editingContact = null;
  editingJob = null;
}

// Event Listeners
function initializeEventListeners() {
  // Workspace selection with more robust event handling
  document.querySelectorAll('.workspace-card').forEach(card => {
    const workspaceId = card.dataset.workspace;
    
    card.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('Workspace card clicked:', workspaceId);
      selectWorkspace(workspaceId);
    });
    
    // Add keyboard accessibility
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.stopPropagation();
        selectWorkspace(workspaceId);
      }
    });
    
    // Make cards focusable
    card.setAttribute('tabindex', '0');
    card.style.cursor = 'pointer';
  });
  
  // Navigation tabs
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const tabName = tab.dataset.tab;
      switchTab(tabName);
    });
  });
  
  // Header buttons
  const switchWorkspaceBtn = document.getElementById('switch-workspace');
  if (switchWorkspaceBtn) {
    switchWorkspaceBtn.addEventListener('click', switchWorkspace);
  }
  
  const quickAddBtn = document.getElementById('quick-add');
  if (quickAddBtn) {
    quickAddBtn.addEventListener('click', () => {
      const modal = document.getElementById('quick-add-modal');
      if (modal) modal.classList.remove('hidden');
    });
  }
  
  // Quick add buttons
  const quickAddContactBtn = document.getElementById('quick-add-contact');
  if (quickAddContactBtn) {
    quickAddContactBtn.addEventListener('click', () => {
      closeModal('quick-add-modal');
      showContactModal();
    });
  }
  
  const quickAddJobBtn = document.getElementById('quick-add-job');
  if (quickAddJobBtn) {
    quickAddJobBtn.addEventListener('click', () => {
      closeModal('quick-add-modal');
      if (currentWorkspace !== 'family') {
        showJobModal();
      }
    });
  }
  
  // Add buttons
  const addContactBtn = document.getElementById('add-contact');
  if (addContactBtn) {
    addContactBtn.addEventListener('click', () => showContactModal());
  }
  
  const addJobBtn = document.getElementById('add-job');
  if (addJobBtn) {
    addJobBtn.addEventListener('click', () => showJobModal());
  }
  
  // Form submissions
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      saveContact();
    });
  }
  
  const jobForm = document.getElementById('job-form');
  if (jobForm) {
    jobForm.addEventListener('submit', (e) => {
      e.preventDefault();
      saveJob();
    });
  }
  
  // Modal close buttons
  document.querySelectorAll('.modal-close, [data-modal]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const modalId = btn.dataset.modal || btn.closest('.modal').id;
      closeModal(modalId);
    });
  });
  
  // Modal overlay clicks
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', () => {
      const modal = overlay.closest('.modal');
      if (modal) closeModal(modal.id);
    });
  });
  
  // Initialize search
  initializeSearch();
  
  console.log('Event listeners initialized');
}

// Application Initialization
function initializeApp() {
  console.log('Initializing CRM application...');
  
  loadData();
  initializeEventListeners();
  
  // Ensure workspace selection is visible and main app is hidden
  const workspaceSelection = document.getElementById('workspace-selection');
  const mainApp = document.getElementById('main-app');
  
  if (workspaceSelection) {
    workspaceSelection.style.display = 'block';
    workspaceSelection.classList.remove('hidden');
  }
  
  if (mainApp) {
    mainApp.style.display = 'none';
    mainApp.classList.add('hidden');
  }
  
  console.log('Application initialized successfully');
}

// Start the application when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);