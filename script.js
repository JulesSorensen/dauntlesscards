"use scrict";
// global variables
let intervalStarted = false;
let infoOpened = false;
let visibilityChangeEventStarted = false;

// service worker
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./serviceworker.js").catch((error) => {
        console.log("Service Worker error", error);
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    if (!sessionStorage.getItem('currentlyPlaying')) {
        document.getElementById("playButton").addEventListener("click", () => {
            sessionStorage.setItem('currentlyPlaying', true);
            document.getElementById("playButton").style.display = "none";
            document.getElementById("cardsUI").style.display = "flex";
        });
    } else {
        document.getElementById("playButton").style.display = "none";
        document.getElementById("cardsUI").style.display = "flex";
    };

    checkBehemotList();
    checkSelector();
});

const selectorListener = (event) => {
    document.getElementById("behemotImg").src = `./images/behemots/${event.target.value}.png`;

    const oldBehemotSelected = sessionStorage.getItem('behemotSelected');
    if (oldBehemotSelected) {
        const oldOption = document.getElementById(oldBehemotSelected);
        oldOption.selected = false;
        oldOption.defaultSelected = false;
        document.getElementById('behemotSelector').value = event.target.value;
    }

    const newOption = document.getElementById(event.target.value);
    newOption.selected = true;
    newOption.defaultSelected = true;
    sessionStorage.setItem('behemotSelected', event.target.value);
    document.getElementById('behemotSelector').value = event.target.value;
}

const checkSelector = () => {
    let behemotSelected = sessionStorage.getItem('behemotSelected');

    if (behemotSelected) {
        document.getElementById("behemotImg").src = `./images/behemots/${behemotSelected}.png`;
        const option = document.getElementById(behemotSelected);
        option.selected = true;
        option.defaultSelected = true;
    } else {
        document.getElementById("behemotImg").src = `./images/behemots/gnasher.png`;
        const option = document.getElementById("gnasher");
        option.selected = true;
        option.defaultSelected = true;
    }

    document.getElementById("behemotSelector").addEventListener('change', selectorListener);
}

const checkBehemotList = () => {
    const behemotList = localStorage.getItem('behemotList');

    if (behemotList && behemotList.length > 0) {
        showBehemots(JSON.parse(behemotList));
    }
}

const createBehemot = () => {
    const behemot = document.getElementById("behemotSelector").value;
    const menaceNb = parseInt(document.getElementById("menaceNb").value);

    if (menaceNb) {
        const beheArray = JSON.parse(localStorage.getItem('behemotList')) ?? [];
        const newId = (beheArray[beheArray.length - 1]?.id ?? 0) + 1;

        // spread pour ajouter
        localStorage.setItem('behemotList', JSON.stringify([...beheArray, { id: newId, behemotType: behemot, menace: menaceNb }]));
    }
    showBehemots(JSON.parse(localStorage.getItem('behemotList')), { behemot: behemot, menace: menaceNb });
    checkSelector();
}

const resetStorage = () => {
    localStorage.removeItem('bebehemotSelectedhemotList')
}

const closeInfo = () => {
    infoOpened = false;
    const createDiv = document.getElementById("newBehemot");
    createDiv.innerHTML = `
    <img id="infoIcon" onclick="getInfo()" class="icon" src="./images/icons/info.png" alt="info">
    <img src="./images/behemots/gnasher.png" alt="Behemot" id="behemotImg">
    <select name="behemotToAdd" id="behemotSelector">
        <option id="gnasher" value="gnasher">Gnasher</option>
        <option id="quillshot" value="quillshot">Quillshot</option>
        <option id="shrike" value="shrike">Shrike</option>
        <option id="skarn" value="skarn">Skarn</option>
        <option id="hellion" value="hellion">Hellion</option>
        <option id="boreus" value="boreus">Boreus</option>
        <option id="stormclaw" value="stormclaw">Stormclaw</option>
        <option id="valomyr" value="valomyr">Valomyr</option>
        <option id="shrowd" value="shrowd">Shrowd</option>
    </select>
    <label for="menaceNb">Menace</label>
    <input type="number" name="menaceNb" id="menaceNb" value="1">
    <img onclick="createBehemot()" id="addBehemot" class="icon" src="./images/icons/plus.png" alt="plus">
    `;

    checkSelector();
}

