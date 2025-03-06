function showPopup(){
    document.getElementById('popupOverlay').style.display = 'flex';
}

function closePopup(){
    document.getElementById('popupOverlay').style.display = 'none';
}

function saveProfile(){
    const profile = document.getElementById('profileName').value.trim();
    const inputWarning = document.getElementById('input-warning');

    if (profile === ""){
        document.getElementById('profileName').style.border = '1px solid orange';
        inputWarning.style.display = 'block';
        inputWarning.textContent = 'pooooooop';
    }
}

function resetWarning(){
    const inputWarning = document.getElementById('input-warning');

    inputWarning.style.display = 'none';
    document.getElementById('profileName').style.border = '1px solid rgba(255, 255, 255, 0.5)';
}