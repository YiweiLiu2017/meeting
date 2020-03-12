
    // 点击会场列表
    $( "#PlaceTable tbody" ).on( "click", "tr", function() {

        //子标题(place_title类)为点击行的名称
        var place = $(this).text().trim();
        $(".place_title").text(place);

        //管理会场相机窗口
        var cameras = post_info(place,'/'); //从服务器获取会场的相机
        cameras = JSON.parse(cameras);

        var num = cameras.name.length;
        var content;
        for (var i=0;i<num;i++){
            content += '<tr>' +
                '<td>'+ cameras.name[i] + '</td>' +
                '<td>'+ cameras.ip[i] + '</td>' +
                '<td><button class="glyphicon glyphicon-facetime-video"></button></td>' +
                '<td><button class="glyphicon glyphicon-pencil" aria-hidden="true" data-toggle="modal" data-target="#EditCamera"></button></td><tr>'
        } // 将每个相机的信息写入 #camera_list 的tbody里

        var camera_list_table = $('#CameraList1 tbody');
        camera_list_table.html(content);

            //编辑相机信息
        camera_list_table.on('click', 'tr',function () {
            var camera_name = $(this.children[0]).text();
            var camera_ip = $(this.children[1]).text();

            var InputCameraIP = $('#InputCameraIP');
            var InputCameraName = $('#InputCameraName');
            InputCameraName.attr("placeholder",camera_name);
            InputCameraIP.attr("placeholder",camera_ip);
            InputCameraIP.inputmask({
                alias:"ip",
                greedy: false
            });

            InputCameraName.focus(function () {
               InputCameraName.val(camera_name)
            });
            InputCameraIP.focus(function () {
               InputCameraIP.val(camera_ip)
            });



            //提交相机信息
            $('#CameraInfoForm').on('submit', function (e) {
                $(this).submit(function () {
                    return false
                });
                if (InputCameraName.val()===camera_name && InputCameraIP.val()===camera_ip){
                    alert('相机信息不变。');
                    return true
                }

                var info ='1';
                if (InputCameraName.val()===camera_name){
                    info = '0'
                }
                if (InputCameraIP.val()===camera_ip){
                    info += '$0$0$'
                } else {
                    info += '$1$0$'
                }

                info += camera_ip + '$' + InputCameraName.val()+ '$' +InputCameraIP.val() + '$ ';
                var check = post_info(info,'/check_camera_info');
                if (check === 'name'){
                    alert('名称已被使用，请更换相机名称');
                    e.preventDefault();
                } else if (check === 'ip'){
                    alert('IP已被使用，请更换相机IP');
                    e.preventDefault();
                } else if (check === 'success'){
                    var change = post_info(info,'/change_camera_info');
                    if (change ==='success'){
                        alert('修改成功，页面即将刷新');
                        location.reload()
                    } else {
                        alert('change_camera_info 返回了failed')
                    }

                } else {
                    alert('check_camera_info 返回了zero')
                }
                return true;
            })
        });
    });
