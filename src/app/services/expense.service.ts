import { inject, Injectable, numberAttribute } from '@angular/core';
import { Expense } from '../interfaces/models/expense.interface';
import { BudgetService } from './budget.service';
import { Observable, Subject } from 'rxjs';
import { TableDateConfig } from '../interfaces/ui-config/table-data-config.interface';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  EXPENSES: string = 'EXPENSES';
  expenseSubject: Subject<Expense[]> = new Subject();
  private budgetService = inject(BudgetService);

  addExpense(expense: Expense) {
    try {
      const budget = this.budgetService.getBudgetById(expense.budgetCategory.id); 
      const expenses = this.getExpenses();
      expenses.push(expense);
      this.setExpense(expenses);
      this.updateExpense(expenses, budget.id);

    } catch (err: any) {
      throw Error(err.message);
    }
  }

  getExpenses() : Expense[] {
    const expenses = JSON.parse(localStorage.getItem('EXPENSES') || '[]') as Expense[];
    return expenses;
  }

  updateExpense(expenses: Expense[], budgetId: string) {
    const budgetExpenses = expenses.filter((item) =>
      item.budgetCategory.id === budgetId);

    const totalExpense = budgetExpenses.reduce((sum: number, current: Expense) => 
      sum + current.amount, 0)

    this.budgetService.updateBudgetAmount(budgetId, totalExpense);
  }

  buildExpenseTable(expenses: Expense[]) {
    return expenses.map((item: Expense) => {
      return {
        id: item.id,
        name: item.name,
        amount: item.amount,
        date: item.date,
        budget: item.budgetCategory.name,
        color: item.budgetCategory.color
      }
  }) as TableDateConfig[]


  }

  setExpense(expense: Expense[]) {
    localStorage.setItem(this.EXPENSES, JSON.stringify(expense));
    this.expenseSubject.next(expense);
  }

  deleteExpenseBudgetId(budgetId: string) {
    const expense = this.getExpenses();
    const deleted = expense.filter((expense: Expense) => expense.budgetCategory.id !== budgetId);
    this.setExpense(deleted);
  }

  deleteExpenseById(expenseId: string) {
    const expenses = this.getExpenses();
    const expense = expenses.filter((expense: Expense) => expense.id === expenseId)[0];
    if (!expense) {
      throw Error('Expense not found');
    }
    const deleted = expenses.filter((expense: Expense) => expense.id !== expenseId);
    this.setExpense(deleted);
    this.updateExpense(deleted, expense.budgetCategory.id);
  }

  getExpensesByBudgetId(budgetId: string): Expense[] {
    const expenses = this.getExpenses();
    return expenses.filter((expense: Expense) => expense.budgetCategory.id === budgetId);
  }

  getExpenseData(): Observable<Expense[]> {
    return this.expenseSubject;
  }
}
