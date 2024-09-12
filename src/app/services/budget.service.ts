import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Budget } from '../interfaces/models/budget.interface';
import { BudgetCategory } from '../interfaces/models/budget-category.interface';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  
  BUDGETS: string = 'BUDGETS';
  BUDGET_CATEGORIES: string = 'BUDGET_CATEGORIES';

  budgetSubject: Subject<Budget[]> = new Subject();
  budgetcategorySubject: Subject<BudgetCategory[]> = new Subject();

  addBudget(budget: Budget) {
    const budgets = this.getBudgets();
    budgets.push(budget);
    this.setBudget(budgets);
  }

  getBudgets(): Budget[] {
    const budgets = JSON.parse(localStorage.getItem(this.BUDGETS) || '[]') as Budget[];
    return budgets;
  }

  updateBudgetAmount(budgetId: string, spent: number) {
    const budgets = this.getBudgets();

    const index = budgets.findIndex(x=> x.id === budgetId);
    if (index > -1) {
      budgets[index].spent = spent;
      this.setBudget(budgets);
      return;      
    }

    throw Error('Can not update for a budget that does not exist');
  }

  getBudgetCategories(): BudgetCategory[] {
    const categories = JSON.parse(localStorage.getItem(this.BUDGET_CATEGORIES) || '[]') as BudgetCategory[];
    return categories;
  }

  getBudgetById(budgetId: string) {
    const budgets = this.getBudgets();
    const index = budgets.findIndex((item: Budget) => item.id === budgetId);
    if (index > -1) {
      return budgets[index];
    }

    throw Error('Budget does not exist');
  }

  getBudgetCategoryById(budgetCategoryId: string) {
    const categories = this.getBudgetCategories();
    const index = categories.findIndex((item: BudgetCategory) => item.id === budgetCategoryId);
    if (index > -1) {
      return categories[index];
    }

    throw Error('category does not exist');
  }

  setBudget (budgets: Budget[]) {
    localStorage.setItem(this.BUDGETS, JSON.stringify(budgets));

    const budgetCategories: BudgetCategory[] = budgets.map((item: Budget) => {
      return {
        id: item.id,
        name: item.name,
        color: item.color
      } as BudgetCategory;
    });

    this.setBudgetCategories(budgetCategories);
    this.budgetSubject.next(budgets);
  }

  deleteBudgetById(budgetId: string) {
    const budgets = this.getBudgets();

    const filtered = budgets.filter((item) => item.id !== budgetId);

    this.setBudget(filtered);
  }

  setBudgetCategories(budgetCategories: BudgetCategory[]) {
    localStorage.setItem(this.BUDGET_CATEGORIES, JSON.stringify(budgetCategories));
    this.budgetcategorySubject.next(budgetCategories);
  }

  getBudgetData() : Observable<Budget[]> {
    return this.budgetSubject;
  }

  getBudgetCategoryData() : Observable<BudgetCategory[]> {
    return this.budgetcategorySubject;
  }
}
