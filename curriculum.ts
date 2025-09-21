import type { AppContext } from './types';

// New, more structured curriculum format
export const curriculum: Record<string, {
    title: string;
    episodes: Record<string, {
        title: string;
        content: Partial<AppContext["curriculumSlice"]>;
    }>
}> = {
    "0": { // Chapter 1
        title: "Python Foundations",
        episodes: {
            "0": { // Episode 1
                title: "Variables & Your First Program",
                content: {
                    stageContent: {
                        discover: {
                            title: "Variables are like labeled boxes!",
                            analogy: "Imagine a warehouse with labeled boxes. Each box has a label (the variable name) and some contents (the value stored in it).",
                            codeSample: "name = 'Ava'\nprint(f'Hi {name}')",
                            microQuiz: "What does {name} show in the output?"
                        },
                        explore: {
                            // FIX: Corrected Python f-string syntax to use {var} instead of ${var}.
                            demoCode: `name = "Alice"\nage = 12\nprint(f"Hello {name}, you are {age} years old")`,
                            experiment: "Try changing the name to your own name, and the age to your age. Predict what will happen before you run it!"
                        },
                        practice: {
                            // FIX: Corrected Python f-string syntax to use {var} instead of ${var}.
                            template: `name = ____  # Your name in quotes\nage = ___    # Your age as a number\nprint(f"Hello {name}, you are {age} years old")`,
                            expectedKeywords: ["Hello", "years old"]
                        },
                        apply: {
                            challenge: "Create a program that asks for a user's name and their favorite hobby using the input() function, then prints a friendly sentence combining them.",
                            hints: ["Use the input() function to get user data.", "Store the results from input() in two different variables.", "Use an f-string to combine the variables into a final sentence."]
                        },
                        master: {
                            assessment: "Build a 3-line personal greeter. It should: 1. Store a name in a variable. 2. Store an age in another variable. 3. Print a sentence that includes the name, the age, and also the length of the name.",
                            criteria: ["Uses variables for name and age.", "Implements an f-string for output.", "Correctly calculates and displays the length of the name using len()."]
                        }
                    },
                    practiceBlanks: ["'YourName'", "25"],
                    tests: [
                        { name: "Contains 'Hello'", expect: ["Hello"] },
                        { name: "Contains 'years old'", expect: ["years old"] }
                    ]
                }
            },
            "1": { // Episode 2
                title: "Numbers & Basic Math",
                content: {
                    stageContent: {
                        discover: {
                            title: "Python is your personal calculator!",
                            analogy: "Python can handle numbers just like a powerful calculator. It knows about whole numbers (integers) and decimal numbers (floats), and understands the order of operations.",
                            // FIX: Corrected Python comment syntax from `//` to `#`.
                            codeSample: "# Python respects order of operations (PEMDAS)\nresult = 5 + 2 * 3  # This will be 11, not 21\nprint(result)",
                            microQuiz: "What is the difference between the `/` and `//` operators in Python?"
                        },
                        explore: {
                            // FIX: Corrected Python f-string syntax to use {var} instead of ${var}.
                            demoCode: `pizzas = 10\nfriends = 3\n\n# Regular division\nslices_per_friend = pizzas / friends\nprint(f"Each friend gets {slices_per_friend} slices.")\n\n# Integer division (how many whole slices)\nwhole_slices = pizzas // friends\nprint(f"Each friend gets {whole_slices} whole slices.")\n\n# Modulo (how many slices are left over)\nleftover = pizzas % friends\nprint(f"{leftover} slices are leftover.")`,
                            experiment: "What happens if you have 12 pizzas and 4 friends? Predict the output for all three print statements."
                        },
                        practice: {
                            // FIX: Corrected Python f-string syntax to use {var} instead of ${var}.
                            template: `item_price = 15\ntax_rate = 0.07\ntax_amount = item_price * ____\ntotal_cost = ____ + tax_amount\nprint(f"Total cost: {total_cost}")`,
                            expectedKeywords: ["Total cost: 16.05"]
                        },
                        apply: {
                            challenge: "Create a simple tip calculator. Ask the user for the bill amount and the tip percentage they want to leave. Then, calculate and print the total bill including the tip.",
                            hints: ["Use `input()` to get the bill and tip percentage.", "Remember to convert the input strings to numbers using `float()`.", "The tip amount is `bill * (percentage / 100)`."]
                        },
                        master: {
                            assessment: "Build a program that converts a temperature from Fahrenheit to Celsius. The formula is (F - 32) * 5/9. The program should ask for a temperature in Fahrenheit and print the result in Celsius, formatted to two decimal places.",
                            criteria: ["Correctly gets user input for Fahrenheit.", "Accurately applies the conversion formula.", "Formats the final output to two decimal places."]
                        }
                    },
                    practiceBlanks: ["tax_rate", "item_price"],
                    tests: [{ name: "Calculates total correctly", expect: ["16.05"] }]
                }
            },
            "2": { // Episode 3
                title: "Text & Strings",
                content: {
                    stageContent: {
                        discover: {
                            title: "Strings are sequences of text!",
                            analogy: "Think of a string like a beaded necklace. Each bead is a character (a letter, number, or symbol), and they are all held together in a specific order.",
                            // FIX: Corrected Python comment syntax from `//` to `#`.
                            codeSample: `greeting = "Hello"\n# Get a specific character (indexing starts at 0!)\nfirst_letter = greeting[0] # 'H'\nprint(first_letter)`,
                            microQuiz: "What would `greeting[4]` give you from the code sample?"
                        },
                        explore: {
                            // FIX: Corrected Python f-string syntax to use {var} instead of ${var}.
                            demoCode: `message = "Python is fun!"\n\n# Get the length of the string\nprint(f"Length: {len(message)}")\n\n# Convert to uppercase\nprint(f"Uppercase: {message.upper()}")\n\n# Slice the string to get a part of it\nprint(f"Slice: {message[7:9]}")`,
                            experiment: "Try to slice the string to get just the word 'Python'. What happens if you leave out the start or end number in a slice, like `message[:6]`?"
                        },
                        practice: {
                            template: `first_name = "ada"\nlast_name = "lovelace"\nfull_name = first_name + " " + ____\n\n# Now, let's make it look nice\nformatted_name = full_name.____()\nprint(formatted_name)`,
                            expectedKeywords: ["Ada Lovelace"]
                        },
                        apply: {
                            challenge: "Ask a user for their favorite movie. Then, print out a message that says 'Your favorite movie, [Movie Title], has [X] characters.' replacing the bracketed parts with the actual movie and its character count.",
                            hints: ["Use `input()` to get the movie title.", "Use `len()` to get the length of the string.", "Use an f-string to format the final output message."]
                        },
                        master: {
                            assessment: "Create a username generator. Ask the user for their first name and their last name. The username should be the first 3 letters of their first name, all lowercase, combined with the first 3 letters of their last name, also all lowercase. Print the resulting username.",
                            criteria: ["Gets both first and last names from user.", "Correctly slices the first 3 letters from each name.", "Converts both parts to lowercase before combining."]
                        }
                    },
                    practiceBlanks: ["last_name", "title"],
                    tests: [{ name: "Prints formatted name", expect: ["Ada Lovelace"] }]
                }
            },
            "3": { // Episode 4
                title: "True/False & Decisions",
                content: {
                    stageContent: {
                        discover: {
                            title: "Making decisions with if/else!",
                            analogy: "An `if` statement is like a fork in the road for your program. It checks a condition (like a signpost), and if the condition is `True`, it goes down one path. If it's `False`, it can go down another path (the `else` path).",
                            codeSample: `age = 20\n\nif age >= 18:\n    print("You can vote!")\nelse:\n    print("You are not old enough to vote.")`,
                            microQuiz: "What would the code print if you changed `age` to 16?"
                        },
                        explore: {
                            demoCode: `temperature = 75\n\nif temperature > 80:\n    print("It's hot outside!")\nelif temperature < 50:\n    print("It's cold outside!")\nelse:\n    print("The weather is pleasant.")`,
                            experiment: "Try different values for `temperature`. What value would make it print 'It's cold outside!'? What about a value of exactly 80?"
                        },
                        practice: {
                            template: `is_raining = True\n\nif ____:\n    print("Bring an umbrella!")\n____:\n    print("Enjoy the sunshine!")`,
                            expectedKeywords: ["Bring an umbrella!"]
                        },
                        apply: {
                            challenge: "Create a simple password checker. Create a variable for a correct password. Then, ask the user to enter a password. If they enter the correct one, print 'Access granted'. Otherwise, print 'Access denied'.",
                            hints: ["Store the correct password in a variable.", "Use `input()` to get the user's attempt.", "The comparison operator for equality is `==`."]
                        },
                        master: {
                            assessment: "Write a program that asks for a number. The program should then print whether the number is positive, negative, or zero. You will need to use `if`, `elif`, and `else` to handle all three cases.",
                            criteria: ["Correctly identifies positive numbers.", "Correctly identifies negative numbers.", "Correctly identifies when the number is exactly zero."]
                        }
                    },
                    practiceBlanks: ["is_raining", "else"],
                    tests: [{ name: "Correctly handles True case", expect: ["Bring an umbrella!"] }]
                }
            },
            "4": { // Episode 5
                title: "Lists & Collections",
                content: {
                    stageContent: {
                        discover: {
                            title: "Lists hold multiple items!",
                            analogy: "A list is like a shopping cart. You can put multiple items in it, they stay in the order you added them, and you can add or remove items whenever you want.",
                            codeSample: `groceries = ["milk", "eggs", "bread"]\n\n# Access the first item\nprint(groceries[0])\n\n# Add a new item\ngroceries.append("butter")\nprint(groceries)`,
                            microQuiz: "In Python, what number do you use to get the *first* item in a list?"
                        },
                        explore: {
                            // FIX: Corrected Python f-string syntax to use {var} instead of ${var}.
                            demoCode: `tasks = ["Clean room", "Do homework", "Walk the dog"]\nprint(f"Initial tasks: {tasks}")\n\n# Add a task\ntasks.append("Read a book")\nprint(f"Added a task: {tasks}")\n\n# Remove a task\ntasks.remove("Do homework")\nprint(f"Removed a task: {tasks}")\n\n# How many tasks are left?\nprint(f"Number of tasks: {len(tasks)}")`,
                            experiment: "Try removing an item that isn't in the list. What happens? How would you change the item at index 1 to 'Finish essay'?"
                        },
                        practice: {
                            template: `colors = ["red", "green", "blue"]\n\n# Add a new color to the end of the list\ncolors.____("yellow")\n\n# Get the second item from the list\nsecond_color = colors[____]\nprint(second_color)`,
                            expectedKeywords: ["green"]
                        },
                        apply: {
                            challenge: "Create a program that manages a list of party guests. Start with an initial list of 3 guests. Then, ask the user for a new guest to add. After adding them, print the total number of guests attending.",
                            hints: ["Create a list with 3 initial string values.", "Use `input()` to get the name of the new guest.", "Use the `.append()` method to add the new guest to the list.", "Use `len()` to find the total count."]
                        },
                        master: {
                            assessment: "Build a simple to-do list manager. Start with an empty list. Ask the user to add three tasks to the list. After they've added all three, print the full list. Then, tell them what the first and last tasks on their list are.",
                            criteria: ["Starts with an empty list.", "Correctly appends three user inputs to the list.", "Prints the final list.", "Correctly identifies and prints the items at the first index (0) and the last index (-1)."]
                        }
                    },
                    practiceBlanks: ["append", "1"],
                    tests: [{ name: "Prints the second color", expect: ["green"] }]
                }
            },
        }
    },
    "1": { // Chapter 2
        title: "Control Flow Mastery",
        episodes: {
            "0": { // Episode 1
                title: "Deeper into if-elif-else",
                content: {
                    stageContent: {
                        discover: {
                            title: "Combining Conditions with `and` & `or`!",
                            analogy: "Think of `and` as a strict bouncer at a club: you need ID *and* a ticket to get in. Both must be true. `or` is more relaxed: you can get a discount if you're a student *or* a senior. Only one needs to be true.",
                            codeSample: `age = 25\nhas_ticket = True\n\nif age >= 18 and has_ticket:\n    print("Welcome to the show!")`,
                            microQuiz: "What would happen if `has_ticket` was `False`?"
                        },
                        explore: {
                            demoCode: `day = "Saturday"\nweather = "Sunny"\n\nif day == "Saturday" and weather == "Sunny":\n    print("Let's go to the beach!")\n\nelif day == "Saturday" and weather == "Rainy":\n    print("Let's watch a movie.")\n\nif day == "Sunday" or weather == "Sunny":\n    print("It's a good day for a walk.")`,
                            experiment: "Change the values of `day` and `weather`. Which combination will trigger both print statements?"
                        },
                        practice: {
                            template: `is_weekend = True\nis_holiday = False\n\n# We can go on a trip if it's a weekend OR a holiday\nif is_weekend ____ is_holiday:\n    print("Time for a trip!")`,
                            expectedKeywords: ["Time for a trip!"]
                        },
                        apply: {
                            challenge: "Write a login system. Ask for a username and a password. Access is granted only if the username is 'admin' AND the password is 'password123'.",
                            hints: ["You'll need two `input()` calls.", "Your `if` statement will need to check two conditions combined with `and`."]
                        },
                        master: {
                            assessment: "Create a program to decide if a user gets a shipping discount. A user gets a discount if they are a premium member, OR if their order total is over $100. Ask the user if they are a premium member ('yes' or 'no') and what their order total is. Print whether they get the discount or not.",
                            criteria: ["Correctly gets both inputs from the user.", "Uses an `or` condition to check the two criteria.", "Prints the correct discount status for all possible combinations."]
                        }
                    },
                    practiceBlanks: ["or"],
                    tests: [{ name: "Prints correct message", expect: ["Time for a trip!"] }]
                }
            },
            "1": { // Episode 2
                title: "Repeating with `for` Loops",
                content: {
                    stageContent: {
                        discover: {
                            title: "Loops do things over and over!",
                            analogy: "A `for` loop is like an assembly line worker who performs the exact same action on every item that comes down the conveyor belt. The 'conveyor belt' is a list or another sequence.",
                            // FIX: Corrected Python f-string syntax to use {var} instead of ${var}.
                            codeSample: `fruits = ["apple", "banana", "cherry"]\n\nfor fruit in fruits:\n    print(f"I like {fruit}s!")`,
                            microQuiz: "What is the variable `fruit` called in this context, and what does it hold each time the loop runs?"
                        },
                        explore: {
                            demoCode: `# The range() function is great for looping a specific number of times.\n# range(5) generates numbers from 0 up to (but not including) 5.\n\nprint("Counting to 4:")\nfor number in range(5):\n    print(number)\n\nprint("\\nBlast off!")\nfor i in range(10, 0, -1):\n    print(i)\nprint("LIFTOFF!")`,
                            experiment: "How would you change the `range()` function to count from 1 to 10? How would you make it count only the even numbers up to 10?"
                        },
                        practice: {
                            // FIX: Corrected Python f-string syntax to use {var} instead of ${var}.
                            template: `numbers = [1, 2, 3, 4, 5]\ntotal = 0\n\nfor num in ____:\n    total = total + ____\n\nprint(f"The sum is: {total}")`,
                            expectedKeywords: ["The sum is: 15"]
                        },
                        apply: {
                            challenge: "You have a list of guest names. Write a `for` loop that goes through the list and prints a personalized invitation for each guest, like 'Hi [Guest Name], you're invited to the party!'",
                            hints: ["Create a list of names first.", "Use a `for` loop to iterate through the list.", "Inside the loop, use an f-string to print the invitation."]
                        },
                        master: {
                            assessment: "Ask the user for a number. Then, use a `for` loop and the `range()` function to print out the multiplication table for that number, from 1 to 10. For example, if the user enters 5, it should print '5 x 1 = 5', '5 x 2 = 10', etc., up to '5 x 10 = 50'.",
                            criteria: ["Gets a number from the user.", "Uses a `for` loop with `range(1, 11)`.", "Prints 10 lines of output.", "Each line is correctly formatted with the multiplication equation and result."]
                        }
                    },
                    practiceBlanks: ["numbers", "num"],
                    tests: [{ name: "Calculates correct sum", expect: ["The sum is: 15"] }]
                }
            },
            "2": { // Episode 3
                title: "Conditional `while` Loops",
                content: {
                    stageContent: {
                        discover: {
                            title: "Looping while a condition is true!",
                            analogy: "A `while` loop is like a toddler repeatedly asking 'Are we there yet?'. As long as the answer (the condition) is 'no' (`False`), they keep asking. They only stop when the answer is 'yes' (`True`).",
                            // FIX: Corrected Python f-string syntax and comment style.
                            codeSample: `count = 0\n\nwhile count < 5:\n    print(f"Count is {count}")\n    count = count + 1 # CRITICAL! Don't forget to change the condition!`,
                            microQuiz: "What would happen if you forgot the line `count = count + 1`?"
                        },
                        explore: {
                            // FIX: Corrected Python f-string syntax.
                            demoCode: `import random\n\nmagic_number = random.randint(1, 10)\nguess = 0\n\nwhile guess != magic_number:\n    guess = int(input("Guess a number between 1 and 10: "))\n    if guess < magic_number:\n        print("Too low!")\n    elif guess > magic_number:\n        print("Too high!")\n\nprint(f"You got it! The number was {magic_number}.")`,
                            experiment: "Run the code and play the guessing game. Think about the `while` loop's condition. What makes it stop?"
                        },
                        practice: {
                            // FIX: Corrected Python f-string syntax.
                            template: `command = ""\n\n# Keep asking until the user types 'quit'\nwhile command != "quit":\n    command = ____("Enter a command: ")\n    print(f"You entered: {command}")`,
                            expectedKeywords: []
                        },
                        apply: {
                            challenge: "Create a simple countdown program. Ask the user for a number to start from. Then, use a `while` loop to print the numbers from their chosen number down to 1, and then finally print 'Liftoff!'.",
                            hints: ["Get a starting number and store it in a variable.", "The `while` loop condition should be `while number > 0`.", "Inside the loop, print the number and then decrease it by 1 (`number = number - 1`)."]
                        },
                        master: {
                            assessment: "Build a program that calculates the sum of numbers entered by a user. The program should keep asking for numbers until the user enters 'done'. Once they do, the program should print the total sum of all numbers entered. Be careful to handle the user's input correctly.",
                            criteria: ["Uses a `while` loop that checks for the 'done' command.", "Correctly converts numeric input to numbers for calculation.", "Maintains a running total.", "Prints the final correct sum after the loop finishes."]
                        }
                    },
                    practiceBlanks: ["input"],
                    tests: [{ name: "Loops until quit", expect: [] }]
                }
            },
            "3": { // Episode 4
                title: "Controlling Loops with `break` and `continue`",
                content: {
                    stageContent: {
                        discover: {
                            title: "Breaking out of loops!",
                            analogy: "`break` is like the emergency stop button on a machine. It halts the entire process immediately, no matter what. `continue` is like a quality control check; it says 'this item is bad, skip it and go to the next one' without stopping the whole line.",
                            // FIX: Corrected Python comment syntax from `//` to `#`.
                            codeSample: `for number in range(10):\n    if number == 5:\n        break # Stop the loop entirely\n    print(number)`,
                            microQuiz: "What is the last number this code will print?"
                        },
                        explore: {
                            // FIX: Corrected Python comment syntax from `//` to `#`.
                            demoCode: `print("Using continue to skip odd numbers:")\nfor i in range(10):\n    if i % 2 != 0: # If the number is odd\n        continue   # Skip the rest of this iteration\n    print(i)\n\nprint("\\nUsing break to find a user:")\nusers = ["Alice", "Bob", "Charlie", "David"]\nfor user in users:\n    if user == "Charlie":\n        print("Found Charlie!")\n        break`,
                            experiment: "How would you modify the `continue` example to print only the odd numbers? In the `break` example, what happens if you search for a user who isn't in the list?"
                        },
                        practice: {
                            // FIX: Corrected Python comment syntax from `//` to `#`.
                            template: `numbers = [1, -2, 3, -4, 5]\n\nfor num in numbers:\n    if num < 0:\n        ____ # Skip negative numbers\n    print(num)`,
                            expectedKeywords: ["1", "3", "5"]
                        },
                        apply: {
                            challenge: "Write a program that searches for a specific number in a list of numbers. If it finds the number, it should print 'Number found!' and stop searching immediately. If it goes through the whole list without finding it, it should print 'Number not found.' (Hint: you might need a variable to keep track).",
                            hints: ["Use a `for` loop to iterate the list.", "Inside the loop, use an `if` statement to check for the number.", "If you find it, print the message and use `break`."]
                        },
                        master: {
                            assessment: "Create a data processing loop. You have a list of strings representing records. Some records are marked as 'INVALID'. Your program should loop through the list, print 'Processing record: [record]' for valid records, and print 'Skipping invalid record.' for invalid ones. If it encounters a record called 'STOP', it must immediately terminate the loop and print 'Processing stopped.'.",
                            criteria: ["Correctly uses `continue` for 'INVALID' records.", "Correctly uses `break` for the 'STOP' record.", "Handles valid records appropriately.", "The loop terminates correctly and doesn't process items after 'STOP'."]
                        }
                    },
                    practiceBlanks: ["continue"],
                    tests: [{ name: "Prints only positive numbers", expect: ["1\n3\n5"] }]
                }
            },
             "4": { // Episode 5
                title: "Nested Structures",
                content: {
                    stageContent: {
                        discover: {
                            title: "Putting loops inside loops!",
                            analogy: "A nested loop is like the hands of a clock. The minute hand (`inner loop`) has to complete a full 60-minute cycle for the hour hand (`outer loop`) to move just one position.",
                            // FIX: Corrected Python f-string syntax and comment style.
                            codeSample: `for i in range(3): # Outer loop\n    print(f"Outer loop iteration {i}")\n    for j in range(2): # Inner loop\n        print(f"  Inner loop iteration {j}")`,
                            microQuiz: "How many times will the inner loop's print statement run in total?"
                        },
                        explore: {
                            demoCode: `rows = 5\ncolumns = 5\n\nfor r in range(rows):\n    line_to_print = ""\n    for c in range(columns):\n        line_to_print += "* "\n    print(line_to_print)`,
                            experiment: "How would you change this code to print a triangle instead of a square? Hint: Think about how the `range()` of the inner loop could depend on the outer loop's variable (`r`)."
                        },
                        practice: {
                            // FIX: Corrected Python f-string syntax and comment style.
                            template: `groups = [["Alice", "Bob"], ["Charlie", "David"]]\n\n# Loop through each group\nfor group in ____:\n    # Loop through each person in the group\n    for person in ____:\n        print(f"Hello, {person}!")`,
                            expectedKeywords: ["Alice", "Bob", "Charlie", "David"]
                        },
                        apply: {
                            challenge: "You have a list of lists representing a simple 2D grid or map, like `[[1, 2], [3, 4]]`. Write nested `for` loops to iterate through each row and then each cell in that row, printing out the value of each cell.",
                            hints: ["The outer loop will iterate through the main list (the rows).", "The inner loop will iterate through the row you got from the outer loop."]
                        },
                        master: {
                            assessment: "Generate a list of all coordinate pairs from (0,0) to (2,2). You should end up with a list of lists, like `[[0,0], [0,1], [0,2], [1,0], ...]`. Use nested `for` loops to generate these pairs and append them to a list.",
                            criteria: ["Initializes an empty list to store the results.", "Uses an outer loop, for example `for x in range(3)`.", "Uses an inner loop, for example `for y in range(3)`.", "Correctly creates a pair `[x, y]` and appends it to the results list in each inner iteration."]
                        }
                    },
                    practiceBlanks: ["groups", "group"],
                    tests: [{ name: "Greets all people", expect: ["Hello, Alice!", "Hello, Bob!", "Hello, Charlie!", "Hello, David!"] }]
                }
            }
        }
    }
};


export const getCurriculumSlice = (chapterIndex: number, episodeIndex: number): Partial<AppContext["curriculumSlice"]> => {
    return curriculum[chapterIndex]?.episodes?.[episodeIndex]?.content ?? {
        stageContent: {},
        practiceBlanks: [],
        tests: []
    };
};
