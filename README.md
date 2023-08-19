# Mermaid Game

Welcome to the Mermaid Game! In this exciting game, you'll dive into an underwater adventure similar to Candy Crush. As a mermaid, your goal is to match and collect objects to clear them from the board. You'll encounter swapping, bombs, and special buttons that add a twist to the gameplay.

![Mermaid Game Screenshot](https://github.com/Harut20024/Mermaid/blob/main/photos/screen.png)

## How to Play

1. Swap adjacent objects horizontally or vertically to create lines of three or more identical objects. When a line is formed, those objects will be cleared from the board.
2. Clear as many objects as you can to earn points and progress through the levels.
3. Use special buttons strategically to change the places of objects and create new matches.

Play the game: [Mermaid Game](https://github.com/Harut20024/Mermaid)
## Object Creation

The code defines classes for different game objects:
- `Obj1`, `Obj2`, `Obj3`, etc., inherit from the `GameObj` class.
- Each class represents a different object type with attributes like color and image source.

## Game Initialization

- The `data` object holds information about game objects on the board.
- The `createGame` function initializes the game board by populating positions with objects and empty spaces.
- Certain positions are marked as excluded from object placement.

## Game Loop

- The `loop` function controls the game loop.
- It periodically refreshes the board, checks for new rows, updates mechanics, and renders changes.

## Gameplay and Interaction

- Game mechanics include swapping adjacent objects, removing matched objects (three or more in a row), and adding new rows.
- Objects can be swapped via mouse clicks, and positions are updated accordingly.
- Specific conditions exclude certain positions from swapping.

## Special Mechanics

- Special mechanics include removing sets of objects (five, four, and three in a row/column) and using a special button to change objects.
- `removeFiveObj`, `removeFourObj`, and `removeTreeObj` functions handle object removal and update score and scale.
- `addNewRow` function adds new rows when top row or specific positions have empty spaces.

## Scoring and Conditions

- The game tracks player's score, coins, and remaining time.
- Reaching a certain scale leads to winning the game.
- Running out of time leads to losing the game.

## Buttons

- Buttons allow special actions:
  - `myButton`: Changes objects on the board when used with available coins.
  - `myButtonDel`: Toggles between delete modes for object removal.
  - `myButtonBomb`: Toggles between bomb modes for special object removal.

Please note that this is a simplified overview. If you have specific questions or need more information about the code, feel free to ask!
