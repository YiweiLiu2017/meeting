function post_info(info, url) {

    info = JSON.stringify(info);

    var request = new XMLHttpRequest();

    var method = "POST";
    url =url + "?time=" + new Date();

    request.open(method, url, true);
    request.setRequestHeader('Content-type','application/x-www-form-urlencoded');

    request.send(info);
    return  request.responseText;
}