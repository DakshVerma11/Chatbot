document.addEventListener('DOMContentLoaded', function() {
    console.log("Document loaded");
    
    // DOM Elements
    const chatbotLauncher = document.getElementById('chatbot-launcher');
    const chatbotWindow = document.getElementById('chatbot-window');
    const minimizeBtn = document.getElementById('minimize-btn');
    const closeBtn = document.getElementById('close-btn');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const messageContainer = document.getElementById('message-container');
    const tooltip = document.getElementById('tooltip');
    
    // Check if elements were found
    console.log("Launcher found:", chatbotLauncher !== null);
    console.log("Chatbot window found:", chatbotWindow !== null);
    
    // IMMEDIATELY hide the chatbot window and show launcher
    if (chatbotWindow) chatbotWindow.style.display = 'none';
    if (chatbotLauncher) chatbotLauncher.style.display = 'flex';
    
    // Default responses (fallback if JSON loading fails)
    let responses = [
        {
            "id": 1,
            "keywords": ["hello", "hi", "hey", "howdy", "namaste"],
            "response": "Hello! How can I help you today?"
        },
        {
            "id": 2,
            "keywords": ["bye", "goodbye", "see you", "talk later"],
            "response": "Goodbye! Have a great day!"
        },
        {
            "id": 3,
            "keywords": ["thank", "thanks"],
            "response": "You're welcome! Is there anything else I can help you with?"
        },
        {
            "id": 6,
            "keywords": ["rate content", "pricing information", "rate data"],
            "response": "Rate content is the information about prices or costs that a company collects and stores electronically. This can include things like hourly rates, fees for services, prices per unit, or discounts from suppliers. Companies use this rate content in their electronic systems to help manage purchases, check that invoices match agreed prices, and make sure they pay the right amount. It helps automate and simplify buying and billing processes by having all the pricing details organized and easy to access.",
            "link": {
                "text": "Click here for more details",
                "url": "https://example.com/rate-content-details"
            }
        }
    ];
    
    // Try to load responses from JSON file
    loadResponses();
    
    // Function to load responses from JSON
    function loadResponses() {
        // Create XMLHttpRequest (works with file:// protocol, unlike fetch)
        const xhr = new XMLHttpRequest();
        xhr.overrideMimeType("application/json");
        xhr.open('GET', 'chatbot-responses.json', true);
        
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200 || xhr.status === 0) { // 0 for local files
                    try {
                        const data = JSON.parse(xhr.responseText);
                        console.log("Responses loaded successfully from JSON file");
                        responses = data;
                    } catch (e) {
                        console.error("Error parsing JSON:", e);
                    }
                } else {
                    console.error("Failed to load responses. Status:", xhr.status);
                }
                
                // Show tooltip after responses are loaded (or failed to load)
                setTimeout(showTooltip, 2000);
            }
        };
        
        xhr.onerror = function() {
            console.error("Error during XMLHttpRequest");
            setTimeout(showTooltip, 2000);
        };
        
        xhr.send(null);
    }

    // Show tooltip
    function showTooltip() {
        if (tooltip) {
            tooltip.classList.remove('hidden');
            setTimeout(() => {
                tooltip.classList.add('hidden');
            }, 5000);
        }
    }

    // Show initial greeting when chatbot is first opened
    let firstOpen = true;

    // Event Listeners
    if (chatbotLauncher) {
        chatbotLauncher.addEventListener('click', function() {
            console.log("Launcher clicked");
            openChatbot();
        });
    }
    
    if (minimizeBtn) {
        minimizeBtn.addEventListener('click', function(e) {
            console.log("Minimize clicked");
            e.stopPropagation(); // Prevent event bubbling
            minimizeChatbot();
        });
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', function(e) {
            console.log("Close clicked");
            e.stopPropagation(); // Prevent event bubbling
            closeChatbot();
        });
    }
    
    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
    }
    
    if (userInput) {
        userInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    // Open chatbot
    function openChatbot() {
        console.log("Opening chatbot");
        
        if (chatbotWindow && chatbotLauncher) {
            // Force removal of hidden class
            chatbotWindow.classList.remove('hidden');
            // Set explicit style
            chatbotWindow.style.display = 'flex';
            chatbotLauncher.style.display = 'none';
            
            console.log("Chatbot window display:", chatbotWindow.style.display);
            console.log("Launcher display:", chatbotLauncher.style.display);
            
            if (userInput) userInput.focus();
            
            if (firstOpen) {
                // Add initial greeting
                setTimeout(() => {
                    addBotMessage("Hello, I'm DV Assistant. How can I help you today?");
                    firstOpen = false;
                }, 500);
            }
        } else {
            console.error("Could not find chatbot elements");
        }
    }

    // Minimize chatbot
    function minimizeChatbot() {
        console.log("Minimizing chatbot");
        if (chatbotWindow && chatbotLauncher) {
            chatbotWindow.style.display = 'none';
            chatbotLauncher.style.display = 'flex';
        }
    }

    // Close chatbot
    function closeChatbot() {
        console.log("Closing chatbot");
        if (chatbotWindow && chatbotLauncher) {
            chatbotWindow.style.display = 'none';
            chatbotLauncher.style.display = 'flex';
        }
    }

    // Send message
    function sendMessage() {
        if (!userInput) return;
        
        const message = userInput.value.trim();
        if (message === '') return;
        
        // Add user message to chat
        addUserMessage(message);
        
        // Process message and get response
        processMessage(message);
        
        // Clear input
        userInput.value = '';
    }

    // Process message using keyword matching
    function processMessage(message) {
        // Convert to lowercase for case-insensitive matching
        const lowerMessage = message.toLowerCase();
        
        // Check for matches in the responses database
        for (const item of responses) {
            for (const keyword of item.keywords) {
                if (lowerMessage.includes(keyword.toLowerCase())) {
                    // Add bot response with delay to simulate thinking
                    setTimeout(() => {
                        addBotMessage(item.response, item.link);
                    }, 800);
                    return;
                }
            }
        }
        
        // Default response if no match found
        setTimeout(() => {
            addBotMessage("I am sorry, I can't reply to that.");
        }, 800);
    }

    // Add user message to chat
    function addUserMessage(message) {
        if (!messageContainer) return;
        
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', 'user-message');
        
        const messageText = document.createElement('div');
        messageText.classList.add('message-text');
        messageText.textContent = message;
        
        const timestamp = document.createElement('div');
        timestamp.classList.add('timestamp');
        timestamp.textContent = getCurrentTime();
        
        messageElement.appendChild(messageText);
        messageElement.appendChild(timestamp);
        
        messageContainer.appendChild(messageElement);
        
        // Scroll to bottom
        scrollToBottom();
    }

    // Add bot message to chat
    function addBotMessage(message, link) {
        if (!messageContainer) return;
        
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', 'bot-message');
        
        const messageText = document.createElement('div');
        messageText.classList.add('message-text');
        messageText.textContent = message;
        
        // Add link if provided
        if (link) {
            const linkElement = document.createElement('div');
            linkElement.classList.add('message-link');
            
            const anchor = document.createElement('a');
            anchor.href = link.url;
            anchor.textContent = link.text;
            anchor.target = "_blank"; // Open in new tab
            
            linkElement.appendChild(anchor);
            messageText.appendChild(document.createElement('br'));
            messageText.appendChild(linkElement);
        }
        
        const timestamp = document.createElement('div');
        timestamp.classList.add('timestamp');
        timestamp.textContent = getCurrentTime();
        
        messageElement.appendChild(messageText);
        messageElement.appendChild(timestamp);
        
        messageContainer.appendChild(messageElement);
        
        // Scroll to bottom
        scrollToBottom();
    }

    // Get current time in format HH:MM AM/PM
    function getCurrentTime() {
        const now = new Date();
        let hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        
        hours = hours % 12;
        hours = hours ? hours : 12; // Convert 0 to 12
        
        return `${hours}:${minutes} ${ampm}`;
    }

    // Scroll to bottom of messages
    function scrollToBottom() {
        if (messageContainer) {
            messageContainer.scrollTop = messageContainer.scrollHeight;
        }
    }
});