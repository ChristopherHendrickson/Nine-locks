from flask import Blueprint, jsonify, request, session, abort
import uuid


auth_router = Blueprint(__name__, 'auth')



@auth_router.route('/api/register/', methods = ['POST'])
def register():
    username = request.json.get('username')
    id = uuid.uuid4().hex
    user_obj = {
            "username":username,
            "id":id
        }
    return jsonify({
        "success":"success",
        "message":"Successfully registered",
        "user":user_obj
    })

