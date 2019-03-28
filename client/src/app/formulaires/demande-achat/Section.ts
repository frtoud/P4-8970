export class Section {
  name: string;
  color: string;
  assignedToIdx: number;
  constructor(name: string, color: string, assignedToIdx: number) {
    this.name = name;
    this.color = color;
    this.assignedToIdx = assignedToIdx;
  }
}
