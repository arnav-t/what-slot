import requests
from bs4 import BeautifulSoup

cookie = 'D573FDD6212E073FEA92DFD8CB11CF69.worker2'

url = 'https://erp.iitkgp.ac.in/Acad/timetable_track.jsp?action=second&dept={}'
headers = {
	'Cookie' : 'JSESSIONID={}'.format(cookie)
}

def getSlots(dep):
	response = requests.get(url.format(dep), headers=headers)
	soup = BeautifulSoup(response.text, 'html.parser')
	parentTable = soup.find('table', {'id': 'disptab'})
	rows = parentTable.find_all('tr')
	for row in rows:
		if 'bgcolor' in row.attrs:
			continue 
		tds = row.find_all('td')
		try:
			print( tds[0].text + ' : ' + tds[1].text + ' : ' + tds[5].text )
		except:
			print('XXXXXXXXXX')

if __name__ == '__main__':
	getSlots('CS')