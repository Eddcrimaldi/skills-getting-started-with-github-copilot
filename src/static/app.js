document.addEventListener("DOMContentLoaded", () => {
  const activitiesList = document.getElementById("activities-list");
  const activitySelect = document.getElementById("activity");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");

  // Function to fetch activities from API
  async function fetchActivities() {
    try {
      const response = await fetch("/activities");
      const activities = await response.json();

      // Clear loading message
      activitiesList.innerHTML = "";
      activitySelect.innerHTML = '<option value="">-- Select an activity --</option>';

      // Populate activities list
      Object.entries(activities).forEach(([name, details]) => {
        const activityCard = document.createElement("div");
        activityCard.className = "activity-card";

        const spotsLeft = details.max_participants - details.participants.length;

        // Create participants list HTML
        let participantsList = "";
        if (details.participants.length > 0) {
          participantsList = `
            <div class="participants-section">
              <strong>Participants:</strong>
              <ul class="participants-list">
                ${details.participants.map(email => `
                  <li>
                    <span class="participant-email">${email}</span>
                    <button class="delete-participant-btn" data-activity="${name}" data-email="${email}" title="Remove participant">×</button>
                  </li>
                `).join("")}
              </ul>
            </div>
          `;
        } else {
          participantsList = `
            <div class="participants-section">
              <strong>Participants:</strong>
              <p class="no-participants">No participants yet</p>
            </div>
          `;
        }

        activityCard.innerHTML = `
          <h4>${name}</h4>
          <p>${details.description}</p>
          <p><strong>Schedule:</strong> ${details.schedule}</p>
          <p><strong>Availability:</strong> ${spotsLeft} spots left</p>
<<<<<<< HEAD
          ${participantsList}
=======
          <div class="participants">
            <strong>Participants:</strong>
            <ul>
              ${details.participants.map((participant) => `
                <li>
                  <span>${participant}</span>
                  <button class="delete-participant" type="button" aria-label="Unregister ${participant}" data-activity="${name}" data-participant="${participant}">&#128465;</button>
                </li>
              `).join("")}
            </ul>
          </div>
>>>>>>> 6bb5a06 (Implement participant unregistration feature and add tests)
        `;

        activitiesList.appendChild(activityCard);

        activityCard.querySelectorAll(".delete-participant").forEach((button) => {
          button.addEventListener("click", async () => {
            const activity = button.dataset.activity;
            const participant = button.dataset.participant;

            try {
              const response = await fetch(
                `/activities/${encodeURIComponent(activity)}/participants/${encodeURIComponent(participant)}`,
                { method: "DELETE" }
              );

              if (!response.ok) {
                throw new Error("Failed to unregister participant");
              }

              fetchActivities();
            } catch (error) {
              console.error("Error unregistering participant:", error);
            }
          });
        });

        // Add option to select dropdown
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        activitySelect.appendChild(option);
      });

      // Add event listeners for delete buttons
      document.querySelectorAll(".delete-participant-btn").forEach(btn => {
        btn.addEventListener("click", async (e) => {
          e.preventDefault();
          const activity = btn.getAttribute("data-activity");
          const email = btn.getAttribute("data-email");

          try {
            const response = await fetch(
              `/activities/${encodeURIComponent(activity)}/participants/${encodeURIComponent(email)}`,
              {
                method: "DELETE",
              }
            );

            if (response.ok) {
              // Refresh the activities list
              fetchActivities();
            } else {
              const result = await response.json();
              console.error("Error removing participant:", result.detail);
            }
          } catch (error) {
            console.error("Error removing participant:", error);
          }
        });
      });
    } catch (error) {
      activitiesList.innerHTML = "<p>Failed to load activities. Please try again later.</p>";
      console.error("Error fetching activities:", error);
    }
  }

  // Handle form submission
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const activity = document.getElementById("activity").value;

    try {
      const response = await fetch(
        `/activities/${encodeURIComponent(activity)}/signup?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (response.ok) {
        messageDiv.textContent = result.message;
        messageDiv.className = "success";
        signupForm.reset();
<<<<<<< HEAD
        // Refresh the activities list to show updated participants
=======
>>>>>>> 6bb5a06 (Implement participant unregistration feature and add tests)
        fetchActivities();
      } else {
        messageDiv.textContent = result.detail || "An error occurred";
        messageDiv.className = "error";
      }

      messageDiv.classList.remove("hidden");

      // Hide message after 5 seconds
      setTimeout(() => {
        messageDiv.classList.add("hidden");
      }, 5000);
    } catch (error) {
      messageDiv.textContent = "Failed to sign up. Please try again.";
      messageDiv.className = "error";
      messageDiv.classList.remove("hidden");
      console.error("Error signing up:", error);
    }
  });

  // Initialize app
  fetchActivities();
});