const getInfo = () => {
    const createDiv = document.getElementById("newBehemot");
    createDiv.innerHTML = `
        <img id="closeIcon" onclick="closeInfo()" class="icon" src="./images/icons/cross.png" alt="">
        <p style="width: max-content; margin-left: auto; margin-right: auto;">Mémoire actuelle ~<b id="result">?</b> GiB.</p>
        <p>Batterie: <b id="charging">?</b><br>Pourcentage: <b id="level">?</b></p>
        <p>Nombre de fois que vous avez quitté la page en changeant d'onglet ou d'application: <b id="status">0</b></p>
    `;
    infoOpened = true;
    setAllInfos();
    if (!intervalStarted) {
        intervalStarted = true;
        setInterval(setAllInfos, 10000);
    }
}

const setAllInfos = () => {
    if (infoOpened) {
        document.getElementById('result').innerHTML = navigator.deviceMemory ?? '?'

        if ('getBattery' in navigator || ('battery' in navigator && 'Promise' in window)) {
            let batteryPromise;

            if ('getBattery' in navigator) {
                batteryPromise = navigator.getBattery();
            } else {
                batteryPromise = Promise.resolve(navigator.battery);
            }

            batteryPromise.then(function (battery) {
                document.getElementById('charging').innerHTML = battery.charging ? 'branchée' : 'débranchée';
                document.getElementById('level').innerHTML = `${Math.round(battery.level * 100)}%`;
            });
        }

        if (!visibilityChangeEventStarted) {
            visibilityChangeEventStarted = true;
            let hidden, visibilityChange;

            if (typeof document.hidden !== "undefined") {
                hidden = "hidden";
                visibilityChange = "visibilitychange";
            } else if (typeof document.mozHidden !== "undefined") {
                hidden = "mozHidden";
                visibilityChange = "mozvisibilitychange";
            } else if (typeof document.msHidden !== "undefined") {
                hidden = "msHidden";
                visibilityChange = "msvisibilitychange";
            } else if (typeof document.webkitHidden !== "undefined") {
                hidden = "webkitHidden";
                visibilityChange = "webkitvisibilitychange";
            } else {
                target.innerText = 'Page Visibility API not supported.';
            }

            document.addEventListener(visibilityChange, () => {
                if (hidden in document && document[hidden] && infoOpened) {
                    document.getElementById('status').innerHTML = (parseInt(document.getElementById('status').innerHTML) + 1).toString();
                }
            }, false);
        }
    }
}

const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const showBehemots = (behemotsArr, options = { behemot: sessionStorage.getItem('behemotSelected') ?? "gnasher", menace: 1 }) => {
    const contentElement = document.getElementById('cardsUI');
    contentElement.innerHTML = `
    <div id="newBehemot" class="newBehemot">
        <img id="infoIcon" onclick="getInfo()" class="icon" src="./images/icons/info.png" alt="info">
        <img src="./images/behemots/${options.behemot.toLowerCase()}.png" alt="Behemot" id="behemotImg">
        <select name="behemotToAdd" id="behemotSelector">
            <option ${options.behemot.toLowerCase() == 'gnasher' ? 'defaultSelected' : ''} ${options.behemot.toLowerCase() == 'gnasher' ? 'selected' : ''}  id="gnasher" value="gnasher">Gnasher</option>
            <option ${options.behemot.toLowerCase() == 'quillshot' ? 'defaultSelected' : ''} ${options.behemot.toLowerCase() == 'quillshot' ? 'selected' : ''}  id="quillshot" value="quillshot">Quillshot</option>
            <option ${options.behemot.toLowerCase() == 'shrike' ? 'defaultSelected' : ''} ${options.behemot.toLowerCase() == 'shrike' ? 'selected' : ''}  id="shrike" value="shrike">Shrike</option>
            <option ${options.behemot.toLowerCase() == 'skarn' ? 'defaultSelected' : ''} ${options.behemot.toLowerCase() == 'skarn' ? 'selected' : ''}  id="skarn" value="skarn">Skarn</option>
            <option ${options.behemot.toLowerCase() == 'hellion' ? 'defaultSelected' : ''} ${options.behemot.toLowerCase() == 'hellion' ? 'selected' : ''}  id="hellion" value="hellion">Hellion</option>
            <option ${options.behemot.toLowerCase() == 'boreus' ? 'defaultSelected' : ''} ${options.behemot.toLowerCase() == 'boreus' ? 'selected' : ''}  id="boreus" value="boreus">Boreus</option>
            <option ${options.behemot.toLowerCase() == 'stormclaw' ? 'defaultSelected' : ''} ${options.behemot.toLowerCase() == 'stormclaw' ? 'selected' : ''}  id="stormclaw" value="stormclaw">Stormclaw</option>
            <option ${options.behemot.toLowerCase() == 'valomyr' ? 'defaultSelected' : ''} ${options.behemot.toLowerCase() == 'valomyr' ? 'selected' : ''}  id="valomyr" value="valomyr">Valomyr</option>
            <option ${options.behemot.toLowerCase() == 'shrowd' ? 'defaultSelected' : ''} ${options.behemot.toLowerCase() == 'shrowd' ? 'selected' : ''}  id="shrowd" value="shrowd">Shrowd</option>
        </select>
        <label for="menaceNb">Menace</label>
        <input type="number" name="menaceNb" id="menaceNb" value=${options.menace}>
        <img onclick="createBehemot()" id="addBehemot" class="icon" src="./images/icons/plus.png" alt="plus">
    </div>
    `;

    for (const curBehemot of behemotsArr) {
        const name = capitalizeFirstLetter(curBehemot.behemotType);

        contentElement.innerHTML += `
        <div class='behemot' id='card-${curBehemot.id}'>
            <h1>${name}</h1>
            <img id='behemotImg' src="./images/behemots/${curBehemot.behemotType}.png" alt="Picture of ${name}">
            <h3>${name}</h3>
            <p>Menace: ${curBehemot.menace}</p>
            <div class='buttonsDiv' id='buttonsDiv-${curBehemot.id}'>
                <img class="icon" src="./images/icons/camera.png" alt="photo" onclick="cameraOn('${curBehemot.id}', '${curBehemot.behemotType}')"></img>
                <img class="icon" src="./images/icons/pen.png" alt="edit" onclick="editCharacter('${curBehemot.id}')"></img>
                <img class="icon" src="./images/icons/trash.png" alt="delete" onclick="deleteCharacter('${curBehemot.id}')"></img>
            </div>
        </div>
        `;
    }

}

