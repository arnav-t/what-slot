ttFileName = 'tt.html'


days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
def slotHeader(slot):
	if slot < 5:
		return f'{8+slot}:00 - {8+slot}:55'
	else:
		return f'{9+slot}:00 - {9+slot}:55'

with open(ttFileName, 'w+') as ttFile:
	ttFile.write('<table class="table">\n')
	ttFile.write('\t<thead>\n')
	ttFile.write('\t\t<tr>\n')
	ttFile.write( f'\t\t\t<th scope="col">Day</th>\n' )
	for slot in range(9):
		ttFile.write( f'\t\t\t<th scope="col">{slotHeader(slot)}</th>\n' )
	ttFile.write('\t\t</tr>\n')
	ttFile.write('\t</thead>\n')

	ttFile.write('\t<tbody>\n')
	for day in range(5):
		ttFile.write('\t\t<tr>\n')
		ttFile.write( f'\t\t\t<th scope="row">{days[day]}</th>\n' )
		for slot in range(9):
			ttFile.write( f'\t\t\t<td id="{str(day)+str(slot)}"></td>\n' )
		ttFile.write('\t\t</tr>\n')
	ttFile.write('\t</tbody>\n')

	ttFile.write('</table>\n')
