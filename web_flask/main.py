import os
import sys
import json
import pandas as pd 
import numpy as np
from flask import Flask, request, render_template, redirect, url_for, flash, Response, jsonify, session

sys.path.append("..")
from nosql.MongoDB import Nosql

app = Flask(__name__)

'''
HTML PAGES
'''      

@app.route('/home', methods=['GET','POST'])
def home():
    return render_template('home.html')

@app.route('/pages')
def pages():
    return render_template('index.html')

@app.route('/models')
def models():
    return render_template('models.html')


@app.route("/error", methods=['GET','POST'])
def error():
    return render_template("error.html")

'''
ASYNC TOOLS
'''
@app.route('/log_submit', methods=[ "GET",'POST'])
def log_submit():
    msg = "Success loading paths!"
    folder_path = request.form.get('folder_path')
    db_size = Nosql().get_db_size()
    upload_size = '"NO RECORDS UPDATED!"'
    try:
        for file in os.listdir(folder_path):
            full_path = os.path.join(folder_path, file)
            df_log = pd.read_csv(full_path, sep='\t', header=None).dropna()
            df_t = df_log[0].str.split('|', n=2, expand=True)
            df = df_t[2].str.split('｜', n=4, expand=True)
            df.columns = ['Owner', 'Name', 'Type', 'Event', 'Result']
            df['next_page'] = np.append(df["Owner"][1:].values,'')
            df['prev_page'] = np.append('', df["Owner"][:-1].values)
            df['time'] = df_t[0]
            Nosql().insert_db(df.dropna())
            upload_size = df.shape[0]
    except Exception as e:
        print("An error occurred:", e)
        msg = "Path loading was unsuccessful. Please make sure the correct files are on your path."

    return jsonify({'msg':msg, 'upload_size':upload_size, 'db_size':db_size})

@app.route("/get_error_list", methods=['GET','POST'])
def get_error_list():
    try:
        msg = "Success loading paths!"
        start = request.form.get('start').split("T")[0]
        end = request.form.get('end').split("T")[0]
        error_db = Nosql().query_error_time(start, end)[['ID', 'Owner', 'Event', 'Result', 'EventTime']]
        error_total = Nosql().query_error().shape[0]
        id_list = error_db['ID'].values.tolist()
        id_db_list = []
        for id_num in id_list:
            id_db = Nosql().query_id(id_num)[['ID', 'Owner', 'Event', 'Result', 'EventTime']]
            id_db_list += [json.loads(id_db.to_json(orient="records"))]
        error_list = json.loads(error_db.to_json(orient="records"))
        return jsonify({'msg': msg, 'error_total': error_total, 'error_count': error_db.shape[0],
                        'column_name': error_db.columns.tolist(), 'error_list': error_list, 'id_db_list': id_db_list})
    except Exception as e:
        return jsonify({'msg': f"Error occurred: {e}"})

@app.route("/page_count", methods=['GET','POST'])
def page_count():
    db_size = Nosql().get_db_size()
    print(db_size)
    return jsonify({'db_size':db_size})

@app.route("/page_plot", methods=['GET','POST'])
def page_plot():
    page = request.form.get('page')
    df = Nosql().query_db(page)

    # prev
    name_list = df.groupby(['PrevPage']).count()['EventTime'].index
    num_list = df.groupby(['PrevPage']).count()['EventTime'].values
    prev_data = pd.DataFrame({'x': name_list, 'value': num_list}, columns=['x', 'value'])
    page_num = sum(prev_data['value'])
    prev_data = prev_data.to_json(orient = "records")
    print(page_num)
    
    # next
    name_list = df.groupby(['NextPage']).count()['EventTime'].index
    num_list = df.groupby(['NextPage']).count()['EventTime'].values
    next_data = pd.DataFrame({'x': name_list, 'value': num_list, 'fill': "#FF0000"}, columns=['x', 'value', 'fill'])
    next_data = next_data.to_json(orient = "records")  

    # components
    name_list = df.groupby(['Name']).count()['EventTime'].index
    num_list = df.groupby(['Name']).count()['EventTime'].values
    components_data = pd.DataFrame({'x': name_list, 'value': num_list}, columns=['x', 'value'])
    components_data = components_data.to_json(orient = "records")  
    
    return jsonify({'next_data':next_data, 'prev_data':prev_data, 'components_data':components_data, 'page_count':page_num})

if __name__ == '__main__':
    app.secret_key = os.urandom(32)
    app.run(host = '127.0.0.1', port = 1000, debug = True)