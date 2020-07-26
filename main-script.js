const tableDiv = document.getElementById('pokemon-table');
const sortDiv = document.getElementById('sort-div');
const audio = new Audio('battle.mp3');
const statText = ["Health", "Attack", "Defence", "Special Attack", "Special Defence", "Speed"]
let stat = 0;
let pokeApiCalls = new Array;
const pokemons = new Array;
for (let i = 1; i <= 30; i++) {
    pokeApiCalls.push(`https://pokeapi.co/api/v2/pokemon/${i}/`);
}

Promise.all(pokeApiCalls.map(url => fetch(url)))
    .then(function(responses) {
        return Promise.all(responses.map(function(response) {
            return response.json();
        }));
    }).then(function(data) {
        for (let i = 0; i < data.length; i++) {
            pokemons.push(data[i]);
        }
        createTable(pokemons)
    }).catch(function(error) {
        console.log(error);
    })



function createNode(element) {
    return document.createElement(element);
}

function append(parent, el) {
    return parent.appendChild(el);
}

function createTable(pokemonsArr) {
    for (let i = 0; i < tableDiv.children.length; i++) {
        tableDiv.children[i].remove();
    }
    let button = document.getElementById('btn-play');
    if (button != null) {
        button.remove();
    }

    tableDiv.style.flexDirection = 'row';
    tableDiv.style.paddingBottom = '50px';

    let sortExists = document.getElementById('select-sort');
    if (!sortExists) {
        let p = createNode('p');
        p.innerHTML = 'Sort by: ';
        p.id = 'sort-p'
        append(sortDiv, p)
        let sortDropdown = createNode('select');
        sortDropdown.id = ('select-sort');
        sortDropdown.addEventListener("change", (e) => sortStat(e, pokemonsArr));
        append(sortDiv, sortDropdown);
        for (let i = 0; i < statText.length; i++) {
            let option = createNode('option');
            option.value = i;
            option.text = statText[i];
            append(sortDropdown, option);
        }
    }



    function sortStat(e, pokemonsArr) {
        if (e.target.value !== stat) {
            stat = e.target.value;
            let pokemonDivs = tableDiv.getElementsByClassName('pokemon');
            let i;
            for (i = pokemonDivs.length - 1; i >= 0; i--) {
                pokemonDivs[i].remove();
            }
            createTable(pokemonsArr);
        }

    }

    pokemons.sort((pok1, pok2) => (pok1.stats[stat].base_stat > pok2.stats[stat].base_stat) ? 1 : -1);
    appendPokemons(pokemonsArr);
}

function appendPokemons(pokemonsArr) {
    for (let i = 0; i < pokemonsArr.length; i++) {
        console.log(i)
        let div = createNode('div'),
            img = createNode('img'),
            ul = createNode('ul'),
            li_name = createNode('li'),
            li_hp = createNode('li'),
            li_ability = createNode('li'),
            li_move1 = createNode('li'),
            li_move2 = createNode('li'),
            li_move3 = createNode('li'),
            li_move4 = createNode('li'),
            li_specDefence = createNode('li'),
            li_specAttack = createNode('li'),
            li_speed = createNode('li'),
            li_defence = createNode('li'),
            li_attack = createNode('li');
        append(div, img);
        append(ul, li_name);
        append(ul, li_ability);
        append(ul, li_move1);
        append(ul, li_move2);
        append(ul, li_move3);
        append(ul, li_move4);
        append(ul, li_speed);
        append(ul, li_specDefence);
        append(ul, li_specAttack);
        append(ul, li_defence);
        append(ul, li_attack);
        append(ul, li_hp);
        append(div, ul);
        append(tableDiv, div);
        div.className = 'pokemon';
        div.id = i + 1;
        div.addEventListener("click", () => initBattle(div.id, pokemonsArr));
        img.src = pokemonsArr[i].sprites.front_default;
        li_name.innerHTML = `Name: ${pokemonsArr[i].name}`;

        let j;
        for (j = 0; j < pokemonsArr[i].abilities.length; j++) {
            if (!pokemonsArr[i].abilities[j].is_hidden) {
                li_ability.innerHTML = `Ability: ${pokemonsArr[i].abilities[0].ability.name}`;
            }
        }

        li_move1.innerHTML = `Move 1: ${pokemonsArr[i].moves[0].move.name}`;
        li_move2.innerHTML = `Move 2: ${pokemonsArr[i].moves[1].move.name}`;
        li_move3.innerHTML = `Move 3: ${pokemonsArr[i].moves[2].move.name}`;
        li_move4.innerHTML = `Move 4: ${pokemonsArr[i].moves[3].move.name}`;
        li_speed.innerHTML = `Speed: ${pokemonsArr[i].stats[5].base_stat}`;
        li_specDefence = `Special Defence: ${pokemonsArr[i].stats[4].base_stat}`
        li_specAttack = `Special Attack: ${pokemonsArr[i].stats[3].base_stat}`
        li_defence.innerHTML = `Defence: ${pokemonsArr[i].stats[2].base_stat}`;
        li_attack.innerHTML = `Attack: ${pokemonsArr[i].stats[1].base_stat}`;
        li_hp.innerHTML = `HP: ${pokemonsArr[i].stats[0].base_stat}`;
    }
}

function initBattle(chosenPokId, pokemonsArr) {
    let randPokId = getRandPokId(Number(chosenPokId), pokemonsArr.length);
    clearTable();
    startBattle(pokemonsArr[chosenPokId - 1], pokemonsArr[randPokId]);
}

