from flask import Flask
from flask_restful import Api

from endpoints.DataBroker import DataBroker

app = Flask(__name__)
api = Api(app)

api.add_resource(DataBroker, '/dataBroker')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=4545)