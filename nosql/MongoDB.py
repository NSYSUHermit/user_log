import sqlite3
import pandas as pd


class Nosql:

    def __init__(self, **kwargs):
        self.conn = None
        self.db = "D:\\Project\\Log Tool\\User_Logs\\demo\\nosql\\log_tool.db"

    def connect_db(self):
        self.conn = sqlite3.connect(self.db)

    def close_db(self):
        self.conn.close()

    def get_db_size(self):
        self.connect_db()
        cursor = self.conn.execute("SELECT COUNT(*) from Record")
        return cursor.fetchone()[0]

    def insert_db(self, df):
        self.connect_db()
        records = df.to_dict('records')
        for record in records:
            record_list = (
            record['Owner'], record['Name'], record['Type'], record['Event'], record['Result'], record['next_page'],
            record['prev_page'], record['time'])
            self.conn.execute(
                "INSERT INTO Record (Owner, Name, Type, Event, Result, NextPage, PrevPage, EventTime) VALUES " + str(
                    record_list))
        self.conn.commit()

    def query_db(self, page):
        self.connect_db()
        cursor = self.conn.execute("SELECT * from Record WHERE Owner=?", (page,))
        data = cursor.fetchall()
        df = pd.DataFrame(data).rename(
            {0: 'ID', 1: 'Owner', 2: 'Name', 3: 'Type', 4: 'Event', 5: 'Result', 6: 'NextPage', 7: 'PrevPage',
             8: 'EventTime'}, axis='columns')
        return df

    def query_error_time(self, start_time, end_time):
        self.connect_db()
        query = "SELECT * FROM Record WHERE EventTime BETWEEN '"+ str(start_time) +"' AND '"+ str(end_time) +"' AND Result LIKE '%failed%'"
        cursor = self.conn.execute(query)
        data = cursor.fetchall()
        df = pd.DataFrame(data).rename(
            {0: 'ID', 1: 'Owner', 2: 'Name', 3: 'Type', 4: 'Event', 5: 'Result', 6: 'NextPage', 7: 'PrevPage',
             8: 'EventTime'}, axis='columns')
        return df

    def query_id(self, record_id, diff=10):
        self.connect_db()
        query = "SELECT * FROM Record WHERE ID < '"+ str(record_id) +"' AND ID > '"+ str(record_id - diff) +"'"
        cursor = self.conn.execute(query)
        data = cursor.fetchall()
        df = pd.DataFrame(data).rename(
            {0: 'ID', 1: 'Owner', 2: 'Name', 3: 'Type', 4: 'Event', 5: 'Result', 6: 'NextPage', 7: 'PrevPage',
             8: 'EventTime'}, axis='columns')
        return df

    def query_error(self):
        self.connect_db()
        cursor = self.conn.execute("SELECT * from Record WHERE Result LIKE '%failed%'")
        data = cursor.fetchall()
        df = pd.DataFrame(data).rename(
            {0: 'ID', 1: 'Owner', 2: 'Name', 3: 'Type', 4: 'Event', 5: 'Result', 6: 'NextPage', 7: 'PrevPage',
             8: 'EventTime'}, axis='columns')
        return df


# from MongoDB import Nosql
# Nosql().connect_db()
# Nosql().insert_db()
# Nosql().insert_db(df)
# query = {"$and": [{'Owner': ' Owner：TrainerForm'}, {"next_page": {'$exists': True}}, {"prev_page": {'$exists': True}}]}
# Nosql().query_db(query)
# client = MongoClient(host="localhost", port=27017) 
