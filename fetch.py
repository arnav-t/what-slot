import requests
from bs4 import BeautifulSoup

cookie = 'D573FDD6212E073FEA92DFD8CB11CF69.worker2'

url = 'https://erp.iitkgp.ac.in/Acad/timetable_track.jsp?action=second&dept={}'
headers = {
	'Cookie' : 'JSESSIONID={}'.format(cookie)
}

def getSlots(dep):
	response = requests.get(url.format(dep), headers=headers)

	courses = []

	soup = BeautifulSoup(response.text, 'html.parser')
	parentTable = soup.find('table', {'id': 'disptab'})
	rows = parentTable.find_all('tr')
	for row in rows:
		if 'bgcolor' in row.attrs:
			continue 
		cells = row.find_all('td')
		try:
			course = {}
			course['Name'] = f'{cells[0].text}: {cells[1].text}'
			data = {}
			data['Credits'] = cells[4].text
			data['Slot'] = cells[5].text
			course['Data'] = data
			print( course['Name'] + ' : ' + data['Credits'] + ' : ' + data['Slot'] )
			courses.append(course)
		except:
			print('XXXXXXXXXX')

	return courses

if __name__ == '__main__':
	courses = getSlots('CS')
	print(courses)