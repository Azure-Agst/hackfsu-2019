from flask import Flask, request, make_response
from tinydb import TinyDB, Query, where
from passlib.hash import sha256_crypt
from api import NoleAPI

import json
import secrets

# Init Flask App
app = Flask(__name__)
db = TinyDB('../../res/db.json')
api = NoleAPI()

# signup
@app.route("/signup", methods=['POST'])
def signup():
    name = request.form['name']
    username = request.form['username']
    password = request.form['password']

    #encrypt pass and username
    encpass = sha256_crypt.encrypt(password)
    encuname = secrets.token_hex(16)
    #check if user exists
    userExists =  db.contains(where('username') == username)
    if userExists:
        return "Username exists"
    address = api.createNew(password)
    # handle registering user here
    userd = { 'name': name, 'username':username, 'password':encpass, 'token':encuname, 'address':address }    
    db.insert(userd)
    # set cookie and return
    response = make_response({
        "name": name,
        "username": username,
        "address": address,
        "value": 0
    })
    response.set_cookie("fsuCoinAuth", encuname)
    return response


# login
@app.route("/login", methods=['POST'])
def login():
    username = request.form['username']
    password = request.form['password']

    # handle login here
    userExists = db.search((where('username') == username)) # & (where('password') == encpass))

    if not userExists:
        return {"error":"Username or password does not exist"}
    if not sha256_crypt.verify(password, userExists[0]['password']):
        return {"error":"Password not correct"}
    
    
    # set cookie and return
    response = make_response({
        "name": userExists[0]['name'],
        "username": userExists[0]['username'],
        "address": userExists[0]['address'],
        "value": api.getTokenBalance(userExists[0]['address'])
    })
    response.set_cookie("fsuCoinAuth", userExists[0]['token'])
    return response


# getCurUser
@app.route("/getCurUser", methods=['GET'])
def curUser():
    userToken = request.cookies.get('fsuCoinAuth')
    if not userToken: 
        return {"error":"Lol, log in."}
    thisUser =  db.search(where('token') == userToken)
    if not thisUser:
        return {"error":"User not found."}
    # use userToken to populate response here

    return {
        "name": thisUser[0]['name'],
        "username": thisUser[0]['username'],
        "address": thisUser[0]["address"],
        "value": api.getTokenBalance(thisUser[0]['address'])
    }

# Transfer
@app.route("/transfer", methods=['POST'])
def transfer():
    userToken = request.cookies.get('fsuCoinAuth')
    if not userToken: 
        return "Lol, log in."
    destination = request.form['address']
    value = request.form['value']
    thisUser =  db.search(where('token') == userToken)
    api.transferFrom(thisUser[0]['address'], destination, value)
    # use userToken and destination to transfer coin here

    return {
        "code": "success",
        "transferred": value
    }

app.run(host='0.0.0.0', port='80')
