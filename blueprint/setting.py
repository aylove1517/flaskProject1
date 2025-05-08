from flask import Blueprint, render_template
from exts import db
from model import User

bp = Blueprint("/setting", __name__, url_prefix="/setting")


@bp.route('/setting', methods=['GET'])
def setting():
    return render_template('setting.html')

