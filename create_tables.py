from extensions import db

class Place(db.Model):
    __tablename__ = 'place'
    name = db.Column(db.String(200), primary_key=True, nullable=False, unique=True, default="会议地点")
    cameras = db.relationship('Camera', backref='place', lazy=True)


class Camera(db.Model):
    __tablename__ = 'camera'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    ip = db.Column(db.String(200), nullable=False)
    name = db.Column(db.String(200))
    place_name = db.Column(db.String(200), db.ForeignKey('place.name'))

