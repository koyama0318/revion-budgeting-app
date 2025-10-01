# Household Accounting App - Design (CQRS + Event Sourcing)

This document provides a detailed design for the Household Accounting App using CQRS and Event Sourcing, including aggregate models, read models, deciders, reducers, policies, projections, and queries.

## type

### Aggregate Models

#### Income

- **States**

  - `Recorded`: { id: string, amount: number, date: Date, categoryId: CategoryId, memo?: string }
  - `Deleted`: { id: string }

- **Commands**

  - `AddIncome`: { id: string, amount: number, date: Date, categoryId: CategoryId, memo?: string }
  - `EditIncome`: { id: string, categoryId: CategoryId, memo?: string }
  - `DeleteIncome`: { id: string }

- **Events**
  - `incomeAdded`: { id: string, payload: { amount: number, date: Date, categoryId: CategoryId, memo?: string } }
  - `incomeEdited`: { id: string, payload: { categoryId?: CategoryId, memo?: string } }
  - `incomeDeleted`: { id: string, payload: { date: Date, categoryId: CategoryId, amount: number } }

---

#### Expense

- **States**

  - `Recorded`: { id: string, amount: number, date: Date, categoryId: CategoryId, memo?: string }
  - `Deleted`: { id: string }

- **Commands**

  - `AddExpense`: { id: string, amount: number, date: Date, categoryId: CategoryId, memo?: string }
  - `EditExpense`: { id: string, categoryId: CategoryId, memo?: string }
  - `DeleteExpense`: { id: string }

- **Events**
  - `expenseAdded`: { id: string, payload: { amount: number, date: Date, categoryId: CategoryId, memo?: string } }
  - `expenseEdited`: { id: string, payload: { categoryId?: string, memo?: string } }
  - `expenseDeleted`: { id: string, payload: { date: Date, categoryId: CategoryId, amount: number } }

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
  - `categoryAdded`: { id: string, payload: { name: string } }
  - `categoryEdited`: { id: string, payload: { name?: string } }
  - `categoryDeleted`: { id: string }

---

### ReadModels

- `IncomeReadModel`: { type: 'income', id: string, amount: number, date: Date, categoryId: CategoryId, memo?: string, createdAt: Date, updatedAt: Date, deletedAt?: Date }
- `ExpenseReadModel`: { type: 'expense', id: string, amount: number, date: Date, categoryId: CategoryId, memo?: string, createdAt: Date, updatedAt: Date, deletedAt?: Date }
- `CategoryReadModel`: { type: 'category', id: string, name: string, createdAt: Date, updatedAt: Date, deletedAt?: Date }
- `MonthlyReportReadModel`: { type: 'monthlyReport', id: string, month: string, totalIncome: number, totalExpense: number, createdAt: Date, updatedAt: Date }

---

## Income Aggregate

### Decider

| command      | state    | event         |
| ------------ | -------- | ------------- |
| addIncome    | -        | incomeAdded   |
| editIncome   | recorded | incomeEdited  |
| deleteIncome | recorded | incomeDeleted |

### Reducer

| event         | state    | newState |
| ------------- | -------- | -------- |
| incomeAdded   | -        | recorded |
| incomeEdited  | recorded | recorded |
| incomeDeleted | recorded | deleted  |

### Policy

| event | command |
| ----- | ------- |
| None  | None    |

### Projection

| event         | readModel              | newReadModel               |
| ------------- | ---------------------- | -------------------------- |
| incomeAdded   | IncomeReadModel        | Append the added income    |
| incomeAdded   | MonthlyReportReadModel | Update monthly report      |
| incomeEdited  | IncomeReadModel        | Update the targeted income |
| incomeDeleted | IncomeReadModel        | Remove the targeted income |
| incomeDeleted | MonthlyReportReadModel | Update monthly report      |

### Query

| query   | readModel       | result                         |
| ------- | --------------- | ------------------------------ |
| incomes | IncomeReadModel | List of all incomes            |
| income  | IncomeReadModel | Details of the targeted income |

---

## Expense Aggregate

### Decider

| command       | state    | event          |
| ------------- | -------- | -------------- |
| addExpense    | -        | expenseAdded   |
| editExpense   | recorded | expenseEdited  |
| deleteExpense | recorded | expenseDeleted |

### Reducer

| event          | state    | newState |
| -------------- | -------- | -------- |
| expenseAdded   | -        | recorded |
| expenseEdited  | recorded | recorded |
| expenseDeleted | recorded | deleted  |

### Policy

| event | command |
| ----- | ------- |
| None  | None    |

### Projection

| event          | readModel              | newReadModel                |
| -------------- | ---------------------- | --------------------------- |
| expenseAdded   | ExpenseReadModel       | Append the added expense    |
| expenseAdded   | MonthlyReportReadModel | Update monthly report       |
| expenseEdited  | ExpenseReadModel       | Update the targeted expense |
| expenseDeleted | ExpenseReadModel       | Remove the targeted expense |
| expenseDeleted | MonthlyReportReadModel | Update monthly report       |

### Query

| query    | readModel        | result                          |
| -------- | ---------------- | ------------------------------- |
| expenses | ExpenseReadModel | List of all expenses            |
| expense  | ExpenseReadModel | Details of the targeted expense |

---

## Category Aggregate

### Decider

| command        | state  | event           |
| -------------- | ------ | --------------- |
| addCategory    | -      | categoryAdded   |
| editCategory   | active | categoryEdited  |
| deleteCategory | active | categoryDeleted |

### Reducer

| event           | state  | newState |
| --------------- | ------ | -------- |
| categoryAdded   | -      | active   |
| categoryEdited  | active | active   |
| categoryDeleted | active | inactive |

### Policy

| event          | command                              |
| -------------- | ------------------------------------ |
| categoryEdited | BudgetOverrunCheckCommand (optional) |

### Projection

| event           | readModel         | newReadModel                 |
| --------------- | ----------------- | ---------------------------- |
| categoryAdded   | CategoryReadModel | Append the added category    |
| categoryEdited  | CategoryReadModel | Update the targeted category |
| categoryDeleted | CategoryReadModel | Remove the targeted category |

### Query

| query          | readModel              | result                                 |
| -------------- | ---------------------- | -------------------------------------- |
| categories     | CategoryReadModel      | List of all categories                 |
| category       | CategoryReadModel      | Details of the targeted category       |
| monthlyReports | MonthlyReportReadModel | List of monthly reports                |
| monthlyReport  | MonthlyReportReadModel | Details of the targeted monthly report |
