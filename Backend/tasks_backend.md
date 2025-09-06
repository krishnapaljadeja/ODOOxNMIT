# EcoFinds Backend Development Tasks

## Phase 1: Project Setup & Core Infrastructure

### Task 1.1: Initialize Project Structure
- [ ] Create new Node.js project with `npm init`
- [ ] Set up folder structure: `/src`, `/models`, `/routes`, `/middleware`, `/config`
- [ ] Install core dependencies: `express`, `mongoose`, `dotenv`, `cors`
- [ ] Create basic `server.js` with Express app initialization
- [ ] Test: Server starts without errors on port 3000

### Task 1.2: Database Connection Setup
- [ ] Install MongoDB connection dependencies
- [ ] Create `config/database.js` with MongoDB connection logic
- [ ] Set up environment variables in `.env` file
- [ ] Add connection error handling and retry logic
- [ ] Test: Database connects successfully with console confirmation

### Task 1.3: Basic Middleware Configuration
- [ ] Configure CORS middleware for cross-origin requests
- [ ] Set up JSON body parser middleware
- [ ] Add request logging middleware
- [ ] Configure static file serving for image placeholders
- [ ] Test: Basic GET request returns JSON response

## Phase 2: User Authentication System

### Task 2.1: User Model Creation
- [ ] Create `models/User.js` with Mongoose schema
- [ ] Define fields: email, password, username, createdAt, updatedAt
- [ ] Add email validation and uniqueness constraint
- [ ] Implement password hashing with bcrypt
- [ ] Test: User model saves to database correctly

### Task 2.2: User Registration Endpoint
- [ ] Create `routes/auth.js` file
- [ ] Implement POST `/api/auth/register` endpoint
- [ ] Add input validation for email, password, username
- [ ] Hash password before saving to database
- [ ] Return success/error responses with appropriate status codes
- [ ] Test: User can register with valid credentials

### Task 2.3: User Login Endpoint
- [ ] Install JWT dependencies (`jsonwebtoken`)
- [ ] Implement POST `/api/auth/login` endpoint
- [ ] Verify email exists and password matches
- [ ] Generate JWT token on successful login
- [ ] Return token and user info (excluding password)
- [ ] Test: User can login and receive valid JWT token

### Task 2.4: JWT Authentication Middleware
- [ ] Create `middleware/auth.js` for token verification
- [ ] Extract token from Authorization header
- [ ] Verify token and attach user info to request object
- [ ] Handle invalid/expired token errors
- [ ] Test: Protected routes reject invalid tokens

### Task 2.5: User Profile Endpoints
- [ ] Implement GET `/api/users/profile` to fetch user data
- [ ] Implement PUT `/api/users/profile` to update user data
- [ ] Add validation for profile updates
- [ ] Ensure users can only access their own profile
- [ ] Test: User can view and update their profile

## Phase 3: Product Management System

### Task 3.1: Product Model Creation
- [ ] Create `models/Product.js` with Mongoose schema
- [ ] Define fields: title, description, category, price, imageUrl, seller, createdAt
- [ ] Add validation for required fields and data types
- [ ] Create relationship with User model (seller reference)
- [ ] Test: Product model saves with valid data

### Task 3.2: Product Categories Setup
- [ ] Define predefined categories array in `config/categories.js`
- [ ] Include categories: Electronics, Clothing, Books, Home, Sports, Other
- [ ] Create GET `/api/products/categories` endpoint
- [ ] Add category validation in product model
- [ ] Test: Categories endpoint returns predefined list

### Task 3.3: Create Product Endpoint
- [ ] Implement POST `/api/products` endpoint
- [ ] Require authentication middleware
- [ ] Validate all required product fields
- [ ] Set seller field to authenticated user ID
- [ ] Handle image placeholder URL
- [ ] Test: Authenticated user can create product listing

### Task 3.4: Product Listing Retrieval
- [ ] Implement GET `/api/products` endpoint for all products
- [ ] Add pagination with limit and skip parameters
- [ ] Include basic product info and seller username
- [ ] Sort products by creation date (newest first)
- [ ] Test: Endpoint returns paginated product list

### Task 3.5: Product Detail Endpoint
- [ ] Implement GET `/api/products/:id` endpoint
- [ ] Populate seller information (username only)
- [ ] Handle invalid product ID errors
- [ ] Return complete product details
- [ ] Test: Single product details are retrieved correctly

### Task 3.6: User's Product Management
- [ ] Implement GET `/api/products/my-listings` endpoint
- [ ] Filter products by authenticated user
- [ ] Include edit/delete permissions check
- [ ] Test: User sees only their own product listings

### Task 3.7: Update Product Endpoint
- [ ] Implement PUT `/api/products/:id` endpoint
- [ ] Verify user owns the product before updating
- [ ] Validate updated fields
- [ ] Return updated product data
- [ ] Test: User can update their own products only

### Task 3.8: Delete Product Endpoint
- [ ] Implement DELETE `/api/products/:id` endpoint
- [ ] Verify user owns the product before deletion
- [ ] Remove product from database
- [ ] Handle non-existent product errors
- [ ] Test: User can delete their own products only

## Phase 4: Search and Filtering

### Task 4.1: Keyword Search Implementation
- [ ] Add search query parameter to GET `/api/products`
- [ ] Implement text search on product title using MongoDB regex
- [ ] Make search case-insensitive
- [ ] Combine search with existing pagination
- [ ] Test: Search returns products matching keywords

### Task 4.2: Category Filtering
- [ ] Add category filter parameter to GET `/api/products`
- [ ] Filter products by selected category
- [ ] Combine category filter with search and pagination
- [ ] Validate category exists in predefined list
- [ ] Test: Products filtered correctly by category

