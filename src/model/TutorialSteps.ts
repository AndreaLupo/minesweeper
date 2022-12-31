export type Step = {
  text: string;
  index: number;
  isSelected: boolean;
};

export const steps: Step[] = [
  {
    index: 0,
    text: "You have to open all the empty cells, without clicking on a bomb.",
    isSelected: true,
  },
  {
    index: 1,
    text: "First, you have to left-click on the first cell to open it! ",
    isSelected: false,
  },
  {
    index: 2,
    text: "Each open cell has a number, that tells the number of bombs around that cell.",
    isSelected: false,
  },
  {
    index: 3,
    text: "The selected cell has one bomb around it.",
    isSelected: false,
  },
  {
    index: 4,
    text: "Right-click on the selected cell to set a flag.",
    isSelected: false,
  },
  {
    index: 5,
    text: "You can open the selected cell, since the 1 next to it already has a bomb.",
    isSelected: false,
  },
  {
    index: 6,
    text: "By now, you don't know if there is a bomb or not here. You can set a question mark by left-clicking twice.",
    isSelected: false,
  },
  {
    index: 7,
    text: "You can set bombs in the closed cells around the selected cell: there are only 2 cells closed.",
    isSelected: false,
  },
  {
    index: 8,
    text: "The selected cell has already all the required flags: if you click on it, all cells around will be opened.",
    isSelected: false,
  },
  {
    index: 9,
    text: "You can now complete the game!",
    isSelected: false,
  },
];