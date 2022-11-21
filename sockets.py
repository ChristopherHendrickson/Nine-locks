from flask import Blueprint, jsonify, request, session, abort
import eventlet
from flask_socketio import SocketIO, join_room, leave_room
from time import sleep

from app import app
socket_router = Blueprint(__name__, 'socket')

socket = SocketIO(app)
socket.sid_map = {}
socket.hosted_rooms = {}

# SID MAP SCHEMA {
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
    socket.sid_map[sid] = {'room_id':None,'user':None}
        
@socket.on('disconnect')
def disconnect():
    print('disconnecting user')
    sid = request.sid
    user = socket.sid_map[sid]['user']
    room_id = socket.sid_map[sid]['room_id']
    if room_id: # if room_id is none, the user never joined a room so there is no one to emit the disconnec to
        socket.emit('user_left',user,to=room_id)
    socket.sid_map.pop(sid)
    print('new sid map from dc',socket.sid_map)


@socket.on('msg')
def handle_message(data):
    text = data['text']
    room=data['room_id']
    sender=data['sender']
    socket.emit('msg',{'text':text,'sender':sender},to=room)
    

@socket.on('join')
def join(data):
    # If it is an attempted request to hosdt a game, room_id = user_id
    room_id = data['room_id']
    user = data['current_user']
    sid = request.sid



    join_room(room_id)




    existing_users = [u['user'] for u in socket.sid_map.values() if u['room_id']==room_id]

    socket.emit('user_joined',{'user':user,'existing_users':existing_users}, to=room_id)
    socket.sid_map[sid] = {'room_id':room_id,'user':user} # keep track of which room each sid is in
    print('new sid map',socket.sid_map)



@socket.on('leave')
def leave(data):
    print('--------------leave route---------------',request.sid)
    sid = request.sid
    room_id = data.get('room_id')
    user = data['current_user']
    socket.emit('user_left',user, to=room_id)
    # Landing page emit does not have a room id becuase room state is not available there
    # so requests without a room_id are just for handling presses on the back button abck to landing
    # to ensure they are proplery removed from any room the sid_map says they were in
    if not room_id:
        sid_map_data = socket.sid_map.get(sid)
        if sid_map_data:
            room_id = sid_map_data.get('room_id')

    print('LEAVING ROOM',room_id)
    print('SID',sid)
    print('SIDMAP',socket.sid_map)
    if room_id:
        # Leaving a room of id 'None' seems to disconnect the socket entirely so want to avoid that
        leave_room(room_id)

    socket.sid_map[sid] = {'room_id':None,'user':None}



