// Restore logged-in user from localStorage if present
if (!window.loggedInUser && localStorage.getItem("loggedInUser")) {
  window.loggedInUser = localStorage.getItem("loggedInUser");
}

// Utility Functions
function showElement(elementId) {
  document.getElementById(elementId).classList.remove("hide");
}

function hideElement(elementId) {
  document.getElementById(elementId).classList.add("hide");
}

function showSection(sectionId) {
  document.querySelectorAll(".container > div").forEach((sec) => {
    hideElement(sec.id);
  });
  showElement(sectionId);

  // Show leaderboard if "highScores" section is displayed
  if (sectionId === "highScores") {
    displayLeaderboard();
  }
}

// Auth Functions
function showLogin() {
  showSection("login");
}
function showRegister() {
  showSection("register");
}

// Register
document
  .getElementById("registerForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    let name = document.getElementById("regName").value;
    let email = document.getElementById("regEmail").value;
    let password = document.getElementById("regPassword").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.some((user) => user.email === email)) {
      alert("User already registered! Please login.");
      showLogin();
      return;
    }
    users.push({ name, email, password });
    localStorage.setItem("users", JSON.stringify(users));
    alert("Registration successful! Please login.");
    showLogin();
  });

// Login
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();
  let email = document.getElementById("loginEmail").value;
  let password = document.getElementById("loginPassword").value;
  let users = JSON.parse(localStorage.getItem("users")) || [];
  let validUser = users.find(
    (user) => user.email === email && user.password === password
  );

  if (validUser) {
    localStorage.setItem("loggedInUser", JSON.stringify(validUser));
    window.loggedInUser = JSON.stringify(validUser);
    document.getElementById(
      "welcomeMsg"
    ).innerText = `Welcome, ${validUser.name}!`;
    showSection("home");
  } else {
    alert("Invalid email or password");
  }
});

// Logout
function logout() {
  localStorage.removeItem("loggedInUser");
  window.loggedInUser = null;
  showSection("login");
}

// On Page Load
window.onload = function () {
  // Check for logged-in user and show the appropriate section
  if (!window.loggedInUser && localStorage.getItem("loggedInUser")) {
    window.loggedInUser = localStorage.getItem("loggedInUser");
  }
  if (window.loggedInUser) {
    const user = JSON.parse(window.loggedInUser);
    document.getElementById("welcomeMsg").innerText = `Welcome, ${user.name}!`;
    showSection("home");
  } else {
    showSection("login");
  }
};
function goHome() {
  showSection("home");
}

// User Type and Categories
function selectUserType(type) {
  window.userType = type;
  showCategories(type);
}

function showCategories(type) {
  let categoryList = document.getElementById("categoryList");
  categoryList.innerHTML = "";

  let categories = [];
  if (type === "School") {
    categories = [
      "General Knowledge",
      "Science Basics",
      "Mathematics Fun",
      "History & Civics",
      "English Grammar & Vocabulary",
    ];
  } else if (type === "College") {
    categories = [
      "Aptitude & Reasoning",
      "Programming Basics (C, Java, Python)",
      "Artificial Intelligence",
      "Current Affairs",
      "Sports & Entertainment",
      "Technology & Gadgets",
    ];
  } else if (type === "Professional") {
    categories = [
      "Industry Knowledge (IT, Finance, etc.)",
      "Coding Challenges",
      "Business & Management",
      "Soft Skills & Communication",
      "Aptitude Test Prep",
      "Latest Tech Trends",
    ];
  }

  categories.forEach((cat) => {
    let btn = document.createElement("button");
    btn.innerText = cat;
    btn.classList.add("btn");
    btn.onclick = () => selectCategory(cat);
    categoryList.appendChild(btn);
  });

  showSection("categories");
}

function selectCategory(cat) {
  window.selectedCategory = cat;
  startQuiz(cat);
}

