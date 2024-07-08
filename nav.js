function showSection(section) {
    document.querySelectorAll('.section').forEach(sec => sec.classList.add('hidden'));
    document.getElementById(section).classList.remove('hidden');
    if (section === 'do') {
        updateDoSection();
    }
    if (section === 'choose') {
        updateChooseSection();
    }
}

window.addEventListener('beforeunload', function (e) {
    e.preventDefault();
    e.returnValue = ''; // Legacy method for older browsers
});
