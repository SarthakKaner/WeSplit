# 💰 WeSplit - Expense Splitting Made Easy

WeSplit is designed to simplify group expense management, making it effortless to split bills, track balances, and settle up with friends, colleagues, or flatmates. Whether it's a trip, shared living, or team lunch, WeSplit eliminates manual calculations and confusion, providing a transparent, real-time overview of who owes what. The goal is to reduce friction in group finances, automate tedious tasks, and help everyone stay organized and stress-free.

## 🌟 Features

### 💸 **Smart Expense Management**

- Create and manage multiple groups
- Add expenses with flexible splitting options
- Real-time balance calculations
- Category-based expense tracking
- Recurring expense automation

### 📊 **Analytics Dashboard**

- Interactive charts and visualizations
- Monthly spending trends
- Category-wise expense breakdown
- Personal balance overview
- Recent activity tracking

![Dashboard Screenshot](./docs/images/app-preview.png)

<!-- Add dashboard screenshot showing charts and analytics -->

### 👥 **Advanced Group Management**

- Invite members via Email, WhatsApp, SMS
- Real-time member search
- Balance tracking per member
- Group chat functionality
- Member status indicators

![Group Management](./docs/images/group-management.png)

<!-- Add screenshot of group details page with members list -->

### 📱 **Responsive Design**

- Mobile-first approach
- Floating action button for mobile navigation
- Touch-friendly interface
- Cross-platform compatibility
- Progressive Web App features

![Mobile View](./docs/images/mobile-view.png)

<!-- Add mobile screenshots showing responsive design -->

## 🚀 Tech Stack

### **Frontend**

- **React 18** - Modern UI library with hooks
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icon library
- **React Router** - Client-side routing

### **State Management**

- **React Context API** - Global state management
- **Custom Hooks** - Reusable stateful logic
- **Local Storage** - Data persistence

### **Communication Services**

- **EmailJS** - Direct email integration
- **WhatsApp API** - Smart messaging
- **Web APIs** - Native sharing & clipboard

## 📁 Project Structure

```
src/
├── components/
│   ├── Auth/           # Login & SignUp components
│   ├── Chat/           # Real-time chat functionality
│   ├── Dashboard/      # Analytics & overview
│   ├── Expense/        # Expense management
│   ├── Group/          # Group management & invites
│   ├── Layout/         # Navigation & layout
│   ├── OCR/            # Receipt scanning (future)
│   └── Profile/        # User profile management
├── contexts/           # React Context providers
├── services/           # External API integrations
└── utils/              # Helper functions
```

## 🛠️ Installation & Setup

### Prerequisites

- Node.js 16+
- npm or yarn
- Modern web browser

### Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/wesplit.git
cd wesplit

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser
http://localhost:5173
```




## 📱 Usage Guide

### 1. **Creating Your First Group**

![Create Group](./docs/images/create-group.png)

<!-- Add screenshot of group creation process -->

1. Click "Create Group" from dashboard
2. Enter group name (e.g., "Goa Trip", "Office Lunch", "Flatmates")
3. Add description (e.g., "Weekend getaway expenses")
4. Start adding expenses immediately
5. Invite members later using multiple methods

### 2. **Adding Expenses**

![Add Expense](./docs/images/add-expense.png)

<!-- Add screenshot of expense creation modal -->

1. Navigate to group → Expenses tab
2. Click "Add Expense"
3. Enter amount in rupees (₹500, ₹1,200)
4. Add description (e.g., "Dinner at restaurant", "Movie tickets")
5. Choose splitting method (equal/custom)
6. Select participants


## 🔧 Advanced Features

### **Smart Invitation System**

```javascript
// Multi-platform invitation support
- Email: Opens default mail client
- WhatsApp: Smart mobile/desktop detection
- SMS: Native messaging app integration
- Share: Device-native sharing options
```

### **Responsive Navigation**

```javascript
// Adaptive UI based on screen size
- Desktop: Traditional sidebar
- Mobile: Floating action button
- Touch-optimized interactions
```



## 🔮 Future Enhancements


- [ ] Multi-currency support (₹, $, €)
- [ ] Push notifications in Hindi/English
- [ ] Dark mode theme
- [ ] Export to PDF/Excel
- [ ] Payment gateway integration (Razorpay, Paytm)

