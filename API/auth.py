from api_main import app, mongo
from response import Response
from flask import request, render_template, redirect, make_response
from datetime import datetime
import secrets, scrypt, urllib.parse

@app.route("/signup", methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        # get ALL the data
        username = request.form['username']
        password = request.form['password']
        verify = request.form['verify']
        name = request.form['name']
        fsuid = request.form['fsuid']
        email = request.form['email']
        gradyear = request.form['gradyear']
        skills = request.form.getlist('skills')

        # if passwords dont match
        if password != verify:
            return render_template('error.html', code=400, message="Passwords do not match!")

        # TODO: Implement data format verification

        # Check if user exists
        curUserbyUsername = mongo.db.user_auth.find_one({"username": username})
        curUserbyFsuid = mongo.db.user_data.find_one({"fsuid": fsuid})
        if curUserbyUsername or curUserbyFsuid:
            return render_template('error.html', code=400, message="User already exists")

        # Hash string "PasswordIsCorrect" using user password, save that.
        hash = scrypt.encrypt("PasswordIsCorrect", password, maxtime=0.5)

        # insert user object into user collection and get that doc's id
        userid = mongo.db.user_data.insert_one({ "name": name, "fsuid": fsuid, "email": email, "gradYear": gradyear, "skills": skills, "created": datetime.now() }).inserted_id

        # insert user auth into auth collection
        mongo.db.user_auth.insert_one({ "username": username, "password": hash, "userdata": userid })

        # verify and get new document
        # wait do i need this?
        userdata = mongo.db.user_auth.aggregate([
            { '$match': { 'username': username }}, 
            { '$lookup': { 'from': 'user_data', 'localField': 'fsuid', 'foreignField': 'fsuid', 'as': 'root' }}, 
            { '$unwind': { 'path': '$root' }}, 
            { '$replaceRoot': { 'newRoot': '$root' }}
        ])

        # generate a token
        token = {
            "user": username,
            "token": secrets.token_hex(30),
            "userdata": userid,
            "created": datetime.utcnow()
        }
        mongo.db.user_tokens.insert(token)

        # See if there's a redirect var and handle
        redir = request.args.get("redir")
        if redir:
            resp = make_response(redirect(urllib.parse.unquote(redir), 302))
        else:
            resp = make_response("You are now signed up.")

        # set token expiry and respond
        age = 3600 # 1 hour
        resp.set_cookie('ihub-cc-a', token['token'], max_age=age)
        return resp
    else: 
        return render_template('signup.html')


@app.route("/login", methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        # get ALL the data
        username = request.form['username']
        password = request.form['password']
        noexpire = request.form.get('doesNotExpire')

        # get specified userdoc
        userdoc = mongo.db.user_auth.find_one({"username": username})
        
        # Try decrypting the secret key using the password provided.
        # The actual key doesnt matter, we just want to make sure it decrypts.
        try:
            scrypt.decrypt(userdoc['password'], password, maxtime=0.5)

            # generate a token
            token = {
                "user": username,
                "token": secrets.token_hex(30),
                "userdata": userdoc['userdata'],
                "created": datetime.utcnow(),
            }
            mongo.db.user_tokens.insert(token)

            # See if there's a redirect var and handle
            redir = request.args.get("redir")
            if redir:
                resp = make_response(redirect(urllib.parse.unquote(redir), 302))
            else:
                resp = make_response("You are now logged in.")

            # set token expiry
            if noexpire:
                age = 31536000 # 1 year
            else:
                age = 3600 # 1 hour

            #set cookie
            resp.set_cookie('ihub-cc-a', token['token'], max_age=age)

            # respond
            return resp

        # If password fails to decrypt
        except scrypt.error:
            return render_template('error.html', code=400, message="Username or password is incorrect. Try again!")
        # Workaround to handle if the user doc doesnt exist in the db.
        except AttributeError:
            return render_template('error.html', code=400, message="Username or password is incorrect. Try again!")
        except TypeError:
            return render_template('error.html', code=400, message="Username or password is incorrect. Try again!")
    else:
        # If user is already logged in...
        if request.cookies.get('ihub-cc-a') != None:
            # Check if token is valid
            if mongo.db.user_tokens.find_one({"token": request.cookies.get('ihub-cc-a')}):
                return render_template('error.html', code=400, message="You're already logged in!")    
        return render_template('login.html')


@app.route("/logout", methods=['GET'])
def logout():
    redir = request.args.get("redir")
    if redir:
        resp = make_response(redirect(urllib.parse.unquote(redir), 302))
    else:
        resp = make_response("You are now logged out.")
    resp.set_cookie('ihub-cc-a', '', expires=0)
    return resp


# test route to see if the cookies are working.
@app.route("/usertest", methods=['GET'])
def usertest():
    cookie = request.cookies.get('ihub-cc-a')
    if cookie:
        userdata = list(mongo.db.user_tokens.aggregate([
            { '$match': { 'token': cookie }}, 
            { '$lookup': { 'from': 'user_data', 'localField': 'userdata', 'foreignField': '_id', 'as': 'root' }}, 
            { '$unwind': { 'path': '$root' }}, 
            { '$replaceRoot': { 'newRoot': '$root' }}
        ]))
        return "<html><head><title>test</title></head><body><h2>You're logged in as: "+userdata[0]['name']+"</h2><a href='/logout?redir=%2Fusertest'><button>logout</button></a></body></html>"
    else:
        return "<html><head><title>test</title></head><body><h2>Not logged in.</h2><a href='/login?redir=%2Fusertest'><button>login</button></a> - <a href='/signup?redir=%2Fusertest'><button>signup</button></a></body></html>"