from flask import Flask, render_template
from flask_restful import Api
import argparse

from endpoints.DataBroker import DataBroker
from endpoints.RenderingLatencyResults import RenderingLatencyResults

app = Flask(__name__, static_folder='templates/static',
            template_folder="templates")
api = Api(app)

api.add_resource(DataBroker, '/dataBroker/<string:resource_id>')
api.add_resource(RenderingLatencyResults,
                 '/testresults/<string:qty_of_points>')


@app.route("/")
@app.route("/<resource_id>")
def vis(resource_id=None):
    return render_template('index.html')


if __name__ == '__main__':

    arguments_parser = argparse.ArgumentParser()
    arguments_parser.add_argument('--port', '-p',
                                  default='4545'
                                  )
    arguments_parser.add_argument('--redis',
                                  default='6379'
                                  )
    args, unknown = arguments_parser.parse_known_args()
    
    app.run(host='0.0.0.0', port=args.port)
