// Selecting elements from the DOM
const chatInput = document.querySelector(".chat-input input"); // Taking input in the chatbox input section
const sendChatBtn = document.querySelector(".chat-input span"); // Variable for the send button
const chatbox = document.querySelector(".chatbox"); // Variable for the chatbox element
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".close-btn");
const inputInHeight = chatInput.scrollHeight ;


 let userMessage;

const API_KEY = "#noapikeyheretill";


// Function to create a new chat <li> element
const createChatLi = (message, className) => {
    const chatLi = document.createElement("li"); // Create a chat <li> element
    chatLi.classList.add("chat", className); // Add the "chat" class and the specified className

    // Check the className to determine the content of the chat bubble
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    
    chatLi.innerHTML = chatContent; // Set the innerHTML of the chat <li> element
    chatLi.querySelector("p").textContent = message;
    return chatLi;
}

const    generateResponse = (incomingChatLi) =>{
    const API_URL = "https://api.openai.com/v1/chat/completions ";
    const messageElement = incomingChatLi.querySelector("p");

    const requestOptions = {
        method: "POST",
        headers:{
            "Content-Type": "application/json",
            "Authorization" : `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "system", content: userMessage }]
          })    
    }

    //Send POST request to API get response
fetch(API_URL, requestOptions)
    .then(res => res.json()) // Parse the response as JSON
    .then(data => {
        messageElement.textContent = data.choices[0].message.content ;
    })
    .catch(error => {
       // console.log(error);
       messageElement.classList.add("error");
       messageElement.textContent = "Ooops! Something went wrong. Please try again ..........l" ;
    }).finally( () =>chatbox.scrollTo(0, chatbox.scrollHeight) );


}

// Function to handle user chat input
const handleChat = () => {
    userMessage = chatInput.value.trim(); // Get user's input from the chatbox

    if (!userMessage) return; // If the input is empty, return without doing anything
    chatInput.value ="";
    chatInput.computedStyleMap.height =`${inputInHeight}px`;

    // Append the user's message to the chatbox using the "outgoing" class
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight)

    setTimeout(() => {
        const incomingChatLi = createChatLi("Thinking.....", "incoming");
        // Display "Thinking....." message while waiting for the response...
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight)
        generateResponse(incomingChatLi);
    }, 600); // After 600ms (0.6 seconds), append the "Thinking....." message with the "incoming" class
 
}

chatInput.addEventListener("input", () =>{
    chatInput.computedStyleMap.height =`${inputInHeight}px`;
    chatInput.computedStyleMap.height =`${chatInput.scrollHeight}px`;
});


chatInput.addEventListener("keydown", (e) =>{
    //If enter key is pressed without shift and the window
    // width is greter than 800px handle the chat
    if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800){
        e.preventDefault();
        handleChat();
    }
});


sendChatBtn.addEventListener("click", handleChat);
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
chatbotCloseBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
