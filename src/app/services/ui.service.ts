import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UiService {

  generateRandomColor(counter: number): string {
    const colors = ['amber', 'red', 'blue'];
    const randomIndex = this.getRandomInt(0, colors.length - 1);
    return colors[randomIndex];
  }

  private getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  generateTailwindClass(color: string, type: string): string {
    // conver the color name to lowercase to ensure case insensitivity
    const colorName = color.toLowerCase();


    // Generate the class based on the type
    let tailwindClass;
    switch (type) {
      case 'bg':
        tailwindClass = color == 'amber' ? 'amber-bg' : color === 'red' ? 'red-bg' : 'blue-bg';
        break;
      case 'text':
        tailwindClass = color == 'amber' ? 'amber-text' : color === 'red' ? 'red-text' : 'blue-text';
        break;
      case 'border':
        tailwindClass = color === 'amber' ? `amber-border` : color === 'red' ? 'red-border' : 'blue-border';
        break;
        default:
          tailwindClass = '';
          console.warn('Invalid type provided. Use "bg", "text", or "border"');
        }
        
    return tailwindClass;
  }
}
