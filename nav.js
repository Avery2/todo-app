function showSection(section) {
    document.querySelectorAll('.section').forEach(sec => sec.classList.add('hidden'));
    document.getElementById(section).classList.remove('hidden');
    if (section === 'do') {
        updateDoSection();
    }
    if (section === 'choose') {
        updateChooseSection();
    }

    // Set the selected section in the nav to be bold
    document.querySelectorAll('.nav-link').forEach(link => link.style.fontWeight = 'normal');
    document.getElementById(`${section}-link`).style.fontWeight = 'bold';
}

window.addEventListener('beforeunload', function (e) {
    e.preventDefault();
    e.returnValue = ''; // Legacy method for older browsers
});
