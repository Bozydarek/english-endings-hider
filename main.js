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


    const puzzle = document.getElementById('puzzle');
    puzzle.innerHTML = prepare_puzzle(text);
    // puzzle.appendChild(document.createTextNode(text));

    await sleep(800);
    puzzle.style.display = "initial";
    input_form.style.display = "none";
    puzzle.classList.add('animate__animated', 'animate__fadeIn');

    document.getElementById('puzzle_0').focus();

    finish_btn = document.createElement("button");
    finish_btn.innerHTML = "Reveal";
    finish_btn.id = "finish";
    finish_btn.classList.add('button', 'is-primary', 'animate__animated', 'animate__fadeIn');
    finish_btn.addEventListener("click", reveal_solution, false)

    back_btn = document.createElement("button");
    back_btn.innerHTML = "Back";
    back_btn.classList.add('button', 'is-primary', 'animate__animated', 'animate__fadeIn');
    back_btn.style.marginLeft = '1em';
    back_btn.addEventListener("click", function(){ location.reload() }, false)

    await sleep(100);
    puzzle.appendChild(finish_btn);
    puzzle.appendChild(back_btn);
}

function prepare_puzzle(text) {
    // var article = document.getElementsByTagName('article');
    const special_chars = new Set([".", ",", ":", "!", "?", "-", "\"", ")"]);
    const cover = function(i, value) {
        return "<input id='puzzle_"+ i + "' class='puzzle' maxlength=" + rm_len + " oninput='change_focus(event)' data-value='" + value + "'>";
    }
    var ctr = 0

    var paragraphs = text.split(/\n+/);
    new_text = paragraphs.map(function (p) {
        var prepared_text = p.split(/\s+/);
        // console.log(prepared_text);
        return prepared_text.map(function (word) {
            if (word.replaceAll(/[\s\(\)0-9A-Z\-\.]/g, '').length > 4) {
                if (special_chars.has(word.slice(-1))) {
                    new_word = word.slice(0, -rm_len - 1) + cover(ctr, word.slice(-rm_len - 1, -1)) + word.slice(-1);
                }
                else {
                    new_word = word.slice(0, -rm_len) + cover(ctr, word.slice(-rm_len));
                }
                ctr += 1
                // console.log(word + "\t" + new_word);
                return new_word;
            }
            return word;
        }).join(' ');
    }).join('</p><p>');

    return '<p>' + new_text + '</p>'
}

function change_focus(change) {
    if (change.target.value.length == 2) {
        if (change.target.value == change.target.dataset.value) {
            change.target.style.borderColor = "green";

            let prefix, ctr;
            [prefix, ctr] = change.target.id.split('_')
            new_id = prefix + '_' + (Number(ctr) + 1)
            next = document.getElementById(new_id)
            if (next != null){
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