# Household Accounting App - Design (CQRS + Event Sourcing)

This document provides a detailed design for the Household Accounting App using CQRS and Event Sourcing, including aggregate models, read models, deciders, reducers, policies, projections, and queries.

## type

### Aggregate Models

#### Income

- **States**

  - `Recorded`: { id: string, amount: number, date: string, categoryId: string, memo?: string }
  - `Edited`: { id: string, amount: number, date: string, categoryId: string, memo?: string }
  - `Deleted`: { id: string }

- **Commands**

  - `AddIncome`: { id: string, amount: number, date: string, categoryId: string, memo?: string }
  - `EditIncome`: { id: string, amount: number, date: string, categoryId: string, memo?: string }
  - `DeleteIncome`: { id: string }

- **Events**
  - `IncomeAdded`: { id: string, amount: number, date: string, categoryId: string, memo?: string }
  - `IncomeEdited`: { id: string, amount: number, date: string, categoryId: string, memo?: string }
  - `IncomeDeleted`: { id: string }

---

#### Expense

- **States**

  - `Recorded`: { id: string, amount: number, date: string, categoryId: string, memo?: string }
  - `Edited`: { id: string, amount: number, date: string, categoryId: string, memo?: string }
  - `Deleted`: { id: string }

- **Commands**

  - `AddExpense`: { id: string, amount: number, date: string, categoryId: string, memo?: string }
  - `EditExpense`: { id: string, amount: number, date: string, categoryId: string, memo?: string }
  - `DeleteExpense`: { id: string }

- **Events**
  - `ExpenseAdded`: { id: string, amount: number, date: string, categoryId: string, memo?: string }
  - `ExpenseEdited`: { id: string, amount: number, date: string, categoryId: string, memo?: string }
  - `ExpenseDeleted`: { id: string }

---

#### Category

- **States**

  - `Created`: { id: string, name: string, type: 'Income' | 'Expense', color?: string, budget?: number }
  - `Edited`: { id: string, name?: string, color?: string, budget?: number }
  - `Deleted`: { id: string }

- **Commands**

  - `AddCategory`: { id: string, name: string, type: 'Income' | 'Expense', color?: string, budget?: number }
  - `EditCategory`: { id: string, name?: string, color?: string, budget?: number }
  - `DeleteCategory`: { id: string }

- **Events**
  - `CategoryAdded`: { id: string, name: string, type: 'Income' | 'Expense', color?: string, budget?: number }
  - `CategoryEdited`: { id: string, name?: string, color?: string, budget?: number }
  - `CategoryDeleted`: { id: string }

---

### ReadModels

- `IncomeList`: { incomes: Array<{ id: string, amount: number, date: string, categoryId: string, memo?: string }> }
- `ExpenseList`: { expenses: Array<{ id: string, amount: number, date: string, categoryId: string, memo?: string }> }
- `CategoryList`: { categories: Array<{ id: string, name: string, type: 'Income' | 'Expense', color?: string, budget?: number }> }
- `MonthlyReport`: { month: string, totalIncome: number, totalExpense: number, byCategory: Record<string, number> }

---

## Income Aggregate

### Decider

| command      | state    | event         |
| ------------ | -------- | ------------- |
| AddIncome    | Recorded | IncomeAdded   |
| AddIncome    | Edited   | IncomeAdded   |
| AddIncome    | Deleted  | IncomeAdded   |
| EditIncome   | Recorded | IncomeEdited  |
| EditIncome   | Edited   | IncomeEdited  |
| EditIncome   | Deleted  | None / Error  |
| DeleteIncome | Recorded | IncomeDeleted |
| DeleteIncome | Edited   | IncomeDeleted |
| DeleteIncome | Deleted  | None / Error  |

### Reducer

| event         | state    | newState |
| ------------- | -------- | -------- |
| IncomeAdded   | Recorded | Recorded |
| IncomeAdded   | Edited   | Recorded |
| IncomeAdded   | Deleted  | Recorded |
| IncomeEdited  | Recorded | Edited   |
| IncomeEdited  | Edited   | Edited   |
| IncomeDeleted | Recorded | Deleted  |
| IncomeDeleted | Edited   | Deleted  |

### Policy

