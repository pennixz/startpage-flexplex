let t = document.getElementById('t')
let topPornBtn = document.getElementById('pbtn')
let topVidBtn = document.getElementById('vbtn')
let queryBtn = document.getElementById('goQuery')

function workPlz() {
    searchTorrents()
}

function searchTorrents() {
    let x = document.getElementById('searchQuery').value
    post('/flex/search', x)
}

function getTopVideo() {
    fetch('http://192.168.0.103:8080/flex/topVideoTorrents')
        .then((response) => {
            return response.text()
        })
        .then((res) => {
            createList(res)
        })
}

function getTopPorn() {
    fetch('http://192.168.0.103:8080/flex/topPornTorrents')
        .then((response) => {
            return response.text()
        })
        .then((res) => {
            createList(res)
        })
}

function post(path, params, method = 'post') {
    const form = document.createElement('form');
    form.method = method;
    form.action = path;
    const hiddenField = document.createElement('input');
    hiddenField.type = 'hidden';
    hiddenField.name = 'key';
    hiddenField.value = params;
    console.log(hiddenField.value)
    form.appendChild(hiddenField);
    document.body.appendChild(form);
    form.submit();
}

function downloadFile(magnetURL) {
    post('/flex/dlFile', magnetURL)
}

function checkIsDownloading() {
    fetch('http://192.168.0.103:8080/flex/downloading')
        .then((response) => {
            return response.text()
        })
        .then((res) => {
            document.getElementById('dlspan').innerHTML = res
        })
}

function createList(obj) {
    let t = document.getElementById('t')
    t.innerHTML = ''
    let parsed = JSON.parse(obj)
    for (let i = 0; i < parsed.length; i++) {
        let uri = document.createElement('a')
        uri.innerHTML = parsed[i].name.replace(/\./g, ' ') + " size: " + parsed[i].size
        uri.href = '#'
            // uri.className = 'button'
        uri.onclick = () => {
            downloadFile(parsed[i].magnetLink)
            console.log(parsed[i].magnetLink)
        }
        t.append(uri)
    }
}
topPornBtn.addEventListener('click', () => getTopPorn())
topVidBtn.addEventListener('click', () => getTopVideo())
queryBtn.addEventListener('click', () => workPlz())
setInterval(checkIsDownloading(), 3000)