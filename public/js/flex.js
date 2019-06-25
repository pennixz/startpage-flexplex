function getTopVideo() {
    let t = document.getElementById('t')
    fetch('http://localhost:8080/flex/topVideoTorrents')
        .then((response) => {
            return response.text()
        })
        .then((res) => {
            createList(res)
        })
}

function getTopPorn() {
    let t = document.getElementById('t')
    fetch('http://localhost:8080/flex/topPornTorrents')
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
    console.log(magnetURL)
}

function createList(obj) {
    let t = document.getElementById('t')
    let parsed = JSON.parse(obj)
    for (let i = 0; i < parsed.length; i++) {
        let newElement = document.createElement('li')
        let uri = document.createElement('a')
        uri.innerHTML = parsed[i].name.replace(/\./g, ' ')
        uri.href = '#'
        uri.onclick = () => {
            downloadFile(parsed[i].magnetLink)
            console.log(parsed[i].magnetLink)
        }
        newElement.append(uri)
        t.append(newElement)
    }
}