| event | command |
| ----- | ------- |
| None  | None    |

### Projection

| event         | readModel  | newReadModel               |
| ------------- | ---------- | -------------------------- |
| IncomeAdded   | IncomeList | Append the added income    |
| IncomeEdited  | IncomeList | Update the targeted income |
| IncomeDeleted | IncomeList | Remove the targeted income |

### Query

| query             | readModel  | result                         |
| ----------------- | ---------- | ------------------------------ |
| GetIncomeList     | IncomeList | List of all incomes            |
| GetIncomeById(id) | IncomeList | Details of the targeted income |

---

## Expense Aggregate

### Decider

| command       | state    | event          |
| ------------- | -------- | -------------- |
| AddExpense    | Recorded | ExpenseAdded   |
| AddExpense    | Edited   | ExpenseAdded   |
| AddExpense    | Deleted  | ExpenseAdded   |
| EditExpense   | Recorded | ExpenseEdited  |
| EditExpense   | Edited   | ExpenseEdited  |
| EditExpense   | Deleted  | None / Error   |
| DeleteExpense | Recorded | ExpenseDeleted |
| DeleteExpense | Edited   | ExpenseDeleted |
| DeleteExpense | Deleted  | None / Error   |

### Reducer

| event          | state    | newState |
| -------------- | -------- | -------- |
| ExpenseAdded   | Recorded | Recorded |
| ExpenseAdded   | Edited   | Recorded |
| ExpenseAdded   | Deleted  | Recorded |
| ExpenseEdited  | Recorded | Edited   |
| ExpenseEdited  | Edited   | Edited   |
| ExpenseDeleted | Recorded | Deleted  |
| ExpenseDeleted | Edited   | Deleted  |

### Policy

| event | command |
| ----- | ------- |
| None  | None    |

### Projection

| event          | readModel   | newReadModel                |
| -------------- | ----------- | --------------------------- |
| ExpenseAdded   | ExpenseList | Append the added expense    |
| ExpenseEdited  | ExpenseList | Update the targeted expense |
| ExpenseDeleted | ExpenseList | Remove the targeted expense |

### Query

| query              | readModel   | result                          |
| ------------------ | ----------- | ------------------------------- |
| GetExpenseList     | ExpenseList | List of all expenses            |
| GetExpenseById(id) | ExpenseList | Details of the targeted expense |

---

## Category Aggregate

### Decider

| command        | state   | event           |
| -------------- | ------- | --------------- |
| AddCategory    | Created | CategoryAdded   |
| AddCategory    | Edited  | CategoryAdded   |
| AddCategory    | Deleted | CategoryAdded   |
| EditCategory   | Created | CategoryEdited  |
| EditCategory   | Edited  | CategoryEdited  |
| EditCategory   | Deleted | None / Error    |
| DeleteCategory | Created | CategoryDeleted |
| DeleteCategory | Edited  | CategoryDeleted |
| DeleteCategory | Deleted | None / Error    |

### Reducer

| event           | state   | newState |
| --------------- | ------- | -------- |
| CategoryAdded   | Created | Created  |
| CategoryAdded   | Edited  | Created  |
| CategoryAdded   | Deleted | Created  |
| CategoryEdited  | Created | Edited   |
| CategoryEdited  | Edited  | Edited   |
| CategoryDeleted | Created | Deleted  |
| CategoryDeleted | Edited  | Deleted  |

### Policy

| event          | command                              |
| -------------- | ------------------------------------ |
| CategoryEdited | BudgetOverrunCheckCommand (optional) |

### Projection

| event           | readModel    | newReadModel                 |
| --------------- | ------------ | ---------------------------- |
| CategoryAdded   | CategoryList | Append the added category    |
| CategoryEdited  | CategoryList | Update the targeted category |
| CategoryDeleted | CategoryList | Remove the targeted category |

### Query

| query                   | readModel                               | result                                              |
| ----------------------- | --------------------------------------- | --------------------------------------------------- |
| GetCategoryList         | CategoryList                            | List of all categories                              |
| GetCategoryById(id)     | CategoryList                            | Details of the targeted category                    |
| GetMonthlyReport(month) | IncomeList + ExpenseList + CategoryList | Monthly summary (Income/Expense total, by category) |
