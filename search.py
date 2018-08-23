import json, re

dataFileName = 'courses.json'

def searchData(query):
	with open(dataFileName, 'r') as dataFile:
		data = json.load(dataFile)
	return [ course for course in data if re.search( query, course['Name'], re.IGNORECASE ) ]

if __name__ == '__main__':
	print( searchData( input('Search for: ') ) )