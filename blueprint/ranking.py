from flask import Blueprint, render_template
from exts import db
from model import User

bp = Blueprint("ranking", __name__, url_prefix="/ranking")


@bp.route("/")
def ranking():
    # 从数据库获取排名数据，按照分数降序排列
    ranking_data = User.query.order_by(User.score.desc()).limit(10).all()

    # 生成 (排名, 用户名, 分数) 的列表
    ranked_players = [(index + 1, user.username, user.score) for index, user in enumerate(ranking_data)]

    return render_template("ranking.html", ranking=ranked_players)
