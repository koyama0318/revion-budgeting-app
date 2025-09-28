# Household Accounting App - Design (CQRS + Event Sourcing)

This document provides a detailed design for the Household Accounting App using CQRS and Event Sourcing, including aggregate models, read models, deciders, reducers, policies, projections, and queries.

## type

### Aggregate Models

#### Income

- **States**

  - `Recorded`: { id: string, amount: number, date: string, categoryId: string, memo?: string }
  - `Deleted`: { id: string }

- **Commands**

  - `AddIncome`: { id: string, amount: number, date: string, categoryId: string, memo?: string }
  - `EditIncome`: { id: string, categoryId: string, memo?: string }
  - `DeleteIncome`: { id: string }

- **Events**
  - `IncomeAdded`: { id: string, amount: number, date: string, categoryId: string, memo?: string }
  - `IncomeEdited`: { id: string, categoryId?: string, memo?: string }
  - `IncomeDeleted`: { id: string }

---

#### Expense

- **States**

  - `Recorded`: { id: string, amount: number, date: string, categoryId: string, memo?: string }
  - `Deleted`: { id: string }

- **Commands**

  - `AddExpense`: { id: string, amount: number, date: string, categoryId: string, memo?: string }
  - `EditExpense`: { id: string, categoryId: string, memo?: string }
  - `DeleteExpense`: { id: string }

- **Events**
  - `ExpenseAdded`: { id: string, amount: number, date: string, categoryId: string, memo?: string }
  - `ExpenseEdited`: { id: string, categoryId?: string, memo?: string }
  - `ExpenseDeleted`: { id: string }

---

#### Category

- **States**

  - `Active`: { id: string, name: string }
  - `Inactive`: { id: string }

- **Commands**

  - `AddCategory`: { id: string, name: string }
  - `EditCategory`: { id: string, name?: string }
  - `DeleteCategory`: { id: string }

- **Events**
  - `CategoryAdded`: { id: string, name: string }
  - `CategoryEdited`: { id: string, name?: string }
  - `CategoryDeleted`: { id: string }

---

### ReadModels

- `IncomeList`: { incomes: Array<{ id: string, amount: number, date: string, categoryId: string, memo?: string }> }
- `ExpenseList`: { expenses: Array<{ id: string, amount: number, date: string, categoryId: string, memo?: string }> }
- `CategoryList`: { categories: Array<{ id: string, name: string }> }
- `MonthlyReport`: { month: string, totalIncome: number, totalExpense: number, byCategory: Record<string, number> }

---

## Income Aggregate

### Decider

| command      | state    | event         |
| ------------ | -------- | ------------- |
| AddIncome    | -        | IncomeAdded   |
| AddIncome    | Recorded | IncomeAdded   |
| AddIncome    | Deleted  | IncomeAdded   |
| EditIncome   | Recorded | IncomeEdited  |
| EditIncome   | Deleted  | None / Error  |
| DeleteIncome | Recorded | IncomeDeleted |
| DeleteIncome | Deleted  | None / Error  |

### Reducer

| event         | state    | newState |
| ------------- | -------- | -------- |
| IncomeAdded   | -        | Recorded |
| IncomeAdded   | Recorded | Recorded |
| IncomeAdded   | Deleted  | Recorded |
| IncomeEdited  | Recorded | Recorded |
| IncomeDeleted | Recorded | Deleted  |

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
| AddExpense    | -        | ExpenseAdded   |
| AddExpense    | Recorded | ExpenseAdded   |
| AddExpense    | Deleted  | ExpenseAdded   |
| EditExpense   | Recorded | ExpenseEdited  |
| EditExpense   | Deleted  | None / Error   |
| DeleteExpense | Recorded | ExpenseDeleted |
| DeleteExpense | Deleted  | None / Error   |

### Reducer

| event          | state    | newState |
| -------------- | -------- | -------- |
| ExpenseAdded   | -        | Recorded |
| ExpenseAdded   | Recorded | Recorded |
| ExpenseAdded   | Deleted  | Recorded |
| ExpenseEdited  | Recorded | Recorded |
| ExpenseDeleted | Recorded | Deleted  |

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

| command        | state    | event           |
| -------------- | -------- | --------------- |
| AddCategory    | -        | CategoryAdded   |
| AddCategory    | Active   | CategoryAdded   |
| AddCategory    | Inactive | CategoryAdded   |
| EditCategory   | Active   | CategoryEdited  |
| EditCategory   | Inactive | None / Error    |
| DeleteCategory | Active   | CategoryDeleted |
| DeleteCategory | Inactive | None / Error    |

### Reducer

| event           | state    | newState |
| --------------- | -------- | -------- |
| CategoryAdded   | -        | Active   |
| CategoryAdded   | Active   | Active   |
| CategoryAdded   | Inactive | Active   |
| CategoryEdited  | Active   | Active   |
| CategoryDeleted | Active   | Inactive |

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
