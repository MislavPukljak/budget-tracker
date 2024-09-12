import { Component, inject, OnInit } from '@angular/core';
import { BudgetCardConfig } from '../../interfaces/ui-config/budget-card-config.interface';
import { TableDateConfig } from '../../interfaces/ui-config/table-data-config.interface';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ExpenseService } from '../../services/expense.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Expense } from '../../interfaces/models/expense.interface';
import { BudgetService } from '../../services/budget.service';
import { BudgetCardComponent } from "../../components/budget-card/budget-card.component";
import { FormWrapperComponent } from "../../components/form-wrapper/form-wrapper.component";
import { v4 as uuidv4 } from 'uuid';
import { TableComponent } from "../../components/table/table.component";
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'app-budget-details',
  standalone: true,
  imports: [
    BudgetCardComponent,
    FormWrapperComponent,
    ReactiveFormsModule,
    TableComponent
],
  templateUrl: './budget-details.component.html',
  styleUrl: './budget-details.component.scss'
})
export class BudgetDetailsComponent implements OnInit {
  private router = inject(Router);
  private expenseService = inject(ExpenseService);
  private activatedRoute = inject(ActivatedRoute);
  private budgetService = inject(BudgetService);
  uiService = inject(UiService);

    budgetCard!: BudgetCardConfig;
    expenseTableData: TableDateConfig[] = [];
    budgetId: string = '';

    expenseForm: FormGroup = new FormGroup({
      name:  new FormControl('', [Validators.required]),
      amount: new FormControl(null, [Validators.required]),
    })
  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.budgetId = params['id'];
      this.initializeData();

      const expenses = this.expenseService.getExpensesByBudgetId(this.budgetId);
      this.expenseTableData = this.expenseService.buildExpenseTable(expenses);

      this.expenseService.getExpenseData().subscribe({
        next: (res: Expense[]) => {
          const expenses = this.expenseService.getExpensesByBudgetId(this.budgetId);
          this.expenseTableData = this.expenseService.buildExpenseTable(expenses);
        },
        error: (err: any) => {
          console.error(err);
        }
      });      
    });
  }

  addExpense() {
    const category = this.budgetService.getBudgetCategoryById(this.budgetId);
    console.log(category);
    const expense: Expense = {
      id: uuidv4(),
      name: this.expenseForm.value.name,
      budgetCategory: category,
      amount: parseFloat(this.expenseForm.value.amount),
      date: new Date()
    }
    // add expense
    this.expenseService.addExpense(expense);
    this.expenseForm.reset();

    this.initializeData();
  }

  initializeData() {
    const budget = this.budgetService.getBudgetById(this.budgetId);

    this.budgetCard = {
      name: budget.name,
      budget: budget.budget,
      spent: budget.spent,
      color: budget.color,
      onClick: () => {
        this.deleteBudget();
      }
    }
  }

  deleteBudget() {
    this.expenseService.deleteExpenseBudgetId(this.budgetId);
    this.budgetService.deleteBudgetById(this.budgetId);
    this.router.navigateByUrl('');
  }

  handleAction($event: TableDateConfig) {
    this.expenseService.deleteExpenseById($event.id);
    this.initializeData();

  }
}

