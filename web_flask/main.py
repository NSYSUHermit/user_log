import os
import sys
import json
import pandas as pd 
import numpy as np
import matplotlib.pyplot as plt
from datetime import timedelta
from flask import Flask, request, render_template, redirect, url_for, flash, Response, jsonify, session
from werkzeug.utils import secure_filename

sys.path.append("..")
from nosql.MongoDB import Nosql

UPLOAD_FOLDER = 'D:\\dataset\\Aisvion Log Tool\\User_Logs\\2022-06-07'
ALLOWED_EXTENSIONS = set(['pdf', 'png', 'jpg', 'jpeg', 'gif'])

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS

'''
HTML PAGES
'''      

@app.route('/home', methods=['GET','POST'])
def home():
    return render_template('home.html')

@app.route('/')
def index():
    return render_template('index.html')

@app.route("/monitor_indoor", methods=['GET','POST'])
def monitor_indoor():
    return render_template("monitor_indoor.html")

@app.route("/monitor_entrance", methods=['GET','POST'])
def monitor_entrance():
    return render_template("monitor_entrance.html")

'''
ASYNC TOOLS
'''
@app.route('/log_submit',methods=[ "GET",'POST'])
def log_submit():
    msg = "Path loading success!"
    folder_path = request.form.get('folder_path')
    db_size = Nosql().get_db_size()
    try:       
        for files in os.listdir(folder_path):
            full_path = folder_path + "//" + files
            df_log = pd.read_csv(full_path, header=None)
            df_t = df_log[0].str.split('|', 2, expand=True)
            df = df_t[2].str.split('｜', 4, expand=True)
            df.columns = ['Owner', 'Name', 'Type', 'Event', 'Result']
            df['next_page'] = np.append(df["Owner"][1:].values,"")
            df['prev_page'] = np.append("",df["Owner"][:-1].values)
            df['time'] = df_t[0] 
            Nosql().insert_db(df)
    except:                   
        msg = "Path loading failed." 
    return jsonify({'msg':msg, 'db_size':db_size}) 

@app.route("/page_count", methods=['GET','POST'])
def page_count():
    db_size = Nosql().get_db_size()
    print(db_size)
    return jsonify({'db_size':db_size}) 

@app.route("/page_plot", methods=['GET','POST'])
def page_plot():
    page = request.form.get('page')
    print("select page: ",page)
    query = {"$and": [{'Owner': page}, {"next_page": {'$exists': True}}, {"prev_page": {'$exists': True}}]}
    list = Nosql().query_db(query)
    df = pd.DataFrame(list)
    
    # prev
    name_list = df.groupby(['prev_page']).count()['_id'].index
    num_list = df.groupby(['prev_page']).count()['_id'].values
    prev_data = pd.DataFrame({'x': name_list, 'value': num_list}, columns=['x', 'value'])
    page_count = sum(prev_data['value'])
    prev_data = prev_data.to_json(orient = "records")
    print(page_count)
    
    # next
    name_list = df.groupby(['next_page']).count()['_id'].index
    num_list = df.groupby(['next_page']).count()['_id'].values
    next_data = pd.DataFrame({'x': name_list, 'value': num_list, 'fill': "#FF0000"}, columns=['x', 'value', 'fill'])
    next_data = next_data.to_json(orient = "records")  
    
    return jsonify({'next_data':next_data, 'prev_data':prev_data, 'page_count':page_count})
   
@app.route('/monitor_facelist', methods=["GET",'POST'])
def monitor_facelist():
    df = db.get_faceid()
    df = df.sort_values(by='date_time', ascending=False)
    df = df.drop_duplicates(subset = "face_id")
    df = df.head(10)
    print("face_refresh")
    id_list = df["face_id"].to_json(orient = "records")
    photo_list = df["image_base64"].to_json(orient = "records")
    return jsonify({'id_list':id_list, 'photo_list':photo_list})

if __name__ == '__main__':
    app.secret_key = os.urandom(32)
    app.run(host = '127.0.0.1', port = 5000, debug = True)