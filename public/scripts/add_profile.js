function showPopup(){
    document.getElementById('popupOverlay').style.display = 'flex';
}

function closePopup(){
    resetWarning();
    document.getElementById('popupOverlay').style.display = 'none';
}

// Validates New Profile Name
function createProfile(){
    const profileName = document.getElementById('profileName').value.trim();
    const existingProfiles = Array.from(document.querySelectorAll('.profiles-container h2'))
                                  .map(h2 => h2.textContent.toLowerCase());

    if (profileName === ""){
        alertErorr('⚠️ Please enter a name');
        return;
    }
 
    if (existingProfiles.includes(profileName.toLowerCase())) {
        alertErorr('⚠️ This name is already in use. Select another name.');
        return;
    }

    if (existingProfiles.length > 4){
        alertErorr('⚠️ Maximum of 3 profiles reached');
        return;
    }

    fetch('/add-profile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: profileName})
    }).then(response => response.json())
        .then(data => {
            if (data.success) {
                location.reload();
            }
        })
        .catch(error => console.error('Error: error'));
}

// Reset warning back to starting state
function resetWarning(){
    const inputWarning = document.getElementById('input-warning');
    inputWarning.style.display = 'none';
    document.getElementById('profileName').style.border = '1px solid rgba(255, 255, 255, 0.5)';
}

// DRY: for textbox alert
function alertErorr(message){
    document.getElementById('profileName').style.border = '1px solid orange';
    const inputWarning = document.getElementById('input-warning');

    inputWarning.style.display = 'block';
    inputWarning.textContent = message;
}