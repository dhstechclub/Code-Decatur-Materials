import requests
import json
'''
try:
    r = requests.get('https://api.github.com/events')
    print(r.text)
    #requestData = json.loads(r.text)
    #print(requestData[0]["repo"]["url"])
except:
    print("Something went wrong with the request")
'''



class Phone:
    def __init__(self, model, color):
        self.model = model
        self.color = color
    def turnOn(self):
        print("Phone is on")
    def __str__(self):
        return self.model + " with color " + self.color



myPhone = Phone("iPhone", "Black")
print(myPhone)


'''


print(myPhone.model)
myPhone.model = "Google Pixel"
print(myPhone.model)'''