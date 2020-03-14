# 往数据库里塞数据
from app import app
from extensions import db
from create_tables import Place, Camera


# 创建Meeting Room 1-10
def create_meeting_room():
    for x in range(10):
        name = 'Meeting Room ' + str(x)
        place = Place(name=name)
        db.session.add(place)
        db.session.commit()


# 创建Camera 1-40， 一个会议室4个摄像头
def create_camera():
    for x in range(40):
        name = 'Camera ' + str(x)
        camera = Camera(ip='10.98.159.'+str(x), name=name, place_name='Meeting Room ' + str(int(x/4)))
        db.session.add(camera)
        db.session.commit()


def wash_camera_ip():
    cameras = db.session.query(Camera).order_by(Camera.id).all()
    n = 10
    for camera in cameras:
        camera.ip = '000.000.000.' + str(n)
        n += 1
        db.session.commit()
    cameras = db.session.query(Camera).order_by(Camera.id).all()
    for camera in cameras:
        print(camera.ip)


def wash_camera_name():
    cameras = db.session.query(Camera).order_by(Camera.id).all()
    n = 10
    for camera in cameras:
        camera.name = 'camera' + str(n)
        n += 1
        db.session.commit()
    cameras = db.session.query(Camera).order_by(Camera.id).all()
    for camera in cameras:
        print(camera.name)


with app.app_context():
    # db.create_all()
    # db.drop_all()# 前三个函数在创建数据完之后就能注释掉了
    # create_meeting_room()
    # create_camera()
    wash_camera_ip()
    # wash_camera_name()