// Category Map
const categoryMap = {
  "General Knowledge": { type: "opentdb", id: 9 },
  "Science Basics": { type: "opentdb", id: 17 },
  "Mathematics Fun": { type: "opentdb", id: 19 },
  "History & Civics": { type: "opentdb", id: 23 },
  "English Grammar & Vocabulary": { type: "custom" },
  "Aptitude & Reasoning": { type: "custom" },
  "Programming Basics (C, Java, Python)": { type: "quizapiio" },
  "Artificial Intelligence": { type: "custom" },
  "Current Affairs": { type: "newsapi" },
  "Sports & Entertainment": { type: "opentdb", id: 21 },
  "Technology & Gadgets": { type: "quizapiio" },
  "Industry Knowledge (IT, Finance, etc.)": { type: "custom" },
  "Coding Challenges": { type: "quizapiio" },
  "Business & Management": { type: "custom" },
  "Soft Skills & Communication": { type: "custom" },
  "Aptitude Test Prep": { type: "custom" },
  "Latest Tech Trends": { type: "newsapi" },
};

// Custom Questions
const customQuestions = {
  "English Grammar & Vocabulary": [
    {
      question: "What is the past tense of 'go'?",
      options: ["Goed", "Went", "Gone", "Going"],
      correct: "Went",
    },
    {
      question: "Synonym of 'happy'?",
      options: ["Sad", "Joyful", "Angry", "Tired"],
      correct: "Joyful",
    },
    {
      question: "Plural of 'child'?",
      options: ["Childs", "Children", "Childes", "Child"],
      correct: "Children",
    },
    {
      question: "What does 'etc.' mean?",
      options: ["And so on", "For example", "However", "Therefore"],
      correct: "And so on",
    },
    {
      question: "Antonym of 'big'?",
      options: ["Large", "Huge", "Small", "Great"],
      correct: "Small",
    },
    {
      question: "Correct spelling: accomodate or accommodate?",
      options: ["Accomodate", "Acommodate", "Accommodate", "Accomoddate"],
      correct: "Accommodate",
    },
    {
      question: "What is a noun?",
      options: [
        "Action word",
        "Describing word",
        "Person, place, thing",
        "Connecting word",
      ],
      correct: "Person, place, thing",
    },
    {
      question: "Passive voice of 'She eats an apple'?",
      options: [
        "An apple is eaten by her",
        "She is eating an apple",
        "An apple eats her",
        "She ate an apple",
      ],
      correct: "An apple is eaten by her",
    },
    {
      question: "Idiom: 'Break a leg' means?",
      options: ["Injure yourself", "Good luck", "Run away", "Fight"],
      correct: "Good luck",
    },
    {
      question: "Which sentence is correct?",
      options: [
        "He go to school",
        "He goes to school",
        "He going to school",
        "He went school",
      ],
      correct: "He goes to school",
    },
  ],
  "Aptitude & Reasoning": [
    {
      question: "If 2+3=10, 7+2=63, 6+5=66, then 8+4=?",
      options: ["96", "12", "48", "72"],
      correct: "96",
    },
    {
      question: "Find the odd one: Apple, Banana, Carrot, Grape",
      options: ["Apple", "Banana", "Carrot", "Grape"],
      correct: "Carrot",
    },
    {
      question: "What comes next: 2, 4, 8, 16, ?",
      options: ["20", "24", "32", "18"],
      correct: "32",
    },
    {
      question:
        "If A is B's sister, C is B's mother, D is C's father, then D is A's?",
      options: ["Uncle", "Grandfather", "Brother", "Father"],
      correct: "Grandfather",
    },
    {
      question: "Complete the series: 1, 4, 9, 16, ?",
      options: ["20", "25", "18", "21"],
      correct: "25",
    },
    {
      question: "Which number replaces the question mark: 5, 10, 20, 40, ?",
      options: ["60", "80", "50", "70"],
      correct: "80",
    },
    {
      question: "If all roses are flowers, some flowers fade quickly, then:",
      options: [
        "All roses fade quickly",
        "Some roses fade quickly",
        "No roses fade quickly",
        "None of the above",
      ],
      correct: "Some roses fade quickly",
    },
    {
      question:
        "Clock shows 3:00. What is the angle between hour and minute hand?",
      options: ["60Â°", "90Â°", "120Â°", "0Â°"],
      correct: "90Â°",
    },
    {
      question: "Find the missing number: 3, 6, 9, ?, 15",
      options: ["10", "12", "11", "13"],
      correct: "12",
    },
    {
      question:
        "A train leaves at 3 PM and reaches at 9 PM. How long was the journey?",
      options: ["5 hours", "6 hours", "7 hours", "4 hours"],
      correct: "6 hours",
    },
  ],
  "Artificial Intelligence": [
    {
      question: "What does AI stand for?",
      options: [
        "Artificial Intelligence",
        "Automated Intelligence",
        "Advanced Integration",
        "Artificial Integration",
      ],
      correct: "Artificial Intelligence",
    },
    {
      question: "Who is known as the father of AI?",
      options: ["Alan Turing", "John McCarthy", "Elon Musk", "Bill Gates"],
      correct: "John McCarthy",
    },
    {
      question: "What is machine learning?",
      options: [
        "AI that learns from data",
        "Programming robots",
        "Building hardware",
        "Designing apps",
      ],
      correct: "AI that learns from data",
    },
    {
      question: "What is a neural network?",
      options: [
        "Brain-like structure in AI",
        "Computer virus",
        "Database system",
        "Web framework",
      ],
      correct: "Brain-like structure in AI",
    },
    {
      question: "Deep learning uses?",
      options: [
        "Multiple layers of neurons",
        "Single layer",
        "No layers",
        "Only rules",
      ],
      correct: "Multiple layers of neurons",
    },
    {
      question: "What is NLP?",
      options: [
        "Natural Language Processing",
        "New Learning Protocol",
        "Neural Link Protocol",
        "Network Layer Protocol",
      ],
      correct: "Natural Language Processing",
    },
    {
      question: "AI ethics concern?",
      options: [
        "Bias in algorithms",
        "Speed of computers",
        "Color of screens",
        "Size of data",
      ],
      correct: "Bias in algorithms",
    },
    {
      question: "What is supervised learning?",
      options: [
        "Learning with labeled data",
        "Unsupervised exploration",
        "Reinforcement rewards",
        "Clustering data",
      ],
      correct: "Learning with labeled data",
    },
    {
      question: "Example of AI application?",
      options: ["Chatbots", "Manual calculators", "Paper books", "Typewriters"],
      correct: "Chatbots",
    },
    {
      question: "What is overfitting in AI?",
      options: [
        "Model too complex for data",
        "Model too simple",
        "No training",
        "Perfect fit",
      ],
      correct: "Model too complex for data",
    },
  ],
  "Industry Knowledge (IT, Finance, etc.)": [
    {
      question: "What is Agile methodology?",
      options: [
        "Iterative development",
        "Waterfall process",
        "One-time build",
        "No planning",
      ],
      correct: "Iterative development",
    },
    {
      question: "In finance, what is ROI?",
      options: [
        "Return on Investment",
        "Risk of Income",
        "Rate of Interest",
        "Return on Income",
      ],
      correct: "Return on Investment",
    },
    {
      question: "What is cloud computing?",
      options: [
        "Internet-based computing",
        "Local storage only",
        "Hardware repair",
        "Software installation",
      ],
      correct: "Internet-based computing",
    },
    {
      question: "SQL stands for?",
      options: [
        "Structured Query Language",
        "Simple Query Language",
        "System Query Language",
        "Standard Query Language",
      ],
      correct: "Structured Query Language",
    },
    {
      question: "What is blockchain?",
      options: [
        "Decentralized ledger",
        "Central bank system",
        "Email protocol",
        "Web browser",
      ],
      correct: "Decentralized ledger",
    },
    {
      question: "In IT, what is DevOps?",
      options: [
        "Development and Operations",
        "Device Operations",
        "Data Optimization",
        "Design Options",
      ],
      correct: "Development and Operations",
    },
    {
      question: "What is GDP in finance?",
      options: [
        "Gross Domestic Product",
        "General Development Plan",
        "Global Data Processing",
        "Gross Data Product",
      ],
      correct: "Gross Domestic Product",
    },
    {
      question: "Cybersecurity threat: Phishing is?",
      options: [
        "Fake emails to steal info",
        "Virus infection",
        "Hardware failure",
        "Slow internet",
      ],
      correct: "Fake emails to steal info",
    },
    {
      question: "What is API?",
      options: [
        "Application Programming Interface",
        "Advanced Processing Interface",
        "Application Process Integration",
        "Automated Program Interface",
      ],
      correct: "Application Programming Interface",
    },
    {
      question: "Stock market term: Bull market means?",
      options: [
        "Rising prices",
        "Falling prices",
        "Stable prices",
        "No trading",
      ],
      correct: "Rising prices",
    },
  ],
  "Business & Management": [
    {
      question: "What is SWOT analysis?",
      options: [
        "Strengths, Weaknesses, Opportunities, Threats",
        "Sales, Workers, Operations, Targets",
        "Strategy, Workflow, Organization, Training",
        "None of the above",
      ],
      correct: "Strengths, Weaknesses, Opportunities, Threats",
    },
    {
      question: "Who wrote 'The Principles of Scientific Management'?",
      options: ["Frederick Taylor", "Peter Drucker", "Henry Ford", "Elon Musk"],
      correct: "Frederick Taylor",
    },
    {
      question: "What is CRM?",
      options: [
        "Customer Relationship Management",
        "Corporate Resource Management",
        "Customer Revenue Model",
        "Central Risk Management",
      ],
      correct: "Customer Relationship Management",
    },
    {
      question: "Leadership style: Autocratic means?",
      options: [
        "One-person decision making",
        "Group decisions",
        "Democratic voting",
        "Laissez-faire",
      ],
      correct: "One-person decision making",
    },
    {
      question: "What is KPI?",
      options: [
        "Key Performance Indicator",
        "Key Process Integration",
        "Knowledge Process Index",
        "Key Product Innovation",
      ],
      correct: "Key Performance Indicator",
    },
    {
      question: "Porter's Five Forces analyzes?",
      options: [
        "Industry competition",
        "Internal HR",
        "Product design",
        "Office layout",
      ],
      correct: "Industry competition",
    },
    {
      question: "What is outsourcing?",
      options: [
        "Delegating tasks to external parties",
        "Internal promotion",
        "In-house training",
        "Budget cutting",
      ],
      correct: "Delegating tasks to external parties",
    },
    {
      question: "Maslow's hierarchy starts with?",
      options: [
        "Physiological needs",
        "Self-actualization",
        "Esteem",
        "Safety",
      ],
      correct: "Physiological needs",
    },
    {
      question: "What is a P&L statement?",
      options: [
        "Profit and Loss",
        "Plan and Launch",
        "Product and Logistics",
        "Performance and Leadership",
      ],
      correct: "Profit and Loss",
    },
    {
      question: "Lean management focuses on?",
      options: [
        "Eliminating waste",
        "Increasing staff",
        "Expanding offices",
        "More meetings",
      ],
      correct: "Eliminating waste",
    },
  ],
  "Soft Skills & Communication": [
    {
      question: "Active listening involves?",
      options: [
        "Paraphrasing what was said",
        "Interrupting",
        "Daydreaming",
        "Checking phone",
      ],
      correct: "Paraphrasing what was said",
    },
    {
      question: "What is empathy?",
      options: [
        "Understanding others' feelings",
        "Ignoring emotions",
        "Competing aggressively",
        "Giving orders",
      ],
      correct: "Understanding others' feelings",
    },
    {
      question: "Non-verbal communication includes?",
      options: [
        "Body language",
        "Emails only",
        "Phone calls",
        "Written reports",
      ],
      correct: "Body language",
    },
    {
      question: "What is assertiveness?",
      options: [
        "Expressing needs respectfully",
        "Being passive",
        "Being aggressive",
        "Avoiding conflict",
      ],
      correct: "Expressing needs respectfully",
    },
    {
      question: "Feedback sandwich starts with?",
      options: [
        "Positive comment",
        "Negative criticism",
        "Question",
        "Silence",
      ],
      correct: "Positive comment",
    },
    {
      question: "What is time management?",
      options: [
        "Prioritizing tasks effectively",
        "Working overtime",
        "Multitasking everything",
        "Procrastinating",
      ],
      correct: "Prioritizing tasks effectively",
    },
    {
      question: "Emotional intelligence includes?",
      options: [
        "Self-awareness",
        "Ignoring feelings",
        "Blaming others",
        "Avoiding people",
      ],
      correct: "Self-awareness",
    },
    {
      question: "Public speaking tip: Practice?",
      options: ["Reduces anxiety", "Increases fear", "No need", "Only once"],
      correct: "Reduces anxiety",
    },
    {
      question: "What is negotiation?",
      options: [
        "Mutual agreement process",
        "Winning at all costs",
        "One-sided demands",
        "Avoiding talks",
      ],
      correct: "Mutual agreement process",
    },
    {
      question: "Teamwork benefits?",
      options: [
        "Diverse ideas",
        "Individual glory",
        "More conflicts",
        "Less productivity",
      ],
      correct: "Diverse ideas",
    },
  ],
  "Aptitude Test Prep": [
    {
      question:
        "If 5 workers build 5 walls in 5 days, how long for 10 workers to build 10 walls?",
      options: ["5 days", "10 days", "2.5 days", "25 days"],
      correct: "5 days",
    },
    {
      question: "What is 15% of 200?",
      options: ["30", "20", "40", "25"],
      correct: "30",
    },
    {
      question: "Series: 1, 3, 6, 10, ?",
      options: ["15", "12", "14", "16"],
      correct: "15",
    },
    {
      question: "If A > B and B > C, then?",
      options: ["A > C", "A < C", "A = C", "None"],
      correct: "A > C",
    },
    {
      question: "Average of 10, 20, 30?",
      options: ["20", "15", "25", "60"],
      correct: "20",
    },
    {
      question: "What is the next prime after 7?",
      options: ["9", "11", "8", "10"],
      correct: "11",
    },
    {
      question: "If x + y = 10 and x - y = 4, then x=?",
      options: ["7", "6", "3", "14"],
      correct: "7",
    },
    {
      question: "Odd one out: Circle, Square, Triangle, Rectangle",
      options: ["Circle", "Square", "Triangle", "Rectangle"],
      correct: "Circle",
    },
    {
      question: "Speed = Distance / ?",
      options: ["Time", "Acceleration", "Force", "Mass"],
      correct: "Time",
    },
    { question: "What is 2^3?", options: ["6", "8", "4", "9"], correct: "8" },
  ],
};

