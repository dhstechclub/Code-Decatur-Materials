import random

#print("Hello World!")

#Print statement
'''
4 is of the data type Interger.
4.5 is of the data type Double.

"4" is a of the type String.
If you tried to add "4" and "4", as shown below, you would get "44" and not "8".
'''

myDict = {"Test1": 1, "Test2": 2}

class Card:
    def __init__(self, name):
        self.name = name

    def SetValue(self, value):
        self.value = value
        print(self.name + " is now set to the value " + str(self.value))

class VisaCard(Card):
    def __init__(self, name):
        super().__init__(name)
        
    

card1 = Card("Card1")
visaCard = VisaCard("VisaCard1")
visaCard.SetValue(20)

print(card1.name)
print(visaCard.value)