const resetCard = (id) => {
    const beheArray = JSON.parse(localStorage.getItem('behemotList')) ?? [];

    const behemot = beheArray.find((element) => { element.id == id });

    if (behemot) {
        const name = capitalizeFirstLetter(behemot.behemotType);

        document.getElementById(`card-${behemot.id}`).innerHTML += `
            <h1>${name}</h1>
            <img id='behemotImg-${id}' class="behemotImg" src="./images/behemots/${behemot.behemotType}.png" alt="Picture of ${name}">
            <h3>${name}</h3>
            <p>Menace: ${behemot.menace}</p>
            <div class='buttonsDiv' id='buttonsDiv-${behemot.id}'>
                <img class="icon" src="./images/icons/camera.png" alt="photo" onclick="cameraOn('${behemot.id}', '${behemot.behemotType}')"></img>
                <img class="icon" src="./images/icons/pen.png" alt="edit" onclick="editCharacter('${behemot.id}')"></img>
                <img class="icon" src="./images/icons/trash.png" alt="delete" onclick="deleteCharacter('${behemot.id}')"></img>
            </div>
        `
    }

    checkSelector();
}

const editEventListener = (id, create = true) => {
    const element = document.getElementById(`behemotSelector-${id}`);
    const listenerEditImg = (event) => {
        document.getElementById(`behemotImgEdit-${id}`).src = `./images/behemots/${event.target.value}.png`;
    }
    if (create) {
        element.addEventListener('change', listenerEditImg);
    } else {
        element.removeEventListener('change', listenerEditImg);
    }
}