// Quiz Variables
let questions = [];
let currentIndex = 0;
let userAnswers = [];
let currentCategory = "";
let timeLeft = 30;
let timer;

function decodeHTML(html) {
  let txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

function updateProgressBar() {
  const progressBarFull = document.getElementById("progressBarFull");
  const questionCounter = document.getElementById("questionCounter");
  const progressPercentage = document.getElementById("progressPercentage");

  const totalQuestions = questions.length;
  const currentQuestion = currentIndex + 1;
  const progressPercent = (currentQuestion / totalQuestions) * 100;

  progressBarFull.style.width = progressPercent + "%";
  progressBarFull.textContent = `${currentQuestion}/${totalQuestions}`;
  questionCounter.textContent = `Question ${currentQuestion} of ${totalQuestions}`;
  progressPercentage.textContent = `${Math.round(progressPercent)}%`;
}

function startTimer() {
  timeLeft = 30;
  const timerDisplay = document.getElementById("timer-display");
  timerDisplay.classList.remove("warning");
  timerDisplay.textContent = `⏱ Time: ${timeLeft}s`;

  clearInterval(timer);
  timer = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `⏱ Time: ${timeLeft}s`;

    if (timeLeft <= 10) {
      timerDisplay.classList.add("warning");
    } else {
      timerDisplay.classList.remove("warning");
    }

    if (timeLeft <= 0) {
      clearInterval(timer);
      // Auto-advance to next question when time runs out
      if (!userAnswers[currentIndex]) {
        userAnswers[currentIndex] = "No answer";
      }
      currentIndex++;
      if (currentIndex < questions.length) {
        renderQuestion(currentIndex);
      } else {
        showResults();
      }
    }
  }, 1000);
}

