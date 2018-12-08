import requests, json, os
from bs4 import BeautifulSoup

cookie = os.environ['JSESSIONID']  # 'F8D06B8C66185BE893CC9838BE21E9E1.worker2'

url = 'https://erp.iitkgp.ac.in/Acad/timetable_track.jsp?action=second&dept={}'
headers = {
	'Cookie' : 'JSESSIONID={}'.format(cookie)
}
form = {
	'for_session': '2018-2019',
	'for_semester': 'SPRING',
	'dept': '{}'
}
dataFileName = 'courses.json'
depFileName = 'deps.txt'

def getData(dep):
	global form 
	form['dept'] = dep
	response = requests.post(url.format(dep), headers=headers, data=form)

	courses = []

	soup = BeautifulSoup(response.text, 'html.parser')
	try:
		parentTable = soup.find('table', {'id': 'disptab'})
		rows = parentTable.find_all('tr')
	except:
		return courses
	for row in rows:
		if 'bgcolor' in row.attrs:
			continue 
		cells = row.find_all('td')
		try:
			course = {}
			course['Name'] = f'{cells[0].text}: {cells[1].text}'
			
			data = {}
			data['Faculty'] = cells[2].text
			data['LTP'] = cells[3].text
			data['Credits'] = cells[4].text
			data['Slot'] = cells[5].text
			try:
				data['Room'] = cells[6].text
			except:
				pass

			course['Data'] = data
			print( course['Name'] )
			courses.append(course)
		except:
			print('XXXXXXXXXX')

	return courses

if __name__ == '__main__':
	deps = []
	with open(depFileName, 'r') as depFile:
		for dep in depFile:
			deps.append(dep[:2])

	courses = []
	for dep in deps:
		courses.extend( getData(dep) )

	with open(dataFileName, 'w') as dataFile:
		json.dump(courses, dataFile)