import tkinter as tk            # Python tkinter properties
from PIL import ImageTk, Image  # Python image loading

# Declare global variables
w = 400 # Root window width
h = 300 # Root window height

class App:
    def __init__(self, root):

        # Set root window size and block resizing
        root.geometry(f"{w}x{h}")
        root.resizable(width=False, height=False)

        # Create the background image
        self.bk_img = ImageTk.PhotoImage(Image.open("greenBackground.jpg"))

        # Create the background canvas
        self.canvas_bkg = tk.Canvas(root, width=w, height=h, bd=0, highlightthickness=0)
        self.canvas_bkg.pack(fill="both", expand=True)

        # Place the background image onto the canvas
        self.canvas_img = self.canvas_bkg.create_image(0, 0, image=self.bk_img, anchor="nw")

        # Create the buttons and place them onto the canvas
        self.createButtons(root)

    # Takes in the root window as param, creates the main buttons and places them on the canvas
    def createButtons(self, root):
        self.startGame = tk.Button(root, text="Start Game", font="Helvetica", border=5, width=11)
        self.leaderBoard = tk.Button(root, text="LeaderBoard", font="Helvetica", border=5, width=11)
        self.howToPlay = tk.Button(root, text="How To Play", font="Helvetica", border=5, width=11)
        self.options = tk.Button(root, text="Options", font="Helvetica", border=5, width=11)

        self.startGame_window = self.canvas_bkg.create_window(w/2, 75, window=self.startGame)
        self.leaderBoard_window = self.canvas_bkg.create_window(w/2, 125, window=self.leaderBoard)
        self.howToPlay_window = self.canvas_bkg.create_window(w/2, 175, window=self.howToPlay)
        self.options_window = self.canvas_bkg.create_window(w/2, 225, window=self.options)

if __name__ == '__main__':
    root_window = tk.Tk() # Create main window
    gui = App(root_window) # Create GUI
    root_window.mainloop() # Main loop