function getRandPokId(chosenPokId, numOfPokemons) {
    let randPokId = null;

    while (randPokId === null || randPokId === chosenPokId - 1 || randPokId === 0) {
        randPokId = Math.round(Math.random() * (numOfPokemons))
    };

    return randPokId;
}

function clearTable() {
    let pokemonDivs = tableDiv.getElementsByClassName('pokemon');
    let i;
    for (i = pokemonDivs.length - 1; i >= 0; i--) {
        pokemonDivs[i].remove();
    }

    let sortDropdown = document.getElementById('select-sort');
    sortDropdown.remove();
    let p = document.getElementById('sort-p');
    p.remove();

    tableDiv.style.flexDirection = 'column';
    tableDiv.style.paddingBottom = '140px';
}

function startBattle(myPokemon, enemyPokemon) {

    let h1 = createNode('h1');
    h1.innerHTML = `${myPokemon.name} Vs. ${enemyPokemon.name}`;
    h1.id = 'header';

    let button = createNode("button");
    button.innerHTML = ("Play Again");
    button.id = 'btn-play';

    const canvas = createNode('canvas');
    canvas.id = 'canvas';
    canvas.className = 'pokemon';

    const ctx = canvas.getContext('2d');
    let cw = canvas.width,
        ch = canvas.height;

    let hit = new Audio('hit.wav');

    audio.play();
    audio.volume = 0.15;
    hit.volume = 0.15;

    append(tableDiv, h1);
    append(tableDiv, canvas);

    let myImg = createNode('img'),
        enemyImg = createNode('img');

    myImg.src = myPokemon.sprites.back_default;
    enemyImg.src = enemyPokemon.sprites.front_default;

    let myX = 45,
        myY = 60,
        enemyX = 165,
        enemyY = 60,
        myMaxX = 150,
        enemyMaxX = 65,
        myDir = 1,
        enemyDir = -1,
        speed = 3,
        myPokHp = myPokemon.stats[0].base_stat,
        enemyPokHp = enemyPokemon.stats[0].base_stat,
        myBarHp = -100,
        enemyBarHp = -100,
        myPokBlinking = false,
        enemyPokBlinking = false,
        damage;

    let mySpeed = myPokemon.stats[5].base_stat,
        enemySpeed = enemyPokemon.stats[5].base_stat,
        enemyFirst;

    if (mySpeed >= enemySpeed) {
        enemyFirst = false;
    } else {
        enemyFirst = true;
    }

    function start() {
        enemyImg.onload = () => requestAnimationFrame(drawBattle);
    }

    function drawBattle() {
        ctx.clearRect(0, 0, cw, ch)
        var frequency = 150;
        if (!myPokBlinking || Math.floor(Date.now() / frequency) % 2) {
            animateMyPokemon();
        }
        if (!enemyPokBlinking || Math.floor(Date.now() / frequency) % 2) {
            animateEnemyPokemon();
        }

        draw_healthbar(20, 128, 5, myBarHp, ctx);
        draw_healthbar(275, 128, 5, enemyBarHp, ctx);
        checkWinner();
    }

    function animateEnemyPokemon() {
        ctx.drawImage(enemyImg, enemyX, enemyY);
        if (enemyFirst) {
            damage = Math.round((Math.random() * 20) * (myPokemon.stats[2].base_stat / enemyPokemon.stats[1].base_stat))
            if (damage > 0) {
                //Moves
                enemyX += speed * enemyDir;
                if (enemyX < enemyMaxX) {
                    enemyDir = 1;
                    hit.play();
                    myPokBlinking = true
                    myBarHp += damage / myPokHp * 100;
                    console.log(damage)
                }
                if (enemyX > 165) {
                    myPokBlinking = false;
                    myDir = 1;
                    enemyDir = 0;
                    enemyFirst = false;
                }
            }
        }

    }

    function animateMyPokemon() {
        ctx.drawImage(myImg, myX, myY);
        if (!enemyFirst) {
            damage = Math.round((Math.random() * 20) * (enemyPokemon.stats[2].base_stat / myPokemon.stats[1].base_stat))
            if (damage > 0) {
                //Moves
                myX += speed * myDir;
                if (myX > myMaxX) {
                    myDir = -1;
                    hit.play();
                    enemyPokBlinking = true;
                    enemyBarHp += damage / enemyPokHp * 100;
                    console.log(damage);
                }
                if (myX < 45) {
                    enemyPokBlinking = false;
                    myDir = 0;
                    enemyFirst = true;
                    enemyDir = -1;
                }
            }
        }
    }

    function checkWinner() {
        if (myBarHp >= 0) {
            canvas.remove();
            h1.innerHTML = 'You Lost.'
            h1.style.color = '#cc0000';
            audio.pause();
            audio.currentTime = 0;
            button.addEventListener('click', () => createTable(pokemons));
            append(tableDiv, h1);
            append(tableDiv, button);

        } else if (enemyBarHp >= 0) {
            canvas.remove();
            h1.innerHTML = 'You Won!'
            h1.style.color = '#00cc00';
            audio.pause();
            audio.currentTime = 0;
            button.addEventListener('click', () => createTable(pokemons));
            append(tableDiv, h1);
            append(tableDiv, button);

        } else {
            requestAnimationFrame(drawBattle);
        }

    }

    function draw_healthbar(x, y, width, thickness, ctx) {
        ctx.beginPath();
        ctx.rect(x, y, width, thickness);
        if (thickness <= -50) {
            ctx.fillStyle = "green";
        } else if (thickness < -20) {
            ctx.fillStyle = "yellow";
        } else if (thickness >= -20) {
            ctx.fillStyle = "red";
        }

        ctx.closePath();
        ctx.fill();
    }

    myImg.onload = start();
}