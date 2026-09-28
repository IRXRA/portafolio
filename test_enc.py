with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('\ufeff', '')

try:
    fixed = content.encode('cp1252').decode('utf-8')
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(fixed)
    print('Successfully fixed encoding!')
except Exception as e:
    print('cp1252 error:', e)
    
