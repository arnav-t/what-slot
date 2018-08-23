import requests

cookie = 'B80F7769304DA4BAE3290ED2F8980DE0.worker2'

url = 'https://erp.iitkgp.ac.in/Acad/timetable_track.jsp?action=second&dept={}'
headers = {
	'Cookie' : 'JSESSIONID={}'.format(cookie)
}

response = requests.get(url.format('BT'), headers=headers)
print(response.text)