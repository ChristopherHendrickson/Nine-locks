from flask import Blueprint, jsonify, request, session, abort
import uuid


auth_router = Blueprint(__name__, 'auth')



@auth_router.route('/api/register/', methods = ['POST'])
def register():
    username = request.json.get('username')
    print('registering')
    id = uuid.uuid4().hex
    user_obj = {
            "username":username,
            "id":id
        }
    session['current_user'] = user_obj
    print(session.get('current_user'))
    return jsonify({
        "success":"success",
        "message":"Successfully registered",
        "user":user_obj
    })

@auth_router.route('/api/logout/', methods =["POST"])
def logout():
    session.pop('current_user', None)
    return jsonify({
        "status":"success",
        "message":"Successfully logged out"
    })

@auth_router.route('/api/verify/', methods=['GET'])
def verify():
    current_user = session.get('current_user', None)
    print(current_user)
    print('verify')
    if not current_user:
        abort(404, 'User not logged in or not found')
    return jsonify({
        'status': 'success',
        'message': 'User verified',
        'user': current_user
    })