let t = document.getElementById('t')
let topPornBtn = document.getElementById('pbtn')
let topVidBtn = document.getElementById('vbtn')
let queryBtn = document.getElementById('goQuery')

function postPromise() {
    return new Promise((res, rej) => {
        let x = document.getElementById('searchQuery').value
        res(post('/flex/search', x))
    })
}

function searchTorrents() {
    // let searchPromise = postPromise()
    // searchPromise.then((res) => {
    //     createList(res)
    // })
    let x = document.getElementById('searchQuery').value
    fetch('http://192.168.0.103:8080/flex/search?movie=' + x)
        .then((response) => {
            return response.text()
        })
        .then((res) => {
            createList(res)
        })
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
    fetch('http://192.168.0.103:8080/flex/dlFile?file=' + magnetURL)
    alert('Download started')
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
        uri.innerHTML = parsed[i].name.replace(/\./g, ' ') + " size: " + parsed[i].size + " seeds: " + parsed[i].seeders
        uri.href = '#'
            // uri.className = 'button'
        uri.onclick = () => {
            downloadFile(parsed[i].magnetLink)
        }
        t.append(uri)
    }
}
// topPornBtn.addEventListener('click', () => getTopPorn())
topVidBtn.addEventListener('click', () => getTopVideo())
queryBtn.addEventListener('click', () => searchTorrents())
setInterval(checkIsDownloading(), 3000)