const editCharacter = (id) => {
    const contentElement = document.getElementById(`card-${id}`);
    let beheArray = localStorage.getItem('behemotList') ?? '[]';
    beheArray = JSON.parse(beheArray);
    let behemot = false;

    beheArray.forEach(curBehemot => {
        if (curBehemot.id == id) {
            behemot = curBehemot;
        }
    });
    if (behemot) {
        contentElement.innerHTML = `
            <h1 style='color: #025514;'>EDIT</h1>
            <div class='editDiv-${behemot.id}'>
                <img src="./images/behemots/${behemot.behemotType}.png" alt="Behemot"  class="behemotImg" id="behemotImgEdit-${behemot.id}">
                <select name="behemotToAdd" id="behemotSelector-${behemot.id}">
                    <option ${behemot.behemotType == 'gnasher' ? 'defaultSelected' : ''} ${behemot.behemotType == 'gnasher' ? 'selected' : ''} id="gnasher" value="gnasher">Gnasher</option>
                    <option ${behemot.behemotType == 'quillshot' ? 'defaultSelected' : ''} ${behemot.behemotType == 'quillshot' ? 'selected' : ''} id="quillshot" value="quillshot">Quillshot</option>
                    <option ${behemot.behemotType == 'shrike' ? 'defaultSelected' : ''} ${behemot.behemotType == 'shrike' ? 'selected' : ''} id="shrike" value="shrike">Shrike</option>
                    <option ${behemot.behemotType == 'skarn' ? 'defaultSelected' : ''} ${behemot.behemotType == 'skarn' ? 'selected' : ''} id="skarn" value="skarn">Skarn</option>
                    <option ${behemot.behemotType == 'hellion' ? 'defaultSelected' : ''} ${behemot.behemotType == 'hellion' ? 'selected' : ''} id="hellion" value="hellion">Hellion</option>
                    <option ${behemot.behemotType == 'boreus' ? 'defaultSelected' : ''} ${behemot.behemotType == 'boreus' ? 'selected' : ''} id="boreus" value="boreus">Boreus</option>
                    <option ${behemot.behemotType == 'stormclaw' ? 'defaultSelected' : ''} ${behemot.behemotType == 'stormclaw' ? 'selected' : ''} id="stormclaw" value="stormclaw">Stormclaw</option>
                    <option ${behemot.behemotType == 'valomyr' ? 'defaultSelected' : ''} ${behemot.behemotType == 'valomyr' ? 'selected' : ''} id="valomyr" value="valomyr">Valomyr</option>
                    <option ${behemot.behemotType == 'shrowd' ? 'defaultSelected' : ''} ${behemot.behemotType == 'shrowd' ? 'selected' : ''} id="shrowd" value="shrowd">Shrowd</option>
                </select><br>
                <label for="menaceNb">Menace</label>
                <input type="number" name="menaceNb" id="menaceNb-${behemot.id}" value=${behemot.menace}>
            </div>
            <div class='buttonsDivEdit'>
                <img onclick="resetCard('${behemot.id}')" class="icon" src="./images/icons/cross.png" alt="cancel">
                <img onclick="editSaveBehemot('${behemot.id}')" class="icon" src="./images/icons/save.png" alt="confirm">
            </div>
        `;
        editEventListener(behemot.id);
    }
}

const editSaveBehemot = (id) => {
    let behemot = document.getElementById(`behemotSelector-${id}`).value || false;
    let menaceNb = parseInt(document.getElementById(`menaceNb-${id}`).value) || false;
    let beheArray = JSON.parse(localStorage.getItem('behemotList')) || [];

    beheArray = beheArray.map((curBehemot) => {
        let newBehe = structuredClone(curBehemot)
        if (newBehe.id == id) {
            editEventListener(id, false);
            if (behemot && menaceNb) {
                newBehe.behemotType = behemot;
                newBehe.menace = menaceNb;
            }
        }
        return newBehe;
    });

    localStorage.setItem('behemotList', JSON.stringify(beheArray));

    showBehemots(beheArray);
    checkSelector();
}

const cameraOn = async (id, name) => {
    const contentElement = document.getElementById(`card-${id}`);
    contentElement.innerHTML = `
    <div id="dataurl-container">
        <video id="video" width="320" height="240" autoplay></video>
    </div>
    <div class='buttonsDiv'>
        <img id="click-cross-${id}" onclick="resetCard('${id}')" class="icon" src="./images/icons/cross.png" alt="cancel">
        <img id="click-photo-${id}" class="icon" src="./images/icons/camera.png" alt="cancel">
    </div>
    `;

    const videoDiv = document.getElementById("dataurl-container");
    const video = document.querySelector("#video");
    const click_button = document.querySelector(`#click-photo-${id}`);

    let stream = null;

    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    } catch (error) {
        // TODO afficher une erreur
        return;
    }

    video.srcObject = stream;

    click_button.addEventListener('click', async () => {
        videoDiv.innerHTML = '<canvas id="canvas" width="320" height="240"></canvas>';
        const canvas = document.getElementById("canvas");
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        let image_data_url = canvas.toDataURL('image/jpeg');

        downloadURI(image_data_url, `${name}.png`);

        videoDiv.innerHTML = '<video id="video" width="320" height="240" autoplay></video>';
        video = document.querySelector("#video");
        video.srcObject = stream;
    });
}

const downloadURI = (uri, name) => {
    let link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    delete link;
}

const deleteCharacter = (id) => {
    const beheArray = JSON.parse(localStorage.getItem('behemotList')) ?? [];

    const indexToDelete = beheArray.find((element) => { console.log(element); return element.id == id });

    const newBeheArray = beheArray.filter((item) => {
        return true;
        // return item.id !== indexToDelete.id
    });

    localStorage.setItem('behemotList', JSON.stringify(newBeheArray));

    showBehemots(beheArray);
    checkSelector();
}