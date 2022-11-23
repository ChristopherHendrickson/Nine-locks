import os
from flask import Flask, Blueprint, request, session, abort
from flask_socketio import SocketIO, join_room, leave_room



app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')


from auth import auth_router

app.register_blueprint(auth_router)


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

# HOSTED ROOMS SCHEMA
    # {
    #   room_id: host_id,
    #   room_id: host_id
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
    user = socket.sid_map[sid].get('user')
    if user: # If the sid is not connected to any rooms, user is None
        room_id = socket.sid_map[sid].get('room_id')
        socket.emit('user_left',user,to=room_id)
        print('user was host',room_id == user.get('id'))
        print('user was host',room_id,user.get('id'))
        print('user was',user)
        if room_id == user.get('id'):
            socket.hosted_rooms.pop(room_id)
            users_to_kick = [(sid,u['user']) for sid,u in socket.sid_map.items() if (u['room_id']==room_id and u['user']['id']!=user['id'])]
            print(users_to_kick,'userstokick')  
            for u in users_to_kick:
                print('kickinh user',u[1]['username'])
                socket.emit('user_left',u[1],to=u[0]) #kick all users in the room if the host leaves
                socket.emit('error',{'status':404,'message':'Game Closed - Host Disconnected'},to=u[0])
    
    socket.sid_map.pop(sid)

@socket.on('msg')
def handle_message(data):
    text = data['text']
    room=data['room_id']
    sender=data['sender']
    socket.emit('msg',{'text':text,'sender':sender},to=room)
    print('forwarding message')

@socket.on('join')
def join(data):
    # If it is an attempted request to hosdt a game, room_id = user_id
    room_id = data['room_id']
    user = data['current_user']
    sid = request.sid

    if room_id == user.get('id'):
        socket.hosted_rooms[room_id] = {'host':user['id'],'started':False}


    elif not socket.hosted_rooms.get(room_id):
        socket.emit('error',{'status':404,'message':'Room Not Found'},to=sid)
        return    

    elif socket.hosted_rooms.get(room_id).get('started'):
        socket.emit('error',{'status':403,'message':'Can Not Join. Game Is In Progress'},to=sid)
        return

    existing_users = [u['user'] for u in socket.sid_map.values() if u['room_id']==room_id]
    socket.emit('user_joined',{'user':user,'existing_users':existing_users,'room_id':room_id}, to=[room_id,sid])
    socket.sid_map[sid] = {'room_id':room_id,'user':user} # keep track of which room each sid is in
    join_room(room_id)

    print('Joining Room')

@socket.on('check_room_hosted')
def check_room_hosted(data):
    sid = request.sid
    room_id = data.get('room_id')
    print('hitting check room hosted')
    if not socket.hosted_rooms.get(room_id):
        print('room not hosted')
        socket.emit('error',{'status':404,'message':'Room Not Found'},to=sid)   
    elif socket.hosted_rooms.get(room_id).get('started'):
        socket.emit('error',{'status':403,'message':'Can Not Join. Game Is In Progress'},to=sid)      
    else:
        socket.emit('hosted_confirmation',{'status':200,'room_id':room_id},to=sid)
        

@socket.on('leave')
def leave(data):
    print('--------------leave route---------------',request.sid,data)
    sid = request.sid
    room_id = socket.sid_map.get(sid).get('room_id')
    user = data.get('current_user')
    
    if room_id:
        socket.emit('user_left',user, to=room_id)
        leave_room(room_id)
    
    
    if room_id == user.get('id'):
        socket.hosted_rooms.pop(room_id) # Room is no longer hosted

        # iterate over all users in game, and tell them host have left, send an error message saying game was closed by host

        users_to_kick = [(sid,u['user']) for sid,u in socket.sid_map.items() if (u['room_id']==room_id and u['user']['id']!=user['id'])]
        print(users_to_kick,'userstokick')  
        for u in users_to_kick:
            print('kicking user',u[1]['username'])
            socket.emit('user_left',u[1],to=u[0]) #kick all users in the room if the host leaves
            socket.emit('error',{'status':403,'message':'Game Disbanded By Host'},to=u[0])
            # Users that are kicked will fire their own emit to 'leave', and disconnect from the socket room

    socket.sid_map[sid] = {'room_id':None,'user':None}

@socket.on('kick')
def kick(data):
    kicked_user = data.get('user')
    print(socket.sid_map)
    for sid,val in socket.sid_map.items():
        if val.get('user'):
            if val.get('user').get('id')==kicked_user.get('id'):
                socket.emit('error',{'status':403,'message':'You Were Kicked By The Host'},to=sid)
                break

    


@socket.on('start_game')
def start_game(data):
    room_id = data['room_id']
    socket.emit('start_game',to=room_id)
    socket.hosted_rooms.get(room_id)['started']=True

@socket.on('init_game')
def start_game(data):
    room_id = data['room_id']
    players = data['players']
    init_deck = data['init_deck']
    socket.emit('init_game',{'players':players,'init_deck':init_deck},to=room_id)
    
@socket.on('move')
def move(data):
    room_id = data['room_id']
    socket.emit('move',data,to=room_id)
