class Git {

	getUser(username, callback) {
        this.get('https://api.github.com/users/' + username, (data) => callback(data));
    }

	getUserRepo(username, callback) {
        this.get('https://api.github.com/users/'+ username + '/repos?per_page=100&page=1', (data) => callback(data));
    }

    get(url, callback) {
        const xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function() {
        	if (this.readyState === 4 && this.status === 200) {
                callback(JSON.parse(this.responseText));
            } else if (this.status == 404) {
                callback();
            }
        };
        xhttp.open('GET', url, true);
        xhttp.send();
    }
}
