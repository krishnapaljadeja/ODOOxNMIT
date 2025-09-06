
> Empowering sustainable consumption through a trusted second-hand marketplace

EcoFinds is a modern, user-friendly platform that revolutionizes how people buy and sell pre-owned goods. Built with sustainability at its core, EcoFinds extends product lifecycles, reduces waste, and makes responsible consumption accessible to everyone.

## 🌟 Project Vision

**Create a vibrant and trusted platform** that fosters a culture of sustainability by connecting conscious consumers in a seamless, secure marketplace for pre-owned goods.

## ✨ Features

### Core Functionality
- 🔐 **Secure Authentication** - Simple email/password registration and login
- 👤 **User Profiles** - Customizable user dashboards with editable fields
- 📦 **Product Management** - Complete CRUD operations for product listings
- 🔍 **Smart Search** - Keyword search and category filtering
- 🛒 **Shopping Cart** - Add, update, and manage items before purchase
- 📈 **Purchase History** - Track all previous purchases and transactions

### Product Features
- 📸 **Image Support** - Image placeholders for product listings
- 🏷️ **Categories** - Organized browsing with predefined categories
- 💰 **Pricing** - Flexible pricing for all product types
- 📝 **Detailed Listings** - Rich descriptions and product information

## 🚀 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **Express-validator** - Input validation

### Frontend (Planned)
- **React/React Native** - Cross-platform mobile and web interface
- **Responsive Design** - Mobile-first approach

## 🏗️ Architecture

```
EcoFinds/
├── src/
│   ├── config/           # Configuration files
│   ├── middleware/       # Express middleware
│   ├── models/          # Database models
│   ├── routes/          # API endpoints
│   └── utils/           # Utility functions
├── tests/               # Test files
├── public/              # Static files
└── docs/               # Documentation
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16+)
- MongoDB (v4.4+)
- npm or yarn package manager

### Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/your-username/ecofinds.git
cd ecofinds
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start the development server**
```bash
npm run dev
```

5. **Access the API**
- API Base URL: `http://localhost:3000/api`
- API Documentation: `http://localhost:3000/api/docs`

### Environment Variables

```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/ecofinds
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
```

## 📋 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Products
- `GET /api/products` - Get all products (with search/filter)
- `POST /api/products` - Create new product listing
- `GET /api/products/:id` - Get product details
- `PUT /api/products/:id` - Update product listing
- `DELETE /api/products/:id` - Delete product listing
- `GET /api/products/my-listings` - Get user's listings

### Cart
- `GET /api/cart` - Get cart contents
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item quantity
- `DELETE /api/cart/remove/:productId` - Remove item from cart

### Purchases
- `POST /api/purchases/process` - Process cart purchase
- `GET /api/purchases/history` - Get purchase history
- `GET /api/purchases/:id` - Get purchase details

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Docker Deployment
```bash
docker build -t ecofinds .
docker run -p 3000:3000 ecofinds
```

## 📊 Development Progress

### Phase 1: Foundation ✅
- [x] Project setup and configuration
- [x] Database connection
- [x] Basic middleware

### Phase 2: Authentication 🚧
- [x] User model and registration
- [x] Login and JWT implementation
- [x] Profile management

### Phase 3: Product Management 📋
- [x] Product model and CRUD operations
- [x] Category system
- [x] Search and filtering

### Phase 4: Cart & Purchases 📋
- [ ] Cart management system
- [ ] Purchase processing
- [ ] Purchase history

### Phase 5: Polish & Deploy 📋
- [ ] Error handling and validation
- [ ] Testing suite
- [ ] API documentation
- [ ] Performance optimization

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Vasu Manmoza** - Lead Developer (@vasumanmoza)

## 🎯 Hackathon Goals

This project is being developed for the **Odoo x NMIT Hackathon '25** with the following objectives:

- ✅ Functional prototype with mobile and desktop interfaces
- ✅ Complete user authentication system
- ✅ Product listing and management features
- ✅ Search and filtering capabilities
- ✅ Responsive, user-friendly design
- ✅ Efficient data structures and stable performance

## 📞 Support

For support, email vasumanmoza@example.com or create an issue in this repository.

## 🚀 Future Roadmap

- 📱 Mobile app development (React Native)
- 💬 In-app messaging between buyers and sellers
- ⭐ Rating and review system
- 📧 Email notifications for purchases and listings
- 🔄 Advanced recommendation engine
- 💳 Payment gateway integration
- 📍 Location-based searching
- 🌍 Multi-language support

---

**Made with ❤️ for a sustainable future**