from flask import Flask, render_template
from flask_restful import Api

from endpoints.DataBroker import DataBroker

app = Flask(__name__, static_folder='templates/static', template_folder="templates")
api = Api(app)

api.add_resource(DataBroker, '/dataBroker')

@app.route("/")
def vis():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=4545)