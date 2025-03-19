function editPopup(currentName){
    document.getElementById('editPopup').style.display = 'flex';
    document.getElementById('manageProfileName').value = currentName;
    document.getElementById('manageProfileName').dataset.originalName = currentName; // Store original name
}

function closeEditPopup(){
    resetWarning();
    document.getElementById('editPopup').style.display = 'none';
}

async function editProfile(){
    const originalName = document.getElementById('manageProfileName').dataset.originalName;
    const newProfileName = document.getElementById('manageProfileName').value.trim();

    if (profileName === ""){
        alertErorr('⚠️ Please enter a name');
        return;
    }
 
    const existingProfiles = Array.from(document.querySelectorAll('.profiles-container h2'))
                                  .map(h2 => h2.textContent.toLowerCase());
    if (existingProfiles.includes(newProfileName.toLowerCase()) && originalName.toLowerCase() !== newProfileName.toLowerCase()) {
        alertError('⚠️ This name is already in use. Select another name.');
        return;
    }

    // Send updated profile name to the server
    try {
        const response = await fetch('/update-profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ originalName, newProfileName })
        });

        const result = await response.json();

        if (result.success) {
            window.location.reload(); // Reload to reflect updated profile
        } else {
            alertError(`⚠️ ${result.message}`);
        }
    } catch (err) {
        alertError('⚠️ An error occurred while updating the profile.');
        console.error(err);
    }
}

function resetWarning(){
    const inputWarning = document.getElementById('manage-input-warning');
    inputWarning.style.display = 'none';
    document.getElementById('manageProfileName').style.border = '1px solid rgba(255, 255, 255, 0.5)';
}

function alertError(message){
    document.getElementById('manageProfileName').style.border = '1px solid orange';
    const inputWarning = document.getElementById('manage-input-warning');

    inputWarning.style.display = 'block';
    inputWarning.textContent = message;
}