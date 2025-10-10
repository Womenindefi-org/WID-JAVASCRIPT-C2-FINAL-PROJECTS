
// Store applications
let apps = JSON.parse(localStorage.getItem('widApplications')) || [];

// When form is submitted
document.getElementById('widApplicationForm').onsubmit = function (e) {
    e.preventDefault();

    // Get form data
    const form = new FormData(this);
    const app = Object.fromEntries(form);

    // Add checkboxes
    app.hasLaptop = form.has('hasLaptop');
    app.hasInternet = form.has('hasInternet');
    app.id = Date.now();

    // Calculate score
    let score = 0;

    // Education (1-5 points)
    if (app.education === 'high-school') score += 1;
    if (app.education === 'diploma') score += 2;
    if (app.education === 'bachelor') score += 3;
    if (app.education === 'master') score += 4;
    if (app.education === 'phd') score += 5;

    // Experience (0.5 per year, max 10)
    score += Math.min(app.workExperience * 0.5, 10);

    // Age (3 points for 25-45, 2 points for 18-55)
    const age = +app.age;
    if (age >= 25 && age <= 45) score += 3;
    else if (age >= 18 && age <= 55) score += 2;

    // Availability
    if (app.availability === 'full-time') score += 5;
    if (app.availability === 'part-time') score += 4;
    if (app.availability === 'weekend') score += 2;
    if (app.availability === 'evening') score += 2;

    // Resources (2 points each)
    if (app.hasLaptop) score += 2;
    if (app.hasInternet) score += 2;

    // Motivation (1-3 points based on length)
    const motLen = (app.motivation || '').length;
    if (motLen >= 200) score += 3;
    else if (motLen >= 100) score += 2;
    else if (motLen >= 50) score += 1;

    // Save result
    app.score = Math.round(score * 10) / 10;
    app.status = score >= 12 ? 'shortlisted' : 'rejected';

    apps.push(app);
    localStorage.setItem('widApplications', JSON.stringify(apps));

    // Show result
    const pass = app.status === 'shortlisted';
    document.getElementById('resultCard').innerHTML = `
        <div class="text-center mb-6">
            <div class="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${pass ? 'bg-green-100' : 'bg-red-100'}">
                <svg class="w-8 h-8 ${pass ? 'text-green-600' : 'text-red-600'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    ${pass ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>' : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>'}
                </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Result</h3>
            <p class="text-${pass ? 'green' : 'red'}-600 font-medium">
                ${pass ? 'Congratulations! You are shortlisted.' : 'Sorry, you did not qualify this time.'}
            </p>
        </div>
        <div class="bg-gray-50 rounded-lg p-6 mb-6">
            <div class="grid grid-cols-2 gap-4 text-sm">
                <div><b>Name:</b> ${app.firstName} ${app.lastName}</div>
                <div><b>Score:</b> ${app.score}/12</div>
                <div><b>Email:</b> ${app.email}</div>
                <div><b>Status:</b> ${app.status}</div>
            </div>
        </div>
        <button onclick="reset()" class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Apply Again</button>
    `;

    document.getElementById('resultsSection').classList.remove('hidden');
    updateAdmin();
    this.reset();
};

// Reset form
function reset() {
    document.getElementById('widApplicationForm').reset();
    document.getElementById('resultsSection').classList.add('hidden');
}

// Admin panel
document.getElementById('toggleAdmin').onclick = () => {
    document.getElementById('adminPanel').classList.toggle('hidden');
    updateAdmin();
};

function updateAdmin() {
    const shortlisted = apps.filter(a => a.status === 'shortlisted').length;
    document.getElementById('totalApps').textContent = apps.length;
    document.getElementById('shortlistedApps').textContent = shortlisted;
    document.getElementById('rejectedApps').textContent = apps.length - shortlisted;

    document.getElementById('applicationsTable').innerHTML = apps.map(a => `
        <tr>
            <td class="px-6 py-4 text-sm">${a.firstName} ${a.lastName}</td>
            <td class="px-6 py-4 text-sm">${a.email}</td>
            <td class="px-6 py-4 text-sm">${a.trainingTrack}</td>
            <td class="px-6 py-4"><span class="px-2 py-1 text-xs rounded ${a.status === 'shortlisted' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">${a.status}</span></td>
            <td class="px-6 py-4 text-sm">${a.score}</td>
        </tr>
    `).join('');
}

document.addEventListener('DOMContentLoaded', updateAdmin);