function startQuiz(category) {
  currentCategory = category;
  currentIndex = 0;
  userAnswers = [];
  questions = [];
  clearInterval(timer);

  showSection("quiz-section");
  showElement("loader");
  loadQuestions(category);

  document.getElementById("quiz-category-title").textContent = category;
}

async function loadQuestions(category) {
  const source = categoryMap[category];
  if (!source) {
    hideElement("loader");
    alert("Category not supported.");
    return;
  }

  try {
    if (source.type === "opentdb") {
      const response = await fetch(
        `https://opentdb.com/api.php?amount=10&category=${source.id}&type=multiple`
      );
      const data = await response.json();
      if (data.response_code !== 0) throw new Error("API error");
      questions = data.results.map((q) => ({
        question: decodeHTML(q.question),
        options: [...q.incorrect_answers, q.correct_answer]
          .map((opt) => decodeHTML(opt))
          .sort(() => Math.random() - 0.5),
        correct: decodeHTML(q.correct_answer),
      }));
    } else if (source.type === "custom") {
      questions = customQuestions[category] || [
        {
          question: "Sample Question?",
          options: ["A", "B", "C", "D"],
          correct: "A",
        },
        {
          question: "Another Sample?",
          options: ["X", "Y", "Z", "W"],
          correct: "Y",
        },
      ];
      questions.forEach((q) => {
        q.options = q.options.sort(() => Math.random() - 0.5);
      });
    } else if (source.type === "quizapiio") {
      const response = await fetch(
        "https://quizapi.io/api/v1/questions?limit=10&tags=JavaScript",
        {
          headers: { "X-Api-Key": "oqXOtHA0k72XBZxD1bKcODZGjVzynbaAwutorDpi" },
        }
      );
      const data = await response.json();
      questions = data.map((q) => ({
        question: q.question,
        options: Object.values(q.answers)
          .filter((a) => a !== null)
          .sort(() => Math.random() - 0.5),
        correct: q.correct_answers
          ? Object.keys(q.correct_answers)
              .find((k) => q.correct_answers[k] === "true")
              .replace("_correct", "")
          : "A",
      }));
    } else if (source.type === "newsapi") {
      const response = await fetch(
        `https://newsapi.org/v2/top-headlines?country=us&apiKey=49d1b557f654423ebbda54bbc9d3e4bf`
      );
      const data = await response.json();
      if (data.articles && data.articles.length > 0) {
        questions = data.articles.slice(0, 10).map((article) => ({
          question: `Which source published: "${article.title?.substring(
            0,
            50
          )}..."?`,
          options: [
            "BBC",
            "CNN",
            article.source?.name || "Unknown",
            "Reuters",
          ].sort(() => Math.random() - 0.5),
          correct: article.source?.name || "Unknown",
        }));
      } else {
        throw new Error("No articles found");
      }
    }
  } catch (err) {
    console.error("âŒ Error loading questions:", err);
    if (customQuestions[category]) {
      questions = customQuestions[category].map((q) => ({
        question: q.question,
        options: q.options.sort(() => Math.random() - 0.5),
        correct: q.correct,
      }));
    } else {
      questions = [
        {
          question: "Fallback Q1: What is 2+2?",
          options: ["3", "4", "5", "6"],
          correct: "4",
        },
        {
          question: "Fallback Q2: Capital of France?",
          options: ["Berlin", "Madrid", "Paris", "London"],
          correct: "Paris",
        },
        {
          question: "Fallback Q3: Largest planet?",
          options: ["Earth", "Mars", "Jupiter", "Saturn"],
          correct: "Jupiter",
        },
        {
          question: "Fallback Q4: Boiling point of water?",
          options: ["50Â°C", "100Â°C", "0Â°C", "200Â°C"],
          correct: "100Â°C",
        },
        {
          question: "Fallback Q5: Author of Harry Potter?",
          options: [
            "J.K. Rowling",
            "J.R.R. Tolkien",
            "George R.R. Martin",
            "Stephen King",
          ],
          correct: "J.K. Rowling",
        },
        {
          question: "Fallback Q6: What is DNA?",
          options: ["Genetic material", "Virus", "Protein", "Carbohydrate"],
          correct: "Genetic material",
        },
        {
          question: "Fallback Q7: Speed of light?",
          options: [
            "300,000 km/s",
            "150,000 km/s",
            "500,000 km/s",
            "100,000 km/s",
          ],
          correct: "300,000 km/s",
        },
        {
          question: "Fallback Q8: UN headquarters?",
          options: ["London", "Paris", "New York", "Geneva"],
          correct: "New York",
        },
        {
          question: "Fallback Q9: Element symbol for Gold?",
          options: ["Go", "Au", "Gd", "Ag"],
          correct: "Au",
        },
        {
          question: "Fallback Q10: Inventor of the telephone?",
          options: [
            "Thomas Edison",
            "Alexander Graham Bell",
            "Nikola Tesla",
            "Albert Einstein",
          ],
          correct: "Alexander Graham Bell",
        },
      ];
    }
  } finally {
    hideElement("loader");
  }

  if (questions.length === 0) {
    alert("No questions available. Please try another category.");
    goHome();
    return;
  }

  renderQuestion(currentIndex);
  updateProgressBar();
  startTimer();
}

