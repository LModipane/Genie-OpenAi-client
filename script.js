const textArea = document.querySelector('textarea');
textArea.addEventListener('keyup', function () {
	textArea.style.height = '0.1px';
	textArea.style.height = 25 + textArea.scrollHeight + 'px';
});

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadinterval;

function generateChatStripe(isAi, value, uniqueId) {
	return `
    <div class="wrapper ${isAi && 'ai'}">
      <div class="chat">
        <div class="profile">
          <img src=${isAi ? 'man-genie.svg' : 'opsgenie.svg'} alt="send" />
        </div>
        <div class="message" id=${uniqueId}>
          ${value}
        </div>
      </div>
    </div>
  `;
}

const handleSubmit = async event => {
	event.preventDefault();
	const data = new FormData(form);

	//generate user chat stripe
	chatContainer.innerHTML += generateChatStripe(false, data.get('prompt'));

	//generate bot chat stript
	const messageId = generateMessageId();
	chatContainer.innerHTML += generateChatStripe(true, '', messageId);

	chatContainer.scrollTop = chatContainer.scrollHeight; //this will generate the new message in view

	//load message in bot chat
	const botMessage = document.getElementById(messageId);
	loadMessage(botMessage);
  textArea.value = "";

	//fetch data from server

	const responce = await fetch(`http://localhost:5000`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			prompt: data.get('prompt'),
		}),
	});

	clearInterval(loadinterval);
	botMessage.innerHTML = '';

	if (responce.ok) {
		const data = await responce.json();
		const parsedData = data.bot.trim();
		typeMessage(botMessage, parsedData);
	} else {
		const err = await responce.text();
		botMessage.innerHTML = 'Opps, Something went wrong!!';
		alert(err);
  }
};

function loadMessage(element) {
	element.textContent = '';
	loadinterval = setInterval(() => {
		element.textContent += '.';
		if (element.textContent.length > 3) {
			element.textContent = '';
		}
	}, 300); //this
}

form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', event => {
	if (event.keyCode === 13) {
		handleSubmit(event);
	}
});

function typeMessage(element, text) {
	let index = 0;

	let interval = setInterval(() => {
		if (index < text.length) {
			element.innerHTML += text.charAt(index);
			index += 1;
		} else {
			clearInterval(interval);
		}
	}, 20);
}

function generateMessageId() {
	const timestamp = Date.now();
	const randomNumber = Math.random();
	const hexadecimalString = randomNumber.toString(16);
	return `id-${timestamp}-${hexadecimalString}`;
}
