from flask import Flask,render_template,request,redirect,url_for
from flask_sqlalchemy import SQLAlchemy
import config
from create_tables import Place,Camera
import json

app = Flask(__name__)
app.config.from_object(config)
# app.config['SQLALCHEMY_ECHO'] = True
db = SQLAlchemy(app)

# 会场管理页面
@app.route('/', methods=['GET', 'POST'])
def place():
    # 从数据库里调用所有会场
    places = Place.query.order_by(Place.name).all()
    # 如果页面查询某个会场的相机：
    if request.method == 'POST':
        # 获得会场名称，起名place
        name = json.loads(request.get_data())
        name = name.strip()
        place = Place.query.filter_by(name=name).first()
# question??
        db.session.remove()
        # 给定相机list，相机名字的list叫cameras_name，相机ip的list叫cameras_ip
        cameras_name = []
        cameras_ip = []
        for camera in place.cameras:
            cameras_name.append(camera.name)
            cameras_ip.append(camera.ip)

        cameras = {'name': cameras_name, 'ip': cameras_ip}
        return json.dumps(cameras)

    return render_template('place.html', places=places)


@app.route('/check_camera_info', methods=['POST'])
def check_camera_info():
    # 如果要求验证新建的或更改的相机信息是否合法:
    if request.method == 'POST':
        check_name = None
        check_ip = None
        check_place = 0

        info = json.loads(request.get_data())
        info = info.split('$')
        # 回传信息的构成举例：'1$1$1$camera_ip$camera_name$camera_ip$camera_place'
        # 1代表修改过，所以需要检查，0代表不变，不用检查
        # [0name,1ip,2place, 3camera current ip, 4camera (new) name, 5camera (new) ip, 6camera new place]
        if info[0]=='1':
            check_name = Camera.query.filter_by(name=info[4]).first()
        if info[1]=='1':
            check_ip = Camera.query.filter_by(ip=info[5]).first()
        if info[2]=='1':
            check_place = Camera.query.filter_by(place_name=info[6]).first()

        if check_name is not None:
            return 'name'
        if check_ip is not None:
            return 'ip'
        if check_place is None:
            return 'place'

        return 'success'
    return 'zero'

# 检查完之后就可以改名字了，在check之后再转到这里
@app.route('/change_camera_info',methods=['POST'])
def change_camera_info():
    if request.method == 'POST':

        info = json.loads(request.get_data())
        info = info.split('$')

        camera = db.session.query(Camera).filter_by(ip=info[3]).first()
        # 同理，如果1则为有变动，当即修改，如果为0则不用管
        if info[0] == '1':
            camera.name = info[4]
        if info[1] == '1':
            camera.ip = info[5]
        if info[2] == '1':
            camera.place_name = info[6]

        db.session.commit()
        return 'success'
    return 'failed'

# 同理，检查完就可以创建相机了，在check之后再转到这里
@app.route('/create_camera',methods=['POST'])
def create_camera():
    if request.method == 'POST':

        info = json.loads(request.get_data())
        info = info.split('$')

        camera = Camera(ip=info[5], name=info[4], place_name=info[6])
        db.session.add(camera)
        db.session.commit()
        return 'success'
    return 'failed'


@app.route('/camera')
def camera():
    # 从数据库读取所有的相机信息
    cameras = Camera.query.order_by(Camera.id).all()

    return render_template('camera.html', cameras=cameras)


if __name__ == '__main__':
    app.run()