function renderQuestion(index) {
  const quizContainer = document.getElementById("quiz-container");
  quizContainer.innerHTML = "";

  if (index >= questions.length) {
    clearInterval(timer);
    showResults();
    return;
  }

  updateProgressBar();
  startTimer();

  const q = questions[index];
  const questionEl = document.createElement("h3");
  questionEl.innerHTML = q.question;

  const optionsEl = document.createElement("div");
  optionsEl.classList.add("options");
  q.options.forEach((opt, optIndex) => {
    const btn = document.createElement("button");
    btn.innerText = opt;
    btn.classList.add("btn", "options");
    btn.onclick = () => selectAnswer(opt, index);
    if (userAnswers[index] === opt) {
      btn.style.backgroundColor = "#87CEEB";
    }
    optionsEl.appendChild(btn);
  });

  quizContainer.appendChild(questionEl);
  quizContainer.appendChild(optionsEl);

  const nav = document.createElement("div");
  nav.classList.add("nav-buttons");

  if (index > 0) {
    let prevBtn = document.createElement("button");
    prevBtn.innerText = "Previous";
    prevBtn.classList.add("btn");
    prevBtn.onclick = () => {
      currentIndex--;
      renderQuestion(currentIndex);
    };
    nav.appendChild(prevBtn);
  }

  if (index < questions.length - 1) {
    let nextBtn = document.createElement("button");
    nextBtn.innerText = "Next";
    nextBtn.classList.add("btn");
    nextBtn.onclick = () => {
      if (!userAnswers[index]) {
        alert("Please select an answer before proceeding.");
        return;
      }
      currentIndex++;
      renderQuestion(currentIndex);
    };
    nav.appendChild(nextBtn);
  } else {
    let finishBtn = document.createElement("button");
    finishBtn.innerText = "Finish Quiz";
    finishBtn.classList.add("btn");
    finishBtn.onclick = () => {
      if (!userAnswers[index]) {
        alert("Please select an answer before finishing.");
        return;
      }
      currentIndex++;
      renderQuestion(currentIndex);
    };
    nav.appendChild(finishBtn);
  }

  quizContainer.appendChild(nav);
}

