import { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext()

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

// Translation data
const translations = {
  en: {
    // Navigation
    home: 'Home',
    menu: 'Menu',
    about: 'About',
    contact: 'Contact',
    blog: 'Blog',
    login: 'Login',
    register: 'Register',
    dashboard: 'Dashboard',
    logout: 'Logout',
    
    // Common
    welcome: 'Welcome',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    view: 'View',
    close: 'Close',
    confirm: 'Confirm',
    back: 'Back',
    next: 'Next',
    submit: 'Submit',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    
    // Auth
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    name: 'Name',
    phone: 'Phone',
    address: 'Address',
    loginTitle: 'Login to Your Account',
    registerTitle: 'Create New Account',
    forgotPassword: 'Forgot Password?',
    rememberMe: 'Remember Me',
    createAccount: 'Create Account',
    alreadyHaveAccount: 'Already have an account?',
    dontHaveAccount: "Don't have an account?",
    
    // Dashboard
    adminDashboard: 'Admin Dashboard',
    staffDashboard: 'Staff Dashboard',
    clientDashboard: 'Client Dashboard',
    totalOrders: 'Total Orders',
    pendingReservations: 'Pending Reservations',
    totalRevenue: 'Total Revenue',
    todayOrders: 'Today\'s Orders',
    overview: 'Overview',
    menuManagement: 'Menu Management',
    orderManagement: 'Order Management',
    reservationManagement: 'Reservation Management',
    userManagement: 'User Management',
    blogManagement: 'Blog Management',
    settings: 'Settings',
    profile: 'Profile',
    
    // Menu
    menuTitle: 'Our Menu',
    price: 'Price',
    category: 'Category',
    description: 'Description',
    addToCart: 'Add to Cart',
    ingredients: 'Ingredients',
    allergens: 'Allergens',
    popular: 'Popular',
    available: 'Available',
    unavailable: 'Unavailable',
    allItems: 'All Items',
    appetizers: 'Appetizers',
    mainCourses: 'Main Courses',
    desserts: 'Desserts',
    beverages: 'Beverages',
    addNewItem: 'Add New Item',
    editItem: 'Edit Item',
    deleteItem: 'Delete Item',
    
    // Orders
    orders: 'Orders',
    myOrders: 'My Orders',
    orderNumber: 'Order Number',
    status: 'Status',
    total: 'Total',
    orderDate: 'Order Date',
    orderItems: 'Order Items',
    quantity: 'Quantity',
    subtotal: 'Subtotal',
    pending: 'Pending',
    confirmed: 'Confirmed',
    preparing: 'Preparing',
    ready: 'Ready',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    noOrders: 'No orders yet',
    browseMenu: 'Browse Menu',
    
    // Reservations
    reservations: 'Reservations',
    myReservations: 'My Reservations',
    reservationDate: 'Reservation Date',
    reservationTime: 'Reservation Time',
    partySize: 'Party Size',
    specialRequests: 'Special Requests',
    makeReservation: 'Make Reservation',
    noReservations: 'No reservations yet',
    
    // Blog
    blogTitle: 'Our Blog',
    readMore: 'Read More',
    publishedOn: 'Published on',
    author: 'Author',
    tags: 'Tags',
    comments: 'Comments',
    addPost: 'Add Post',
    editPost: 'Edit Post',
    deletePost: 'Delete Post',
    title: 'Title',
    content: 'Content',
    excerpt: 'Excerpt',
    published: 'Published',
    draft: 'Draft',
    
    // Cart
    cart: 'Cart',
    removeFromCart: 'Remove from Cart',
    cartEmpty: 'Your cart is empty',
    checkout: 'Checkout',
    continueShopping: 'Continue Shopping',
    
    // Contact
    contactUs: 'Contact Us',
    getInTouch: 'Get in Touch',
    sendMessage: 'Send Message',
    message: 'Message',
    subject: 'Subject',
    openingHours: 'Opening Hours',
    location: 'Location',
    
    // About
    aboutUs: 'About Us',
    ourStory: 'Our Story',
    ourTeam: 'Our Team',
    ourMission: 'Our Mission',
    
    // Footer
    footerText: '© 2024 Oasis Tides Restaurant. All rights reserved.',
    followUs: 'Follow Us',
    quickLinks: 'Quick Links',
    contactInfo: 'Contact Information',
    
    // Actions
    actions: 'Actions',
    viewDetails: 'View Details',
    updateStatus: 'Update Status',
    printReceipt: 'Print Receipt',
    
    // Favorites
    favorites: 'Favorites',
    myFavorites: 'My Favorites',
    addToFavorites: 'Add to Favorites',
    removeFromFavorites: 'Remove from Favorites',
    noFavorites: 'No favorite items yet',
    
    // Loyalty
    loyaltyPoints: 'Loyalty Points',
    earnPoints: 'Earn Points',
    redeemPoints: 'Redeem Points',
    
    // Notifications
    notifications: 'Notifications',
    markAsRead: 'Mark as Read',
    noNotifications: 'No notifications',
    
    // Error Messages
    errorOccurred: 'An error occurred',
    tryAgain: 'Try Again',
    pageNotFound: 'Page Not Found',
    accessDenied: 'Access Denied',
    
    // Success Messages
    itemAdded: 'Item added successfully',
    itemUpdated: 'Item updated successfully',
    itemDeleted: 'Item deleted successfully',
    orderPlaced: 'Order placed successfully',
    reservationMade: 'Reservation made successfully',
    
    // Additional Dashboard Terms
    welcomeBack: 'Welcome Back',
    accountSummary: 'Account Summary',
    recentOrders: 'Recent Orders',
    upcomingReservations: 'Upcoming Reservations',
    quickActions: 'Quick Actions',
    orderFood: 'Order Food',
    updateProfile: 'Update Profile',
    favoriteItems: 'Favorite Items',
    noOrdersYet: 'No orders yet',
    browseMenuPrompt: 'Browse our delicious menu to place your first order',
    noReservationsYet: 'No reservations yet',
    makeReservationPrompt: 'Make your first reservation to dine with us',
    favoriteItemsDisplay: 'Your favorite menu items will appear here',
    myProfile: 'My Profile',
    kitchenDisplay: 'Kitchen Display',
    kitchenDisplayMessage: 'Kitchen orders and preparation status will be displayed here',
    settingsManagement: 'Settings Management',
    settingsManagementDescription: 'Manage restaurant settings and configurations',
    themeSettings: 'Theme Settings',
    themeSettingsDescription: 'Customize the appearance and theme of the application',
    loadingOrders: 'Loading orders...',
    loadingReservations: 'Loading reservations...',
    loadingUsers: 'Loading users...',
    addNewReservation: 'Add New Reservation',
    addNewBlogPost: 'Add New Blog Post',
    addNewUser: 'Add New User',
    confirmDeleteMenuItemTitle: 'Delete Menu Item',
    confirmDeleteMenuItemDescription: 'Are you sure you want to delete this menu item? This action cannot be undone.',
  },
  ar: {
    // Navigation
    home: 'الرئيسية',
    menu: 'القائمة',
    about: 'حولنا',
    contact: 'اتصل بنا',
    blog: 'المدونة',
    login: 'تسجيل الدخول',
    register: 'إنشاء حساب',
    dashboard: 'لوحة التحكم',
    logout: 'تسجيل الخروج',
    
    // Common
    welcome: 'مرحباً',
    loading: 'جاري التحميل...',
    error: 'خطأ',
    success: 'نجح',
    save: 'حفظ',
    cancel: 'إلغاء',
    delete: 'حذف',
    edit: 'تعديل',
    add: 'إضافة',
    view: 'عرض',
    close: 'إغلاق',
    confirm: 'تأكيد',
    back: 'رجوع',
    next: 'التالي',
    submit: 'إرسال',
    search: 'بحث',
    filter: 'تصفية',
    sort: 'ترتيب',
    
    // Auth
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    confirmPassword: 'تأكيد كلمة المرور',
    name: 'الاسم',
    phone: 'الهاتف',
    address: 'العنوان',
    loginTitle: 'تسجيل الدخول إلى حسابك',
    registerTitle: 'إنشاء حساب جديد',
    forgotPassword: 'نسيت كلمة المرور؟',
    rememberMe: 'تذكرني',
    createAccount: 'إنشاء حساب',
    alreadyHaveAccount: 'لديك حساب بالفعل؟',
    dontHaveAccount: 'ليس لديك حساب؟',
    
    // Dashboard
    adminDashboard: 'لوحة تحكم المدير',
    staffDashboard: 'لوحة تحكم الموظف',
    clientDashboard: 'لوحة تحكم العميل',
    totalOrders: 'إجمالي الطلبات',
    pendingReservations: 'الحجوزات المعلقة',
    totalRevenue: 'إجمالي الإيرادات',
    todayOrders: 'طلبات اليوم',
    overview: 'نظرة عامة',
    menuManagement: 'إدارة القائمة',
    orderManagement: 'إدارة الطلبات',
    reservationManagement: 'إدارة الحجوزات',
    userManagement: 'إدارة المستخدمين',
    blogManagement: 'إدارة المدونة',
    settings: 'الإعدادات',
    profile: 'الملف الشخصي',
    
    // Menu
    menuTitle: 'قائمة الطعام',
    price: 'السعر',
    category: 'الفئة',
    description: 'الوصف',
    addToCart: 'أضف إلى السلة',
    ingredients: 'المكونات',
    allergens: 'مسببات الحساسية',
    popular: 'مشهور',
    available: 'متوفر',
    unavailable: 'غير متوفر',
    allItems: 'جميع الأصناف',
    appetizers: 'المقبلات',
    mainCourses: 'الأطباق الرئيسية',
    desserts: 'الحلويات',
    beverages: 'المشروبات',
    addNewItem: 'إضافة صنف جديد',
    editItem: 'تعديل الصنف',
    deleteItem: 'حذف الصنف',
    
    // Orders
    orders: 'الطلبات',
    myOrders: 'طلباتي',
    orderNumber: 'رقم الطلب',
    status: 'الحالة',
    total: 'المجموع',
    orderDate: 'تاريخ الطلب',
    orderItems: 'أصناف الطلب',
    quantity: 'الكمية',
    subtotal: 'المجموع الفرعي',
    pending: 'معلق',
    confirmed: 'مؤكد',
    preparing: 'قيد التحضير',
    ready: 'جاهز',
    delivered: 'تم التوصيل',
    cancelled: 'ملغي',
    noOrders: 'لا توجد طلبات بعد',
    browseMenu: 'تصفح القائمة',
    
    // Reservations
    reservations: 'الحجوزات',
    myReservations: 'حجوزاتي',
    reservationDate: 'تاريخ الحجز',
    reservationTime: 'وقت الحجز',
    partySize: 'عدد الأشخاص',
    specialRequests: 'طلبات خاصة',
    makeReservation: 'احجز طاولة',
    noReservations: 'لا توجد حجوزات بعد',
    
    // Blog
    blogTitle: 'مدونتنا',
    readMore: 'اقرأ المزيد',
    publishedOn: 'نُشر في',
    author: 'الكاتب',
    tags: 'العلامات',
    comments: 'التعليقات',
    addPost: 'إضافة مقال',
    editPost: 'تعديل المقال',
    deletePost: 'حذف المقال',
    title: 'العنوان',
    content: 'المحتوى',
    excerpt: 'المقطع',
    published: 'منشور',
    draft: 'مسودة',
    
    // Cart
    cart: 'السلة',
    removeFromCart: 'إزالة من السلة',
    cartEmpty: 'سلتك فارغة',
    checkout: 'الدفع',
    continueShopping: 'متابعة التسوق',
    
    // Contact
    contactUs: 'اتصل بنا',
    getInTouch: 'تواصل معنا',
    sendMessage: 'إرسال رسالة',
    message: 'الرسالة',
    subject: 'الموضوع',
    openingHours: 'ساعات العمل',
    location: 'الموقع',
    
    // About
    aboutUs: 'حولنا',
    ourStory: 'قصتنا',
    ourTeam: 'فريقنا',
    ourMission: 'مهمتنا',
    
    // Footer
    footerText: '© 2024 مطعم أوايسيس تايدز. جميع الحقوق محفوظة.',
    followUs: 'تابعنا',
    quickLinks: 'روابط سريعة',
    contactInfo: 'معلومات التواصل',
    
    // Actions
    actions: 'الإجراءات',
    viewDetails: 'عرض التفاصيل',
    updateStatus: 'تحديث الحالة',
    printReceipt: 'طباعة الإيصال',
    
    // Favorites
    favorites: 'المفضلة',
    myFavorites: 'مفضلاتي',
    addToFavorites: 'أضف إلى المفضلة',
    removeFromFavorites: 'إزالة من المفضلة',
    noFavorites: 'لا توجد أصناف مفضلة بعد',
    
    // Loyalty
    loyaltyPoints: 'نقاط الولاء',
    earnPoints: 'اكسب نقاط',
    redeemPoints: 'استبدل النقاط',
    
    // Notifications
    notifications: 'الإشعارات',
    markAsRead: 'تحديد كمقروء',
    noNotifications: 'لا توجد إشعارات',
    
    // Error Messages
    errorOccurred: 'حدث خطأ',
    tryAgain: 'حاول مرة أخرى',
    pageNotFound: 'الصفحة غير موجودة',
    accessDenied: 'الوصول مرفوض',
    
    // Success Messages
    itemAdded: 'تم إضافة الصنف بنجاح',
    itemUpdated: 'تم تحديث الصنف بنجاح',
    itemDeleted: 'تم حذف الصنف بنجاح',
    orderPlaced: 'تم تقديم الطلب بنجاح',
    reservationMade: 'تم الحجز بنجاح',
    
    // Additional Dashboard Terms
    welcomeBack: 'مرحباً بعودتك',
    accountSummary: 'ملخص الحساب',
    recentOrders: 'الطلبات الأخيرة',
    upcomingReservations: 'الحجوزات القادمة',
    quickActions: 'إجراءات سريعة',
    orderFood: 'اطلب طعام',
    updateProfile: 'تحديث الملف الشخصي',
    favoriteItems: 'الأصناف المفضلة',
    noOrdersYet: 'لا توجد طلبات بعد',
    browseMenuPrompt: 'تصفح قائمتنا اللذيذة لتقديم طلبك الأول',
    noReservationsYet: 'لا توجد حجوزات بعد',
    makeReservationPrompt: 'احجز طاولتك الأولى لتناول الطعام معنا',
    favoriteItemsDisplay: 'ستظهر أصنافك المفضلة من القائمة هنا',
    myProfile: 'ملفي الشخصي',
    kitchenDisplay: 'شاشة المطبخ',
    kitchenDisplayMessage: 'ستظهر طلبات المطبخ وحالة التحضير هنا',
    settingsManagement: 'إدارة الإعدادات',
    settingsManagementDescription: 'إدارة إعدادات وتكوينات المطعم',
    themeSettings: 'إعدادات المظهر',
    themeSettingsDescription: 'تخصيص مظهر وثيم التطبيق',
    loadingOrders: 'جاري تحميل الطلبات...',
    loadingReservations: 'جاري تحميل الحجوزات...',
    loadingUsers: 'جاري تحميل المستخدمين...',
    addNewReservation: 'إضافة حجز جديد',
    addNewBlogPost: 'إضافة مقال جديد',
    addNewUser: 'إضافة مستخدم جديد',
    confirmDeleteMenuItemTitle: 'حذف صنف من القائمة',
    confirmDeleteMenuItemDescription: 'هل أنت متأكد من حذف هذا الصنف من القائمة؟ لا يمكن التراجع عن هذا الإجراء.',
  }
}

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en')
  const [isRTL, setIsRTL] = useState(false)

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en'
    setLanguage(savedLanguage)
    setIsRTL(savedLanguage === 'ar')
    
    // Update document direction
    document.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = savedLanguage
  }, [])

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage)
    setIsRTL(newLanguage === 'ar')
    localStorage.setItem('language', newLanguage)
    
    // Update document direction
    document.dir = newLanguage === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = newLanguage
  }

  const t = (key) => {
    return translations[language][key] || key
  }

  const value = {
    language,
    isRTL,
    changeLanguage,
    t,
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

