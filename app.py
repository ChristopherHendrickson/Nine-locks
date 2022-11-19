import os
from flask import Flask



app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')


from auth import auth_router
from sockets import socket_router

app.register_blueprint(auth_router)
app.register_blueprint(socket_router)