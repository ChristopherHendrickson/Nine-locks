from flask import Blueprint, jsonify, request, session, abort
import eventlet
from flask_socketio import SocketIO, join_room, leave_room
from time import sleep

from app import app
socket_router = Blueprint(__name__, 'socket')

socket = SocketIO(app)
sid_map = {}

# SID MAP SCHEME {
#   sid1:{
#       room_id:"123",
#       user: {
#           'username':'name',
#           'id':'3q4gfw435g'    
#       }
#   },
#   sid2:{
#       room_id:"123",
#       user: {
#           'username':'name2',
#           'id':'fy563y56'    
#       }
#   }  
# }

@socket.on('connect')
def connect():
    print(f'user connected {request.sid}')
    sid = request.sid
    sid_map[sid] = {'room_id':None,'user':None}
        
@socket.on('disconnect')
def disconnect():
    sid = request.sid
    user = sid_map[sid]['user']
    room_id = sid_map[sid]['room_id']
    if room_id: # if room_id is none, the user never joined a room so there is no one to emit the disconnec to
        socket.emit('user_left',user,to=room_id)
    sid_map.pop(sid)


@socket.on('message')
def handle_message(msg,data):
    if data['type']=='msg':
        socket.send(msg,to=data['room'])

@socket.on('join')
def join(data):
    room_id = data['room_id']
    user = data['current_user']
    sid = request.sid
    join_room(room_id)
    existing_users = [u['user'] for u in sid_map.values() if u['room_id']==room_id]

    socket.emit('user_joined',{'user':user,'existing_users':existing_users}, to=room_id)
    sid_map[sid] = {'room_id':room_id,'user':user} # keep track of which room each sid is in

@socket.on('leave')
def leave(data):
    sid = request.sid
    room_id = data['room_id']
    user = data['current_user']
    socket.emit('user_left',user, to=room_id)
    leave_room(room_id)
    sid_map.pop(sid)




