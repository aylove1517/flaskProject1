from flask import Blueprint, render_template, request, redirect, url_for, session, flash
from werkzeug.security import check_password_hash, generate_password_hash

from exts import db
from model import User  # 导入 User 模型

bp = Blueprint("index", __name__, url_prefix="/")


@bp.route("/")
def index():
    load_script = True
    return render_template("index.html", load_script=load_script)


@bp.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")

        if not username or not password:
            flash("用户名和密码不能为空", "error")
            return render_template("login.html")

        user = User.query.filter_by(username=username).first()

        if user:
            # 用户存在，验证密码
            if check_password_hash(user.password, password):
                session["username"] = username
                flash("登录成功！", "success")
                return redirect(url_for("index.index"))
            else:
                flash("密码错误！", "error")
        else:
            # 用户不存在，自动注册
            hashed_password = generate_password_hash(password)
            new_user = User(username=username, password=hashed_password)
            db.session.add(new_user)
            db.session.commit()

            session["username"] = username
            flash("注册成功并已登录！", "success")
            return redirect(url_for("index.index"))

    return render_template("login.html")


@bp.route("/logout")
def logout():
    session.pop("username", None)
    flash("已注销！", "success")
    return redirect(url_for("index.index"))



