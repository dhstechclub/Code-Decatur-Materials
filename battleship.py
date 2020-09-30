import random
#importing random for computer guesses here


#Function to draw the computer's board
def drawBoard():
  for line in shipsComputer:
      #String for each line that draws the emojis
      s = ""
      for c in line:
        #if c not equal to boom and c not equal splash, draw hidden square
        if(c != "ðŸ’¥" and c != "ðŸ’¦"):
          s += "â¬›"
        #else draw what c is
        else:
          s += c
        #Spacing because emojis are dumb
        s += " "
      print(s)
  print()

#Function to draw your board
def drawBoardComputer():
  for line in shipsPlayer1:
      #String per line of the grid
      s = ""
      #For each character c in the line, add it to the end of s
      for c in line:
        s += c
        s += " "
      #print the full line
      print(s)
  #Whitespace at the end
  print()

#Array that stores the ships positions for one side
shipsPlayer1 = [
  ["ðŸŒŠ", "ðŸš£", "ðŸŒŠ"],
  ["ðŸŒŠ", "ðŸš£", "ðŸŒŠ"], 
  ["ðŸš£", "ðŸŒŠ", "ðŸŒŠ"]
]

#Array that stores the ships positions for the other side
shipsComputer = [
  ["ðŸŒŠ", "ðŸš£", "ðŸŒŠ"],
  ["ðŸŒŠ", "ðŸš£", "ðŸŒŠ"], 
  ["ðŸš£", "ðŸŒŠ", "ðŸŒŠ"]
]

#If the game's over
gameOver = False

#variable to represent who's turn it is, 1 for you, 2 for computer
turn = 1

while not gameOver:
  #While it's your turn
  while turn == 1:
    #draw the board
    drawBoard()

    #player guesses two coordinates
    playerGuessX = int(input("Coordinate X: \n>> "))
    playerGuessY = int(input("Coordinate Y: \n>> "))

    #corresponding value to player's guess on the computer's board
    guess = shipsComputer[playerGuessY][playerGuessX]

    if (guess == "ðŸš£"):
      print("you hit!")
      shipsComputer[playerGuessY][playerGuessX] = "ðŸ’¥"

    elif(guess == "ðŸŒŠ"):
      print("you missed :(")
      shipsComputer[playerGuessY][playerGuessX] = "ðŸ’¦"
      drawBoard()
      #If you miss, go to the computer's turn
      turn = 2

    elif(guess == "ðŸ’¥"):
      print("you already guessed there and hit a boat!")

    elif(guess == "ðŸ’¦"):
      print("you already guessed there and missed.")

    #yana did this- if there is a boat on the board
    sExists = False

    #Check if there's a boat on the board
    for line in shipsComputer:
      for point in line:
        if point == "ðŸš£":
          sExists = True


    #If there isn't, end the game
    if not sExists:
      gameOver = True
      print("you win!")
      turn = 2

  print("\n\nComputers turn:\n")
  while turn == 2:
    drawBoardComputer()

    """
    shipsPlayer1 = [
      ["ðŸŒŠ", "ðŸš£", "ðŸŒŠ"],
      ["ðŸŒŠ", "ðŸš£", "ðŸŒŠ"], 
      ["ðŸš£", "ðŸŒŠ", "ðŸŒŠ"]
    ]
    """

    #computer guesses a random x and y inside the grid
    computerGuessX = random.randint(0, len(shipsPlayer1[0]) - 1)
    computerGuessY = random.randint(0, len(shipsPlayer1) - 1)

    #print where the computer attacked
    print("Computer attacked (" + str(computerGuessX) + ", " + str(computerGuessY) + ")")

    guess = shipsPlayer1[computerGuessY][computerGuessX]

    if (guess == "ðŸš£"):
      print("Computer hit!")
      shipsPlayer1[computerGuessY][computerGuessX] = "ðŸ’¥"

    elif(guess == "ðŸŒŠ"):
      print("Computer Missed")
      shipsPlayer1[computerGuessY][computerGuessX] = "ðŸ’¦"
      drawBoardComputer()
      #If missed, go to player's turn
      turn = 1

    #This whole block is the same as it works for the player
    sExists = False

    for line in shipsPlayer1:
      for point in line:
        if point == "ðŸš£":
          sExists = True

    if not sExists:
      gameOver = True
      print("you lose! (Hayden)")



  if not gameOver:
    print("\n\nPlayers Turn:\n")
