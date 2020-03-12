$(document).ready(function () {

$('#CameraList2 tbody').on('click', 'tr', function () {
    alert('hello');
    var camera_name = $(this.children[0]).text();
    var camera_ip = $(this.children[1]).text();
    var camera_place = $(this.children[2]).text();
    var InputCameraIP = $('#InputCameraIP2');
    var InputCameraName = $('#InputCameraName2');
    var InputCameraPlace = $('#InputCameraPlace2');
    InputCameraName.attr("placeholder", camera_name);
    InputCameraPlace.attr("placeholder", camera_place);
    InputCameraIP.attr("placeholder", camera_ip);
    InputCameraIP.inputmask({
        alias: "ip",
        greedy: false
    });

    InputCameraName.focus(function () {
        InputCameraName.val(camera_name)
    });
    InputCameraIP.focus(function () {
        InputCameraIP.val(camera_ip)
    });
    InputCameraPlace.focus(function () {
        InputCameraPlace.val(camera_place)
    });

    $('#CameraInfoForm2').on('submit', function (e) {
        $(this).submit(function () {
            return false;
        });

        if (InputCameraName.val() === camera_name &&
            InputCameraIP.val() === camera_ip &&
            InputCameraPlace.val() === camera_place) {
            alert('相机信息不变。');
            return true
        }

        var info = '1';
        if (InputCameraName.val() === camera_name) {
            info = '0'
        }
        if (InputCameraIP.val() === camera_ip) {
            info += '$0'
        } else {
            info += '$1'
        }
        if (InputCameraPlace.val() === camera_place) {
            info += '$0$'
        } else {
            info += '$1$'
        }

        info += camera_ip + '$' +
            InputCameraName.val() + '$' +
            InputCameraIP.val() + '$' +
            InputCameraPlace.val();

        var check = post_info(info, '/check_camera_info');

        switch (check) {
            case "name":
                e.preventDefault();
                alert('名称已被使用，请更换相机名称');
                break;
            case "ip":
                e.preventDefault();
                alert('IP已被使用，请更换相机IP');
                break;
            case "place":
                e.preventDefault();
                alert('该会场不存在');
                break;
            case "success":
                var change = post_info(info, '/change_camera_info');
                if (change === 'success') {
                    alert('修改成功，页面即将刷新');
                    location.reload()
                } else {
                    alert('change_camera_info 返回了failed')
                }
                break;
            default:
                    alert('check_camera_info 返回了zero')

        return true;





        }
    })

});

$('#CreateCameraButton').on('click', function () {
    $('#InputCameraIP3').inputmask({
        alias: "ip",
        greedy: false
    });

    $('#CameraInfoForm3').on('submit', function (e) {
        $(this).submit(function () {
            return false;
        });
        var info = '1$1$1$ $'
        info += $('#InputCameraName3').val() + '$' +
            $('#InputCameraIP3').val() + '$' +
            $('#InputCameraPlace3').val();

        var check = post_info(info, '/check_camera_info');

        switch (check) {
            case "name":
                e.preventDefault();
                alert('名称已被使用，请更换相机名称');
                break;
            case "ip":
                e.preventDefault();
                alert('IP已被使用，请更换相机IP');
                break;
            case "place":
                e.preventDefault();
                alert('该会场不存在');
                break;
            case "success":
                var create = post_info(info, '/create_camera');
                if (create === 'success') {
                    alert('创建相机成功，页面即将刷新');
                    location.reload()
                } else {
                    alert('create_camera_info 返回了failed')
                }
                break;
            default:
                    alert('check_camera_info 返回了zero')

        return true;





        }


    })
});
});
