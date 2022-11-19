from flask import Blueprint, jsonify, request, session, abort
import eventlet
from flask_socketio import SocketIO, join_room, leave_room
from time import sleep

from app import app
socket_router = Blueprint(__name__, 'socket')

socket = SocketIO(app, logger=False)



@socket.on('connect')
def connect():
    print(f'user connected {request.sid}')
    
        
@socket.on('disconnect')
def disconnect():
    print('user disconnected')

@socket.on('message')
def handle_message(msg,data):
    if data['room']=='msg':
        print(data['room'])
        socket.send(msg,to=data['room'])

@socket.on('join')
def join(data):
    join_room(data['room_id'])
    socket.emit('user_joined',data['current_user']['id'], to=data['room_id'])

@socket.on('leave')
def leave(data):
    
    socket.emit('user_left',data['current_user']['id'],broadcast=True, to=data['room_id'])
    leave_room(data['room_id'])





# @socket_router.route('/api/joingroup/<group_id>', methods=['PUT'])
# def join_group(group_id):
#     # emit to others already in group that a new use has joined
#     # return the group id and 
#     socket.join(group_id)
#     socket.to(group_id).message('user Added')
