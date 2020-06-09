from flask import Flask, render_template
from flask_restful import Api

from endpoints.DataBroker import DataBroker
from endpoints.ClusterBroker import ClusterBroker

app = Flask(__name__, static_folder='templates/static', template_folder="templates")
api = Api(app)

api.add_resource(DataBroker, '/dataBroker/<string:resource_id>')
api.add_resource(ClusterBroker, '/clusterBroker/<string:resource_id>')

@app.route("/")
@app.route("/<resource_id>")
def vis(resource_id=None):
    return render_template('index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=4545)