document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("applicationForm");
  const steps = document.querySelectorAll(".step-section");
  const nextBtn = document.getElementById("nextBtn");
  const prevBtn = document.getElementById("prevBtn");
  const joinedCommunity = document.getElementById("joinedCommunity");
  const communityUsernameContainer = document.getElementById("communityUsernameContainer");
  
  // Step Indicator DOM elements
  const progressBar = document.getElementById("progressBar");
  const progressText = document.getElementById("progressText");
  const currentStepTitle = document.getElementById("currentStepTitle");
  
  // Word Count DOM elements
  const impactAnswerTextarea = document.getElementById("impactAnswer");
  const wordCountFeedback = document.getElementById("wordCountFeedback");

  // Step Titles for the indicator
  const stepTitles = [
    "Personal Information",
    "Community & Socials",
    "Commitment & Access",
    "Short Question"
  ];

  let currentStep = 0;
  const totalSteps = steps.length;

  // Store all form data
  const formData = {
    fullName: "",
    email: "",
    gender: "",
    joinedCommunity: "",
    communityUsername: "",
    linkedin: "",
    discord: "",
    twitter: "",
    commitment: "",
    availability: "",
    access: "",
    impactAnswer: "",
  };

  // --- Frontend Data Persistence & Duplication Check ---

  const savedApplication = localStorage.getItem("wid_application");
  if (savedApplication) {
    const appData = JSON.parse(savedApplication);
    document.getElementById("app").innerHTML = `
      <div class="text-center py-20">
        <h2 class="text-3xl font-bold text-indigo-700 mb-4">Welcome Back, ${appData.fullName}!</h2>
        <p class="text-gray-700 mb-3">You have already submitted your application for the WID DeFi Skill-Up Program. We have kept your data.</p>
        <p class="text-gray-500 mb-6">Duplicate applications are not allowed. You can clear local data to restart.</p>
        <button id="restartApp" class="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Clear Data & Restart Application</button>
      </div>`;

    document.getElementById("restartApp").addEventListener("click", () => {
      localStorage.clear();
      location.reload();
    });
    return;
  }

  // Show username input only if joined community
  joinedCommunity.addEventListener("change", (e) => {
    communityUsernameContainer.classList.toggle("hidden", e.target.value !== "yes");
  });

  // Save input dynamically and remove error highlights
  form.addEventListener("input", (e) => {
    if (e.target.name in formData) {
      formData[e.target.name] = e.target.value;
    }
    e.target.classList.remove('border-red-500');

    // Update word count for the specific field
    if (e.target.id === 'impactAnswer') {
      updateWordCountFeedback(e.target.value);
    }
  });
  
  form.addEventListener("change", (e) => {
    e.target.classList.remove('border-red-500');
  });

  // Function to update word count feedback
  function updateWordCountFeedback(text) {
    const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;
    wordCountFeedback.textContent = `Words: ${wordCount} / 50 minimum`;
      
    if (wordCount < 50) {
      wordCountFeedback.classList.remove('text-gray-500');
      wordCountFeedback.classList.add('text-red-500');
    } else {
      wordCountFeedback.classList.remove('text-red-500');
      wordCountFeedback.classList.add('text-gray-500');
    }
  }

  // Next and Previous Handlers
  nextBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (!validateStep(currentStep)) {
      // Validation handled inline
      return;
    }
    if (currentStep < totalSteps - 1) {
      currentStep++;
      updateSteps();
    } else {
      handleSubmit();
    }
  });

  prevBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (currentStep > 0) {
      currentStep--;
      updateSteps();
    }
  });

  // Handle step visibility, progress bar, and scroll
  function updateSteps() {
    steps.forEach((step, index) => {
      step.classList.toggle("hidden", index !== currentStep);
    });
    
    // Update Progress Bar and Text
    const progress = ((currentStep + 1) / totalSteps) * 100;
    progressBar.style.width = `${progress}%`;
    progressText.textContent = `${currentStep + 1} of ${totalSteps}`;
    currentStepTitle.textContent = `Step ${currentStep + 1}: ${stepTitles[currentStep]}`;

    // Update Buttons
    prevBtn.disabled = currentStep === 0;
    prevBtn.classList.toggle('opacity-50', currentStep === 0);
    nextBtn.textContent = currentStep === totalSteps - 1 ? "Submit Application" : "Next";
    
    // Scroll to the top of the application container for better UX
    const appContainer = document.getElementById("app");
    appContainer.scrollIntoView({ behavior: 'smooth' });
  }
  
  // Inline Validation Logic
  function validateStep(stepIndex) {
    let isValid = true;
    const currentStepSection = steps[stepIndex];
    
    // Reset validation highlights
    currentStepSection.querySelectorAll('input, select, textarea').forEach(field => {
      field.classList.remove('border-red-500');
    });

    // Check required fields
    const requiredFields = currentStepSection.querySelectorAll('[required]');
    requiredFields.forEach(field => {
      if (!field.value || field.value.trim() === "") {
        field.classList.add('border-red-500');
        isValid = false;
      }
    });
    
    // Specific validation rules for step 2 (Community Username)
    if (stepIndex === 1 && formData.joinedCommunity === "yes" && !formData.communityUsername) {
      const usernameInput = currentStepSection.querySelector('input[name="communityUsername"]');
      usernameInput.classList.add('border-red-500');
      isValid = false;
    }
    
    // Specific validation for Step 4 (Word count)
    if (stepIndex === 3) {
      const wordCount = formData.impactAnswer.trim().split(/\s+/).filter(word => word.length > 0).length;
      const textarea = currentStepSection.querySelector('textarea[name="impactAnswer"]');
      if (wordCount < 50) {
        textarea.classList.add('border-red-500');
        isValid = false;
      }
    }

    return isValid;
  }

  // Simple grammar quality check (used only for internal client-side shortlisting score)
  function getWritingQualityScore(text) {
    const clean = text.trim();
    if (!clean) return 0;
    const words = clean.split(/\s+/).filter(word => word.length > 0);
    const sentences = clean.split(/[.!?]/).filter(Boolean);
    let score = 100;
    if (words.length < 30) score -= 30;
    if (sentences.length < 2) score -= 10;
    const uniqueWords = new Set(words.map(w => w.toLowerCase()));
    const repetition = 1 - uniqueWords.size / words.length;
    if (repetition > 0.2) score -= repetition * 40;
    return Math.max(0, Math.min(100, Math.round(score)));
  }

  // Handle submission & Final Client-Side Shortlisting
  function handleSubmit() {
    // All shortlisting criteria are client-side only
    const isFemale = formData.gender === "female";
    const joinedCommunity = formData.joinedCommunity === "yes";
    const committed = formData.commitment === "yes";
    const available = formData.availability !== "";
    const hasAccess = formData.access === "yes";
    
    const motivationQuality = getWritingQualityScore(formData.impactAnswer);
    const writingPass = motivationQuality >= 70;
    const impactWordCount = formData.impactAnswer.trim().split(/\s+/).filter(word => word.length > 0).length;

    const passedAll =
      isFemale &&
      joinedCommunity &&
      committed &&
      available &&
      hasAccess &&
      impactWordCount >= 50 &&
      writingPass;

    // Save application locally
    localStorage.setItem("wid_application", JSON.stringify({
      ...formData,
      shortlisted: passedAll,
      writingScore: motivationQuality // Internal score saved but not displayed
    }));

    // Feedback UI
    if (passedAll) {
      document.getElementById("app").innerHTML = `
        <div class="text-center py-20">
          <h2 class="text-3xl font-bold text-green-700 mb-4">🎉 Congratulations, ${formData.fullName}!</h2>
          <p class="text-gray-700 mb-3">You’ve been <b>shortlisted</b> for the WID DeFi Skill-Up Program. We will contact you soon!</p>
          <button id="restartApp" class="mt-6 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Clear Data & Restart Application</button>
        </div>`;
    } else {
      document.getElementById("app").innerHTML = `
        <div class="text-center py-20">
          <h2 class="text-3xl font-bold text-red-600 mb-4">Application Received</h2>
          <p class="text-gray-700 mb-2">Thank you, ${formData.fullName}. Your application has been recorded.</p>
          <p class="text-gray-500 mb-4">We will review your application and be in touch.</p>
          <button id="restartApp" class="mt-6 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Clear Data & Restart Application</button>
        </div>`;
    }

    document.getElementById("restartApp").addEventListener("click", () => {
      localStorage.clear();
      location.reload();
    });
  }

  // Initialize form
  updateSteps();
  // Initialize word count feedback on load
  if (impactAnswerTextarea) {
    updateWordCountFeedback(impactAnswerTextarea.value);
  }
});