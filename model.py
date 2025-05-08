from exts import db


class User(db.Model):
    __tablename__ = 'users'  # MySQL 里的表名

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(100), nullable=False, unique=True)  # 玩家名称
    password = db.Column(db.String(255), nullable=False)  # 用户密码
    score = db.Column(db.Integer, default=0)  # 排名分数

    def __repr__(self):
        return f'<User {self.username}, Score: {self.score}>'