### Task 4.3: Advanced Filtering Options
- [ ] Add price range filtering (min and max price)
- [ ] Add sorting options (price low-to-high, high-to-low, newest)
- [ ] Combine all filters with search functionality
- [ ] Optimize database queries for performance
- [ ] Test: Multiple filters work together correctly

## Phase 5: Cart Management System

### Task 5.1: Cart Model Creation
- [ ] Create `models/Cart.js` with Mongoose schema
- [ ] Define fields: user, items (array of product references and quantities)
- [ ] Ensure one cart per user constraint
- [ ] Add methods for cart total calculation
- [ ] Test: Cart model saves and calculates totals correctly

### Task 5.2: Add to Cart Endpoint
- [ ] Implement POST `/api/cart/add` endpoint
- [ ] Require authentication middleware
- [ ] Validate product exists and is available
- [ ] Prevent users from adding their own products
- [ ] Create or update existing cart
- [ ] Test: Products are added to cart correctly

### Task 5.3: View Cart Endpoint
- [ ] Implement GET `/api/cart` endpoint
- [ ] Populate product details in cart items
- [ ] Calculate and return cart total
- [ ] Handle empty cart scenarios
- [ ] Test: Cart contents displayed with product details

### Task 5.4: Update Cart Item Endpoint
- [ ] Implement PUT `/api/cart/update` endpoint
- [ ] Allow quantity updates for cart items
- [ ] Remove items when quantity is 0
- [ ] Recalculate cart total after updates
- [ ] Test: Cart quantities update correctly

### Task 5.5: Remove from Cart Endpoint
- [ ] Implement DELETE `/api/cart/remove/:productId` endpoint
- [ ] Remove specific product from cart
- [ ] Update cart totals after removal
- [ ] Handle non-existent items gracefully
- [ ] Test: Products are removed from cart correctly

## Phase 6: Purchase History System

### Task 6.1: Purchase Model Creation
- [ ] Create `models/Purchase.js` with Mongoose schema
- [ ] Define fields: buyer, products, totalAmount, purchaseDate
- [ ] Store snapshot of product data at time of purchase
- [ ] Add purchase status field (completed, pending, cancelled)
- [ ] Test: Purchase records save correctly

### Task 6.2: Purchase Processing Endpoint
- [ ] Implement POST `/api/purchases/process` endpoint
- [ ] Move cart items to purchase record
- [ ] Clear user's cart after successful purchase
- [ ] Add basic purchase validation
- [ ] Test: Cart contents convert to purchase record

### Task 6.3: Purchase History Endpoint
- [ ] Implement GET `/api/purchases/history` endpoint
- [ ] Return user's previous purchases
- [ ] Include product snapshots from purchase time
- [ ] Sort by purchase date (newest first)
- [ ] Test: User's purchase history displays correctly

### Task 6.4: Purchase Details Endpoint
- [ ] Implement GET `/api/purchases/:id` endpoint
- [ ] Return detailed purchase information
- [ ] Verify user owns the purchase record
- [ ] Include all purchased product details
- [ ] Test: Individual purchase details load correctly

## Phase 7: Error Handling and Validation

### Task 7.1: Global Error Handler
- [ ] Create `middleware/errorHandler.js`
- [ ] Handle different types of errors (validation, authentication, server)
- [ ] Return consistent error response format
- [ ] Log errors for debugging purposes
- [ ] Test: All endpoints return proper error responses

### Task 7.2: Input Validation Middleware
- [ ] Install express-validator package
- [ ] Create validation rules for all endpoints
- [ ] Add custom validation messages
- [ ] Validate email formats, password strength, etc.
- [ ] Test: Invalid inputs are rejected with clear messages

### Task 7.3: Rate Limiting
- [ ] Install express-rate-limit package
- [ ] Add rate limiting to authentication endpoints
- [ ] Configure different limits for different endpoint types
- [ ] Return appropriate error messages when limits exceeded
- [ ] Test: Rate limiting prevents abuse

## Phase 8: Testing and Documentation

### Task 8.1: API Testing Setup
- [ ] Install testing dependencies (Jest, Supertest)
- [ ] Set up test database configuration
- [ ] Create test helpers for common operations
- [ ] Write basic endpoint tests
- [ ] Test: All core endpoints have passing tests

### Task 8.2: API Documentation
- [ ] Install swagger-jsdoc and swagger-ui-express
- [ ] Document all API endpoints with Swagger
- [ ] Include request/response examples
- [ ] Add authentication requirements to docs
- [ ] Test: API documentation is accessible and complete

### Task 8.3: Environment Configuration
- [ ] Set up different environment configs (dev, staging, prod)
- [ ] Add environment variable validation
- [ ] Configure different database connections per environment
- [ ] Add deployment-ready scripts
- [ ] Test: Application runs in different environments

## Phase 9: Performance and Security

### Task 9.1: Database Indexing
- [ ] Add database indexes for frequently queried fields
- [ ] Index user email for login performance
- [ ] Index product category and title for search
- [ ] Monitor query performance
- [ ] Test: Database queries execute efficiently

### Task 9.2: Security Hardening
- [ ] Install helmet.js for security headers
- [ ] Add input sanitization middleware
- [ ] Configure secure session handling
- [ ] Add request logging and monitoring
- [ ] Test: Security measures are active

### Task 9.3: API Performance Optimization
- [ ] Implement response compression
- [ ] Add caching for frequently accessed data
- [ ] Optimize database queries with proper projections
- [ ] Add request timeout handling
- [ ] Test: API response times are acceptable

## Completion Criteria
- All endpoints return proper HTTP status codes
- Authentication works correctly across all protected routes
- Data validation prevents invalid entries
- Error handling provides clear, helpful messages
- Basic performance requirements are met
- API documentation is complete and accurate