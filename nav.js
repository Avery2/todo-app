function showSection(section) {
    document.querySelectorAll('.section').forEach(sec => sec.classList.add('hidden'));
    document.getElementById(section).classList.remove('hidden');
    if (section === 'do') {
        updateDoSection();
    }
    if (section === 'choose') {
        updateChooseSection();
    }

    // Remove current from all nav-link elements
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('current'));

    document.getElementById(`${section}-link`).classList.add('current');
}

window.addEventListener('beforeunload', function (e) {
    e.preventDefault();
    e.returnValue = ''; // Legacy method for older browsers
});