function selectAnswer(selectedOpt, index) {
  userAnswers[index] = selectedOpt;
  renderQuestion(index);
  const correct = questions[index].correct;
  if (selectedOpt === correct) {
    document.body.classList.add("correct");
    setTimeout(() => document.body.classList.remove("correct"), 500);
  } else {
    document.body.classList.add("wrong");
    setTimeout(() => document.body.classList.remove("wrong"), 500);
  }
}

function showResults() {
  clearInterval(timer);
  document.getElementById("quiz-bar-container").style.display = "none";
  showSection("result-section");

  const container = document.getElementById("result-container");
  container.innerHTML = "<h2>Your Results</h2>";
  let score = 0;

  questions.forEach((q, i) => {
    const userAns = userAnswers[i] || "No answer";
    const correctAns = q.correct;
    if (userAns === correctAns) score++;

    const qEl = document.createElement("div");
    const className = userAns === correctAns ? "correct" : "wrong";
    qEl.innerHTML = `
                    <p><strong>Q${i + 1}: ${q.question}</strong></p>
                    <p>Your Answer: <span class="${className}">${userAns}</span></p>
                    <p>Correct Answer: <span class="correct">${correctAns}</span></p>
                    <hr>
                `;
    container.appendChild(qEl);
  });

  const scoreEl = document.createElement("h3");
  scoreEl.innerHTML = `✅ Final Score: ${score} / ${
    questions.length
  } (${Math.round((score / questions.length) * 100)}%)`;
  container.prepend(scoreEl);

  let leaderboard = JSON.parse(window.leaderboardData || "[]");
  let loggedUser = JSON.parse(window.loggedInUser || '{"name":"Guest"}');
  leaderboard.push({
    name: loggedUser.name,
    score,
    category: currentCategory,
    date: new Date().toLocaleDateString(),
  });
  leaderboard.sort((a, b) => b.score - a.score);
  leaderboard = leaderboard.slice(0, 50);
  window.leaderboardData = JSON.stringify(leaderboard);

  let lbHTML = "<h3>🏆 Top 5 Leaderboard (Overall)</h3><ol>";
  leaderboard.slice(0, 5).forEach((entry) => {
    lbHTML += `<li>${entry.name} - ${entry.score} (${entry.category}) - ${entry.date}</li>`;
  });
  lbHTML += "</ol>";
  container.innerHTML += lbHTML;

  if (score === questions.length) {
    launchConfetti();
  }
}

