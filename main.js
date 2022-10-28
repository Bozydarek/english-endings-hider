const generate_btn = document.getElementById("generate");
generate_btn.addEventListener("click", generate, false);

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function generate(event) {
    console.log("Generate puzzle ...");
    event.preventDefault();

    const input_form = document.getElementById('input-form');
    input_form.classList.add('animate__animated', 'animate__backOutUp', 'animate__fast')

    const url = document.getElementById('url').value;
    const text = document.getElementById('text').value;


    console.log(url, "or", text);


    const puzzle = document.getElementById('puzzle');
    puzzle.innerText = text
    // puzzle.appendChild(document.createTextNode(text));

    await sleep(800);
    puzzle.style.display = "initial";
    input_form.style.display = "none";
    puzzle.classList.add('animate__animated', 'animate__fadeIn')
}