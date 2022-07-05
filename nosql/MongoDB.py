from pymongo import MongoClient 

class Nosql:

    def __init__(self, **kwargs):
        self.host = "localhost"
        self.port = 27017
        
    def connect_db(self):
        client = MongoClient(host=self.host, port=self.port) 
        db = client.test
        self.collection = db.record
    
    def get_db_size(self):
        client = MongoClient(host=self.host, port=self.port) 
        db = client.test
        return db.command("collstats", "record")['count']

    def insert_db(self, df):
        self.connect_db()
        records = df.to_dict('records')
        result = self.collection.insert_many(records)
        
    def query_db(self, query):
        self.connect_db()
        find_list = self.collection.find(query)
        return list(find_list)

# from MongoDB import Nosql
# Nosql().connect_db()
# Nosql().insert_db()
# Nosql().insert_db(df)
# query = {"$and": [{'Owner': ' Owner：TrainerForm'}, {"next_page": {'$exists': True}}, {"prev_page": {'$exists': True}}]}
# Nosql().query_db(query)
# client = MongoClient(host="localhost", port=27017) 