function retryQuiz() {
  document.getElementById("quiz-bar-container").style.display = "block";
  startQuiz(currentCategory);
}

function launchConfetti() {
  for (let i = 0; i < 50; i++) {
    let conf = document.createElement("div");
    conf.innerText = "🎉";
    conf.style.position = "fixed";
    conf.style.left = Math.random() * window.innerWidth + "px";
    conf.style.top = "-50px";
    conf.style.fontSize = "24px";
    conf.style.pointerEvents = "none";
    conf.style.zIndex = "1000";
    conf.style.animation = `fall 3s linear forwards ${Math.random() * 3}s`;
    document.body.appendChild(conf);
    setTimeout(() => conf.remove(), 4000);
  }
}

function clearLeaderboard() {
  if (confirm("Are you sure you want to clear the leaderboard?")) {
    window.leaderboardData = "[]";
    showSection("highScores");
    const highScoresList = document.getElementById("highScoresList");
    highScoresList.innerHTML = "<li>No scores yet!</li>";
  }
}

function displayLeaderboard() {
  const highScoresList = document.getElementById("highScoresList");
  let leaderboard = JSON.parse(window.leaderboardData || "[]");
  highScoresList.innerHTML = "";

  if (leaderboard.length === 0) {
    highScoresList.innerHTML =
      "<li>No scores yet! Take a quiz to get on the board.</li>";
    return;
  }

  const categories = [...new Set(leaderboard.map((l) => l.category))];
  let lbHTML = "";

  categories.forEach((cat) => {
    const catScores = leaderboard.filter((l) => l.category === cat).slice(0, 3);
    if (catScores.length > 0) {
      lbHTML += `<h4>${cat} Top 3:</h4><ol>`;
      catScores.forEach((entry) => {
        lbHTML += `<li>${entry.name} - ${entry.score} (${entry.date})</li>`;
      });
      lbHTML += "</ol>";
    }
  });

  lbHTML += "<h4>Overall Top 5:</h4><ol>";
  leaderboard.slice(0, 5).forEach((entry) => {
    lbHTML += `<li>${entry.name} - ${entry.score} (${entry.category}) - ${entry.date}</li>`;
  });
  lbHTML += "</ol>";

  highScoresList.innerHTML = lbHTML;
}

// Page Initialization
document.addEventListener("DOMContentLoaded", function () {
  const style = document.createElement("style");
  style.textContent = `
                @keyframes fall {
                    to { transform: translateY(100vh) rotate(360deg); }
                }
            `;
  document.head.appendChild(style);

  const loggedInUser = window.loggedInUser;
  if (loggedInUser) {
    const user = JSON.parse(loggedInUser);
    document.getElementById("welcomeMsg").innerText = `Welcome, ${user.name}!`;
    showSection("home");
  } else {
    showSection("login");
  }

  if (window.location.hash === "#leaderboard") {
    showSection("highScores");
    displayLeaderboard();
  }
});

window.selectUserType = selectUserType;
