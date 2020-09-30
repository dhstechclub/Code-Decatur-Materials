board = [
    ['⬛', '⬛', '⬛'], 
    ['⬛', '⬛', '⬛'], 
    ['⬛', '⬛', '⬛']
]

currentPlayer = 1
'''
For each player while game hasnt ended,
pick square to change that is blank,
if not blank, prompt to pick again,
replace part of the array with an x or o depending on the player,
check to see if there are 3 in a row,
check if there are squares available,
end turn
'''
gameOver = False
players = ["❌", "⭕"]

while not gameOver:
    for player in players:
        choice = input("X, Y of tile")
