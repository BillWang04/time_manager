document.addEventListener("DOMContentLoaded", function () {
    const createButton = document.getElementById("createButton");
    const addButton = document.getElementById("addButton");
    const createGroupContainer = document.getElementById("createGroupContainer");
    const existingGroupsContainer = document.getElementById("existingGroups");
    const newGroupNameInput = document.getElementById("newGroupName");
  
    //popup appears everytime I open a tab

    // Function to show/hide elements
    function toggleElement(element, show) {
      if (show) {
        element.classList.remove("hidden");
      } else {
        element.classList.add("hidden");
      }
    }
  
    // Show/hide create group input on button click
    createButton.addEventListener("click", function () {
        toggleElement(createGroupContainer, true);
         
    });
  
    newGroupNameInput.addEventListener("keypress", createNewButton)

    function createNewButton(e){
        if(e.key == "Enter"){
            var buttonText = newGroupNameInput.value;

            if (buttonText.trim !== '') {
                var button = document.createElement('button');
                button.textContent = buttonText;
                existingGroupsContainer.appendChild(button);
                toggleElement(newGroupNameInput,false);

            }

        }
    }

    addButton.addEventListener("click", function(){
        toggleElement(existingGroupsContainer, true);
    })
  
    // ... (implement logic to handle creating new groups and adding tabs to existing groups)
  });
  