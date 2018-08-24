from flask import Flask, render_template, request
from search import searchData
import json

app = Flask(__name__)

@app.route('/')
def home():
	return render_template('home.html')

@app.route('/search/')
def search():
	query = request.args.get('term')
	results = searchData(query)
	return json.dumps( [ course['Name'] for course in results ] )

if __name__ == '__main__':
	app.run(debug = True)