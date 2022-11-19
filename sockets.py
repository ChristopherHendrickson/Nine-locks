from flask import Blueprint, jsonify, request, session, abort
import eventlet
from flask_socketio import SocketIO, join_room, leave_room
from time import sleep

from app import app
socket_router = Blueprint(__name__, 'socket')

socket = SocketIO(app)
sid_map = {}

@socket.on('connect')
def connect():
    print(f'user connected {request.sid}')
    
        
@socket.on('disconnect')
def disconnect():
    sid = request.sid
    user_id = sid_map[sid]['user_id']
    room_id = sid_map[sid]['room_id']
    socket.emit('user_left',user_id,to=room_id)
    sid_map.pop(sid)


@socket.on('message')
def handle_message(msg,data):
    if data['type']=='msg':
        print(data['room'])
        socket.send(msg,to=data['room'])

@socket.on('join')
def join(data):
    room_id = data['room_id']
    user_id = data['current_user']['id']
    sid = request.sid
    join_room(room_id)
    existing_users = [u['user_id'] for u in sid_map.values() if u['room_id']==room_id]
    # existing_users=[uid for uid in sid_map]

    socket.emit('user_joined',{'user_id':user_id,'existing_users':existing_users}, to=room_id)
    sid_map[sid] = {'room_id':room_id,'user_id':user_id} # keep track of which room each sid is in

@socket.on('leave')
def leave(data):
    sid = request.sid
    room_id = data['room_id']
    user_id = data['current_user']['id']
    socket.emit('user_left',user_id, to=room_id)
    leave_room(room_id)
    sid_map.pop(sid)




# @socket_router.route('/api/joingroup/<group_id>', methods=['PUT'])
# def join_group(group_id):
#     # emit to others already in group that a new use has joined
#     # return the group id and 
#     socket.join(group_id)
#     socket.to(group_id).message('user Added')
