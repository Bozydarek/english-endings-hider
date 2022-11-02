const rm_len = 2;

const generate_btn = document.getElementById("generate");
generate_btn.addEventListener("click", generate, false);

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function generate(event) {
    console.log("Generate puzzle ...");
    event.preventDefault();

    const input_form = document.getElementById('input-form');
    input_form.classList.add('animate__animated', 'animate__backOutUp', 'animate__fast');

    const url = document.getElementById('url').value;
    const text = document.getElementById('text').value;


    // console.log(url, "or", text);

    start_processing_time = new Date();
    const puzzle = document.getElementById('puzzle');
    prepare_puzzle(text)
    // puzzle.appendChild(document.createTextNode(text));

    processing_time = new Date() - start_processing_time;
    console.log("Generated in:" + processing_time + "ms")

    // wait for animation to finish
    await sleep(350 - processing_time);
    puzzle.style.display = "initial";
    input_form.style.display = "none";
    puzzle.classList.add('animate__animated', 'animate__fadeIn');

    first_puzzle = document.getElementById('puzzle_0');
    if (first_puzzle != null) {
        first_puzzle.focus();
    }
    else {
        info = document.createElement("div")
        info.innerHTML = "No text provided."
        info.style.marginBottom = "2em"
        puzzle.appendChild(info)
    }

    finish_btn = document.createElement("button");
    finish_btn.innerHTML = "Reveal";
    finish_btn.id = "finish";
    finish_btn.classList.add('button', 'is-primary', 'animate__animated', 'animate__fadeIn');
    finish_btn.addEventListener("click", reveal_solution, false)

    back_btn = document.createElement("button");
    back_btn.innerHTML = "Back";
    back_btn.classList.add('button', 'is-primary', 'animate__animated', 'animate__fadeIn');
    back_btn.style.marginLeft = '1em';
    back_btn.addEventListener("click", function () { location.reload() }, false)

    await sleep(100);
    puzzle.appendChild(finish_btn);
    puzzle.appendChild(back_btn);
}

function prepare_puzzle(text) {
    // This way is slower than previous implementation but it is simpler

    const special_chars = new Set([".", ",", ":", "!", "?", "-", "\"", ")"]);
    const cover = function (i, value) {
        input = document.createElement("input")
        input.id = 'puzzle_' + i
        input.classList.add('puzzle')
        input.dataset.value = value.replaceAll('’', '\'')
        input.maxLength = rm_len
        input.addEventListener("input", change_focus, { capture: true })

        return input
    }

    var ctr = 0
    const puzzle = document.getElementById('puzzle');

    for (const paragraph of text.split(/\n+/)) {
        par = document.createElement("p")
        for (const word of paragraph.split(/\s+/)) {
            ws = document.createElement("span")
            ws.classList.add('word')

            if (word.replaceAll(/[\s\(\)0-9A-Z\-\.]/g, '').length > 4) {
                var sc_ctr = 0
                while (special_chars.has(word.charAt(word.length - 1 - sc_ctr))) {
                    sc_ctr += 1
                }
                // console.log(word, sc_ctr)

                if (sc_ctr > 0) {
                    ws.appendChild(document.createTextNode(word.slice(0, -rm_len - sc_ctr)))
                    ws.appendChild(cover(ctr, word.slice(-rm_len - sc_ctr, -sc_ctr)))
                    ws.appendChild(document.createTextNode(word.slice(-sc_ctr)))
                }
                else {
                    ws.appendChild(document.createTextNode(word.slice(0, -rm_len)))
                    ws.appendChild(cover(ctr, word.slice(-rm_len)))
                }
                ctr += 1
            }
            else {
                ws.appendChild(document.createTextNode(word))
            }

            par.appendChild(ws)
            puzzle.appendChild(par)
        }
    }
}

function change_focus(change) {
    if (change.target.value.length == 2) {
        if (change.target.value == change.target.dataset.value) {
            change.target.style.borderColor = "green";

            let prefix, ctr;
            [prefix, ctr] = change.target.id.split('_')
            new_id = prefix + '_' + (Number(ctr) + 1)
            next = document.getElementById(new_id)
            if (next != null) {
                next.focus();
            }
        }
    }
}

function reveal_solution() {
    ctr = 0
    do {
        p = document.getElementById("puzzle_" + ctr)

        if (p.value != p.dataset.value) {
            p.value = p.dataset.value
        }
        ctr += 1
    } while (p != null);

}