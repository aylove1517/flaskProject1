from flask import Flask, request, render_template, session, flash, redirect
from flask_migrate import Migrate
import config
from blueprint.index import bp as index_bp
from blueprint.ranking import bp as rank_bp
from blueprint.setting import bp as set_bp
from exts import db

app = Flask(__name__)
app.config.from_object(config)
db.init_app(app)

app.register_blueprint(index_bp)
app.register_blueprint(set_bp)
app.register_blueprint(rank_bp)
migrate = Migrate(app, db)


@app.route('/multiply')
def hello_world():  # put application's code here
    return render_template("index.html")


@app.route('/setting')
def setting():  # put application's code here
    return render_template("setting.html")


@app.route('/guest')
def guest_login():
    session['username'] = '游客'
    flash('欢迎以游客身份体验游戏！', 'info')
    return redirect('/')


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5005)
