<a name="readme-top"></a>
<!-- PROJECT LOGO -->
<div align="center">
  <a href="https://luxelined.netlify.app/">
    <!-- <img src="public/images/logo.png" alt="luxeline-logo" height="64"> -->
  </a>

  <h2 align="center">LuxeLine</h2>

  <h4 align="center">  
    <a href="https://luxelined.netlify.app/" target="_blank" rel="noreferrer noopener" >View Live</a>
    ·
    <a href="https://github.com/Carshy/storefront-coupon/issues" target="_blank">Report Bug</a>
  </h4>
</div>

<!-- ABOUT THE PROJECT -->

LuxeLine is a modern, secure, and performant e-commerce platform that delivers an exceptional online shopping experience. Built with cutting-edge technologies, it features a comprehensive product catalog, intelligent filtering, secure cart management, and responsive design that works seamlessly across all devices.

**Core Functionalities:**
* Browse products with dynamic filtering by category, price, and ratings
* Detailed product pages with high-quality images and comprehensive information
* Secure shopping cart with persistent state management
* Real-time product search and sorting capabilities
* Responsive design optimized for mobile, tablet, and desktop
* Fast loading with Next.js Server-Side Rendering (SSR) and Static Site Generation (SSG)
* Secure state management with Redux Toolkit

This project showcases modern web development best practices, including TypeScript for type safety, Tailwind CSS for responsive styling, and secure API integration. The application prioritizes performance, accessibility, and user experience.

I thoroughly enjoyed building this modern e-commerce platform and implementing advanced features like dynamic routing, state persistence, and responsive design. Click [Here](https://luxeline-store.vercel.app/) to explore the live application!

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### View Live
**Below is the live link to the LuxeLine e-commerce platform:**
- [x] [Luxelined Deployment](https://luxelined.netlify.app/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

**Main Technologies:**

* ![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
* ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
* ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
* ![Redux](https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white)
* ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

**Additional Tools & Libraries:**
* Redux Toolkit for state management
* Axios for API requests
* Lucide React for icons
* Next.js Image optimization
* Responsive design with Tailwind CSS

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- FEATURES -->
## Key Features

### 🛍️ **Product Management**
- **Dynamic Product Listing**: Browse through a curated collection of products with real-time loading
- **Advanced Filtering**: Filter products by categories (electronics, jewelry, men's clothing, women's clothing)
- **Smart Search**: Search products by name with instant results
- **Sorting Options**: Sort by price (low to high, high to low) and ratings

### 🛒 **Shopping Cart**
- **Persistent Cart**: Cart state maintained across browser sessions
- **Secure State Management**: Redux-powered cart with optimistic updates
- **Quantity Management**: Add, remove, and modify item quantities
- **Real-time Total Calculation**: Dynamic price calculations with tax and shipping

### 📱 **User Experience**
- **Responsive Design**: Optimized for mobile, tablet, and desktop viewing
- **Fast Loading**: Server-Side Rendering (SSR) and Static Site Generation (SSG)
- **Progressive Enhancement**: Works seamlessly with and without JavaScript
- **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation

### 🔒 **Security & Performance**
- **Type Safety**: Full TypeScript implementation for reduced runtime errors
- **Secure API Integration**: Protected endpoints with proper error handling
- **Performance Optimization**: Image optimization, lazy loading, and code splitting
- **Error Boundaries**: Graceful error handling with user-friendly messages

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started

### Prerequisites
Make sure you have Node.js installed on your system:
* Node.js (version 18 or higher)
  ```sh
  node --version
  ```
* npm
  ```sh
  npm install npm@latest -g
  ```

### Clone Locally
- Enter this URL: [https://github.com/Carshy/storefront-coupon](https://github.com/Carshy/storefront-coupon) in your web browser
- Navigate to the green "Code" button on the right side of the repository
- Select "Download ZIP" option from the dropdown menu
- Extract the downloaded ZIP file to access the project locally

### Installation & Setup

1. **Clone the repository**
   ```sh
   git clone https://github.com/Carshy/storefront-coupon.git
   cd luxeline
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Environment setup**
   ```sh
   cp .env.example .env.local
   ```
   Add your environment variables:
   ```env
   NEXT_PUBLIC_API_URL=https://fakestoreapi.com
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Start the development server**
   ```sh
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to view the application

### Build for Production
```sh
npm run build
npm start
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Maintain responsive design principles
- Write clean, readable code with proper comments
- Ensure all new features are tested
- Follow the existing code style and structure

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->
## Roadmap

### Phase 1 (Current)
- [x] Product listing and filtering
- [x] Shopping cart functionality
- [x] Responsive design
- [x] TypeScript implementation
- [x] User authentication and profiles
- [x] Advanced search with autocomplete

### Phase 2 (Upcoming)
- [ ] Order history and tracking
- [ ] Payment gateway integration
- [ ] Product reviews and ratings
- [ ] Wishlist functionality

### Phase 3 (Future)
- [ ] Admin dashboard
- [ ] Inventory management
- [ ] Multi-language support
- [ ] PWA capabilities
- [ ] Advanced analytics

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->
## License

This project is distributed under the MIT License. [Click here for more information](LICENSE).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

**Project Link**: [https://github.com/Carshy/storefront-coupon](https://github.com/Carshy/storefront-coupon)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* [Fake Store API](https://fakestoreapi.com/) - RESTful API for e-commerce prototyping
* [Next.js Documentation](https://nextjs.org/docs) - React framework for production
* [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
* [Redux Toolkit](https://redux-toolkit.js.org/) - Modern Redux development
* [Lucide React](https://lucide.dev/) - Beautiful and consistent icons
* [Vercel](https://vercel.com/) - Deployment and hosting platform
* [TypeScript](https://www.typescriptlang.org/) - Type safety for JavaScript
* [React Documentation](https://react.dev/) - Component-based UI library

<p align="right">(<a href="#readme-top">back to top</a>)</p>
