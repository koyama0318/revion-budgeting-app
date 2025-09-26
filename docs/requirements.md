# Household Accounting App - Requirements

## Functional Requirements

1. Income Management

   - Register income (amount, date, category, optional memo)
   - Edit income
   - Delete income

2. Expense Management

   - Register expense (amount, date, category, optional memo)
   - Edit expense
   - Delete expense

3. Category Management

   - Add categories (name, type: Income/Expense, color, optional budget)
   - Edit categories
   - Delete categories

4. Monthly Reporting

   - Generate a monthly summary report
   - Calculate total income and expense
   - Show breakdown by category

5. Budget Management

   - Assign budgets to categories
   - Monitor expenses against budgets

## Non-Functional Requirements

1. CQRS and Event Sourcing architecture
2. Support for full audit trail of changes
3. Responsive and fast read model queries
4. Scalability for growing number of transactions
5. Error handling for invalid operations (e.g., editing a deleted record)
