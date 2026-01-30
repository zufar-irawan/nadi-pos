# Laporan Page Implementation Documentation

## Changes Made
This document records the changes made to implement the Reports (Laporan) feature.

### 1. `store/orderStore.ts`
- **Added Dummy Data**: Populated the store with more realistic order data for January 2026 to ensure charts are visualization-ready.
- **New Selectors**:
    - `getOrdersByMonth(month, year)`: Filters orders for a specific month.
    - `getOrdersByRange(startDate, endDate)`: Filters orders for a specific date range.

### 2. `app/reports.tsx` (New File)
- **Layout**: Created a new screen following the Dashboard design guidelines (White cards, soft shadows, Tailwind-like colors).
- **Features**:
    - **Header**: Standard "Laporan" header with back navigation.
    - **Metrics Cards**:
        - "Total Penjualan Hari Ini": Shows daily sales sum. Green text/icon indicates positive trend.
        - "Perkiraan Biaya": Shows 60% of sales as estimated cost. Red text indicates cost increase.
    - **Horizontal Charts**:
        - **Monthly Sales**: Scrollable horizontal view showing sales broken down by Week (1-4).
        - **Weekly Sales**: Shows sales broken down by Day (Mon-Sun).
        - Implementation: Custom Flexbox-based Bar Charts (No external libraries used).
    - **Cashflow Section**:
        - Displayed as a Donut/Pie Chart visualization.
        - Shows "Income" vs "Expense" (Mocked logic based on sales).
        - Custom CSS-in-JS implementation for the Donut visual using border styling.

### 3. Design Consistency
- colors:
  - Background: `#F9FAFB` (Gray-50)
  - Cards: `#FFF` (White)
  - Primary Text: `#111827` (Gray-900)
  - Accent Indigo: `#4F46E5`
  - Success Green: `#10B981`
  - Danger Red: `#EF4444` / `#7F1D1D`

## Future Improvements
- Connect "Expenses" to real inventory cost data once the `Product` model includes `costPrice`.
- Replace the custom View-based charts with `react-native-svg` or `react-native-gifted-charts` for better interactivity and complex visualizations (e.g. true Pie segments).
